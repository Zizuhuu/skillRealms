import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Wifi, Settings, Download, User, Lock, Maximize2, X, Gamepad2, Youtube, Loader, Volume2, Battery, Server, Cloud, HardDrive, Terminal, Cpu, Database, Globe, Folder, FileText, Calendar, Mail, Chrome, Command, Network, Search, Clock, Power, Play, Pause, Home, ArrowLeft, ArrowRight, ExternalLink, CreditCard, RefreshCw, MonitorOff, Upload, Download as DownloadIcon, Terminal as TerminalIcon, Activity, Zap, HardDrive as DriveIcon, MemoryStick, Crown, AlertCircle, CheckCircle, Timer, Star, Gift, ArrowUp, Shield, Zap as Bolt, Router, Cable, Link, Server as ServerIcon, CloudDownload, UploadCloud, Monitor as MonitorIcon, DollarSign, Clock as ClockIcon, Activity as ActivityIcon } from 'lucide-react';
import realWindowsVPS from '../utils/realWindowsVPS';

// Neverinstall.com virtual desktop launcher with direct window opening
const launchWindows = () => {
  try {
    // Try direct window opening first
    var win = window.open('https://neverinstall.com', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes');
    console.log('Direct Neverinstall window opened:', win);
    
    if (win) {
      // Window opened successfully
      console.log('Neverinstall cloud PC launched successfully');
    } else {
      // Fallback to about:blank with iframe
      console.log('Direct window blocked, trying about:blank fallback...');
      var fallbackWin = window.open('about:blank', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes');
      
      if (fallbackWin) {
        fallbackWin.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Windows Desktop - Neverinstall Cloud PC</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body, html { 
                width: 100%; 
                height: 100%; 
                overflow: hidden; 
                background: #1a1a1a;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                color: white;
                text-align: center;
                padding: 40px;
              }
              .logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 30px;
                font-size: 40px;
              }
              h1 {
                font-size: 32px;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #4CAF50, #81C784);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .subtitle {
                font-size: 18px;
                color: #888;
                margin-bottom: 40px;
                max-width: 500px;
              }
              .launch-btn {
                padding: 15px 30px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
              }
              .launch-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
              }
              .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
                max-width: 600px;
              }
              .feature {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .feature-icon {
                font-size: 24px;
                margin-bottom: 10px;
              }
              .feature-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #4CAF50;
              }
              .feature-desc {
                font-size: 14px;
                color: #aaa;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🖥️</div>
              <h1>Neverinstall Cloud PC</h1>
              <p class="subtitle">Browser-based Windows virtual desktop with zero installation required</p>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-title">Instant Access</div>
                  <div class="feature-desc">No downloads or installations needed</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🔒</div>
                  <div class="feature-title">Secure</div>
                  <div class="feature-desc">Enterprise-grade security and encryption</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🌐</div>
                  <div class="feature-title">Cloud-Based</div>
                  <div class="feature-desc">Access from anywhere with internet</div>
                </div>
              </div>
              
              <a href="https://neverinstall.com" target="_blank" class="launch-btn">
                🚀 Launch Cloud PC
              </a>
            </div>
            
            <script>
              // Keep the window focused
              window.addEventListener('blur', function() {
                setTimeout(() => window.focus(), 100);
              });
              
              // Auto-redirect after 3 seconds if user doesn't click
              setTimeout(() => {
                window.location.href = 'https://neverinstall.com';
              }, 3000);
            </script>
          </body>
          </html>
        `);
        fallbackWin.document.close();
        fallbackWin.focus();
      } else {
        alert("Pop-up blocked! Please allow pop-ups for this site to access Neverinstall Cloud PC.");
      }
    }
  } catch (error) {
    console.error('Error opening Neverinstall cloud PC window:', error);
    alert("Failed to open Neverinstall cloud PC window. Please check pop-up blocker settings.");
  }
};

const RealWindowsVPS = ({ user, lessonId = 'current', onError, onLoad }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vpsStatus, setVpsStatus] = useState('disconnected');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStatus, setSessionStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(Infinity);
  const [userTier, setUserTier] = useState('free');
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [vpsWindow, setVpsWindow] = useState(null);
  const [vpsSession, setVpsSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [rdpUrl, setRdpUrl] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const containerRef = useRef(null);

  // Initialize REAL Windows VPS
  const initializeVPS = async () => {
    setIsLoading(true);
    setError(null);
    setVpsStatus('connecting');
    
    try {
      if (!user || !user.email) {
        throw new Error('Authentication required. Please sign in with your SkillRealms account.');
      }

      // Detect user tier
      const tier = detectUserTier(user);
      setUserTier(tier);

      // Check session time for free users
      if (tier === 'free') {
        const usedTime = getUsedSessionTime(user.email);
        if (usedTime >= 30 * 60 * 1000) {
          throw new Error(`You've used your 30-minute free trial. Upgrade to Pro for unlimited time.`);
        }
        setRemainingTime((30 * 60 * 1000) - usedTime);
      } else {
        // Pro user - unlimited access
        setRemainingTime(Infinity);
        console.log('Pro user detected - unlimited access granted');
      }

      // Initialize REAL Windows VPS session
      const sessionResult = await realWindowsVPS.initializeSession(user.email, user);
      
      if (sessionResult.success) {
        setVpsSession(sessionResult);
        setRdpUrl(sessionResult.rdpUrl);
        setVpsWindow(sessionResult.vpsWindow);
        setIsConnected(true);
        setSessionStartTime(Date.now());
        setVpsStatus('running');
        setConnectionInfo({
          hostname: sessionResult.specs.hostname,
          ip: sessionResult.specs.ip,
          os: sessionResult.specs.os,
          cpu: sessionResult.specs.cpu,
          ram: sessionResult.specs.ram,
          storage: sessionResult.specs.storage,
          gpu: sessionResult.specs.gpu,
          bandwidth: sessionResult.specs.bandwidth,
          performance: sessionResult.specs.performance,
          realConnection: sessionResult.realConnection,
          billing: sessionResult.billing
        });
        
        // Set up event handlers
        if (tier === 'free') {
          realWindowsVPS.onTimeUpdate = (time) => {
            setRemainingTime(time);
            if (time < 5 * 60 * 1000) {
              setShowTimeWarning(true);
            }
          };
          
          realWindowsVPS.onTrialExpired = () => {
            handleTrialExpired();
          };
        } else {
          // Pro user - no time restrictions
          console.log('Pro user - no time restrictions applied');
        }
        
        realWindowsVPS.onSessionEnded = (reason) => {
          setIsConnected(false);
          setVpsStatus('disconnected');
        };
        
        realWindowsVPS.onSessionClosed = () => {
          setIsConnected(false);
          setVpsStatus('disconnected');
        };
        
        onLoad?.();
        
        return sessionResult;
      } else {
        throw new Error(sessionResult.error);
      }
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get session time for free users
  const getUsedSessionTime = (userEmail) => {
    const storageKey = `skillrealms_session_time_${userEmail}`;
    const usedTime = localStorage.getItem(storageKey);
    return usedTime ? parseInt(usedTime) : 0;
  };

  // Save session time for free users
  const saveSessionTime = (userEmail, usedTime) => {
    const storageKey = `skillrealms_session_time_${userEmail}`;
    localStorage.setItem(storageKey, usedTime.toString());
  };

  // Detect user tier
  const detectUserTier = (user) => {
    if (!user) return 'free';
    
    console.log('RealVPS: Checking user object:', user);
    
    // Treat all logged-in users as pro for now
    if (user.email) {
      console.log('RealVPS: User detected as PRO - all logged-in users are pro');
      return 'pro';
    }
    
    console.log('RealVPS: User detected as FREE');
    return 'free';
  };

  const handleError = (message) => {
    setError(message);
    setIsLoading(false);
    setIsConnected(false);
    setVpsStatus('error');
    onError?.(message);
  };

  const handleTrialExpired = () => {
    setIsConnected(false);
    setVpsStatus('trial_expired');
    setError('Your 30-minute free trial has expired. Upgrade to Pro for unlimited time!');
  };

  // Close session
  const closeSession = () => {
    realWindowsVPS.endSession(user.email);
    setIsConnected(false);
    setVpsStatus('disconnected');
    setSystemInfo(null);
    setPerformanceMetrics(null);
    setVpsWindow(null);
    setVpsSession(null);
    setRdpUrl(null);
    setConnectionInfo(null);
    setBillingInfo(null);
  };

  // Focus VPS window
  const focusVPSWindow = () => {
    if (vpsWindow && !vpsWindow.closed) {
      vpsWindow.focus();
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Format remaining time
  const formatTime = (milliseconds) => {
    if (milliseconds === Infinity) return 'Unlimited';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format billing cost
  const formatCost = (cost) => {
    return `$${cost.toFixed(2)}`;
  };

  // Detect user tier on component mount
  useEffect(() => {
    if (user) {
      const tier = detectUserTier(user);
      setUserTier(tier);
    }
  }, [user]);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full bg-gray-900 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      {/* Header */}
      <div className="bg-black bg-opacity-90 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ServerIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">Real Windows VPS</h1>
            <p className="text-gray-400 text-sm">
              {userTier === 'pro' ? 'Real Windows Virtual Private Server' : '30 Minutes Free Trial'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* VPS Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              vpsStatus === 'running' ? 'bg-green-400' : 
              vpsStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 
              vpsStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
            }`} />
            <span className="text-white text-xs capitalize">{vpsStatus.replace('_', ' ')}</span>
          </div>
          
                    
          {/* Time Display */}
          {userTier === 'free' && (
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="font-medium">{formatTime(remainingTime)}</span>
            </div>
          )}
          
          {/* User Info */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">{user?.email?.split('@')[0]}</span>
          </div>
          
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <MonitorOff className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          {/* End Session Button */}
          <button
            onClick={closeSession}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full flex items-center justify-center">
        {!isConnected && !isLoading && (
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <ServerIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-3">Real Windows VPS</h2>
            
            {/* User Tier Display */}
            <div className="mb-4">
              {userTier === 'pro' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm">
                  <Crown className="w-4 h-4" />
                  <span>Real Windows VPS - Unlimited</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                  <Gift className="w-4 h-4" />
                  <span>Real Windows VPS - 30 Minutes</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              {userTier === 'pro' 
                ? 'Connect to real Windows Virtual Private Servers with guaranteed performance'
                : 'Get 30 minutes of real Windows VPS access. Like AppOnFly - no simulation!'
              }
            </p>
            
            <div className="space-y-4">
              <button
                onClick={initializeVPS}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Connecting to Real VPS...
                  </>
                ) : (
                  <>
                    <ServerIcon className="w-5 h-5" />
                    {userTier === 'pro' ? 'Start Real VPS Session' : 'Start Free Trial'}
                  </>
                )}
              </button>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 text-gray-500 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <Link className="w-3 h-3" />
                  <span>Real RDP Protocol</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ServerIcon className="w-3 h-3" />
                  <span>Actual Windows OS</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Cable className="w-3 h-3" />
                  <span>Direct Connection</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CloudDownload className="w-3 h-3" />
                  <span>Cloud Infrastructure</span>
                </div>
                              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <Loader className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-white text-lg font-medium mb-2">Connecting to Real Windows VPS...</h3>
            <p className="text-gray-400 text-sm">
              {userTier === 'pro' ? 'Establishing real VPS connection...' : 'Preparing your 30-minute free VPS session...'}
            </p>
            <div className="mt-4 text-gray-500 text-sm">
              <div>🔗 Establishing secure RDP connection...</div>
              <div>🖥️ Provisioning actual Windows VPS...</div>
              <div>🌐 Configuring Remote Desktop...</div>
              <div>⚡ Optimizing connection settings...</div>
              <div>🆓 Free access - no billing required</div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Real Windows VPS Active</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your actual Windows VPS is running with real Remote Desktop connection
            </p>
            
            {connectionInfo && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg text-left max-w-md">
                <h4 className="text-white font-medium mb-2">VPS Information:</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <div>🖥️ OS: {connectionInfo.os}</div>
                  <div>🌐 Host: {connectionInfo.hostname}</div>
                  <div>📍 IP: {connectionInfo.ip}</div>
                  <div>💻 CPU: {connectionInfo.cpu} cores</div>
                  <div>🧠 RAM: {connectionInfo.ram}</div>
                  <div>💾 Storage: {connectionInfo.storage}</div>
                  <div>🎮 GPU: {connectionInfo.gpu}</div>
                  <div>🌐 Bandwidth: {connectionInfo.bandwidth}</div>
                  <div>⚡ Performance: {connectionInfo.performance}</div>
                  <div>🔗 Protocol: RDP (Real)</div>
                  {connectionInfo.billing && <div>💳 Billing: {connectionInfo.billing}</div>}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={launchWindows}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                Free Windows (Cloudflare)
              </button>
              {userTier === 'free' && (
                <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span className="font-medium">{formatTime(remainingTime)}</span>
                </div>
              )}
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Pro User - Unlimited</span>
              </div>
              <button
                onClick={focusVPSWindow}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Focus VPS Window
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-20 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-20">
          <div className="flex items-start gap-3">
            <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm mb-1">VPS Connection Error</div>
              <div className="text-xs opacity-90 mb-2">{error}</div>
              <button
                onClick={() => setError(null)}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {isConnected && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Connected to Real Windows VPS</span>
          <span className="text-gray-400">• {currentTime.toLocaleTimeString()}</span>
          <span className="text-purple-400">• Pro User</span>
        </div>
      )}
    </div>
  );
};

export default RealWindowsVPS;
