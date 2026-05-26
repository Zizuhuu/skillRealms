import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Tablet, Globe, Gamepad2 } from "lucide-react";
import Home from "@/pages/Home.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Lesson from "@/pages/Lesson.jsx";
import Games from "@/pages/Games.jsx";
import Courses from "@/pages/Courses.jsx";
import Profile from "@/pages/Profile.jsx";
import Resources from "@/pages/Resources.jsx";
import Upgrade from "@/pages/Upgrade.jsx";
import RealmPad from "@/pages/RealmPad.jsx";
import ClassroomCenter from "@/pages/CoolGame.jsx";
import VMSession from "@/pages/VMSession.jsx";
import FreeWeb from "@/pages/FreeWeb.jsx";

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/freeweb" element={<FreeWeb />} />
        <Route path="/vm-session" element={<VMSession />} />
                <Route path="/games" element={<Games />} />
        <Route path="/courses" element={<Courses />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/realmpad" element={<RealmPad />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Always-visible buttons */}
      <Link
        to="/games"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow-lg hover:bg-green-700 transition"
      >
        <Gamepad2 className="w-5 h-5" />
        <span className="hidden sm:inline">Games</span>
      </Link>
      <Link
        to="/freeweb"
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700 transition"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">Free Web</span>
      </Link>
      <Link
        to="/realmpad"
        className="fixed bottom-34 right-6 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-white shadow-lg hover:bg-indigo-700 transition"
      >
        <Tablet className="w-5 h-5" />
        <span className="hidden sm:inline">RealmPad</span>
      </Link>
    </HashRouter>
  )
}
