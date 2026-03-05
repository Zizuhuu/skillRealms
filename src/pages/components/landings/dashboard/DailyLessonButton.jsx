import { Button } from '@/components/ui/Button';
import React from 'react';
import { Link } from "react-router-dom";
import { Play, CheckCircle2, Infinity } from "lucide-react";

export default function DailyLessonButton({ canStartLesson, todaySession, timeUntilUnlock, isPro }) {
  const allSubjectsCompleted = todaySession?.is_complete;
  
  // Pro users can always keep learning — never "done for the day"
  if (allSubjectsCompleted && !isPro) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Great Job!</h3>
            <p className="text-green-100 text-lg">You've completed all lessons for today!</p>
          </div>
        </div>
        <p className="mt-4 text-green-100 text-center">
          Come back tomorrow for new lessons
        </p>
      </div>
    );
  }
  
  const subjectsRemaining = allSubjectsCompleted ? 5 : 5 - (todaySession?.subjects_completed?.length || 0);
  
  return (
    <Link to={"/lesson"}>
      <Button 
        size="lg"
        className="w-full h-20 text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-4"
      >
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
          <Play className="w-8 h-8 fill-white" />
        </div>
        <div className="text-left">
          <span className="block">{allSubjectsCompleted && isPro ? 'Continue Learning' : 'Start Daily Lesson'}</span>
          <span className="text-sm font-normal text-blue-100">
            {isPro ? (
              <span className="flex items-center gap-1"><Infinity className="w-3 h-3" /> Unlimited lessons</span>
            ) : (
              `${subjectsRemaining} subjects remaining`
            )}
          </span>
        </div>
      </Button>
    </Link>
  );
}