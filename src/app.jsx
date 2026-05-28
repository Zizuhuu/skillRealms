import { HashRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Tablet, Globe, Gamepad2, Home as HomeIcon, LayoutDashboard, Library, User, BookOpen } from "lucide-react";
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

function SideNavButtons() {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/lesson", label: "Lesson", icon: BookOpen },
    { to: "/courses", label: "Courses", icon: Library },
    { to: "/freeweb", label: "Free Web", icon: Globe },
    { to: "/games", label: "Games", icon: Gamepad2 },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const hideOn = ["/", "/realmpad", "/vm-session"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <aside className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-lg p-2 flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SideNavButtons />
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
