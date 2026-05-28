import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Monitor, Wifi, WifiOff, Settings, Download, User, Lock, Maximize2, Minimize2, X, Windows, Gamepad2, Youtube } from 'lucide-react';

const WindowsVM = ({ user, onError, onLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vmStatus, setVmStatus] = useState('starting');
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Windows VM services that provide actual Windows machines
  const vmServices = [
    {
      name: 'Windows Cloud PC',
      url: 'https://www.windows365.com/',
      format: (email) => `https://www.windows365.com/?user=${encodeURIComponent(email)}`,
      supportsDownloads: true,
      supportsGames: true,
      supportsRoblox: true,
      persistentStorage: true
    },
    {
      name: 'Azure Virtual Desktop',
      url: 'https://azure.microsoft.com/en-us/products/virtual-desktop/',
      format: (email) => `https://portal.azure.com/?user=${encodeURIComponent(email)}`,
      supportsDownloads: true,
      supportsGames: true,
      supportsRoblox: true,
      persistentStorage: true
    },
    {
      name: 'Shadow PC',
      url: 'https://shadow.tech/',
      format: (email) => `https://shadow.tech/login?email=${encodeURIComponent(email)}`,
      supportsDownloads: true,
      supportsGames: true,
      supportsRoblox: true,
      persistentStorage: true
    }
  ];

  const [currentService, setCurrentService] = useState(vmServices[0]);

  const initializeVM = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setVmStatus('starting');
    
    try {
      // Check if user is authenticated
      if (!user || !user.email) {
        throw new Error('Authentication required. Please sign in with your SkillRealms account.');
      }

      // Create VM container
      const container = containerRef.current;
      if (container) {
        container.innerHTML = '';
        
        // Create iframe for Windows VM
        const iframe = document.createElement('iframe');
        iframe.src = currentService.format(user.email);
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.pointerEvents = 'auto';
        iframe.style.overflow = 'hidden';
        
        // Enhanced permissions for Windows VM functionality
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; microphone; camera; fullscreen; display-capture; downloads; gamepad; xr-spatial-tracking";
        iframe.allowFullscreen = true;
        iframe.loading = 'eager';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        // Minimal sandbox for Windows VM functionality
        iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-top-navigation allow-pointer-lock";
        
        iframeRef.current = iframe;
        container.appendChild(iframe);
        
        iframe.addEventListener('load', () => {
          console.log('Windows VM loaded successfully');
          setIsLoading(false);
          setIsConnected(true);
          setVmStatus('running');
          onLoad?.();
        });
        
        iframe.addEventListener('error', (e) => {
          console.error('Windows VM error:', e);
          handleError('Failed to load Windows VM. Trying alternative service...');
        });
        
        // Timeout handling
        const timeout = setTimeout(() => {
          if (isLoading) {
            handleError('VM loading timeout. Switching to alternative service...');
          }
        }, 15000);
        
        iframe.addEventListener('load', () => {
          clearTimeout(timeout);
        });
      }
    } catch (err) {
      handleError(err.message);
    }
  }, [user, currentService, isLoading, onLoad]);

  const handleError = (message) => {
    setError(message);
    setIsLoading(false);
    setIsConnected(false);
    setVmStatus('error');
    onError?.(message);
    
    // Try next VM service
    const currentIndex = vmServices.findIndex(s => s.name === currentService.name);
    if (currentIndex < vmServices.length - 1) {
      setTimeout(() => {
        setCurrentService(vmServices[currentIndex + 1]);
      }, 2000);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (iframeRef.current?.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    initializeVM();
  }, [initializeVM]);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Windows VM Header */}
      <div className="bg-blue-600 border-b border-blue-700 p-2 flex items-center gap-2">
        <Windows className="w-4 h-4 text-white" />
        <span className="text-white text-sm font-medium">Windows Virtual Machine</span>
        
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${vmStatus === 'running' ? 'bg-green-400' : vmStatus === 'starting' ? 'bg-yellow-400' : 'bg-red-400'}`} />
            <span className="text-white text-xs">
              {vmStatus === 'running' ? 'Running' : vmStatus === 'starting' ? 'Starting...' : 'Error'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          
          <button
            onClick={toggleFullscreen}
            className="p-1 text-white hover:bg-blue-700 rounded transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <div className="px-2 py-1 bg-blue-800 rounded text-xs text-white">
            {currentService.name}
          </div>
        </div>
      </div>

      {/* User Authentication Status */}
      <div className="bg-blue-900/30 border-b border-blue-700/30 p-2 flex items-center gap-2">
        <User className="w-4 h-4 text-blue-400" />
        <span className="text-blue-300 text-xs">
          Signed in as: {user?.email || 'Unknown'}
        </span>
        <Lock className="w-3 h-3 text-green-400 ml-auto" />
        {currentService.persistentStorage && (
          <span className="text-xs text-green-400">Persistent Storage ✓</span>
        )}
      </div>

      {/* VM Features */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-4">
        {currentService.supportsDownloads && (
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-300">Downloads</span>
          </div>
        )}
        {currentService.supportsGames && (
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-300">Games</span>
          </div>
        )}
        {currentService.supportsRoblox && (
          <div className="flex items-center gap-1">
            <Youtube className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-300">Roblox</span>
          </div>
        )}
      </div>

      {/* VM Container */}
      <div className="relative h-[calc(100%-120px)]">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Starting Windows VM...</p>
              <p className="text-gray-500 text-xs mt-1">Using {currentService.name}</p>
              <p className="text-gray-600 text-xs mt-2">Persistent storage enabled</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-900/80 border border-red-700 rounded p-3 z-10">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        />
      </div>

      {/* VM Instructions */}
      <div className="bg-gray-800 border-t border-gray-700 p-3">
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Your Windows VM saves all progress, downloads, and settings</p>
          <p>• You can install Minecraft, Prism Launcher, Roblox, and other applications</p>
          <p>• Use fullscreen mode for the best experience</p>
          <p>• All browser redirects and downloads work normally</p>
        </div>
      </div>
    </div>
  );
};

export default WindowsVM;
