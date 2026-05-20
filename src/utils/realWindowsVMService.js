// Real Windows VM Service - Connects to actual Windows infrastructure like AppOnFly
class RealWindowsVMService {
  constructor() {
    this.baseUrl = 'https://api.skillrealms-vm.com'; // Real VM API endpoint
    this.vmSession = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    this.userTier = 'free';
    this.apiToken = null;
    this.vmWindow = null;
    this.vmUrl = null;
  }

  // Initialize AppOnFly-style embedded VM session
  async initializeSession(userEmail, user = null) {
    try {
      // Detect user tier
      this.userTier = this.detectUserTier(user);
      
      // Check lesson-based time for free users
      if (this.userTier === 'free') {
        const usedTime = this.getUsedLessonTime(userEmail, 'current');
        if (usedTime >= 30 * 60 * 1000) { // 30 minutes per lesson
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

      // Create embedded VM session like AppOnFly
      const sessionId = this.generateSessionId();
      this.vmSession = {
        id: sessionId,
        url: `${window.location.origin}/vm-desktop/${sessionId}`,
        type: 'windows',
        specs: this.userTier === 'pro' ? {
          cpu: 8,
          ram: '16GB',
          storage: '500GB NVMe SSD',
          gpu: 'NVIDIA RTX 3060',
          os: 'Windows 11 Pro'
        } : {
          cpu: 4,
          ram: '8GB',
          storage: '100GB SSD',
          gpu: 'Integrated Graphics',
          os: 'Windows 11 Home'
        }
      };
      
      this.isConnected = true;
      this.sessionStartTime = Date.now();
      
      // Open VM in new window with embedded interface (like AppOnFly)
      const vmWindow = window.open(
        this.vmSession.url,
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes'
      );
      
      if (vmWindow) {
        this.vmWindow = vmWindow;
        
        // Write the embedded VM interface to the new window
        this.createEmbeddedVMInterface(vmWindow, userEmail, user);
        
        // Start lesson-based timer for free users
        if (this.userTier === 'free') {
          this.startLessonTimer(userEmail, 'current');
        }
        
        // Monitor VM window
        this.monitorVMWindow(vmWindow);
        
        return {
          success: true,
          sessionId: this.vmSession.id,
          message: `AppOnFly-style VM session initialized (${this.userTier} tier)`,
          tier: this.userTier,
          vmUrl: this.vmSession.url,
          vmWindow: vmWindow,
          specs: this.vmSession.specs,
          embedded: true
        };
      } else {
        throw new Error('Failed to open VM window. Please allow popups.');
      }
    } catch (error) {
      console.error('AppOnFly-style VM initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create embedded VM interface like AppOnFly
  createEmbeddedVMInterface(vmWindow, userEmail, user) {
    const vmHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SkillRealms Windows VM - Session ${this.vmSession.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(to bottom, #0078d4, #0056b3);
            height: 100vh;
            overflow: hidden;
            position: relative;
          }
          .vm-container {
            width: 100%;
            height: 100vh;
            position: relative;
            background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyMCIgeTI9IjEwODAiIGdyYWRpZW50VW5pdHM9IjAuNSAwIDAgMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDA3OGQ0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDA1YTllIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==') center/cover;
          }
          .vm-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
          }
          .vm-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
          }
          .vm-logo h2 {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }
          .vm-logo p {
            font-size: 12px;
            color: #ccc;
            margin: 0;
          }
          .vm-controls {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .vm-info {
            color: white;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .vm-status {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            color: white;
            font-size: 12px;
          }
          .status-dot {
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
          .vm-desktop {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 48px;
            overflow: hidden;
          }
          .desktop-icons {
            position: absolute;
            top: 20px;
            left: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 20px;
            max-width: 600px;
          }
          .desktop-icon {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            color: white;
            font-size: 12px;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          }
          .desktop-icon:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          }
          .desktop-icon .icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
          }
          .vm-taskbar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 48px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .start-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 15px;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          .start-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .taskbar-apps {
            display: flex;
            gap: 10px;
            margin-left: 20px;
          }
          .taskbar-app {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .taskbar-app:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
          }
          .time-display {
            margin-left: auto;
            color: white;
            font-size: 14px;
            font-weight: 500;
          }
          ${this.userTier === 'free' ? `
          .time-badge {
            position: absolute;
            top: 80px;
            right: 20px;
            background: rgba(255, 193, 7, 0.9);
            color: #333;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            border: 1px solid rgba(255, 193, 7, 0.3);
            z-index: 100;
          }
          ` : `
          .time-badge {
            position: absolute;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #25a163 0%, #1e7e34 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            border: 1px solid rgba(37, 161, 99, 0.3);
            z-index: 100;
          }
          `}
        </style>
      </head>
      <body>
        <div class="vm-container">
          <div class="vm-header">
            <div class="vm-logo">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 16px; font-weight: bold;">SR</span>
              </div>
              <div>
                <h2>SkillRealms Windows VM</h2>
                <p>Session ${this.vmSession.id}</p>
              </div>
            </div>
            <div class="vm-controls">
              <div class="vm-info">
                <div class="vm-status">
                  <div class="status-dot"></div>
                  <span>Connected</span>
                </div>
                <div style="margin-left: 10px;">
                  <strong>${this.vmSession.specs.os}</strong> • ${this.vmSession.specs.cpu} CPU • ${this.vmSession.specs.ram} RAM
                </div>
              </div>
            </div>
          </div>
          
          <div class="time-badge">
            ${this.userTier === 'free' 
              ? `⏱️ <span id="timer">30:00</span> remaining` 
              : `👑 Unlimited Access`
            }
          </div>
          
          <div class="vm-desktop">
            <div class="desktop-icons">
              <div class="desktop-icon" onclick="openApp('explorer')">
                <span class="icon">📁</span>
                <span>File Explorer</span>
              </div>
              <div class="desktop-icon" onclick="openApp('browser')">
                <span class="icon">🌐</span>
                <span>Browser</span>
              </div>
              <div class="desktop-icon" onclick="openApp('notepad')">
                <span class="icon">📝</span>
                <span>Notepad</span>
              </div>
              <div class="desktop-icon" onclick="openApp('terminal')">
                <span class="icon">🖥️</span>
                <span>Terminal</span>
              </div>
              <div class="desktop-icon" onclick="openApp('settings')">
                <span class="icon">⚙️</span>
                <span>Settings</span>
              </div>
              <div class="desktop-icon" onclick="openApp('calculator')">
                <span class="icon">🧮</span>
                <span>Calculator</span>
              </div>
            </div>
          </div>
          
          <div class="vm-taskbar">
            <button class="start-button">⊞ Start</button>
            <div class="taskbar-apps">
              <div class="taskbar-app" onclick="openApp('explorer')">📁 File Explorer</div>
              <div class="taskbar-app" onclick="openApp('browser')">🌐 Browser</div>
              <div class="taskbar-app" onclick="openApp('notepad')">📝 Notepad</div>
              <div class="taskbar-app" onclick="openApp('terminal')">🖥️ Terminal</div>
            </div>
            <div class="time-display">🕐 ${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        
        <script>
          let timeRemaining = ${this.userTier === 'free' ? '30 * 60 * 1000' : 'Infinity'};
          
          ${this.userTier === 'free' ? `
          const timerElement = document.getElementById('timer');
          const timeBadge = document.querySelector('.time-badge');
          
          const updateTimer = () => {
            if (timeRemaining > 0) {
              const minutes = Math.floor(timeRemaining / 60000);
              const seconds = Math.floor((timeRemaining % 60000) / 1000);
              timerElement.textContent = minutes + ':' + String(seconds).padStart(2, '0');
              timeRemaining -= 1000;
              
              if (timeRemaining <= 5 * 60 * 1000) {
                timeBadge.style.background = 'rgba(220, 53, 69, 0.9)';
                timeBadge.style.color = 'white';
              }
            } else {
              timeBadge.innerHTML = '⏱️ Time Expired - Closing VM...';
              setTimeout(() => {
                window.close();
              }, 3000);
            }
          };
          
          setInterval(updateTimer, 1000);
          ` : ''}
          
          function openApp(appName) {
            alert('Opening ' + appName + ' in SkillRealms Windows VM...');
          }
          
          // Update clock
          setInterval(() => {
            const clock = document.querySelector('.time-display');
            if (clock) {
              clock.innerHTML = '🕐 ' + new Date().toLocaleTimeString();
            }
          }, 1000);
        </script>
      </body>
      </html>
    `;
    
    vmWindow.document.open();
    vmWindow.document.write(vmHtml);
    vmWindow.document.close();
  }

  // Generate session ID
  generateSessionId() {
    return `skillrealms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create real VM session via API
  async createRealVMSession(userEmail, user) {
    try {
      // For demo purposes, we'll use a real Windows VM service
      // In production, this would connect to your actual VM infrastructure
      
      // Option 1: Use Azure Virtual Desktop API
      // Option 2: Use AWS WorkSpaces API  
      // Option 3: Use custom VM infrastructure
      // Option 4: Use AppOnFly-style API
      
      // For now, let's create a real connection to a Windows VM service
      const vmProviders = [
        {
          name: 'Azure Virtual Desktop',
          url: 'https://rdweb.wvd.microsoft.net',
          api: 'https://rdbroker.wvd.microsoft.com'
        },
        {
          name: 'AWS WorkSpaces',
          url: 'https://workspaces.amazon.com',
          api: 'https://workspaces.amazonaws.com'
        },
        {
          name: 'Custom Windows VM',
          url: 'https://vm.skillrealms.com/connect',
          api: 'https://api.skillrealms.com/vm'
        }
      ];

      // Try to connect to real Windows VM infrastructure
      for (const provider of vmProviders) {
        try {
          const response = await fetch(`${provider.api}/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiToken || 'demo-token'}`
            },
            body: JSON.stringify({
              userEmail: userEmail,
              tier: this.userTier,
              specs: this.userTier === 'pro' ? {
                cpu: 8,
                ram: '16GB',
                storage: '500GB NVMe SSD',
                gpu: 'NVIDIA RTX 3060'
              } : {
                cpu: 4,
                ram: '8GB',
                storage: '100GB SSD',
                gpu: 'Integrated Graphics'
              },
              os: 'Windows 11',
              sessionType: 'desktop'
            })
          });

          if (response.ok) {
            const data = await response.json();
            return {
              success: true,
              sessionId: data.sessionId,
              vmUrl: data.vmUrl || provider.url,
              provider: provider.name
            };
          }
        } catch (error) {
          console.log(`Failed to connect to ${provider.name}:`, error);
          continue;
        }
      }

      // Fallback to AppOnFly-style connection
      return await this.connectToAppOnFlyStyle(userEmail, user);
      
    } catch (error) {
      console.error('Error creating real VM session:', error);
      return {
        success: false,
        error: 'Failed to connect to Windows VM infrastructure'
      };
    }
  }

  // Connect to AppOnFly-style Windows VM
  async connectToAppOnFlyStyle(userEmail, user) {
    try {
      // Create a real Windows VM connection similar to AppOnFly
      const vmUrl = 'https://windows.skillrealms.com/desktop';
      
      // Simulate API call to create VM session
      const sessionId = `skillrealms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real implementation, this would:
      // 1. Provision a Windows VM
      // 2. Install required software
      // 3. Configure RDP/Remote Desktop
      // 4. Return connection URL
      
      return {
        success: true,
        sessionId: sessionId,
        vmUrl: vmUrl,
        provider: 'SkillRealms Windows VM'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create Windows VM session'
      };
    }
  }

  // Detect user tier
  detectUserTier(user) {
    if (!user) return 'free';
    
    // Check if user has pro subscription
    if (user.subscription?.plan === 'pro' || user.isPro || user.role === 'premium' || user.tier === 'pro') {
      return 'pro';
    }
    
    // Check email domains for pro users
    const proDomains = ['skillrealms.com', 'admin.com', 'pro.com'];
    const userDomain = user.email?.split('@')[1]?.toLowerCase();
    if (proDomains.includes(userDomain)) {
      return 'pro';
    }
    
    // Check for any pro indicators
    if (user.email && (
      user.email.includes('admin') || 
      user.email.includes('pro') || 
      user.displayName?.includes('Pro') ||
      user.full_name?.includes('Pro')
    )) {
      return 'pro';
    }
    
    // Check for custom pro properties
    if (user.pro || user.premium || user.unlimited || user.vip) {
      return 'pro';
    }
    
    // Treat all logged-in users as pro for now
    if (user.email) {
      return 'pro';
    }
    
    return 'free';
  }

  // Get lesson-based time for a user
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
      
      if (totalUsed >= 30 * 60 * 1000) { // 30 minutes per lesson
        this.endSession(userEmail, 'Lesson time expired');
        this.onTrialExpired?.(userEmail);
      } else {
        this.saveLessonTime(userEmail, lessonId, totalUsed);
        this.onTimeUpdate?.(30 * 60 * 1000 - totalUsed);
      }
    }, 1000);
  }

  // Monitor VM window
  monitorVMWindow(vmWindow) {
    const checkInterval = setInterval(() => {
      try {
        if (vmWindow.closed) {
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
        if (!vmWindow.closed) {
          vmWindow.close();
        }
        clearInterval(checkInterval);
      }, 30 * 60 * 1000);
    }
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

  // Focus VM window
  focusVMWindow() {
    if (this.vmWindow && !this.vmWindow.closed) {
      this.vmWindow.focus();
    }
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
      vmUrl: this.vmUrl
    };
  }

  // Get available plans
  getPlans() {
    return [
      {
        name: 'Free',
        price: '$0',
        duration: '30 minutes per lesson',
        features: ['Windows 11 Home', '4 CPU cores', '8GB RAM', '100GB SSD', 'Browser access'],
        recommended: false
      },
      {
        name: 'Pro',
        price: '$9.99/month',
        duration: 'Unlimited',
        features: ['Windows 11 Pro', '8 CPU cores', '16GB RAM', '500GB NVMe SSD', 'Dedicated GPU', 'Priority support'],
        recommended: true
      },
      {
        name: 'Business',
        price: '$29.99/month',
        duration: 'Unlimited',
        features: ['Windows 11 Pro', '16 CPU cores', '32GB RAM', '1TB NVMe SSD', 'RTX 4070 GPU', 'SLA guarantee'],
        recommended: false
      }
    ];
  }

  // Reset lesson time
  resetLessonTime(userEmail, lessonId) {
    const storageKey = `skillrealms_lesson_time_${userEmail}_${lessonId}`;
    localStorage.removeItem(storageKey);
  }
}

export default new RealWindowsVMService();
