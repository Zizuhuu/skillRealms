import React from 'react';
import { CheckCircle2, BookOpen, Calculator, FlaskConical, Globe, Heart } from "lucide-react";

const subjectConfig = {
  math: {
    name: "Mathematics",
    icon: Calculator,
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-600"
  },
  english: {
    name: "English",
    icon: BookOpen,
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-600"
  },
  science: {
    name: "Science",
    icon: FlaskConical,
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-600"
  },
  social_studies: {
    name: "Social Studies",
    icon: Globe,
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-600"
  },
  health: {
    name: "Health",
    icon: Heart,
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-600"
  }
};

export default function SubjectCard({ subject, progress, isCompletedToday }) {
  const config = subjectConfig[subject];
  const Icon = config.icon;
  const completedCount = progress?.completed_lessons?.length || 0;
  const totalLessons = progress?.total_lessons || 30;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${isCompletedToday ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${config.lightColor} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.textColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{config.name}</h3>
            <p className="text-gray-500 text-sm">Lesson {progress?.current_lesson || 1} of {totalLessons}</p>
          </div>
        </div>
        {isCompletedToday && (
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className={`font-semibold ${config.textColor}`}>{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-3 bg-gray-100" />
      </div>
    </div>
  );
}