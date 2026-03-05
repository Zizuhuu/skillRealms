import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, LogOut, GraduationCap, Star, Library, Gamepad2 } from 'lucide-react';
import StreakCard from '@/pages/components/landings/dashboard/StreakCard.jsx';
import OverallProgress from '@/pages/components/landings/dashboard/OverallProgress.jsx';
import SubjectCard from '@/pages/components/landings/dashboard/SubjectCard.jsx';
import DailyLessonButton from '@/pages/components/landings/dashboard/DailyLessonButton.jsx';
import moment from 'moment';

const SUBJECTS = ['math', 'english', 'science', 'social_studies', 'health'];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [canStartLesson, setCanStartLesson] = useState(true);
  const [timeUntilUnlock, setTimeUntilUnlock] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || '',
          role: 'user'
        });
      } else {
        navigate('/');
      }
    });
    return unsub;
  }, [navigate]);

  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ['userStreak', user?.email],
    queryFn: async () => {
      const q = query(collection(db, 'UserStreak'), where('user_email', '==', user.email));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    },
    enabled: !!user?.email
  });

  const { data: progressData = [], isLoading: progressLoading } = useQuery({
    queryKey: ['learningProgress', user?.email],
    queryFn: async () => {
      const q = query(collection(db, 'LearningProgress'), where('user_email', '==', user.email));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    enabled: !!user?.email
  });

  const { data: todaySession, isLoading: sessionLoading } = useQuery({
    queryKey: ['dailySession', user?.email],
    queryFn: async () => {
      const today = moment().format('YYYY-MM-DD');
      const q = query(
        collection(db, 'DailySession'),
        where('user_email', '==', user.email),
        where('session_date', '==', today)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    },
    enabled: !!user?.email
  });

  const initProgressMutation = useMutation({
    mutationFn: async () => {
      const existingSubjects = progressData.map(p => p.subject);
      const newProgress = SUBJECTS.filter(s => !existingSubjects.includes(s));
      for (const subject of newProgress) {
        await addDoc(collection(db, 'LearningProgress'), {
          user_email: user.email,
          subject,
          current_lesson: 1,
          total_lessons: 30,
          completed_lessons: []
        });
      }
      if (!streakData) {
        await addDoc(collection(db, 'UserStreak'), {
          user_email: user.email,
          current_streak: 0,
          longest_streak: 0,
          total_lessons_completed: 0
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['learningProgress']);
      queryClient.invalidateQueries(['userStreak']);
    }
  });

  useEffect(() => {
    if (user?.email && !progressLoading && progressData.length === 0) {
      initProgressMutation.mutate();
    }
  }, [user?.email, progressLoading, progressData.length]);

  useEffect(() => {
    if (!user) return;
    const today = moment().format('YYYY-MM-DD');
    const isTodayComplete = todaySession?.is_complete && todaySession?.session_date === today;
    if (isTodayComplete) {
      setCanStartLesson(false);
      const now = moment();
      const midnight = moment().endOf('day');
      const duration = moment.duration(midnight.diff(now));
      setTimeUntilUnlock(`${Math.floor(duration.asHours())}h ${duration.minutes()}m`);
    } else {
      setCanStartLesson(true);
    }
  }, [todaySession, user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const getProgressForSubject = (subject) => progressData.find(p => p.subject === subject) || null;
  const isSubjectCompletedToday = (subject) => todaySession?.subjects_completed?.includes(subject) || false;
  const isLoading = streakLoading || progressLoading || sessionLoading || !user;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-lg mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">skillRealms</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-500 text-lg mt-1">Ready to learn something new today?</p>
        </div>

        <StreakCard streak={streakData} />

        <DailyLessonButton
          canStartLesson={canStartLesson}
          todaySession={todaySession}
          timeUntilUnlock={timeUntilUnlock}
          isPro={false}
        />

        <OverallProgress progressData={progressData} />

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Subjects</h2>
          <div className="space-y-4">
            {SUBJECTS.map(subject => (
              <SubjectCard
                key={subject}
                subject={subject}
                progress={getProgressForSubject(subject)}
                isCompletedToday={isSubjectCompletedToday(subject)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/resources">
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-medium">
              <HelpCircle className="w-5 h-5 mr-2" />
              Resources
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-medium">
              <Settings className="w-5 h-5 mr-2" />
              Profile
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-medium border-blue-200 text-blue-700 hover:bg-blue-50">
              <Library className="w-5 h-5 mr-2" />
              All Courses
            </Button>
          </Link>
          <Link to="/games">
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-medium border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Games
            </Button>
          </Link>
        </div>

        <Link to="/upgrade">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-7 h-7 text-yellow-300" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg">Upgrade to Pro</p>
              <p className="text-purple-200 text-sm">Unlimited drills, deeper explanations & more</p>
            </div>
            <span className="text-white font-semibold text-sm bg-white/20 px-3 py-1 rounded-xl">$4.99/mo →</span>
          </div>
        </Link>
      </main>
    </div>
  );
}