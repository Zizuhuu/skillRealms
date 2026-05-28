import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Wifi, Settings, Download, User, Lock, Maximize2, X, Gamepad2, Youtube, Loader, Volume2, Battery, Server, Cloud, HardDrive, Terminal, Cpu, Database, Globe, Folder, FileText, Calendar, Mail, Chrome, Command, Network, Search, Clock, Power, Play, Pause, Home, ArrowLeft, ArrowRight, ExternalLink, CreditCard, RefreshCw, MonitorOff, Upload, Download as DownloadIcon, Terminal as TerminalIcon, Activity, Zap, HardDrive as DriveIcon, MemoryStick, Crown, AlertCircle, CheckCircle, Timer, Star, Gift, ArrowUp } from 'lucide-react';
import skillRealmsVMService from '../utils/skillRealmsVMService';
import AppOnFlyEmbed from '../components/AppOnFlyEmbed';

const VMSession = ({ user, lessonId, onError, onLoad }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [vmStatus, setVmStatus] = useState('disconnected');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStatus, setSessionStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(Infinity);
  const [userTier, setUserTier] = useState('free');
  const [vmWindow, setVmWindow] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [useAppOnFly, setUseAppOnFly] = useState(true); // Use AppOnFly in about:blank
  const containerRef = useRef(null);

  // Initialize AppOnFly in about:blank window
  const initializeVM = async () => {
    setIsLoading(true);
    setError(null);
    setVmStatus('connecting');
    
    try {
      if (!user || !user.email) {
        throw new Error('Authentication required. Please sign in with your SkillRealms account.');
      }

      // For AppOnFly, no time limits needed
      setRemainingTime(Infinity);

      // Create about:blank window for AppOnFly embedding
      const appOnFlyWindow = window.open(
        'about:blank', 
        '_blank', 
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes'
      );

      if (appOnFlyWindow) {
        // Write AppOnFly content to about:blank window
        appOnFlyWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>AppOnFly Virtual Desktop</title>
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
              .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                color: white;
                font-size: 18px;
                flex-direction: column;
              }
              .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #333;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .loading-text {
                font-size: 16px;
                margin-bottom: 10px;
              }
              .loading-subtext {
                font-size: 14px;
                color: #888;
              }
              iframe {
                border: none;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
              }
              .error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                color: #ff6b6b;
                text-align: center;
                padding: 20px;
              }
              .error-icon {
                font-size: 48px;
                margin-bottom: 20px;
              }
              .retry-btn {
                margin-top: 20px;
                padding: 12px 24px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
              }
              .retry-btn:hover {
                background: #45a049;
              }
              .persistent-notice {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
              }
            </style>
          </head>
          <body>
            <div class="persistent-notice">✅ Virtual Desktop • Instant Access • No Limits</div>
            <div id="loading" class="loading">
              <div class="spinner"></div>
              <div class="loading-text">Loading AppOnFly Virtual Desktop...</div>
              <div class="loading-subtext">Browser-based Windows desktop • Zero installation</div>
            </div>
            <div id="error" class="error" style="display: none;">
              <div class="error-icon">⚠️</div>
              <h2>Failed to load AppOnFly</h2>
              <p id="error-message">Please check your connection and try again.</p>
              <button class="retry-btn" onclick="location.reload()">Retry</button>
            </div>
            <iframe 
              id="apponfly-frame"
              src="https://www.apponfly.com" 
              onload="document.getElementById('loading').style.display='none'"
              onerror="document.getElementById('loading').style.display='none'; document.getElementById('error').style.display='flex';"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              allowfullscreen
              loading="eager"
              referrerpolicy="no-referrer"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; pointer-events: auto;">
            </iframe>
            
            <script>
              // Comprehensive window security lockdown
              window.location.replace = function() { return false; };
              window.location.assign = function() { return false; };
              window.location.href = '#';
              window.location.reload = function() { return false; };
              window.location.hash = '#locked';
              
              // Prevent window opening and manipulation
              window.open = function() { return null; };
              window.close = function() { return false; };
              window.print = function() { return false; };
              
              // Prevent history manipulation
              window.history.pushState = function() { return false; };
              window.history.replaceState = function() { return false; };
              window.history.back = function() { return false; };
              window.history.forward = function() { return false; };
              window.history.go = function() { return false; };
              
              // Prevent document manipulation
              document.write = function() { return false; };
              document.writeln = function() { return false; };
              document.open = function() { return false; };
              document.close = function() { return false; };
              
              // Keep the page alive and prevent timeouts
              let keepAliveInterval = setInterval(() => {
                if (navigator.onLine) {
                  console.log('Keeping virtual desktop session alive...');
                }
              }, 30000);
              
              // Handle iframe loading errors
              const iframe = document.getElementById('apponfly-frame');
              const errorDiv = document.getElementById('error');
              const loadingDiv = document.getElementById('loading');
              const errorMessage = document.getElementById('error-message');
              
              // Prevent iframe from breaking out
              iframe.addEventListener('load', function() {
                console.log('AppOnFly virtual desktop loaded successfully');
                iframe.focus();
                
                // Monitor iframe for navigation attempts
                try {
                  const iframeWindow = iframe.contentWindow;
                  if (iframeWindow) {
                    // Prevent navigation in iframe
                    iframeWindow.addEventListener('beforeunload', function(e) {
                      e.preventDefault();
                      e.returnValue = false;
                      return false;
                    });
                    
                    // Override navigation methods in iframe
                    iframeWindow.location.replace = function() { return false; };
                    iframeWindow.location.assign = function() { return false; };
                    iframeWindow.location.href = iframeWindow.location.href;
                  }
                } catch (e) {
                  console.log('Cannot access iframe content due to security restrictions');
                }
              });
              
              // Extended timeout handling
              setTimeout(function() {
                if (loadingDiv.style.display !== 'none') {
                  loadingDiv.style.display = 'none';
                  errorDiv.style.display = 'flex';
                  errorMessage.textContent = 'Loading timed out. Please check your internet connection and try again.';
                }
              }, 30000);
              
              // Comprehensive security measures to prevent breakout
              document.addEventListener('click', function(e) {
                // Prevent any link clicks from navigating away
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);
              
              // Prevent form submissions
              document.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }, true);
              
              // Prevent page refresh/close without warning
              window.addEventListener('beforeunload', function(e) {
                e.preventDefault();
                e.returnValue = 'Your virtual desktop session will be terminated. Are you sure you want to leave?';
                return e.returnValue;
              });
              
              // Keep the window focused
              window.addEventListener('blur', function() {
                setTimeout(() => window.focus(), 100);
              });
              
              // Aggressive monitoring to block AppOnFly redirects
              let originalSrc = iframe.src;
              
              // Ultra-aggressive monitoring - check every 500ms
              setInterval(() => {
                try {
                  // Check if iframe src changed
                  if (iframe.src !== originalSrc) {
                    console.log('🚫 BLOCKED: iframe src change detected');
                    iframe.src = originalSrc;
                  }
                  
                  // Check iframe attributes
                  if (iframe.getAttribute('src') !== originalSrc) {
                    console.log('🚫 BLOCKED: iframe attribute change detected');
                    iframe.setAttribute('src', originalSrc);
                  }
                  
                  // Try to check iframe content location (may fail due to CORS)
                  if (iframe.contentWindow && iframe.contentWindow.location) {
                    const currentSrc = iframe.contentWindow.location.href;
                    if (currentSrc && !currentSrc.includes('apponfly.com')) {
                      console.log('🚫 BLOCKED: iframe content navigation detected');
                      iframe.src = 'https://www.apponfly.com';
                    }
                  }
                } catch (e) {
                  // Cross-origin restrictions, this is expected
                  // Just check iframe src instead
                }
              }, 500); // Check every 500ms for ultra-fast response
              
              // Intercept any form submissions or link clicks within iframe
              iframe.addEventListener('load', function() {
                try {
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                  if (iframeDoc) {
                    // Intercept all form submissions
                    const forms = iframeDoc.getElementsByTagName('form');
                    for (let form of forms) {
                      form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Blocked form submission in iframe');
                        return false;
                      }, true);
                    }
                    
                    // Intercept all link clicks
                    const links = iframeDoc.getElementsByTagName('a');
                    for (let link of links) {
                      link.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Blocked link click in iframe:', link.href);
                        return false;
                      }, true);
                    }
                    
                    // Override window.open in iframe
                    if (iframe.contentWindow) {
                      iframe.contentWindow.open = function() { return null; };
                      iframe.contentWindow.location.replace = function() { return false; };
                      iframe.contentWindow.location.assign = function() { return false; };
                    }
                  }
                } catch (e) {
                  console.log('Cannot access iframe content due to security restrictions');
                }
              });
              
              // Cleanup on page unload
              window.addEventListener('unload', function() {
                clearInterval(keepAliveInterval);
              });
            </script>
          </body>
          </html>
        `);
        appOnFlyWindow.document.close();
        
        // AppOnFly window opened successfully
        setVmWindow(appOnFlyWindow);
        setIsConnected(true);
        setVmStatus('connected');
        setIsLoading(false);
        
        if (onLoad) {
          onLoad();
        }
        
        // Start session timer for AppOnFly
        const startTime = Date.now();
        setSessionStartTime(startTime);
        
        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          setSessionStatus({
            startTime,
            elapsed,
            status: 'active'
          });
        }, 1000);
        
        setSessionTimer(timer);
        
        // Handle window close
        const checkWindow = setInterval(() => {
          if (appOnFlyWindow.closed) {
            clearInterval(checkWindow);
            clearInterval(timer);
            setIsConnected(false);
            setVmStatus('disconnected');
            setVmWindow(null);
            setSessionTimer(null);
          }
        }, 1000);
        
        return;
      } else {
        setError('Failed to open AppOnFly window. Please allow pop-ups.');
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (useAppOnFly) {
      initializeVM();
    }
  }, [useAppOnFly]);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-black bg-opacity-90 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">SkillRealms Virtual Desktop</h1>
            <p className="text-gray-400 text-sm">
              Lesson {lessonId || 'Unknown'} • AppOnFly • Unlimited Time
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">{user?.email?.split('@')[0]}</span>
          </div>
          
          {/* End Session Button */}
          <button
            onClick={() => {
              if (vmWindow && !vmWindow.closed) {
                vmWindow.close();
              }
              setIsConnected(false);
              setVmStatus('disconnected');
              setVmWindow(null);
              if (sessionTimer) {
                clearInterval(sessionTimer);
                setSessionTimer(null);
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            End Virtual Desktop
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full flex items-center justify-center">
        {useAppOnFly ? (
          <AppOnFlyEmbed 
            onError={(error) => setError(error.message)}
            onLoad={() => {
              setIsConnected(true);
              setVmStatus('connected');
              if (onLoad) onLoad();
            }}
          />
        ) : (
          <>
            {!isConnected && !isLoading && (
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-white text-xl font-semibold mb-3">Start Your Virtual Desktop</h2>
                
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm">
                    <Monitor className="w-4 h-4" />
                    <span>AppOnFly Virtual Desktop • Unlimited Time</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                  Access your Windows virtual desktop from anywhere with AppOnFly's cloud computing service.
                </p>
                
                <button
                  onClick={initializeVM}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Starting Virtual Desktop...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Virtual Desktop
                    </>
                  )}
                </button>
              </div>
            )}

            {isLoading && (
              <div className="text-center">
                <Loader className="w-16 h-16 text-green-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-white text-lg font-medium mb-2">Starting Virtual Desktop...</h3>
                <p className="text-gray-400 text-sm">
                  Preparing your AppOnFly virtual desktop session
                </p>
              </div>
            )}

            {isConnected && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Virtual Desktop Session Active</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your AppOnFly virtual desktop is running in a new window
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => vmWindow?.focus()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Focus Virtual Desktop Window
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-20 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-20">
          <div className="flex items-start gap-3">
            <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm mb-1">Virtual Desktop Error</div>
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
    </div>
  );
};

export default VMSession;
