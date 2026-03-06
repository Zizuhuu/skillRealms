import React, { useState } from 'react';
import { GraduationCap, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function HeroSection() {
  const [mode, setMode] = useState('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Incorrect email or password. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      await sendEmailVerification(cred.user);
      setVerifyMsg('✅ Account created! Check your email to verify your account, then sign in.');
      setMode('login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('That email is already registered. Try signing in.');
      else setError('Could not create account. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-blue-50 via-white to-green-50">
      <div className="max-w-lg mx-auto text-center space-y-8 w-full">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Your Path to a<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Brighter Future</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">Free GED prep designed for you. Learn at your own pace, one day at a time.</p>
        <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 text-left text-lg">
              <strong className="text-green-700">You belong here.</strong> No matter where you are in life, education opens doors. We're with you every step of the way.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-5 max-w-sm mx-auto w-full">
          {verifyMsg && <p className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">{verifyMsg}</p>}

          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-800 text-lg">Get started for free</p>
              <button onClick={() => setMode('register')} className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors">Create Account</button>
              <button onClick={() => setMode('login')} className="w-full h-14 text-lg font-semibold border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">Sign In</button>
              <div className="text-center mt-2">
                <Link to="/realmpad" className="text-sm font-medium text-blue-600 hover:underline">
                  Want the RealmPad app? Learn more →
                </Link>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="font-semibold text-gray-800 text-lg">Welcome back!</p>
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 px-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
              </button>
              <p className="text-gray-500 text-sm">
                <button type="button" onClick={() => setMode('choose')} className="text-blue-600 hover:underline">← Back</button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <p className="font-semibold text-gray-800 text-lg">Create your free account</p>
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" placeholder="First name" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full h-12 px-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 px-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Account'}
              </button>
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-medium hover:underline">Sign in</button>
                {' · '}
                <button type="button" onClick={() => setMode('choose')} className="text-blue-600 hover:underline">← Back</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}