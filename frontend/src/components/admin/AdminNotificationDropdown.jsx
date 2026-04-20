"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, ShieldAlert, CheckCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/notifications");
      setNotifications(data.notifications.slice(0, 6));
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/admin/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
        }`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-[1000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ 
            background: 'var(--bgCard, #ffffff)', 
            border: '1px solid var(--border, #f3f4f6)',
            color: 'var(--text, #111827)'
          }}>
          <div className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border, #f3f4f6)', background: 'var(--bg, #f9fafb)' }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text, #111827)' }}>
              <ShieldAlert size={18} className="text-blue-600" />
              Admin Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-sm">Fetching alerts...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center text-gray-400">
                <CheckCircle size={32} className="text-green-500 mb-3 opacity-20" />
                <p className="text-sm font-medium">All systems clear!</p>
                <p className="text-xs">No pending admin alerts.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border, #f3f4f6)' }}>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`p-4 cursor-pointer transition-colors flex gap-3 relative group ${
                      !n.isRead ? 'bg-blue-50/10' : 'hover:bg-gray-50/10'
                    }`}
                  >
                    {!n.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm leading-tight ${!n.isRead ? 'font-bold' : 'opacity-80'}`}
                           style={{ color: 'var(--text, #111827)' }}>
                          {n.message}
                        </p>
                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getPriorityColor(n.priority)}`} />
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] opacity-50 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(n.createdAt)}
                        </span>
                        <span className="capitalize">{n.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t" style={{ borderColor: 'var(--border, #f3f4f6)', background: 'var(--bgCard, #ffffff)' }}>
            <button 
              onClick={() => {
                router.push("/admin/moderation"); // Redirect to moderation as it's the main admin task
                setIsOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 group"
            >
              View All Notifications
              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
