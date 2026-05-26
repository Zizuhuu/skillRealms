import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

// Import existing JSX game components
import JobSimGame from '../pages/components/landings/dashboard/lesson/games/JobSimGame.jsx';
import MathBlitzGame from '../pages/components/landings/dashboard/lesson/games/MathBlitzGame.jsx';
import CivicsQuestGame from '../pages/components/landings/dashboard/lesson/games/CivicsQuestGame.jsx';
import CodeBreakerGame from '../pages/components/landings/dashboard/lesson/games/CodeBreakerGame.jsx';
import DesignChallengeGame from '../pages/components/landings/dashboard/lesson/games/DesignChallengeGame.jsx';
import GTARallyGame from '../pages/components/landings/dashboard/lesson/games/GTARallyGame.jsx';
import HealthHeroGame from '../pages/components/landings/dashboard/lesson/games/HealthHeroGame.jsx';
import QuickQuizGame from '../pages/components/landings/dashboard/lesson/games/QuickQuizGame.jsx';
import ScienceLabGame from '../pages/components/landings/dashboard/lesson/games/ScienceLabGame.jsx';
import StartItUpGame from '../pages/components/landings/dashboard/lesson/games/StartItUpGame.jsx';
import WordRushGame from '../pages/components/landings/dashboard/lesson/games/WordRushGame.jsx';

// Local Game Loader Component
const LocalGameLoader = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const iframeRef = useRef(null);

  const urls = game.alternativeUrls ? [game.url, ...game.alternativeUrls] : [game.url];

  const tryNextUrl = () => {
    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // For JSX components, no loading needed
    if (game.type === 'jsx') {
      setIsLoading(false);
      return;
    }

    // Load the local game
    if (iframeRef.current) {
      const timeout = setTimeout(() => {
        console.warn(`Timeout loading ${game.name} from: ${urls[currentUrlIndex]}`);
        setHasError(true);
        setIsLoading(false);
      }, 10000); // 10 second timeout

      iframeRef.current.onload = () => {
        clearTimeout(timeout);
        setIsLoading(false);
        console.log(`${game.name} loaded successfully from: ${urls[currentUrlIndex]}`);
      };
      
      iframeRef.current.onerror = () => {
        clearTimeout(timeout);
        console.error(`Failed to load ${game.name} from: ${urls[currentUrlIndex]}`);
        tryNextUrl();
      };

      return () => clearTimeout(timeout);
    }
  }, [game.name, currentUrlIndex, urls, game.type]);

  const handleReload = () => {
    setCurrentUrlIndex(0);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
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

      {/* Game Content */}
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
              Unable to load {game.name}. The game files might not be available.
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
          game.type === 'jsx' ? (
            <div className="w-full h-full overflow-auto">
              {game.component}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={urls[currentUrlIndex]}
              className="w-full h-full border-0"
              title={game.name}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              loading="eager"
            />
          )
        )}
      </div>
    </div>
  );
};

