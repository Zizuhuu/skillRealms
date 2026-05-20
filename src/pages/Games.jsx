import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, Search, Star, Play } from 'lucide-react';

// Import JSX game components
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

// JSX Educational Games Only
const games = [
    {
      id: 'job-sim',
      name: 'Job Simulator',
      category: 'educational',
      rating: 4.9,
      plays: '50K',
      icon: '💼',
      component: <JobSimGame />,
      description: 'Learn different jobs and careers!'
    },
    {
      id: 'math-blitz',
      name: 'Math Blitz',
      category: 'educational',
      rating: 4.8,
      plays: '45K',
      icon: '🔢',
      component: <MathBlitzGame />,
      description: 'Fast-paced math challenges and learning!'
    },
    {
      id: 'civics-quest',
      name: 'Civics Quest',
      category: 'educational',
      rating: 4.7,
      plays: '35K',
      icon: '🏛️',
      component: <CivicsQuestGame />,
      description: 'Learn about government and civics!'
    },
    {
      id: 'code-breaker',
      name: 'Code Breaker',
      category: 'educational',
      rating: 4.6,
      plays: '28K',
      icon: '💻',
      component: <CodeBreakerGame />,
      description: 'Programming puzzles and coding challenges!'
    },
    {
      id: 'design-challenge',
      name: 'Design Challenge',
      category: 'educational',
      rating: 4.8,
      plays: '22K',
      icon: '🎨',
      component: <DesignChallengeGame />,
      description: 'Creative design and art challenges!'
    },
    {
      id: 'gta-rally',
      name: 'GTA Rally',
      category: 'educational',
      rating: 4.5,
      plays: '41K',
      icon: '🏁',
      component: <GTARallyGame />,
      description: 'Racing adventure and driving skills!'
    },
    {
      id: 'health-hero',
      name: 'Health Hero',
      category: 'educational',
      rating: 4.6,
      plays: '18K',
      icon: '🏥',
      component: <HealthHeroGame />,
      description: 'Health education and wellness games!'
    },
    {
      id: 'quick-quiz',
      name: 'Quick Quiz',
      category: 'educational',
      rating: 4.4,
      plays: '33K',
      icon: '📝',
      component: <QuickQuizGame />,
      description: 'Test your knowledge with fun quizzes!'
    },
    {
      id: 'science-lab',
      name: 'Science Lab',
      category: 'educational',
      rating: 4.9,
      plays: '25K',
      icon: '🔬',
      component: <ScienceLabGame />,
      description: 'Science experiments and learning games!'
    },
    {
      id: 'start-it-up',
      name: 'Start It Up',
      category: 'educational',
      rating: 4.7,
      plays: '19K',
      icon: '🚀',
      component: <StartItUpGame />,
      description: 'Entrepreneurship and business games!'
    },
    {
      id: 'word-rush',
      name: 'Word Rush',
      category: 'educational',
      rating: 4.5,
      plays: '31K',
      icon: '📚',
      component: <WordRushGame />,
      description: 'Vocabulary building and word games!'
    }
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        window.location.href = '/';
      }
    });
    return unsub;
  }, []);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => setActiveGame(null)} className="text-white hover:bg-gray-700 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Games
          </Button>
          <span className="text-white font-bold text-lg">{game.icon} {game.name}</span>
        </header>
        <div className="p-6">
          {game.component}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Educational Games</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="educational">Educational</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border border-gray-200"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700">{game.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{game.plays} plays</span>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {game.category}
                  </span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <Play className="w-4 h-4" />
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
