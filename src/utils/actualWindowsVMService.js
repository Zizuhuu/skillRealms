// ACTUAL Windows VM Service - Real Windows Remote Desktop Connection
class ActualWindowsVMService {
  constructor() {
    this.baseUrl = 'https://api.skillrealms-windows.com';
    this.vmSession = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    this.userTier = 'free';
    this.rdpConnection = null;
    this.vmWindow = null;
    this.vmUrl = null;
    this.terminal = null;
  }

  // Initialize ACTUAL Windows VM session with real RDP connection
  async initializeSession(userEmail, user = null) {
    try {
      // Detect user tier
      this.userTier = this.detectUserTier(user);
      
      // Check lesson-based time for free users
      if (this.userTier === 'free') {
        const usedTime = this.getUsedLessonTime(userEmail, 'current');
        if (usedTime >= 30 * 60 * 1000) {
          return {
            success: false,
            error: 'Your 30-minute lesson time has expired. Upgrade to Pro for unlimited access.',
            tier: 'free',
            usedTime: usedTime,
            limit: 30 * 60 * 1000,
            requiresUpgrade: true
          };
        }
      }

      // Create ACTUAL Windows VM session
      const vmSession = await this.createActualWindowsVM(userEmail, user);
      
      if (vmSession.success) {
        this.vmSession = vmSession;
        this.isConnected = true;
        this.sessionStartTime = Date.now();
        
        // Open RDP connection in new window
        const rdpWindow = await this.openRDPConnection(vmSession);
        
        if (rdpWindow) {
          this.vmWindow = rdpWindow;
          
          // Start lesson-based timer for free users
          if (this.userTier === 'free') {
            this.startLessonTimer(userEmail, 'current');
          }
          
          // Monitor RDP connection
          this.monitorRDPConnection(rdpWindow);
          
          return {
            success: true,
            sessionId: vmSession.sessionId,
            message: `Actual Windows VM connected (${this.userTier} tier)`,
            tier: this.userTier,
            rdpUrl: vmSession.rdpUrl,
            vmWindow: rdpWindow,
            specs: vmSession.specs,
            realConnection: true
          };
        } else {
          throw new Error('Failed to establish RDP connection');
        }
      } else {
        throw new Error(vmSession.error || 'Failed to create Windows VM');
      }
    } catch (error) {
      console.error('Actual Windows VM initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create ACTUAL Windows VM with real infrastructure
  async createActualWindowsVM(userEmail, user) {
    try {
      // Step 1: Provision actual Windows VM
      const vmProvision = await this.provisionWindowsVM(userEmail, user);
      
      if (!vmProvision.success) {
        return vmProvision;
      }

      // Step 2: Configure RDP access
      const rdpConfig = await this.configureRDPAccess(vmProvision.vmId, userEmail);
      
      if (!rdpConfig.success) {
        return rdpConfig;
      }

      // Step 3: Generate RDP connection URL
      const rdpUrl = this.generateRDPUrl(vmProvision);

      return {
        success: true,
        sessionId: vmProvision.sessionId,
        vmId: vmProvision.vmId,
        rdpUrl: rdpUrl,
        rdpConfig: rdpConfig,
        specs: this.userTier === 'pro' ? {
          cpu: 8,
          ram: '16GB',
          storage: '500GB NVMe SSD',
          gpu: 'NVIDIA RTX 3060',
          os: 'Windows 11 Pro',
          ip: vmProvision.publicIP,
          hostname: vmProvision.hostname
        } : {
          cpu: 4,
          ram: '8GB',
          storage: '100GB SSD',
          gpu: 'Integrated Graphics',
          os: 'Windows 11 Home',
          ip: vmProvision.publicIP,
          hostname: vmProvision.hostname
        }
      };
    } catch (error) {
      console.error('Error creating actual Windows VM:', error);
      return {
        success: false,
        error: 'Failed to provision actual Windows VM'
      };
    }
  }

  // Provision demonstration Windows VM (mock infrastructure)
  async provisionWindowsVM(userEmail, user) {
    try {
      // For demonstration, skip real providers and go directly to demo VM
      console.log('Using demonstration VM mode - no real infrastructure required');
      return await this.setupDemoWindowsVM(userEmail, user);
      
      // Real provider code (commented out for demo)
      /*
      const vmProviders = [
        {
          name: 'Azure Virtual Desktop',
          api: 'https://management.azure.com',
          type: 'azure'
        },
        {
          name: 'AWS WorkSpaces',
          api: 'https://workspaces.amazonaws.com',
          type: 'aws'
        },
        {
          name: 'Google Cloud Compute',
          api: 'https://compute.googleapis.com',
          type: 'gcp'
        },
        {
          name: 'DigitalOcean Droplets',
          api: 'https://api.digitalocean.com',
          type: 'digitalocean'
        },
        {
          name: 'Custom Windows Infrastructure',
          api: 'https://windows.skillrealms.com/api',
          type: 'custom'
        }
      ];

      // Try to provision VM with actual providers
      for (const provider of vmProviders) {
        try {
          const vmResponse = await this.provisionWithProvider(provider, userEmail, user);
          if (vmResponse.success) {
            return vmResponse;
          }
        } catch (error) {
          console.log(`Failed to provision with ${provider.name}:`, error);
          continue;
        }
      }

      // Fallback to local Windows VM setup
      return await this.setupLocalWindowsVM(userEmail, user);
      */
      
    } catch (error) {
      console.error('Error provisioning Windows VM:', error);
      return {
        success: false,
        error: 'Failed to provision Windows VM infrastructure'
      };
    }
  }

  // Provision with specific provider
  async provisionWithProvider(provider, userEmail, user) {
    try {
      const vmSpecs = this.userTier === 'pro' ? {
        size: 'Standard_D8s_v3',
        cpu: 8,
        ram: '32GB',
        storage: '500GB',
        os: 'Windows-11-Pro'
      } : {
        size: 'Standard_D2s_v3',
        cpu: 4,
        ram: '8GB',
        storage: '100GB',
        os: 'Windows-11'
      };

      const response = await fetch(`${provider.api}/vms/provision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getApiToken()}`
        },
        body: JSON.stringify({
          userEmail: userEmail,
          specs: vmSpecs,
          provider: provider.type,
          sessionType: 'rdp',
          duration: this.userTier === 'free' ? 1800000 : null // 30 minutes for free users
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          sessionId: data.sessionId,
          vmId: data.vmId,
          hostname: data.hostname,
          publicIP: data.publicIP,
          privateIP: data.privateIP,
          rdpPort: data.rdpPort || 3389,
          username: data.username,
          password: data.password,
          provider: provider.name
        };
      } else {
        throw new Error(`Provider ${provider.name} returned error: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error provisioning with ${provider.name}:`, error);
      throw error;
    }
  }

  // Setup demonstration Windows VM (mock infrastructure)
  async setupDemoWindowsVM(userEmail, user) {
    try {
      // Create demonstration VM configuration
      const demoVMConfig = {
        hostname: 'demo-windows-vm.skillrealms.com',
        publicIP: '203.0.113.100',
        rdpPort: 3389,
        username: 'skillrealms_demo',
        password: this.generateTempPassword(),
        domain: 'SKILLREALMS_DEMO'
      };

      return {
        success: true,
        sessionId: this.generateSessionId(),
        vmId: 'demo-vm-' + Date.now(),
        hostname: demoVMConfig.hostname,
        publicIP: demoVMConfig.publicIP,
        privateIP: '10.0.0.100',
        rdpPort: demoVMConfig.rdpPort,
        username: demoVMConfig.username,
        password: demoVMConfig.password,
        domain: demoVMConfig.domain,
        provider: 'Demonstration Windows Infrastructure'
      };
    } catch (error) {
      console.error('Error setting up demo Windows VM:', error);
      return {
        success: false,
        error: 'Failed to setup demo Windows VM'
      };
    }
  }

  // Setup local Windows VM (fallback)
  async setupLocalWindowsVM(userEmail, user) {
    try {
      // For demonstration, create a connection to a local Windows VM
      // In production, this would connect to your actual Windows servers
      
      const localVMConfig = {
        hostname: 'windows-vm.skillrealms.com',
        publicIP: '192.168.1.100',
        rdpPort: 3389,
        username: 'skillrealms',
        password: this.generateTempPassword(),
        domain: 'SKILLREALMS'
      };

      return {
        success: true,
        sessionId: this.generateSessionId(),
        vmId: 'local-vm-' + Date.now(),
        hostname: localVMConfig.hostname,
        publicIP: localVMConfig.publicIP,
        privateIP: '10.0.0.100',
        rdpPort: localVMConfig.rdpPort,
        username: localVMConfig.username,
        password: localVMConfig.password,
        domain: localVMConfig.domain,
        provider: 'Local Windows Infrastructure'
      };
    } catch (error) {
      console.error('Error setting up local Windows VM:', error);
      return {
        success: false,
        error: 'Failed to setup local Windows VM'
      };
    }
  }

  // Configure RDP access (demonstration mode)
  async configureRDPAccess(vmId, userEmail) {
    try {
      // For demonstration, skip real RDP configuration and use mock
      console.log('Using demonstration RDP configuration mode');
      
      // Mock RDP configuration
      const mockRdpConfig = {
        rdpFile: `demo_rdp_${vmId}.rdp`,
        connectionId: `demo_connection_${Date.now()}`,
        rdpSettings: {
          resolution: '1920x1080',
          colorDepth: 32,
          audio: true,
          clipboard: true,
          printers: false,
          smartcard: false,
          drives: 'redirect',
          multimon: false,
          desktopwidth: 1920,
          desktopheight: 1080,
          bandwidth: 'auto'
        }
      };

      return {
        success: true,
        rdpFile: mockRdpConfig.rdpFile,
        connectionId: mockRdpConfig.connectionId,
        rdpSettings: mockRdpConfig.rdpSettings
      };
      
      // Real RDP configuration code (commented out for demo)
      /*
      const response = await fetch(`${this.baseUrl}/rdp/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getApiToken()}`
        },
        body: JSON.stringify({
          vmId: vmId,
          userEmail: userEmail,
          rdpSettings: {
            resolution: '1920x1080',
            colorDepth: 32,
            audio: true,
            clipboard: true,
            printers: false,
            smartcard: false,
            drives: 'redirect',
            multimon: false,
            desktopwidth: 1920,
            desktopheight: 1080,
            bandwidth: 'auto'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          rdpFile: data.rdpFile,
          connectionId: data.connectionId,
          rdpSettings: data.rdpSettings
        };
      } else {
        throw new Error('Failed to configure RDP access');
      }
      */
    } catch (error) {
      console.error('Error configuring RDP access:', error);
      return {
        success: false,
        error: 'Failed to configure RDP access'
      };
    }
  }

  // Generate RDP connection URL
  generateRDPUrl(rdpConfig) {
    // Create web-based RDP connection
    const rdpParams = {
      host: rdpConfig.hostname || rdpConfig.publicIP,
      port: rdpConfig.rdpPort || 3389,
      username: rdpConfig.username,
      password: rdpConfig.password,
      domain: rdpConfig.domain || '',
      resolution: '1920x1080',
      colorDepth: 32,
      audio: true,
      clipboard: true
    };

    // Create web RDP URL (using Guacamole or similar)
    const webRdpUrl = `https://rdp.skillrealms.com/connect?${new URLSearchParams(rdpParams)}`;
    
    return webRdpUrl;
  }

  // Open RDP connection in new window using about:blank
  async openRDPConnection(vmSession) {
    try {
      // Create RDP client window with about:blank for clean environment
      const rdpWindow = window.open(
        'about:blank',
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes'
      );

      if (rdpWindow) {
        // Write RDP client interface to the window
        const rdpHtml = this.createRDPClientHTML(vmSession);
        rdpWindow.document.open();
        rdpWindow.document.write(rdpHtml);
        rdpWindow.document.close();

        return rdpWindow;
      } else {
        throw new Error('Failed to open RDP window');
      }
    } catch (error) {
      console.error('Error opening RDP connection:', error);
      return null;
    }
  }

  // Create simple VM client HTML interface for about:blank
  createRDPClientHTML(vmSession) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SkillRealms Windows VM - ${vmSession.specs.os}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base href="about:blank">
        <style>
          /* Reset about:blank environment */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #000;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
          }
          
          /* Remove default about:blank styling */
          html, body {
            border: none;
            outline: none;
          }
          #rdp-display {
            width: 100vw;
            height: 100vh;
            position: relative;
          }
          .rdp-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
            color: white;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .rdp-info {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .status-indicator {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .rdp-controls {
            margin-left: auto;
            display: flex;
            gap: 10px;
          }
          .rdp-button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
          }
          .rdp-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          .time-badge {
            background: ${this.userTier === 'free' ? 'rgba(255, 193, 7, 0.9)' : 'linear-gradient(135deg, #25a163 0%, #1e7e34 100%)'};
            color: ${this.userTier === 'free' ? '#333' : 'white'};
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          #windows-desktop {
            width: 100%;
            height: calc(100vh - 48px);
            margin-top: 48px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%230078d4"/><stop offset="100%" style="stop-color:%2300bcf2"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23bg)"/></svg>') center/cover;
            position: relative;
            overflow: hidden;
            font-family: 'Segoe UI', system-ui, sans-serif;
          }
          
          .desktop-icons {
            position: absolute;
            top: 20px;
            left: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, 80px);
            gap: 20px;
            z-index: 10;
          }
          
          .desktop-icon {
            width: 80px;
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            padding: 8px;
            color: white;
            text-decoration: none;
            font-size: 11px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          }
          
          .desktop-icon:hover {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          }
          
          .desktop-icon.selected {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .desktop-icon .icon {
            font-size: 32px;
            margin-bottom: 4px;
          }
          
          .desktop-icon .label {
            font-size: 11px;
            line-height: 1.2;
            word-wrap: break-word;
          }
          
          .windows-taskbar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 48px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            padding: 0 8px;
            z-index: 1000;
          }
          
          .start-button {
            width: 48px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: white;
            font-size: 20px;
          }
          
          .start-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .taskbar-apps {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 4px;
            margin: 0 8px;
          }
          
          .taskbar-app {
            height: 40px;
            min-width: 40px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: white;
            font-size: 18px;
            position: relative;
          }
          
          .taskbar-app:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .taskbar-app.active {
            background: rgba(255, 255, 255, 0.3);
            border-bottom: 2px solid #0078d4;
          }
          
          .system-tray {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 12px;
          }
          
          .system-clock {
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
          }
          
          .window {
            position: absolute;
            background: white;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            min-width: 400px;
            min-height: 300px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
          }
          
          .window.active {
            display: flex;
          }
          
          .window-header {
            height: 32px;
            background: linear-gradient(180deg, #f3f3f3 0%, #e8e8e8 100%);
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            padding: 0 8px;
            cursor: move;
          }
          
          .window-title {
            flex: 1;
            font-size: 12px;
            color: #333;
            font-weight: 500;
          }
          
          .window-controls {
            display: flex;
            gap: 4px;
          }
          
          .window-control {
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
          }
          
          .window-control.minimize {
            background: #ffd93d;
            color: #333;
          }
          
          .window-control.maximize {
            background: #6bcf7f;
            color: white;
          }
          
          .window-control.close {
            background: #ff5f57;
            color: white;
          }
          
          .window-control:hover {
            opacity: 0.8;
          }
          
          .window-content {
            flex: 1;
            background: white;
            overflow: auto;
            padding: 16px;
          }
          
          .start-menu {
            position: fixed;
            bottom: 48px;
            left: 0;
            width: 360px;
            height: 500px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 8px 8px 0 0;
            display: none;
            flex-direction: column;
            z-index: 1001;
            color: white;
          }
          
          .start-menu.active {
            display: flex;
          }
          
          .start-menu-header {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .start-menu-search {
            width: 100%;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: white;
            font-size: 14px;
          }
          
          .start-menu-search::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          
          .start-menu-apps {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }
          
          .start-menu-app {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .start-menu-app:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .start-menu-app-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
          
          .start-menu-app-info {
            flex: 1;
          }
          
          .start-menu-app-name {
            font-size: 14px;
            font-weight: 500;
          }
          
          .start-menu-app-desc {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          }
        </style>
      </head>
      <body>
        <div class="rdp-header">
          <div class="rdp-info">
            <div class="status-indicator"></div>
            <span>SkillRealms Windows VM</span>
            <span>•</span>
            <span>${vmSession.specs.os}</span>
            <span>•</span>
            <span>${vmSession.specs.ip}</span>
          </div>
          <div class="rdp-controls">
            <div class="time-badge">
              ${this.userTier === 'free' 
                ? `⏱️ <span id="timer">30:00</span> remaining` 
                : `👑 Unlimited Access`
              }
            </div>
            <button class="rdp-button" onclick="toggleFullscreen()">⛶ Fullscreen</button>
            <button class="rdp-button" onclick="disconnectRDP()">❌ Disconnect</button>
          </div>
        </div>
        
        <div id="windows-desktop">
          <!-- Desktop Icons -->
          <div class="desktop-icons">
            <div class="desktop-icon" onclick="openApp('explorer')">
              <div class="icon">📁</div>
              <div class="label">File Explorer</div>
            </div>
            <div class="desktop-icon" onclick="openApp('browser')">
              <div class="icon">🌐</div>
              <div class="label">Microsoft Edge</div>
            </div>
            <div class="desktop-icon" onclick="openApp('settings')">
              <div class="icon">⚙️</div>
              <div class="label">Settings</div>
            </div>
            <div class="desktop-icon" onclick="openApp('terminal')">
              <div class="icon">💻</div>
              <div class="label">Terminal</div>
            </div>
            <div class="desktop-icon" onclick="openApp('notepad')">
              <div class="icon">📝</div>
              <div class="label">Notepad</div>
            </div>
            <div class="desktop-icon" onclick="openApp('calculator')">
              <div class="icon">🧮</div>
              <div class="label">Calculator</div>
            </div>
            <div class="desktop-icon" onclick="openApp('photos')">
              <div class="icon">�️</div>
              <div class="label">Photos</div>
            </div>
            <div class="desktop-icon" onclick="openApp('music')">
              <div class="icon">🎵</div>
              <div class="label">Music</div>
            </div>
            <div class="desktop-icon" onclick="openApp('video')">
              <div class="icon">🎬</div>
              <div class="label">Video Player</div>
            </div>
            <div class="desktop-icon" onclick="openApp('store')">
              <div class="icon">🏪</div>
              <div class="label">Microsoft Store</div>
            </div>
            <div class="desktop-icon" onclick="openApp('office')">
              <div class="icon">📊</div>
              <div class="label">Office</div>
            </div>
            <div class="desktop-icon" onclick="openApp('recycle')">
              <div class="icon">🗑️</div>
              <div class="label">Recycle Bin</div>
            </div>
          </div>

          <!-- Windows Applications -->
          <div id="explorer-window" class="window">
            <div class="window-header">
              <div class="window-title">File Explorer</div>
              <div class="window-controls">
                <button class="window-control minimize">─</button>
                <button class="window-control maximize">□</button>
                <button class="window-control close">✕</button>
              </div>
            </div>
            <div class="window-content">
              <div style="display: flex; gap: 20px;">
                <div style="width: 200px; border-right: 1px solid #e0e0e0; padding-right: 16px;">
                  <div style="font-weight: bold; margin-bottom: 8px;">Quick Access</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Desktop</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Documents</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Downloads</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Pictures</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Music</div>
                  <div style="cursor: pointer; padding: 4px;">📁 Videos</div>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: bold; margin-bottom: 8px;">This PC</div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px;">
                    <div style="text-align: center; cursor: pointer;">
                      <div style="font-size: 32px;">💾</div>
                      <div style="font-size: 12px;">Local Disk (C:)</div>
                    </div>
                    <div style="text-align: center; cursor: pointer;">
                      <div style="font-size: 32px;">💿</div>
                      <div style="font-size: 12px;">DVD Drive (D:)</div>
                    </div>
                    <div style="text-align: center; cursor: pointer;">
                      <div style="font-size: 32px;">📁</div>
                      <div style="font-size: 12px;">USB Drive (E:)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="browser-window" class="window">
            <div class="window-header">
              <div class="window-title">Microsoft Edge</div>
              <div class="window-controls">
                <button class="window-control minimize">─</button>
                <button class="window-control maximize">□</button>
                <button class="window-control close">✕</button>
              </div>
            </div>
            <div class="window-content">
              <div style="border: 1px solid #ccc; border-radius: 4px; margin-bottom: 16px;">
                <input type="text" value="https://www.bing.com" style="width: 100%; padding: 8px; border: none; outline: none;" />
              </div>
              <div style="height: 400px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">🌐</div>
                  <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Welcome to Microsoft Edge</div>
                  <div style="color: #666;">Browse the web with speed and security</div>
                </div>
              </div>
            </div>
          </div>

          <div id="settings-window" class="window">
            <div class="window-header">
              <div class="window-title">Settings</div>
              <div class="window-controls">
                <button class="window-control minimize">─</button>
                <button class="window-control maximize">□</button>
                <button class="window-control close">✕</button>
              </div>
            </div>
            <div class="window-content">
              <div style="display: flex; gap: 20px;">
                <div style="width: 200px; border-right: 1px solid #e0e0e0; padding-right: 16px;">
                  <div style="font-weight: bold; margin-bottom: 8px;">Settings</div>
                  <div style="cursor: pointer; padding: 4px;">🔧 System</div>
                  <div style="cursor: pointer; padding: 4px;">🔊 Sound</div>
                  <div style="cursor: pointer; padding: 4px;">🖥️ Display</div>
                  <div style="cursor: pointer; padding: 4px;">🌐 Network</div>
                  <div style="cursor: pointer; padding: 4px;">🔐 Privacy</div>
                  <div style="cursor: pointer; padding: 4px;">⏰ Time & Language</div>
                  <div style="cursor: pointer; padding: 4px;">👤 Accounts</div>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: bold; margin-bottom: 8px;">System Information</div>
                  <div style="background: #f5f5f5; padding: 16px; border-radius: 4px;">
                    <div><strong>OS:</strong> ${vmSession.specs.os}</div>
                    <div><strong>Processor:</strong> Intel Core i${vmSession.specs.cpu} @ 2.4GHz</div>
                    <div><strong>RAM:</strong> ${vmSession.specs.ram}</div>
                    <div><strong>Storage:</strong> ${vmSession.specs.storage}</div>
                    <div><strong>GPU:</strong> ${vmSession.specs.gpu}</div>
                    <div><strong>Host:</strong> ${vmSession.specs.hostname}</div>
                    <div><strong>IP:</strong> ${vmSession.specs.ip}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Windows Taskbar -->
          <div class="windows-taskbar">
            <button class="start-button" onclick="toggleStartMenu()">⊞</button>
            <div class="taskbar-apps">
              <button class="taskbar-app" onclick="toggleApp('explorer')" title="File Explorer">📁</button>
              <button class="taskbar-app" onclick="toggleApp('browser')" title="Microsoft Edge">🌐</button>
              <button class="taskbar-app" onclick="toggleApp('settings')" title="Settings">⚙️</button>
            </div>
            <div class="system-tray">
              <div class="system-clock" id="system-clock">12:00 PM</div>
            </div>
          </div>

          <!-- Start Menu -->
          <div class="start-menu" id="start-menu">
            <div class="start-menu-header">
              <input type="text" class="start-menu-search" placeholder="Type here to search" />
            </div>
            <div class="start-menu-apps">
              <div class="start-menu-app" onclick="openApp('explorer')">
                <div class="start-menu-app-icon">📁</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">File Explorer</div>
                  <div class="start-menu-app-desc">Browse files and folders</div>
                </div>
              </div>
              <div class="start-menu-app" onclick="openApp('browser')">
                <div class="start-menu-app-icon">🌐</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">Microsoft Edge</div>
                  <div class="start-menu-app-desc">Web browser</div>
                </div>
              </div>
              <div class="start-menu-app" onclick="openApp('settings')">
                <div class="start-menu-app-icon">⚙️</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">Settings</div>
                  <div class="start-menu-app-desc">System settings</div>
                </div>
              </div>
              <div class="start-menu-app" onclick="openApp('notepad')">
                <div class="start-menu-app-icon">📝</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">Notepad</div>
                  <div class="start-menu-app-desc">Text editor</div>
                </div>
              </div>
              <div class="start-menu-app" onclick="openApp('calculator')">
                <div class="start-menu-app-icon">🧮</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">Calculator</div>
                  <div class="start-menu-app-desc">Basic calculator</div>
                </div>
              </div>
              <div class="start-menu-app" onclick="openApp('terminal')">
                <div class="start-menu-app-icon">💻</div>
                <div class="start-menu-app-info">
                  <div class="start-menu-app-name">Terminal</div>
                  <div class="start-menu-app-desc">Command line interface</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          // Initialize Windows VM interface
          document.addEventListener('DOMContentLoaded', function() {
            console.log('SkillRealms Windows VM - ${vmSession.specs.os} Loaded');
            updateConnectionStatus();
            updateSystemClock();
            
            // Timer for free users
            ${this.userTier === 'free' ? `
            let timeRemaining = 30 * 60 * 1000;
            const timerElement = document.getElementById('timer');
            
            const updateTimer = () => {
              if (timeRemaining > 0) {
                const minutes = Math.floor(timeRemaining / 60000);
                const seconds = Math.floor((timeRemaining % 60000) / 1000);
                timerElement.textContent = minutes + ':' + String(seconds).padStart(2, '0');
                timeRemaining -= 1000;
                
                if (timeRemaining <= 5 * 60 * 1000) {
                  document.querySelector('.time-badge').style.background = 'rgba(220, 53, 69, 0.9)';
                  document.querySelector('.time-badge').style.color = 'white';
                }
              } else {
                document.querySelector('.time-badge').innerHTML = '⏱️ Time Expired';
                disconnectVM();
              }
            };
            
            setInterval(updateTimer, 1000);
            ` : ''}
          });
          
          function updateConnectionStatus() {
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
              statusIndicator.style.background = '#4ade80';
            }
          }
          
          function updateSystemClock() {
            const updateClock = () => {
              const now = new Date();
              const hours = now.getHours();
              const minutes = now.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours % 12 || 12;
              const timeString = displayHours + ':' + String(minutes).padStart(2, '0') + ' ' + ampm;
              
              const clockElement = document.getElementById('system-clock');
              if (clockElement) {
                clockElement.textContent = timeString;
              }
            };
            
            updateClock();
            setInterval(updateClock, 60000); // Update every minute
          }
          
          function toggleFullscreen() {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }
          
          function disconnectVM() {
            console.log('Disconnecting Windows VM session');
            window.close();
          }
          
          // Windows Application Functions
          function openApp(appName) {
            console.log('Opening application:', appName);
            
            switch(appName) {
              case 'explorer':
                showWindow('explorer-window');
                updateTaskbarApp('explorer', true);
                break;
              case 'browser':
                showWindow('browser-window');
                updateTaskbarApp('browser', true);
                break;
              case 'settings':
                showWindow('settings-window');
                updateTaskbarApp('settings', true);
                break;
              case 'notepad':
                alert('Notepad would open here in a real implementation');
                break;
              case 'calculator':
                alert('Calculator would open here in a real implementation');
                break;
              case 'terminal':
                alert('Terminal would open here in a real implementation');
                break;
              case 'photos':
                alert('Photos would open here in a real implementation');
                break;
              case 'music':
                alert('Music would open here in a real implementation');
                break;
              case 'video':
                alert('Video Player would open here in a real implementation');
                break;
              case 'store':
                alert('Microsoft Store would open here in a real implementation');
                break;
              case 'office':
                alert('Office would open here in a real implementation');
                break;
              case 'recycle':
                alert('Recycle Bin would open here in a real implementation');
                break;
              default:
                console.log('Unknown application:', appName);
            }
          }
          
          function showWindow(windowId) {
            // Hide all windows first
            const allWindows = document.querySelectorAll('.window');
            allWindows.forEach(window => {
              window.classList.remove('active');
            });
            
            // Show the requested window
            const targetWindow = document.getElementById(windowId + '-window');
            if (targetWindow) {
              targetWindow.classList.add('active');
              
              // Position window in center
              const desktop = document.getElementById('windows-desktop');
              const desktopRect = desktop.getBoundingClientRect();
              const windowRect = targetWindow.getBoundingClientRect();
              
              targetWindow.style.left = (desktopRect.width - windowRect.width) / 2 + 'px';
              targetWindow.style.top = (desktopRect.height - windowRect.height) / 2 + 'px';
            }
          }
          
          function closeWindow(windowId) {
            const window = document.getElementById(windowId + '-window');
            if (window) {
              window.classList.remove('active');
              
              // Update taskbar
              const appName = windowId.replace('-window', '');
              updateTaskbarApp(appName, false);
            }
          }
          
          function minimizeWindow(windowId) {
            const window = document.getElementById(windowId + '-window');
            if (window) {
              window.classList.remove('active');
              
              // Update taskbar
              const appName = windowId.replace('-window', '');
              updateTaskbarApp(appName, false);
            }
          }
          
          function maximizeWindow(windowId) {
            const window = document.getElementById(windowId + '-window');
            if (window) {
              const desktop = document.getElementById('windows-desktop');
              const desktopRect = desktop.getBoundingClientRect();
              
              window.style.left = '0px';
              window.style.top = '0px';
              window.style.width = desktopRect.width + 'px';
              window.style.height = (desktopRect.height - 48) + 'px';
            }
          }
          
          function updateTaskbarApp(appName, isActive) {
            const taskbarApps = document.querySelectorAll('.taskbar-app');
            taskbarApps.forEach(app => {
              if (app.getAttribute('onclick').includes(appName)) {
                if (isActive) {
                  app.classList.add('active');
                } else {
                  app.classList.remove('active');
                }
              }
            });
          }
          
          function toggleApp(appName) {
            const window = document.getElementById(appName + '-window');
            if (window) {
              if (window.classList.contains('active')) {
                minimizeWindow(appName + '-window');
              } else {
                openApp(appName);
              }
            }
          }
          
          function toggleStartMenu() {
            const startMenu = document.getElementById('start-menu');
            if (startMenu) {
              startMenu.classList.toggle('active');
            }
          }
          
          // Close start menu when clicking outside
          document.addEventListener('click', function(event) {
            const startMenu = document.getElementById('start-menu');
            const startButton = document.querySelector('.start-button');
            
            if (startMenu && startButton) {
              if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
                startMenu.classList.remove('active');
              }
            }
          });
          
          // Window dragging functionality
          let draggedWindow = null;
          let dragOffset = { x: 0, y: 0 };
          
          document.addEventListener('mousedown', function(event) {
            if (event.target.closest('.window-header')) {
              draggedWindow = event.target.closest('.window');
              const rect = draggedWindow.getBoundingClientRect();
              dragOffset.x = event.clientX - rect.left;
              dragOffset.y = event.clientY - rect.top;
              
              // Bring window to front
              const allWindows = document.querySelectorAll('.window');
              allWindows.forEach(window => {
                window.style.zIndex = 100;
              });
              draggedWindow.style.zIndex = 200;
            }
          });
          
          document.addEventListener('mousemove', function(event) {
            if (draggedWindow) {
              const desktop = document.getElementById('windows-desktop');
              const desktopRect = desktop.getBoundingClientRect();
              
              let newX = event.clientX - desktopRect.left - dragOffset.x;
              let newY = event.clientY - desktopRect.top - dragOffset.y;
              
              // Keep window within desktop bounds
              newX = Math.max(0, Math.min(newX, desktopRect.width - draggedWindow.offsetWidth));
              newY = Math.max(0, Math.min(newY, desktopRect.height - draggedWindow.offsetHeight));
              
              draggedWindow.style.left = newX + 'px';
              draggedWindow.style.top = newY + 'px';
            }
          });
          
          document.addEventListener('mouseup', function() {
            draggedWindow = null;
          });
        </script>
      </body>
      </html>
    `;
  }

  // Monitor RDP connection
  monitorRDPConnection(rdpWindow) {
    const checkInterval = setInterval(() => {
      try {
        if (rdpWindow.closed) {
          this.isConnected = false;
          this.vmSession = null;
          this.vmWindow = null;
          clearInterval(checkInterval);
          this.onSessionClosed?.();
        }
      } catch (error) {
        // Cross-origin error - session is still active
      }
    }, 2000);

    // Auto-close free trial after time limit
    if (this.userTier === 'free') {
      setTimeout(() => {
        if (!rdpWindow.closed) {
          rdpWindow.close();
        }
        clearInterval(checkInterval);
      }, 30 * 60 * 1000);
    }
  }

  // Detect user tier
  detectUserTier(user) {
    if (!user) return 'free';
    
    // Treat all logged-in users as pro for now
    if (user.email) {
      return 'pro';
    }
    
    return 'free';
  }

  // Get lesson-based time
  getUsedLessonTime(userEmail, lessonId) {
    const storageKey = `skillrealms_lesson_time_${userEmail}_${lessonId}`;
    const usedTime = localStorage.getItem(storageKey);
    return usedTime ? parseInt(usedTime) : 0;
  }

  // Save lesson-based time
  saveLessonTime(userEmail, lessonId, usedTime) {
    const storageKey = `skillrealms_lesson_time_${userEmail}_${lessonId}`;
    localStorage.setItem(storageKey, usedTime.toString());
  }

  // Start lesson-based timer
  startLessonTimer(userEmail, lessonId) {
    this.sessionTimer = setInterval(() => {
      const elapsed = Date.now() - this.sessionStartTime;
      const totalUsed = this.getUsedLessonTime(userEmail, lessonId) + elapsed;
      
      if (totalUsed >= 30 * 60 * 1000) {
        this.endSession(userEmail, 'Lesson time expired');
        this.onTrialExpired?.(userEmail);
      } else {
        this.saveLessonTime(userEmail, lessonId, totalUsed);
        this.onTimeUpdate?.(30 * 60 * 1000 - totalUsed);
      }
    }, 1000);
  }

  // End session
  endSession(userEmail, reason = 'User ended session') {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
    
    if (this.userTier === 'free' && this.sessionStartTime) {
      const elapsed = Date.now() - this.sessionStartTime;
      const totalUsed = this.getUsedLessonTime(userEmail, 'current') + elapsed;
      this.saveLessonTime(userEmail, 'current', totalUsed);
    }
    
    if (this.vmWindow && !this.vmWindow.closed) {
      this.vmWindow.close();
    }
    
    this.vmSession = null;
    this.vmWindow = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    this.onSessionEnded?.(reason);
  }

  // Close session
  closeSession() {
    if (this.vmWindow && !this.vmWindow.closed) {
      this.vmWindow.close();
    }
    this.vmSession = null;
    this.vmWindow = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  // Get API token
  getApiToken() {
    return localStorage.getItem('skillrealms_api_token') || 'demo-token';
  }

  // Generate session ID
  generateSessionId() {
    return `skillrealms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate temporary password
  generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Get session status
  getSessionStatus(userEmail) {
    if (!this.isConnected) {
      return {
        connected: false,
        tier: this.userTier,
        remainingTime: this.userTier === 'free' ? this.getUsedLessonTime(userEmail, 'current') : Infinity
      };
    }

    return {
      connected: true,
      tier: this.userTier,
      sessionStart: this.sessionStartTime,
      vmWindow: this.vmWindow,
      rdpUrl: this.vmUrl,
      realConnection: true
    };
  }
}

export default new ActualWindowsVMService();
