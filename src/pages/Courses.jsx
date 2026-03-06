import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, BookOpen, Calculator, FlaskConical, Globe, Heart, Play, Lock, CheckCircle2, Clock, Code, Palette, DollarSign, Briefcase } from 'lucide-react';

const GED_COURSES = [
  { id: 'math', title: 'GED Mathematics', subtitle: 'Arithmetic, Algebra & Problem Solving', icon: Calculator, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', lessons: 30, duration: '~15 hours', description: 'Master the math skills you need for the GED.', topics: ['Basic Arithmetic', 'Fractions & Decimals', 'Percentages', 'Order of Operations', 'Basic Algebra', 'Geometry & Area', 'Word Problems', 'Data & Statistics'] },
  { id: 'english', title: 'GED Reasoning Through Language Arts', subtitle: 'Reading, Writing & Grammar', icon: BookOpen, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200', lessons: 30, duration: '~12 hours', description: 'Develop strong reading, grammar, and writing skills.', topics: ['Main Idea & Details', 'Inference & Context', 'Grammar Rules', 'Punctuation', 'Vocabulary Building', 'Sentence Structure', 'Paragraph Writing', 'Fact vs. Opinion'] },
  { id: 'science', title: 'GED Science', subtitle: 'Life Science, Physical Science & Earth Science', icon: FlaskConical, color: 'from-green-500 to-green-600', bg: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', lessons: 30, duration: '~13 hours', description: 'Explore the natural world from cells to energy.', topics: ['Cells & Living Things', 'Ecosystems', 'Photosynthesis', "Newton's Laws", 'Matter & States', 'Chemical Change', 'Scientific Method', 'Human Body'] },
  { id: 'social_studies', title: 'GED Social Studies', subtitle: 'U.S. History, Civics & Economics', icon: Globe, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', lessons: 30, duration: '~12 hours', description: 'Understand American history and how the government works.', topics: ['Declaration & Constitution', 'Bill of Rights', 'Three Branches', 'Civil War', 'Civil Rights Movement', 'World Wars', 'Supply & Demand', 'Geography'] },
  { id: 'health', title: 'Personal Health & Life Skills', subtitle: 'Wellness, Nutrition & Mental Health', icon: Heart, color: 'from-red-500 to-red-600', bg: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', lessons: 30, duration: '~10 hours', description: 'Practical health knowledge for everyday life.', topics: ['Nutrition Basics', 'Exercise & Fitness', 'Mental Health', 'Disease Prevention', 'Substance Use', 'Healthy Relationships', 'First Aid', 'Healthcare'] },
];

const PRO_COURSES = [
  { id: 'financial_literacy', title: 'Financial Literacy', subtitle: 'Budgeting, Credit & Money Management', icon: DollarSign, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', textColor: 'text-teal-700', borderColor: 'border-teal-200', lessons: 20, duration: '~8 hours', description: 'Learn to manage money, build a budget, and understand credit.', topics: ['Creating a Budget', 'Saving & Goals', 'Understanding Credit', 'Banking Basics', 'Avoiding Debt', 'Benefits', 'Job Skills', 'Tenant Rights'], game: 'Start It Up! 🚀' },
  { id: 'coding_basics', title: 'Intro to Coding', subtitle: 'Logic, Algorithms & Your First Program', icon: Code, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', textColor: 'text-indigo-700', borderColor: 'border-indigo-200', lessons: 20, duration: '~10 hours', description: 'No experience needed! Learn how computers think.', topics: ['What is Code?', 'Variables & Data', 'If/Then Logic', 'Loops', 'Functions', 'HTML Basics', 'Problem Solving', 'Debugging'], game: 'Code Breaker 💻' },
  { id: 'digital_art', title: 'Digital Art & Design', subtitle: 'Creativity, Canva & Visual Communication', icon: Palette, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', textColor: 'text-pink-700', borderColor: 'border-pink-200', lessons: 15, duration: '~6 hours', description: 'Express yourself and build job-ready design skills.', topics: ['Color Theory', 'Typography', 'Composition', 'Canva Essentials', 'Logo Design', 'Social Media Graphics', 'Print Design', 'Portfolio'], game: 'Design Challenge 🎨' },
  { id: 'job_readiness', title: 'Job Readiness', subtitle: 'Resume, Interview & Workplace Skills', icon: Briefcase, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', lessons: 15, duration: '~5 hours', description: 'Land your first job or next job.', topics: ['Writing a Resume', 'Cover Letters', 'Interview Prep', 'Professional Communication', 'Workplace Rights', 'Time Management', 'Goal Setting', 'Networking'], game: 'Job Sim 💼' },
];

function CourseCard({ course, isProCourse }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = course.icon;

  return (
    <div className={`bg-white rounded-2xl border ${course.borderColor} shadow-sm overflow-hidden`}>
      <button className="w-full text-left p-5 hover:bg-gray-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center flex-shrink-0`}><Icon className="w-7 h-7 text-white" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{course.title}</h3>
              {isProCourse ? <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">PRO</span> : <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>}
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{course.subtitle}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} lessons</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
            </div>
          </div>
          <span className={`text-2xl transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}>›</span>
        </div>
      </button>
      {expanded && (
        <div className={`border-t ${course.borderColor} ${course.bg} p-5 space-y-4`}>
          <p className="text-gray-700">{course.description}</p>
          <div>
            <p className={`font-semibold ${course.textColor} mb-2`}>What you'll learn:</p>
            <div className="grid grid-cols-2 gap-2">
              {course.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${course.textColor} flex-shrink-0`} /><span className="text-sm text-gray-700">{topic}</span></div>
              ))}
            </div>
          </div>
          {isProCourse ? (
            <Link to="/upgrade"><Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12"><Lock className="w-4 h-4 mr-2" /> Unlock with Pro — $5.99/mo</Button></Link>
          ) : (
            <Link to={`/lesson?subject=${course.id}`}><Button className={`w-full bg-gradient-to-r ${course.color} text-white rounded-xl h-12 hover:opacity-90`}><Play className="w-4 h-4 mr-2 fill-white" /> Start Learning</Button></Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function Courses() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5 text-gray-600" /></Button></Link>
          <div><h1 className="text-xl font-bold text-gray-900">All Courses</h1><p className="text-sm text-gray-500">{GED_COURSES.length + PRO_COURSES.length} courses available</p></div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-5 text-white">
          <p className="font-bold text-xl">Your GED Journey Starts Here</p>
          <p className="text-blue-100 text-sm mt-1">Master all 5 GED subjects FREE, then explore Pro courses in coding, finance, art & more.</p>
        </div>
        <div><h2 className="text-lg font-bold text-gray-800 mb-3">🎯 Core GED Subjects — Free</h2><div className="space-y-4">{GED_COURSES.map(c => <CourseCard key={c.id} course={c} isProCourse={false} />)}</div></div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">⭐ Pro Courses</h2>
          <p className="text-sm text-gray-500 mb-3">Go beyond the GED with real-world skills employers want.</p>
          <div className="space-y-4">{PRO_COURSES.map(c => <CourseCard key={c.id} course={c} isProCourse={true} />)}</div>
        </div>
        <Link to="/upgrade">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">⭐</div>
            <div className="flex-1"><p className="text-white font-bold text-lg">Unlock All Pro Courses + Games</p><p className="text-purple-200 text-sm">Coding, finance, art, unlimited drills & more</p></div>
            <span className="text-white font-semibold text-sm bg-white/20 px-3 py-1 rounded-xl">$5.99/mo →</span>
          </div>
        </Link>
      </main>
    </div>
  );
}