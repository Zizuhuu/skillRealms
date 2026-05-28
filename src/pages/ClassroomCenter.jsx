import React, { useState } from 'react';
import { Gamepad2, Trophy, Star, Zap, Target, Shield, Heart, Flame, Crown, Rocket, Play } from 'lucide-react';

const ClassroomCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const games = [
    { id: 1, name: 'Race', category: 'racing', rating: 4.5, plays: '1.2M', icon: '🏁' },
    { id: 2, name: 'Dune Dash', category: 'racing', rating: 4.3, plays: '890K', icon: '🏜️' },
    { id: 3, name: 'RocketGoal.io', category: 'action', rating: 4.7, plays: '2.1M', icon: '🚀' },
    { id: 4, name: 'Tsunami Brainrots', category: 'puzzle', rating: 4.1, plays: '567K', icon: '🌊' },
    { id: 5, name: 'Granny', category: 'horror', rating: 4.6, plays: '3.4M', icon: '👵' },
    { id: 6, name: 'CS: Surf', category: 'action', rating: 4.8, plays: '1.8M', icon: '🏄' },
    { id: 7, name: 'Basketball Stars', category: 'sports', rating: 4.4, plays: '945K', icon: '🏀' },
    { id: 8, name: 'Flappy Dunk', category: 'sports', rating: 4.2, plays: '1.5M', icon: '🏀' },
    { id: 9, name: 'Knife Smash', category: 'action', rating: 4.5, plays: '2.3M', icon: '🔪' },
    { id: 10, name: 'Mad Pursuit', category: 'racing', rating: 4.6, plays: '1.7M', icon: '🏎️' },
    { id: 11, name: 'Snow Rider', category: 'racing', rating: 4.3, plays: '2.8M', icon: '❄️' },
    { id: 12, name: 'Flip', category: 'puzzle', rating: 4.4, plays: '1.1M', icon: '🔄' },
    { id: 13, name: 'Archers Heroes', category: 'action', rating: 4.7, plays: '1.9M', icon: '🏹' },
    { id: 14, name: 'Dig out of Prison', category: 'puzzle', rating: 4.2, plays: '780K', icon: '⛏️' },
    { id: 15, name: 'Real Kart', category: 'racing', rating: 4.5, plays: '1.3M', icon: '🏁' },
    { id: 16, name: 'Only Up!', category: 'platformer', rating: 4.8, plays: '4.2M', icon: '⬆️' },
    { id: 17, name: 'Rooftop Run', category: 'platformer', rating: 4.4, plays: '1.6M', icon: '🏢' },
    { id: 18, name: 'Gunspin', category: 'action', rating: 4.6, plays: '2.5M', icon: '🌀' },
    { id: 19, name: 'Basket Random', category: 'sports', rating: 4.3, plays: '3.1M', icon: '🏀' },
    { id: 20, name: 'Meme: Tash', category: 'fun', rating: 4.1, plays: '890K', icon: '😂' },
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'racing', name: 'Racing Games', icon: <Target className="w-4 h-4" /> },
    { id: 'action', name: 'Action Games', icon: <Zap className="w-4 h-4" /> },
    { id: 'puzzle', name: 'Puzzle Games', icon: <Star className="w-4 h-4" /> },
    { id: 'sports', name: 'Sports Games', icon: <Trophy className="w-4 h-4" /> },
    { id: 'platformer', name: 'Platformer', icon: <Rocket className="w-4 h-4" /> },
    { id: 'horror', name: 'Horror', icon: <Heart className="w-4 h-4" /> },
    { id: 'fun', name: 'Fun & Random', icon: <Flame className="w-4 h-4" /> },
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const featuredGames = games.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">❄️ Classroom Center ❄️</h1>
                <p className="text-purple-200">Unblocked Games - Your Go-To Destination for Free Online Fun!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎮 {games.length} Games</p>
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">⭐ Top Rated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-purple-800 bg-opacity-50 text-purple-200 hover:bg-purple-700'
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Games Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Featured Games
          </h2>
          <p className="text-purple-200">Most popular games students can't get enough of!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredGames.map(game => (
            <div key={game.id} className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-6 border border-purple-500 hover:border-purple-400 transition-all hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{game.icon}</div>
                <div className="bg-green-600 px-2 py-1 rounded-full">
                  <span className="text-white text-xs font-bold">NEW</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                {game.name}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-purple-200 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{game.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4 text-blue-400" />
                  <span>{game.plays}</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105">
                Play Now
              </button>
            </div>
          ))}
        </div>

        {/* All Games Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            {selectedCategory === 'all' ? 'All Games' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGames.map(game => (
              <div key={game.id} className="bg-purple-800 bg-opacity-50 rounded-lg p-4 border border-purple-600 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group">
                <div className="text-3xl mb-2 text-center group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>
                
                <h4 className="text-white font-semibold text-sm mb-2 text-center group-hover:text-purple-200 transition-colors">
                  {game.name}
                </h4>
                
                <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-blue-400" />
                    <span>{game.plays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-t border-purple-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                Classroom Center
              </h3>
              <p className="text-purple-200 text-sm">
                The best unblocked games for students. Play your favorites without restrictions!
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Popular Categories</h4>
              <div className="space-y-2">
                <p className="text-purple-200 text-sm hover:text-white cursor-pointer transition-colors">🏁 Racing Games</p>
                <p className="text-purple-200 text-sm hover:text-white cursor-pointer transition-colors">⚔️ Action Games</p>
                <p className="text-purple-200 text-sm hover:text-white cursor-pointer transition-colors">🧩 Puzzle Games</p>
                <p className="text-purple-200 text-sm hover:text-white cursor-pointer transition-colors">🏀 Sports Games</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Why Choose Us?</h4>
              <div className="space-y-2">
                <p className="text-purple-200 text-sm">✅ 100% Unblocked</p>
                <p className="text-purple-200 text-sm">✅ No Downloads Required</p>
                <p className="text-purple-200 text-sm">✅ Updated Daily</p>
                <p className="text-purple-200 text-sm">✅ School Friendly</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-600 mt-8 pt-6 text-center">
            <p className="text-purple-200 text-sm">
              © 2024 Classroom Center - Your #1 Source for Unblocked Games 🎮
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomCenter;
