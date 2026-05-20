import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, FlaskConical, Globe, Heart, Trophy, Briefcase } from 'lucide-react';
import { Star } from 'lucide-react';
import DailyLessonButton from '@/pages/components/landings/dashboard/DailyLessonButton';
import LessonContent from '@/pages/components/landings/dashboard/lesson/LessonContent';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = ['math', 'english', 'science', 'social_studies', 'health'];
const PRO_SUBJECT_MAP = { financial_literacy: 'math', coding_basics: 'math', digital_art: 'english', job_readiness: 'english' };

const subjectConfig = {
  math: { name: "Mathematics", icon: Calculator, color: "from-blue-500 to-blue-600" },
  english: { name: "English", icon: BookOpen, color: "from-purple-500 to-purple-600" },
  science: { name: "Science", icon: FlaskConical, color: "from-green-500 to-green-600" },
  social_studies: { name: "Social Studies", icon: Globe, color: "from-orange-500 to-orange-600" },
  health: { name: "Health", icon: Heart, color: "from-red-500 to-red-600" },
  financial_literacy: { name: "Financial Literacy", icon: BookOpen, color: "from-teal-500 to-teal-600" },
  coding_basics: { name: "Intro to Coding", icon: BookOpen, color: "from-indigo-500 to-indigo-600" },
  digital_art: { name: "Digital Art & Design", icon: BookOpen, color: "from-pink-500 to-pink-600" },
  job_readiness: { name: "Job Readiness", icon: Briefcase, color: "from-amber-500 to-amber-600" },
};

