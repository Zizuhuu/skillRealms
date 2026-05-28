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
    </HashRouter>
  )
}
