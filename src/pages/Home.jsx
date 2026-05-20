import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import FeaturesSection from '@/pages/components/landings/FeaturesSection.jsx';
import ResourcesFooter from '@/pages/components/landings/ResourcesFooter.jsx';
import HeroSection from '@/pages/components/landings/HeroSection.jsx';
import StreakCard from '@/pages/components/landings/dashboard/StreakCard.jsx';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (auth) {
        const unsub = onAuthStateChanged(auth, (user) => {
          if (user) navigate('/dashboard');
          else setLoading(false);
        });
        return unsub;
      } else {
        // Firebase not available, just show the UI
        setLoading(false);
      }
    } catch (error) {
      console.error('Firebase auth error:', error);
      // Show UI even if Firebase fails
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <ResourcesFooter />
    </div>
  );
}
