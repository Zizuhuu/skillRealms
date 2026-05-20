import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, RotateCcw } from 'lucide-react';

// Real Game Loader Component
const RealGameLoader = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load the real game
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        setIsLoading(false);
        console.log(`${game.name} loaded successfully`);
      };
      
      iframeRef.current.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        console.error(`Failed to load ${game.name}`);
      };
    }
  }, [game.name]);

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
    if (iframeRef.current) {
      iframeRef.current.src = game.url;
    }
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

      {/* Content Area */}
      <div className="w-full h-full pt-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-16 h-16 border-4 border-white border-opacity-30 border-t-4 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <div className="text-2xl font-bold mb-2">Loading {game.name}...</div>
            <div className="text-purple-200 text-center max-w-md">{game.description}</div>
          </div>
        )}

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

        {!isLoading && !hasError && (
          <iframe
            ref={iframeRef}
            src={game.url}
            className="w-full h-full border-0"
            title={game.name}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
};

// Main Real Classroom Center
const RealClassroomCenter = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null);

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
    return <RealGameLoader game={selectedGame} onClose={() => setSelectedGame(null)} />;
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
                <p className="text-purple-200">Real Games - No Simulations!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎯 {games.length} Real Games</p>
              </div>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">⛶ Fullscreen</p>
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
                  Play Real Game
                </button>
              </div>
            </div>
          ))}
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

export default RealClassroomCenter;
