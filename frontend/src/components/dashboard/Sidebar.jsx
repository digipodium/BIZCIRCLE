"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Compass,
  UserCircle,
  LogOut,
  Menu,
  X,
  Star,
  Bell,
  MessageSquareWarning,
  ShieldAlert,
  Send
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";
import NotificationBell from "@/components/NotificationBell";
import SearchBar from "@/components/SearchBar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { points } = usePoints();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Circles", icon: Users, href: "/dashboard/my-circles" },
    { name: "Explore", icon: Compass, href: "/dashboard/discover" },
    { name: "Referrals", icon: Send, href: "/dashboard/referrals" },
    { name: "Profile", icon: UserCircle, href: "/profile" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Support", icon: MessageSquareWarning, href: "/support" },
  ];

  const { user } = useProfile();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    menuItems.push({ name: "Moderation", icon: ShieldAlert, href: "/admin/moderation" });
  }

  const activeClass = "bg-blue-50 text-blue-600 font-semibold shadow-sm";
  const inactiveClass = "text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200";

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-slate-100 text-slate-600"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo + bell */}
          <div className="flex items-center justify-between gap-3 mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-100">
                <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                  <circle cx="5" cy="10" r="2.5" /><circle cx="15" cy="5" r="2.5" /><circle cx="15" cy="15" r="2.5" />
                  <line x1="7.2" y1="9" x2="13" y2="6.2" stroke="white" strokeWidth="1.5" />
                  <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">BizCircle</span>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Points Balance */}
          <div className="mb-8 px-2">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm shadow-amber-900/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-md shadow-amber-900/20">
                  <Star className="text-slate-900 fill-slate-900 w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">BizPoints Balance</p>
                  <p className="text-lg font-bold text-slate-900 leading-none">{points}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm 
                    ${isActive ? activeClass : inactiveClass}
                  `}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="pt-6 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-slate-100 shadow-sm">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Guest"}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wider">{user?.role || "Member"}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/login';
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors duration-200 font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
