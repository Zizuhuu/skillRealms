import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Clock, Globe, Youtube, Search, ArrowLeft, Lock, Gamepad2, Play, Zap, Hash, Music, Infinity as InfinityIcon } from 'lucide-react';
import moment from 'moment';

export default function FreeWeb() {
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [currentTab, setCurrentTab] = useState('youtube');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser({ email: firebaseUser.email, full_name: firebaseUser.displayName || '' });
      else navigate('/');
    });
    return unsub;
  }, [navigate]);

  const { data: progressData = [], isLoading: progressLoading } = useQuery({
    queryKey: ['learningProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        const q = query(collection(db, 'LearningProgress'), where('user_email', '==', user.email));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        return [];
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        const q = query(collection(db, 'UserProfile'), where('user_email', '==', user.email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      } catch (err) {
        return null;
      }
    },
    enabled: !!user?.email,
    retry: 2,
    staleTime: 60000
  });

  const isGEDComplete = progressData.length > 0 && progressData.every(p => p.current_lesson > 30);
  const isPro = userProfile?.is_pro || false;
  const hasPermanentAccess = isPro || isGEDComplete;
  const freeWebDuration = 1800; // 30 minutes for free users after each lesson

  useEffect(() => {
    if (!user) return;

    if (hasPermanentAccess) {
      setIsActive(true);
      setTimeLeft(0);
      return;
    }

    const today = moment().format('YYYY-MM-DD');
    const lastLessonDate = localStorage.getItem(`last_lesson_${user.email}`);
    const freeWebEnd = localStorage.getItem(`free_web_end_${user.email}`);

    if (lastLessonDate === today && freeWebEnd) {
      const endTime = moment(freeWebEnd);
      const now = moment();
      if (now.isBefore(endTime)) {
        setTimeLeft(endTime.diff(now, 'seconds'));
        setIsActive(true);
      } else {
        setTimeLeft(0);
        setIsActive(false);
      }
    } else if (lastLessonDate === today) {
      // Just completed a lesson today, start free web
      const endTime = moment().add(freeWebDuration, 'seconds');
      localStorage.setItem(`free_web_end_${user.email}`, endTime.toISOString());
      setTimeLeft(freeWebDuration);
      setIsActive(true);
    } else {
      setTimeLeft(0);
      setIsActive(false);
    }
  }, [user, freeWebDuration, hasPermanentAccess]);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'youtube', label: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/' },
    { id: 'instagram', label: 'Instagram', icon: Globe, url: 'https://www.instagram.com/' },
    { id: 'google', label: 'Google', icon: Search, url: 'https://www.google.com/webhp?igu=1' },
    { id: 'games', label: 'Games', icon: Gamepad2, url: 'https://poki.com/' },
    { id: 'netflix', label: 'Netflix', icon: Play, url: 'https://www.netflix.com/' },
    { id: 'twitch', label: 'Twitch', icon: Zap, url: 'https://www.twitch.tv/' },
    { id: 'reddit', label: 'Reddit', icon: Hash, url: 'https://www.reddit.com/' },
    { id: 'tiktok', label: 'TikTok', icon: Music, url: 'https://www.tiktok.com/' },
  ];
  const currentTabConfig = tabs.find(t => t.id === currentTab) || tabs[0];

  if (!user || progressLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isGEDComplete && !isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Congratulations!</h1>
            <p className="text-xl text-gray-600">You've completed your GED! Web access is now unlocked permanently.</p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-2xl">
                Back to Dashboard
              </Button>
              <Button onClick={() => setCurrentTab('youtube')} variant="outline" size="lg" className="w-full h-14 text-lg rounded-2xl">
                Start Browsing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasPermanentAccess && (!isActive || timeLeft === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Free Web Time Expired</h1>
            <p className="text-xl text-gray-600">Complete another lesson to earn more free web time.</p>
            <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-500">{isPro ? 'Pro Web Access' : 'Free Web'}</p>
                <span className="text-xl font-bold text-gray-900">{isPro ? 'Permanent browsing' : 'Free Web'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isPro || isGEDComplete ? 'bg-green-50' : 'bg-blue-50'}`}>
              {isPro || isGEDComplete ? <InfinityIcon className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-blue-600" />}
              <span className={`font-semibold ${isPro || isGEDComplete ? 'text-green-900' : 'text-blue-900'}`}>
                {isPro || isGEDComplete ? 'Permanent access' : formatTime(timeLeft)}
              </span>
            </div>
            <span className="text-sm text-gray-500">{isPro || isGEDComplete ? 'Unlimited browsing' : 'Time remaining'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    currentTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Some websites block in-app embedding. If a page is blank, open it in a new tab.
            </p>
            <a
              href={currentTabConfig.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Open {currentTabConfig.label}
            </a>
          </div>
          <div className="h-[calc(100vh-270px)]">
            <iframe
              key={currentTabConfig.id}
              src={currentTabConfig.url}
              title={`${currentTabConfig.label} preview`}
              className="w-full h-full border-0"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
