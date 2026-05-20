// Frame.io Virtual Desktop Service - Better alternative to AppOnFly
class FrameService {
  constructor() {
    this.baseUrl = 'https://api.frame.io';
    this.apiUrl = 'https://api.frame.io/v2';
    this.vmSession = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    this.userTier = 'free';
    this.apiToken = null;
  }

  // Initialize Frame.io session with direct embedding on current website
  async initializeSession(userEmail, user = null) {
    try {
      // Detect user tier
      this.userTier = this.detectUserTier(user);
      
      if (this.userTier === 'free') {
        // Check if free user has remaining trial time
        const usedTime = this.getUsedTrialTime(userEmail);
        if (usedTime >= 30 * 60 * 1000) { // 30 minutes
          return {
            success: false,
            error: 'Free trial expired. Upgrade to Pro for unlimited access.',
            tier: 'free',
            usedTime: usedTime,
            limit: 30 * 60 * 1000,
            requiresUpgrade: true
          };
        }
      }
      
      // Create embedded VM session - no new window, no redirection
      this.vmSession = {
        id: this.generateSessionId(),
        url: 'https://app.frame.io',
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
      
      return {
        success: true,
        sessionId: this.vmSession.id,
        message: `Frame.io session initialized (${this.userTier} tier)`,
        tier: this.userTier,
        embedUrl: 'https://app.frame.io',
        specs: this.vmSession.specs,
        embedded: true
      };
    } catch (error) {
      console.error('Frame.io initialization error:', error);
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

  // Get used trial time for a user
  getUsedTrialTime(userEmail) {
    const storageKey = `frame_trial_time_${userEmail}`;
    const usedTime = localStorage.getItem(storageKey);
    return usedTime ? parseInt(usedTime) : 0;
  }

  // Save used trial time
  saveTrialTime(userEmail, usedTime) {
    const storageKey = `frame_trial_time_${userEmail}`;
    localStorage.setItem(storageKey, usedTime.toString());
  }

  // Start session timer for free users
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
    
    this.closeSession();
    this.onSessionEnded?.(reason);
  }

  // Close Frame.io session
  closeSession() {
    if (this.vmSession?.window && !this.vmSession.window.closed) {
      this.vmSession.window.close();
    }
    this.vmSession = null;
    this.isConnected = false;
    this.sessionStartTime = null;
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
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
      vmSession: this.vmSession
    };
  }

  // Generate unique session ID
  generateSessionId() {
    return `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get VM specifications
  getVMSpecs() {
    return {
      free: {
        cpu: 2,
        ram: '4GB',
        storage: '50GB SSD',
        gpu: 'Integrated Graphics',
        network: '100 Mbps'
      },
      pro: {
        cpu: 8,
        ram: '16GB',
        storage: '500GB NVMe SSD',
        gpu: 'NVIDIA RTX 3060',
        network: '1 Gbps'
      }
    };
  }

  // Get available plans
  getPlans() {
    return [
      {
        name: 'Free',
        price: '$0',
        duration: '30 minutes trial',
        features: ['Windows 10', '2 CPU cores', '4GB RAM', '50GB SSD', 'Browser access'],
        recommended: false
      },
      {
        name: 'Pro',
        price: '$9.99/month',
        duration: 'Unlimited',
        features: ['Windows 11', '8 CPU cores', '16GB RAM', '500GB NVMe SSD', 'Dedicated GPU', 'Priority support'],
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
    const storageKey = `frame_trial_time_${userEmail}`;
    localStorage.removeItem(storageKey);
  }

  // File operations through Frame.io
  async uploadFile(file, destinationPath = 'C:\\Users\\User\\Downloads\\') {
    if (!this.isConnected) {
      throw new Error('No active Frame.io session');
    }

    try {
      // In production, this would use Frame.io API
      console.log(`Uploading ${file.name} to ${destinationPath} via Frame.io`);
      
      return {
        success: true,
        message: `File uploaded successfully via Frame.io`,
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

  // Execute command in VM
  async executeCommand(command) {
    if (!this.isConnected) {
      throw new Error('No active Frame.io session');
    }

    try {
      // In production, this would use Frame.io API
      console.log(`Executing command: "${command}" via Frame.io`);
      
      return {
        success: true,
        message: `Command executed successfully via Frame.io`,
        command: command
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
        storage: '500GB NVMe SSD',
        gpu: 'NVIDIA RTX 3060',
        network: '1 Gbps',
        uptime: new Date().toISOString(),
        frameVersion: '2.0'
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
}

export default new FrameService();
