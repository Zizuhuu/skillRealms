import React, { useState } from 'react';
import { X } from 'lucide-react';

const WorkingGameCenter = ({ onClose }) => {
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
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-b border-purple-500 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">{selectedGame.icon}</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">{selectedGame.name}</h1>
                <p className="text-purple-200 text-sm">{selectedGame.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>

        <div className="w-full h-full pt-16">
          <iframe
            src={selectedGame.url}
            className="w-full h-full border-0"
            title={selectedGame.name}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="eager"
          />
        </div>
      </div>
    );
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
                <p className="text-purple-200">Working Games - Simple and Clean!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎯 {games.length} Games</p>
              </div>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">✅ Working</p>
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
                  Play Now
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

export default WorkingGameCenter;
