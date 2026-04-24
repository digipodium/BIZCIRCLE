"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Grid, 
  Flag, 
  AlertCircle, 
  BarChart2, 
  Bell, 
  Settings, 
  FileText,
  Search,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useProfile } from "@/lib/useProfile";

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'groups', label: 'Group Management', icon: Grid },
  { id: 'moderation', label: 'Content Moderation', icon: Flag },
  { id: 'reports', label: 'Reports & Complaints', icon: AlertCircle },
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'System Settings', icon: Settings },
  { id: 'logs', label: 'Activity Logs', icon: FileText },
];

export default function AdminLayout({ children, activeSection, setActiveSection }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useProfile();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        
        .sidebar-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-item:hover {
          background-color: #f1f5f9;
          transform: translateX(4px);
        }
        .sidebar-item.active {
          background-color: #eff6ff;
          color: #2563eb;
          border-right: 3px solid #2563eb;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .nav-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
      `}</style>

      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          {sidebarOpen && (
            <span className="font-extrabold text-xl tracking-tight text-blue-900">BizCircle</span>
          )}
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${isActive ? 'active' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Icon size={sidebarOpen ? 20 : 24} className={isActive ? 'text-blue-600' : ''} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-3 space-y-1">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all"
            title="Back to User View"
          >
            <ArrowLeft size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span>User View</span>}
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.href = '/login';
            }}
            className="sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span>Logout</span>}
          </button>

          <div className="pt-2">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-bottom border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between nav-shadow">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search dashboard, users, posts..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500 font-medium capitalize">{user?.role || "System Admin"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
