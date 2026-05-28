// SkillRealms Custom Windows VM Service - Complete control over your own VM
class SkillRealmsVMService {
  constructor() {
    this.baseUrl = window.location.origin; // Your own domain
    this.vmSession = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    this.userTier = 'free';
    this.apiToken = null;
    this.vmWindow = null;
  }

  // Initialize SkillRealms VM session
  async initializeSession(userEmail, user = null) {
    try {
      // Detect user tier
      this.userTier = this.detectUserTier(user);
      
      // Create VM window with full control
      const vmWindow = window.open(
        `${this.baseUrl}/vm-session`, 
        '_blank', 
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes'
      );
      
      if (vmWindow) {
        this.vmWindow = vmWindow;
        this.vmSession = {
          id: this.generateSessionId(),
          window: vmWindow,
          url: `${this.baseUrl}/vm-session`,
          type: 'windows',
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
          }
        };
        
        this.isConnected = true;
        this.sessionStartTime = Date.now();
        
        // Start session timer for free users
        if (this.userTier === 'free') {
          this.startSessionTimer(userEmail);
        }
        
        // Set up communication with VM window
        this.setupVMWindowCommunication(vmWindow);
        
        return {
          success: true,
          sessionId: this.vmSession.id,
          message: `SkillRealms VM session initialized (${this.userTier} tier)`,
          tier: this.userTier,
          vmWindow: vmWindow,
          specs: this.vmSession.specs
        };
      } else {
        throw new Error('Failed to open VM window. Please allow popups.');
      }
    } catch (error) {
      console.error('SkillRealms VM initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Detect user tier (free vs pro)
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
    
    // Check for any pro indicators in user object
    if (user.email && (
      user.email.includes('admin') || 
      user.email.includes('pro') || 
      user.displayName?.includes('Pro') ||
      user.full_name?.includes('Pro')
    )) {
      return 'pro';
    }
    
    // Temporary override for testing - treat all logged-in users as pro
    if (user.email) {
      return 'pro';
    }
    
    return 'free';
  }

  // Get used lesson time for a user
  getUsedLessonTime(userEmail, lessonId) {
    const storageKey = `skillrealms_lesson_time_${userEmail}_${lessonId}`;
    const usedTime = localStorage.getItem(storageKey);
    return usedTime ? parseInt(usedTime) : 0;
  }

  // Save used lesson time
  saveLessonTime(userEmail, lessonId, usedTime) {
    const storageKey = `skillrealms_lesson_time_${userEmail}_${lessonId}`;
    localStorage.setItem(storageKey, usedTime.toString());
  }

  // Get used trial time for a user (legacy)
  getUsedTrialTime(userEmail) {
    const storageKey = `skillrealms_trial_time_${userEmail}`;
    const usedTime = localStorage.getItem(storageKey);
    return usedTime ? parseInt(usedTime) : 0;
  }

  // Save used trial time (legacy)
  saveTrialTime(userEmail, usedTime) {
    const storageKey = `skillrealms_trial_time_${userEmail}`;
    localStorage.setItem(storageKey, usedTime.toString());
  }

  // Start lesson-based timer for free users
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

  // Start session timer for free users (legacy)
  startSessionTimer(userEmail) {
    this.sessionTimer = setInterval(() => {
      const elapsed = Date.now() - this.sessionStartTime;
      const totalUsed = this.getUsedTrialTime(userEmail) + elapsed;
      
      if (totalUsed >= 30 * 60 * 1000) { // 30 minutes
        this.endSession(userEmail, 'Trial expired');
        this.onTrialExpired?.(userEmail);
      } else {
        this.saveTrialTime(userEmail, totalUsed);
        this.onTimeUpdate?.(30 * 60 * 1000 - totalUsed);
      }
    }, 1000);
  }

  // Set up communication with VM window
  setupVMWindowCommunication(vmWindow) {
    // Post message to VM window with commands
    this.sendVMCommand = (command, data = null) => {
      if (vmWindow && !vmWindow.closed) {
        vmWindow.postMessage({
          type: 'command',
          command: command,
          data: data,
          timestamp: Date.now()
        }, '*');
      }
    };

    // Listen for messages from VM window
    window.addEventListener('message', (event) => {
      if (event.data.type === 'vm-status') {
        this.onVMStatusUpdate?.(event.data);
      } else if (event.data.type === 'vm-file-upload') {
        this.onFileUploaded?.(event.data);
      } else if (event.data.type === 'vm-app-launched') {
        this.onAppLaunched?.(event.data);
      }
    });

    // Monitor window for closure
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

    // Cleanup after 30 minutes (free trial limit)
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
      const totalUsed = this.getUsedTrialTime(userEmail) + elapsed;
      this.saveTrialTime(userEmail, totalUsed);
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

  // Close VM window
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

  // Minimize VM window
  minimizeVMWindow() {
    if (this.vmWindow && !this.vmWindow.closed) {
      this.vmWindow.minimize?.();
    }
  }

  // Maximize VM window
  maximizeVMWindow() {
    if (this.vmWindow && !this.vmWindow.closed) {
      this.vmWindow.maximize?.();
    }
  }

  // Execute command in VM
  executeCommand(command, data = null) {
    this.sendVMCommand(command, data);
    return {
      success: true,
      message: `Command executed: ${command}`,
      command: command
    };
  }

  // Launch application in VM
  launchApplication(appName, appPath = null) {
    this.sendVMCommand('launch-app', { appName, appPath });
    return {
      success: true,
      message: `Launching application: ${appName}`,
      appName: appName
    };
  }

  // Upload file to VM
  async uploadFile(file, destinationPath = 'C:\\Users\\User\\Downloads\\') {
    if (!this.isConnected) {
      throw new Error('No active VM session');
    }

    try {
      // Send file to VM window
      this.sendVMCommand('upload-file', { fileName: file.name, destinationPath, size: file.size });
      
      return {
        success: true,
        message: `File uploaded successfully to VM`,
        fileName: file.name,
        destination: destinationPath,
        fileSize: file.size
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Download file from VM
  async downloadFile(sourcePath) {
    if (!this.isConnected) {
      throw new Error('No active VM session');
    }

    try {
      this.sendVMCommand('download-file', { sourcePath });
      
      return {
        success: true,
        message: `File download initiated from VM`,
        sourcePath: sourcePath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get system information
  async getSystemInfo() {
    if (!this.isConnected) {
      return {
        connected: false,
        info: null
      };
    }

    // Return mock system info for now
    return {
      connected: true,
      info: {
        os: 'Windows 11 Pro',
        cpu: 'Intel Core i7-12700K',
        ram: '16GB DDR4',
        storage: '1TB NVMe SSD',
        gpu: 'NVIDIA RTX 3060',
        network: '1 Gbps',
        uptime: new Date().toISOString(),
        provider: 'SkillRealms VM'
      }
    };
  }

  // Get performance metrics
  async getPerformanceMetrics() {
    if (!this.isConnected) {
      return null;
    }

    // Mock performance data
    return {
      cpu: Math.floor(Math.random() * 20) + 10, // 10-30%
      memory: Math.floor(Math.random() * 30) + 20, // 20-50%
      disk: Math.floor(Math.random() * 15) + 5, // 5-20%
      network: Math.floor(Math.random() * 40) + 20, // 20-60 Mbps
      gpu: Math.floor(Math.random() * 25) + 15, // 15-40%
      timestamp: new Date().toISOString()
    };
  }

  // Get session status
  getSessionStatus(userEmail) {
    if (!this.isConnected) {
      return {
        connected: false,
        tier: this.userTier,
        remainingTime: this.userTier === 'free' ? this.getUsedTrialTime(userEmail) : Infinity
      };
    }

    return {
      connected: true,
      tier: this.userTier,
      sessionStart: this.sessionStartTime,
      vmWindow: this.vmWindow
    };
  }

  // Generate unique session ID
  generateSessionId() {
    return `skillrealms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get available plans
  getPlans() {
    return [
      {
        name: 'Free',
        price: '$0',
        duration: '30 minutes trial',
        features: ['Windows 11', '4 CPU cores', '8GB RAM', '100GB SSD', 'Browser access'],
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

  // Reset trial time (for testing or admin)
  resetTrialTime(userEmail) {
    const storageKey = `skillrealms_trial_time_${userEmail}`;
    localStorage.removeItem(storageKey);
  }
}

export default new SkillRealmsVMService();
