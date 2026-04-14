"use client";

import Link from 'next/link';
import { Users, FileText, CheckSquare, Bell, LogOut, ArrowLeft, Star } from 'lucide-react';
import { usePoints } from "@/context/PointsContext";

export default function GroupsLayout({ children }) {
  const { points } = usePoints();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            BizCircle
          </h1>
        </div>

        {/* Points Balance */}
        <div className="px-6 mb-2">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-sm">
                <Star className="text-slate-900 fill-slate-900 w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider leading-tight">BizPoints Balance</p>
                <p className="text-lg font-bold text-slate-900 leading-none">{points}</p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/groups" className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">All Groups</span>
          </Link>
          <Link href="/groups/my" className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <CheckSquare className="w-5 h-5 mr-3" />
            <span className="font-medium">My Groups</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Soft background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 -z-10" />
        
        {/* Mobile Header (fallback) */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">BizCircle</h1>
          <button><LogOut className="w-6 h-6 text-gray-500" /></button>
        </header>

        <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