export default function Lesson() {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  const isProStandalone = subjectParam && PRO_SUBJECT_MAP.hasOwnProperty(subjectParam);
  const initialIndex = (!isProStandalone && subjectParam) ? Math.max(0, SUBJECTS.indexOf(subjectParam)) : 0;

  const [user, setUser] = useState(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(initialIndex);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser({ uid: firebaseUser.uid, email: firebaseUser.email, full_name: firebaseUser.displayName || '' });
      else navigate('/');
    });
    return unsub;
  }, [navigate]);

  const { data: todaySession } = useQuery({
    queryKey: ['dailySession', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        const today = moment().format('YYYY-MM-DD');
        const q = query(collection(db, 'DailySession'), where('user_email', '==', user.email), where('session_date', '==', today));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      } catch (err) {
        console.error('Daily session query error:', err);
        return null;
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 0
  });

  const { data: progressData = [] } = useQuery({
    queryKey: ['learningProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        const q = query(collection(db, 'LearningProgress'), where('user_email', '==', user.email));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Learning progress query error:', err);
        return [];
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        if (user?.uid) {
          const uidQuery = query(collection(db, 'UserProfile'), where('user_uid', '==', user.uid));
          const uidSnap = await getDocs(uidQuery);
          if (!uidSnap.empty) return { id: uidSnap.docs[0].id, ...uidSnap.docs[0].data() };
        }
        const emailQuery = query(collection(db, 'UserProfile'), where('user_email', '==', user.email));
        const emailSnap = await getDocs(emailQuery);
        if (emailSnap.empty) return null;
        return { id: emailSnap.docs[0].id, ...emailSnap.docs[0].data() };
      } catch (err) {
        return null;
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  useEffect(() => {
    if (!user || !todaySession?.subjects_completed) return;
    const nextIndex = SUBJECTS.findIndex(s => !todaySession.subjects_completed.includes(s));
    if (nextIndex !== -1) setCurrentSubjectIndex(nextIndex);
    else if (todaySession.is_complete) setShowCompletion(true);
  }, [todaySession, user]);

  const completeSubjectMutation = useMutation({
    mutationFn: async (subject) => {
      const today = moment().format('YYYY-MM-DD');
      const timeSpent = Math.round((Date.now() - startTime) / 60000);

      if (!todaySession) {
        await addDoc(collection(db, 'DailySession'), {
          user_email: user.email, session_date: today,
          subjects_completed: [subject], time_spent_minutes: timeSpent, is_complete: false
        });
      } else {
        const alreadyDone = (todaySession.subjects_completed || []).includes(subject);
        const updatedSubjects = alreadyDone ? todaySession.subjects_completed : [...(todaySession.subjects_completed || []), subject];
        const isComplete = updatedSubjects.length >= SUBJECTS.length;
        await updateDoc(doc(db, 'DailySession', todaySession.id), {
          subjects_completed: updatedSubjects,
          time_spent_minutes: (todaySession.time_spent_minutes || 0) + timeSpent,
          is_complete: isComplete
        });
      }

      const subjectProgress = progressData.find(p => p.subject === subject);
      if (subjectProgress) {
        const currentLesson = subjectProgress.current_lesson || 1;
        await updateDoc(doc(db, 'LearningProgress', subjectProgress.id), {
          completed_lessons: [...(subjectProgress.completed_lessons || []), currentLesson],
          current_lesson: currentLesson + 1,
          last_lesson_date: today
        });
      }

      const sq = query(collection(db, 'UserStreak'), where('user_email', '==', user.email));
      const ssnap = await getDocs(sq);
      if (!ssnap.empty) {
        const streak = { id: ssnap.docs[0].id, ...ssnap.docs[0].data() };
        const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
        let newStreak = streak.current_streak || 0;
        if (streak.last_activity_date !== today) {
          newStreak = streak.last_activity_date === yesterday ? newStreak + 1 : 1;
        }
        await updateDoc(doc(db, 'UserStreak', streak.id), {
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak || 0),
          last_activity_date: today,
          total_lessons_completed: (streak.total_lessons_completed || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dailySession']);
      queryClient.invalidateQueries(['learningProgress']);
      queryClient.invalidateQueries(['userStreak']);
      // Set last lesson date for free web
      const today = moment().format('YYYY-MM-DD');
      localStorage.setItem(`last_lesson_${user.email}`, today);
      const freeWebKey = `free_web_end_${user.email}`;
      const currentEnd = localStorage.getItem(freeWebKey);
      const now = moment();
      const base = currentEnd && moment(currentEnd).isAfter(now) ? moment(currentEnd) : now;
      localStorage.setItem(freeWebKey, base.add(30, 'minutes').toISOString());
    }
  });

  const handleLessonComplete = () => completeSubjectMutation.mutate(SUBJECTS[currentSubjectIndex]);

  const currentSubject = isProStandalone ? subjectParam : SUBJECTS[currentSubjectIndex];
  const contentSubject = PRO_SUBJECT_MAP[currentSubject] || currentSubject;
  const config = subjectConfig[currentSubject];
  const Icon = config?.icon;

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Amazing Work!</h1>
          <p className="text-xl text-gray-600">You've completed all your daily lessons. Your dedication is inspiring!</p>
          <p className="text-lg text-green-600 font-medium">Open Free Web now to use your earned browsing time.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button onClick={() => navigate('/freeweb')} size="lg" className="h-16 px-8 text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl">
              Open Free Web
            </Button>
            <Button onClick={() => navigate('/dashboard')} size="lg" className="h-16 px-8 text-xl font-semibold bg-green-600 hover:bg-green-700 rounded-2xl">
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user || !config) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`bg-gradient-to-r ${config.color} text-white sticky top-0 z-50`}>
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="text-white hover:bg-white/20 rounded-xl">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{config.name}</h1>
                <p className="text-white/80 text-sm">Lesson {progressData.find(p => p.subject === currentSubject)?.current_lesson || 1}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 pb-4">
          <div className="flex gap-2">
            {SUBJECTS.map((subject, index) => (
              <div key={subject} className={`flex-1 h-2 rounded-full ${todaySession?.subjects_completed?.includes(subject) ? 'bg-white' : index === currentSubjectIndex ? 'bg-white/60' : 'bg-white/20'}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-white/80">
            <span>{todaySession?.subjects_completed?.length || 0} of {SUBJECTS.length} complete</span>
            <span>~60 min per subject</span>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentSubject} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <LessonContent
              subject={contentSubject}
              displaySubject={currentSubject}
              lessonNumber={progressData.find(p => p.subject === contentSubject)?.current_lesson || 1}
              onComplete={isProStandalone ? () => setShowCompletion(true) : handleLessonComplete}
              isPro={userProfile?.is_pro || (import.meta.env.VITE_FIREBASE_PROJECT_ID === 'skillway-1125b' && user?.email && localStorage.getItem('skillRealms_pro_user') === user.email)}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
