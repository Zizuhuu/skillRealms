import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Award, Flame, BookOpen, LogOut, Trophy, Target, Clock, GraduationCap } from 'lucide-react';
import moment from 'moment';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser({ email: firebaseUser.email, full_name: firebaseUser.displayName || '', created_date: firebaseUser.metadata.creationTime });
      else navigate('/');
    });
    return unsub;
  }, [navigate]);

  const { data: streak } = useQuery({
    queryKey: ['userStreak', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        const q = query(collection(db, 'UserStreak'), where('user_email', '==', user.email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      } catch (err) {
        console.error('Streak query error:', err);
        return null;
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
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
        console.error('Progress query error:', err);
        return [];
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['allSessions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        const q = query(collection(db, 'DailySession'), where('user_email', '==', user.email));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.session_date.localeCompare(a.session_date)).slice(0, 30);
      } catch (err) {
        console.error('Sessions query error:', err);
        return [];
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const totalLessonsCompleted = streak?.total_lessons_completed || 0;
  const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.time_spent_minutes || 0), 0);

  const achievements = [
    { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: BookOpen, unlocked: totalLessonsCompleted >= 1, color: 'bg-green-100 text-green-600' },
    { id: 'week_streak', name: 'Week Warrior', description: '7-day streak', icon: Flame, unlocked: (streak?.longest_streak || 0) >= 7, color: 'bg-orange-100 text-orange-600' },
    { id: 'ten_lessons', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: Award, unlocked: totalLessonsCompleted >= 10, color: 'bg-purple-100 text-purple-600' },
    { id: 'month_streak', name: 'Month Master', description: '30-day streak', icon: Trophy, unlocked: (streak?.longest_streak || 0) >= 30, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'fifty_lessons', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: Target, unlocked: totalLessonsCompleted >= 50, color: 'bg-blue-100 text-blue-600' },
    { id: 'graduate', name: 'Graduate', description: 'Complete all subjects', icon: GraduationCap, unlocked: progressData.every(p => (p.completed_lessons?.length || 0) >= 30), color: 'bg-indigo-100 text-indigo-600' }
  ];

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5 text-gray-600" /></Button></Link>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-red-500" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-8 space-y-8">
        <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center"><User className="w-10 h-10" /></div>
            <div>
              <h2 className="text-2xl font-bold">{user.full_name || 'Learner'}</h2>
              <p className="text-blue-100 flex items-center gap-2 mt-1"><Mail className="w-4 h-4" />{user.email}</p>
              <p className="text-blue-100 flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" />Joined {moment(user.created_date).format('MMMM YYYY')}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{streak?.current_streak || 0}</p><p className="text-sm text-gray-500">Day Streak</p></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{totalLessonsCompleted}</p><p className="text-sm text-gray-500">Lessons</p></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><Clock className="w-8 h-8 text-green-500 mx-auto mb-2" /><p className="text-3xl font-bold text-gray-900">{Math.round(totalTimeSpent / 60)}h</p><p className="text-sm text-gray-500">Learning</p></CardContent></Card>
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" />Achievements</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map(a => (
                <div key={a.id} className={`p-4 rounded-2xl border-2 ${a.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center mb-3`}><a.icon className="w-6 h-6" /></div>
                  <h3 className="font-semibold text-gray-900">{a.name}</h3>
                  <p className="text-sm text-gray-500">{a.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {sessions.length === 0 ? <p className="text-gray-500 text-center py-4">No activity yet. Start your first lesson!</p> : (
              <div className="space-y-3">
                {sessions.slice(0, 5).map(session => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{moment(session.session_date).format('MMMM D, YYYY')}</p>
                      <p className="text-sm text-gray-500">{session.subjects_completed?.length || 0} subjects · {session.time_spent_minutes || 0} min</p>
                    </div>
                    {session.is_complete && <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Award className="w-4 h-4 text-green-600" /></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}