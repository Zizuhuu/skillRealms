import React from 'react';
import { Target, Star } from "lucide-react";

export default function OverallProgress({ progressData }) {
  // Calculate overall progress
  const totalLessons = progressData.reduce((sum, p) => sum + (p.total_lessons || 30), 0);
  const completedLessons = progressData.reduce((sum, p) => (sum + (p.completed_lessons?.length || 0)), 0);
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-gray-500">Toward your GED</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-green-600">{percentage}%</span>
        </div>
      </div>
      
      <Progress value={percentage} className="h-4 bg-gray-100" />
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">{completedLessons} of {totalLessons} lessons completed</span>
        {percentage >= 100 && (
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="font-medium">Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
}