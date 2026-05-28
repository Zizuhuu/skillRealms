import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Phone, Wifi, Bluetooth, Users } from 'lucide-react';

const REALMPAD_LINK = 'https://buy.stripe.com/test_7sY6oH2gFcDj8Cv9decwg02';

export default function RealmPad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Phone className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RealmPad</h1>
            <p className="text-sm text-gray-500">Your offline study hub + mentor connection</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10 space-y-10">
        <section className="bg-gradient-to-br from-indigo-600 to-teal-500 rounded-3xl p-6 text-white">
          <h2 className="text-3xl font-bold">Learn anywhere—even without Wi‑Fi</h2>
          <p className="mt-3 text-lg text-indigo-100">
            RealmPad gives you a dedicated learning app with built-in Wi‑Fi + Bluetooth support, mentor chat, and the full SkillRealms experience—all in one place.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 bg-white/15 rounded-2xl p-4">
              <Wifi className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-semibold">Offline sync</h3>
                <p className="text-sm text-indigo-100">Download lessons and quizzes, then study without needing constant internet.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/15 rounded-2xl p-4">
              <Bluetooth className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-semibold">Bluetooth sharing</h3>
                <p className="text-sm text-indigo-100">Share progress, lessons, and mentor notes with nearby peers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/15 rounded-2xl p-4">
              <Users className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-semibold">Mentor connection</h3>
                <p className="text-sm text-indigo-100">Message your mentor directly from the app for guidance and support.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/15 rounded-2xl p-4">
              <Phone className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-semibold">All your tools in one place</h3>
                <p className="text-sm text-indigo-100">Access the SkillRealms website, lessons, and your dashboard right from the app.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Get RealmPad</h2>
            <p className="text-gray-600">Purchase RealmPad and unlock the full companion app experience.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a href={REALMPAD_LINK} target="_blank" rel="noreferrer" className="block">
              <Button size="lg" className="w-full text-center bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white">
                Buy RealmPad
              </Button>
            </a>
          </div>

          <p className="text-sm text-gray-500">RealmPad is sold separately from SkillRealms Pro and includes its own pricing and features.</p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Need help?</h2>
          <p className="text-gray-600">If you already purchased RealmPad, open the app and sign in with the same account you use here. Your lessons and progress will sync automatically.</p>
          <p className="text-gray-600">Questions about setup or compatibility? Reach out to our support team from the app or email us at <a href="mailto:support@skillrealms.com" className="text-indigo-600 hover:underline">support@skillrealms.com</a>.</p>
        </section>
      </main>
    </div>
  );
}
