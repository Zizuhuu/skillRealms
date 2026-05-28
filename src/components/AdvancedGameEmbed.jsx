import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, RotateCcw } from 'lucide-react';

// Advanced Game Loader with professional embedding techniques
const AdvancedGameLoader = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const gameFrameRef = useRef(null);

  useEffect(() => {
    // Prevent right-click and developer tools
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const preventDevTools = (e) => {
      if (e.keyCode === 123 || 
          (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
          (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
          (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventDevTools);

    // Create advanced game container
    if (containerRef.current && !gameFrameRef.current) {
      const gameContainer = document.createElement('div');
      gameContainer.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: #000;
      `;

      // Use object tag for better embedding (like other game sites)
      const gameObject = document.createElement('object');
      gameObject.type = 'text/html';
      gameObject.data = game.url;
      gameObject.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
      `;

      // Add security attributes
      gameObject.setAttribute('allowfullscreen', 'true');
      gameObject.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      
      // Create loading overlay
      const loadingOverlay = document.createElement('div');
      loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 10;
        transition: opacity 0.5s ease;
      `;

      loadingOverlay.innerHTML = `
        <div style="width: 60px; height: 60px; border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
        <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 10px;">Loading ${game.name}...</div>
        <div style="color: rgba(255, 255, 255, 0.8); font-size: 16px; text-align: center; max-width: 400px;">${game.description}</div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      gameContainer.appendChild(loadingOverlay);
      gameContainer.appendChild(gameObject);
      containerRef.current.appendChild(gameContainer);

      // Handle loading
      gameObject.onload = () => {
        setTimeout(() => {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            if (loadingOverlay.parentNode) {
              loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
          }, 500);
          setIsLoading(false);
          console.log(`${game.name} loaded successfully`);
        }, 1000);
      };

      gameObject.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        console.error(`Failed to load ${game.name}`);
      };

      gameFrameRef.current = gameObject;
    }

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, [game]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Clear and reload
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }
    gameFrameRef.current = null;
    
    // Trigger re-render
    setTimeout(() => {
      // This will trigger the useEffect again
    }, 100);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-b border-purple-500 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">{game.icon}</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{game.name}</h1>
              <p className="text-purple-200 text-sm">{game.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all border border-white border-opacity-20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reload</span>
            </button>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium">Fullscreen</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="w-full h-full pt-16">
        {hasError && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-2xl font-bold mb-2">Failed to Load</div>
            <div className="text-purple-200 text-center max-w-md mb-6">
              Unable to load {game.name}. The game might be blocked or unavailable.
            </div>
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!hasError && (
          <div ref={containerRef} className="w-full h-full">
            {/* Game will be embedded here */}
          </div>
        )}
      </div>
    </div>
  );
};

// Alternative embedding with script injection (like some game sites)
const ScriptGameLoader = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent inspection
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const preventDevTools = (e) => {
      if (e.keyCode === 123 || 
          (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
          (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
          (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventDevTools);

    if (containerRef.current) {
      // Create a div that will contain the game
      const gameDiv = document.createElement('div');
      gameDiv.id = `game-${game.id}`;
      gameDiv.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        background: #000;
      `;

      // Create iframe with advanced attributes
      const iframe = document.createElement('iframe');
      iframe.src = game.url;
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
      `;
      
      // Advanced security and permissions
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone');
      iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-same-origin');
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

      // Add loading overlay
      const loadingOverlay = document.createElement('div');
      loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 10;
      `;

      loadingOverlay.innerHTML = `
        <div style="width: 60px; height: 60px; border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
        <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 10px;">Loading ${game.name}...</div>
        <div style="color: rgba(255, 255, 255, 0.8); font-size: 16px;">${game.description}</div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      gameDiv.appendChild(loadingOverlay);
      gameDiv.appendChild(iframe);
      containerRef.current.appendChild(gameDiv);

      // Handle loading
      iframe.onload = () => {
        setTimeout(() => {
          if (loadingOverlay.parentNode) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
              if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
              }
            }, 500);
          }
          setIsLoading(false);
        }, 1500);
      };

      iframe.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
    }

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, [game]);

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }
    setTimeout(() => {
      // Force re-render
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-b border-purple-500 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">{game.icon}</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{game.name}</h1>
              <p className="text-purple-200 text-sm">{game.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all border border-white border-opacity-20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reload</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="w-full h-full pt-16">
        {hasError && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-2xl font-bold mb-2">Failed to Load</div>
            <div className="text-purple-200 text-center max-w-md mb-6">
              Unable to load {game.name}. The game might be blocked or unavailable.
            </div>
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!hasError && (
          <div ref={containerRef} className="w-full h-full">
            {/* Game will be embedded here */}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Advanced Classroom Center
const AdvancedGameEmbed = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [useAdvancedLoader, setUseAdvancedLoader] = useState(true);

  const games = [
    {
      id: 'race',
      name: 'Race',
      description: 'High-speed racing game!',
      icon: '🏎️',
      color: 'from-red-600 to-orange-600',
      url: 'https://www.crazygames.com/embed/race'
    },
    {
      id: 'gunspin',
      name: 'Gunspin',
      description: 'Spin and shoot targets!',
      icon: '🔫',
      color: 'from-gray-600 to-blue-600',
      url: 'https://www.crazygames.com/embed/gunspin'
    },
    {
      id: 'minecraft',
      name: 'Minecraft Eaglecraft',
      description: 'Real Minecraft in browser!',
      icon: '⛏️',
      color: 'from-green-600 to-emerald-600',
      url: 'https://eaglercraft.com/'
    },
    {
      id: 'gta',
      name: 'GTA Simulator',
      description: 'Open world crime simulator!',
      icon: '🚗',
      color: 'from-orange-600 to-red-600',
      url: 'https://www.crazygames.com/embed/gta-simulator'
    }
  ];

  if (selectedGame) {
    const LoaderComponent = useAdvancedLoader ? AdvancedGameLoader : ScriptGameLoader;
    return <LoaderComponent game={selectedGame} onClose={() => setSelectedGame(null)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Classroom Center</h1>
                <p className="text-purple-200">Advanced Game Embedding - Like Other Sites!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎯 {games.length} Games</p>
              </div>
              <button
                onClick={() => setUseAdvancedLoader(!useAdvancedLoader)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-all"
              >
                {useAdvancedLoader ? 'Object Embed' : 'Script Embed'}
              </button>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🔒 Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-white border-opacity-20`}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{game.icon}</div>
                <h3 className="text-white font-bold text-2xl mb-2">{game.name}</h3>
                <p className="text-white text-opacity-90 text-sm mb-4">{game.description}</p>
                <button className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-bold text-lg transition-all">
                  Play (Protected)
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-white text-opacity-60 text-sm">
          <p>🔒 Games are protected with advanced embedding techniques</p>
          <p>Right-click and developer tools are disabled for security</p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
      >
        <X className="w-4 h-4" />
        <span className="text-sm font-medium">Close</span>
      </button>
    </div>
  );
};

export default AdvancedGameEmbed;
