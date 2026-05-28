import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Award, Clock } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "All GED Subjects",
    description: "Math, English, Science, Social Studies, and Health - everything you need.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Calendar,
    title: "Daily Lessons",
    description: "One lesson per subject daily. Small steps lead to big achievements.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Award,
    title: "Track Your Progress",
    description: "See how far you've come with your personal dashboard and streak counter.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Clock,
    title: "Learn Anytime",
    description: "Access your lessons whenever you have time. No deadlines, no pressure.",
    color: "bg-orange-100 text-orange-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          How skillRealms Works
        </h2>
        
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/realmpad" className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700">
            Learn more about RealmPad
          </Link>
        </div>
      </div>
    </section>
  );
}