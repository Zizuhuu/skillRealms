import React from 'react';
import { Flame, Trophy } from "lucide-react";

export default function StreakCard({ streak }) {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-lg font-medium mb-1">Day Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{currentStreak}</span>
            <span className="text-2xl text-orange-200">days</span>
          </div>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
          <Flame className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-300" />
        <span className="text-orange-100">Best streak: <strong className="text-white">{longestStreak} days</strong></span>
      </div>
    </div>
  );
}