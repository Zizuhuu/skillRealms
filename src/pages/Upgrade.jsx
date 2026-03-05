import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Star, Check, Zap, BookOpen, BarChart2, Infinity, Trophy, Lock } from 'lucide-react';
const FREE_FEATURES = ["1 lesson per subject per day", "Progress tracking", "Basic quiz (3 questions)", "Resource directory", "Day streak counter"];
const PRO_FEATURES = ["Everything is Free", "Unlimited practice drills", "In-depth explanations", "Smart review sessions", "30 questions per subject", "Detailed analytics", "Downloadable study guides", "Priority support"];

export default function Upgrade() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate('/');
    });
    return unsub;
  }, [navigate]);

  const handleUpgrade = () => window.open('https://buy.stripe.com/test_4gM4gs3pTczwcBx4wafQI00', '_blank');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5 text-gray-600" /></Button></Link>
          <div><h1 className="text-xl font-bold text-gray-900">Upgrade to Pro</h1><p className="text-sm text-gray-500">Accelerate your learning</p></div>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-8 space-y-8">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 text-white text-center space-y-3">
          <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center"><Star className="w-10 h-10 text-yellow-300" /></div>
          <h2 className="text-3xl font-bold">skillRealms Pro</h2>
          <p className="text-purple-100 text-lg">Everything you need to pass your GED faster</p>
          <div className="mt-2"><span className="text-5xl font-bold">$4.99</span><span className="text-purple-200 text-xl">/month</span></div>
          <p className="text-purple-200 text-sm">Cancel anytime. No contracts.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border border-gray-200"><CardContent className="p-5"><div className="text-center mb-4"><h3 className="text-lg font-bold text-gray-700">Free</h3><p className="text-2xl font-bold text-gray-900">$0</p></div><div className="space-y-2">{FREE_FEATURES.map((f, i) => <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-600">{f}</span></div>)}</div></CardContent></Card>
          <Card className="border-2 border-purple-500 relative"><div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div><CardContent className="p-5"><div className="text-center mb-4"><h3 className="text-lg font-bold text-purple-700">Pro</h3><p className="text-2xl font-bold text-gray-900">$4.99</p></div><div className="space-y-2">{PRO_FEATURES.slice(0, 6).map((f, i) => <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-700 font-medium">{f}</span></div>)}</div></CardContent></Card>
        </div>
        <div className="space-y-4">
          {[
            { icon: Infinity, title: "Unlimited Practice Drills", desc: "Repeat any subject's quiz as many times as you want.", color: "bg-purple-100 text-purple-600" },
            { icon: Zap, title: "In-Depth Explanations", desc: "Deeper, personalized explanations for every wrong answer.", color: "bg-blue-100 text-blue-600" },
            { icon: BarChart2, title: "Smart Analytics", desc: "See exactly which topics you struggle with.", color: "bg-green-100 text-green-600" },
            { icon: BookOpen, title: "Extended Practice Sets", desc: "30 questions per subject — closer to the real GED.", color: "bg-orange-100 text-orange-600" },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}><Icon className="w-6 h-6" /></div>
              <div><h4 className="font-semibold text-gray-900 text-lg">{title}</h4><p className="text-gray-600">{desc}</p></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Button onClick={handleUpgrade} size="lg" className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-xl">
            <Star className="mr-2 w-6 h-6" /> Upgrade to Pro — $5.99/mo
          </Button>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Lock className="w-4 h-4" /><span>Secure checkout · Cancel anytime · No contracts</span>
          </div>
        </div>
      </main>
    </div>
  );
}