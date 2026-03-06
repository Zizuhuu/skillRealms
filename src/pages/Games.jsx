import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import MathBlitzGame from '@/pages/components/landings/dashboard/lesson/games/MathBlitzGame.jsx';
import StartItUpGame from '@/pages/components/landings/dashboard/lesson/games/StartItUpGame.jsx';
import WordRushGame from '@/pages/components/landings/dashboard/lesson/games/WordRushGame.jsx';
import ScienceLabGame from '@/pages/components/landings/dashboard/lesson/games/ScienceLabGame.jsx';
import CivicsQuestGame from '@/pages/components/landings/dashboard/lesson/games/CivicsQuestGame.jsx';
import HealthHeroGame from '@/pages/components/landings/dashboard/lesson/games/HealthHeroGame.jsx';
import CodeBreakerGame from '@/pages/components/landings/dashboard/lesson/games/CodeBreakerGame.jsx';
import DesignChallengeGame from '@/pages/components/landings/dashboard/lesson/games/DesignChallengeGame.jsx';
import JobSimGame from '@/pages/components/landings/dashboard/lesson/games/JobSimGame.jsx';
import QuickQuizGame from '@/pages/components/landings/dashboard/lesson/games/QuickQuizGame.jsx';
import TargetArenaGame from '@/pages/components/landings/dashboard/lesson/games/TargetArenaGame.jsx';

const gameList = [
  { id: 'math_blitz', title: 'Math Blitz', subject: 'Math', description: 'Answer math questions as fast as you can!', icon: '⚡', color: 'from-blue-500 to-blue-600', border: 'border-blue-200', component: MathBlitzGame },
  { id: 'word_rush', title: 'Word Rush', subject: 'English', description: 'Pick the correct word or grammar rule before time runs out.', icon: '📝', color: 'from-purple-500 to-purple-600', border: 'border-purple-200', component: WordRushGame },
  { id: 'start_it_up', title: 'Start It Up!', subject: 'Finance', description: 'Run your own business and make smart money decisions.', icon: '🚀', color: 'from-teal-500 to-teal-600', border: 'border-teal-200', component: StartItUpGame },
  { id: 'science_lab', title: 'Science Lab Escape', subject: 'Science', description: 'Solve science questions to escape the lab!', icon: '🔬', color: 'from-green-500 to-green-600', border: 'border-green-200', component: ScienceLabGame },
  { id: 'civics_quest', title: 'Civics Quest', subject: 'Social Studies', description: 'Race through U.S. history trivia!', icon: '🏛️', color: 'from-orange-500 to-orange-600', border: 'border-orange-200', component: CivicsQuestGame },
  { id: 'health_hero', title: 'Health Hero', subject: 'Health', description: 'Make real-life health decisions!', icon: '🏥', color: 'from-red-500 to-red-600', border: 'border-red-200', component: HealthHeroGame },
  { id: 'code_breaker', title: 'Code Breaker', subject: 'Coding', description: 'Read code snippets and figure out what they do.', icon: '💻', color: 'from-indigo-500 to-indigo-600', border: 'border-indigo-200', component: CodeBreakerGame },
  { id: 'design_challenge', title: 'Design Challenge', subject: 'Digital Art', description: 'Test your eye for design!', icon: '🎨', color: 'from-pink-500 to-pink-600', border: 'border-pink-200', component: DesignChallengeGame },
  { id: 'quick_quiz', title: 'Quick Quiz', subject: 'Mixed', description: 'Answer rapid-fire questions to earn a perfect score.', icon: '⚡', color: 'from-emerald-500 to-emerald-600', border: 'border-emerald-200', component: QuickQuizGame },
  { id: 'job_sim', title: 'Job Sim', subject: 'Job Readiness', description: 'Go through a full job search simulation.', icon: '💼', color: 'from-amber-500 to-amber-600', border: 'border-amber-200', component: JobSimGame },
  { id: 'target_arena', title: 'Target Arena', subject: 'Competitive', description: 'Unlock by getting perfect scores on all games. Each correct answer is a bullet — hit targets twice to knock them out!', icon: '🎯', color: 'from-cyan-500 to-cyan-600', border: 'border-cyan-200', component: TargetArenaGame },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [arenaUnlocked, setArenaUnlocked] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, () => {});
  }, []);

  useEffect(() => {
    const requiredGameIds = gameList
      .filter(g => g.id !== 'target_arena')
      .map(g => g.id);

    const allPerfect = requiredGameIds.every(id => {
      try {
        return localStorage.getItem(`game_${id}_perfect`) === '1';
      } catch {
        return false;
      }
    });

    setArenaUnlocked(allPerfect);
  }, [activeGame]);

  if (activeGame) {
    const game = gameList.find(g => g.id === activeGame);
    const GameComponent = game.component;
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => setActiveGame(null)} className="text-white hover:bg-gray-700 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Games
          </Button>
          <span className="text-white font-bold text-lg">{game.icon} {game.title}</span>
        </header>
        <GameComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5 text-gray-600" /></Button></Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Learning Games</h1>
            <p className="text-sm text-gray-500">Play your way to a GED</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2"><Gamepad2 className="w-7 h-7" /><p className="font-bold text-xl">Learn by Playing!</p></div>
          <p className="text-indigo-100 text-sm">Games make learning stick. Every game is based on real GED content.</p>
          <p className="text-indigo-200 text-sm mt-2 font-medium">🎮 All games are free to play!</p>
        </div>
        {gameList.map(game => {
          const isLocked = game.id === 'target_arena' && !arenaUnlocked;
          return (
            <div key={game.id} className={`relative bg-white rounded-2xl border ${game.border} shadow-sm overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
              {isLocked && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-sm font-semibold">
                  Locked — get perfect scores on all other games to unlock
                </div>
              )}
              <div className="p-5 flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md`}>{game.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-lg">{game.title}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">FREE</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{game.subject}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{game.description}</p>
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        if (!isLocked) setActiveGame(game.id);
                      }}
                      disabled={isLocked}
                      className={`bg-gradient-to-r ${game.color} text-white rounded-xl h-9 text-sm hover:opacity-90 ${isLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      {isLocked ? 'Locked' : '▶ Play Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}