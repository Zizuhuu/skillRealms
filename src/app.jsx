import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Lesson from "@/pages/Lesson.jsx";
import Games from "@/pages/Games.jsx";
import Courses from "@/pages/Courses.jsx";
import Profile from "@/pages/Profile.jsx";
import Resources from "@/pages/Resources.jsx";
import Upgrade from "@/pages/Upgrade.jsx";
import RealmPad from "@/pages/RealmPad.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/games" element={<Games />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/realmpad" element={<RealmPad />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