// Main Local Game Center
const LocalGameCenter = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  // Games from your local files
  const games = [
    {
      id: 'glass-city',
      name: 'Glass City',
      description: '3D city exploration game!',
      icon: '🏙️',
      color: 'from-pink-600 to-purple-600',
      url: '/html-games-v3/glass-city/index.html',
      type: 'local',
      alternativeUrls: [
        '/html-games-v3/glass-city/',
        '/HTML-Games-v3-main/glass-city/index.html',
        '/html-games-v3-main/glass-city/index.html'
      ]
    },
    {
      id: 'html-games-collection',
      name: 'HTML Games Collection',
      description: '100+ HTML5 games!',
      icon: '🎮',
      color: 'from-blue-600 to-cyan-600',
      url: '/html-games-v3/index.html',
      type: 'local',
      alternativeUrls: [
        '/html-games-v3/',
        '/HTML-Games-v3-main/index.html',
        '/html-games-v3-main/index.html',
        '/HTML-Games-v3-main/',
        '/html-games-v3-main/',
        '/HTML-Games-v3-main',
        '/html-games-v3-main'
      ]
    },
            {
      id: 'job-sim-jsx',
      name: 'Job Simulator',
      description: 'Learn different jobs!',
      icon: '💼',
      color: 'from-purple-600 to-indigo-600',
      type: 'jsx',
      component: <JobSimGame />
    },
    {
      id: 'math-blitz-jsx',
      name: 'Math Blitz',
      description: 'Fast-paced math challenges!',
      icon: '🔢',
      color: 'from-yellow-600 to-orange-600',
      type: 'jsx',
      component: <MathBlitzGame />
    },
    {
      id: 'civics-quest-jsx',
      name: 'Civics Quest',
      description: 'Learn about government!',
      icon: '🏛️',
      color: 'from-blue-600 to-cyan-600',
      type: 'jsx',
      component: <CivicsQuestGame />
    },
    {
      id: 'code-breaker-jsx',
      name: 'Code Breaker',
      description: 'Programming puzzles!',
      icon: '💻',
      color: 'from-green-600 to-emerald-600',
      type: 'jsx',
      component: <CodeBreakerGame />
    },
    {
      id: 'design-challenge-jsx',
      name: 'Design Challenge',
      description: 'Creative design tasks!',
      icon: '🎨',
      color: 'from-pink-600 to-rose-600',
      type: 'jsx',
      component: <DesignChallengeGame />
    },
    {
      id: 'gta-rally-jsx',
      name: 'GTA Rally',
      description: 'Racing adventure!',
      icon: '🏁',
      color: 'from-red-600 to-orange-600',
      type: 'jsx',
      component: <GTARallyGame />
    },
    {
      id: 'health-hero-jsx',
      name: 'Health Hero',
      description: 'Health education game!',
      icon: '�',
      color: 'from-teal-600 to-green-600',
      type: 'jsx',
      component: <HealthHeroGame />
    },
    {
      id: 'quick-quiz-jsx',
      name: 'Quick Quiz',
      description: 'Test your knowledge!',
      icon: '📝',
      color: 'from-indigo-600 to-purple-600',
      type: 'jsx',
      component: <QuickQuizGame />
    },
    {
      id: 'science-lab-jsx',
      name: 'Science Lab',
      description: 'Science experiments!',
      icon: '�',
      color: 'from-cyan-600 to-blue-600',
      type: 'jsx',
      component: <ScienceLabGame />
    },
    {
      id: 'start-it-up-jsx',
      name: 'Start It Up',
      description: 'Entrepreneurship game!',
      icon: '🚀',
      color: 'from-orange-600 to-red-600',
      type: 'jsx',
      component: <StartItUpGame />
    },
    {
      id: 'word-rush-jsx',
      name: 'Word Rush',
      description: 'Vocabulary building!',
      icon: '📚',
      color: 'from-amber-600 to-yellow-600',
      type: 'jsx',
      component: <WordRushGame />
    },
      ];

  if (selectedGame) {
    return <LocalGameLoader game={selectedGame} onClose={() => setSelectedGame(null)} />;
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
                <h1 className="text-3xl font-bold text-white">Local Game Center</h1>
                <p className="text-purple-200">Your Local Games + Online Games!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎯 100+ Games</p>
              </div>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">📁 Local Files</p>
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎓 Educational</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    game.type === 'local' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {game.type === 'local' ? '📁 LOCAL' : '🌐 ONLINE'}
                  </span>
                </div>
                <button className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-bold text-lg transition-all">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-white text-opacity-60 text-sm">
          <p>📁 Local games load from your extracted zip files</p>
          <p>� Educational games for learning fun!</p>
          <p>�🌐 Online games load from external sources</p>
          <p>💡 GTA Vice City is Unity executable - requires download</p>
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

export default LocalGameCenter;
