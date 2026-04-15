"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell, X, CheckCheck, ArrowRight,
  Users, Briefcase, Calendar, Trophy,
  Megaphone, Clock, MessageCircle, GitMerge, Zap
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  referral:     { icon: GitMerge,      bg: "bg-violet-500", soft: "bg-violet-50",  text: "text-violet-600",  label: "Referral"     },
  connection:   { icon: Users,         bg: "bg-blue-500",   soft: "bg-blue-50",    text: "text-blue-600",    label: "Connection"   },
  messaging:    { icon: MessageCircle, bg: "bg-emerald-500",soft: "bg-emerald-50", text: "text-emerald-600", label: "Message"      },
  opportunity:  { icon: Briefcase,     bg: "bg-amber-500",  soft: "bg-amber-50",   text: "text-amber-600",   label: "Opportunity"  },
  event:        { icon: Calendar,      bg: "bg-pink-500",   soft: "bg-pink-50",    text: "text-pink-600",    label: "Event"        },
  achievement:  { icon: Trophy,        bg: "bg-yellow-500", soft: "bg-yellow-50",  text: "text-yellow-600",  label: "Achievement"  },
  announcement: { icon: Megaphone,     bg: "bg-red-500",    soft: "bg-red-50",     text: "text-red-600",     label: "Announcement" },
  reminder:     { icon: Clock,         bg: "bg-slate-500",  soft: "bg-slate-50",   text: "text-slate-600",   label: "Reminder"     },
};

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-pink-500 to-pink-700",
  "from-amber-500 to-amber-700",
];

function avatarColor(id = "") {
  return AVATAR_COLORS[(id.charCodeAt(id.length - 1) || 0) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "BC";
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─────────────────────────────────────────────────────────────
// SINGLE ROW IN DROPDOWN
// ─────────────────────────────────────────────────────────────

const DropdownRow = ({ notif, onRead, onDelete }) => {
  const cat   = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.reminder;
  const Icon  = cat.icon;
  const unread = !notif.isRead;
  const senderName = notif.sender?.name || "BizCircle";

  return (
    <div
      onClick={() => unread && onRead(notif._id)}
      className={`
        group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150
        hover:bg-slate-50 border-b border-slate-50 last:border-0
        ${unread ? "bg-blue-50/40" : ""}
      `}
    >
      {/* Unread left bar */}
      {unread && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-blue-500" />
      )}

      {/* Avatar with icon badge */}
      <div className="relative shrink-0">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(notif._id || "")} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}>
          {getInitials(senderName)}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${cat.bg} flex items-center justify-center ring-2 ring-white`}>
          <Icon size={8} className="text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1.5 justify-between">
          <p className={`text-[12.5px] leading-snug flex-1 ${unread ? "font-semibold text-slate-900" : "text-slate-600"}`}>
            {notif.message.length > 80 ? notif.message.slice(0, 80) + "…" : notif.message}
          </p>
          {notif.priority === "high" && (
            <Zap size={11} className="text-red-500 fill-red-400 shrink-0 mt-0.5" />
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-400">{timeAgo(notif.createdAt)}</span>
          <span className={`text-[10px] font-semibold ${cat.text}`}>{cat.label}</span>
        </div>
      </div>

      {/* Delete — hover only */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
        className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <X size={12} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// BELL BUTTON + DROPDOWN
// ─────────────────────────────────────────────────────────────

const NotificationBell = () => {
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead, deleteNotif, loading } = useNotifications();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const recent = notifications.slice(0, 6);

  return (
    <div className="relative" ref={ref}>

      {/* ── Bell Button ───────────────────────────────────── */}
      <button
        id="notification-bell"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open notifications"
        className={`
          relative p-2.5 rounded-xl transition-all duration-200 active:scale-95
          ${open
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-slate-500 border border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 shadow-sm"
          }
        `}
      >
        <Bell size={17} />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className={`
            absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
            bg-red-500 text-white text-[9px] font-black
            rounded-full flex items-center justify-center leading-none
            ring-2 ring-white shadow-sm
            ${unreadCount > 0 ? "animate-bounce" : ""}
          `}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ──────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 z-50 overflow-hidden"
          style={{ animation: "dropIn 0.18s cubic-bezier(.2,.8,.2,1) both" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-blue-600" />
              <span className="font-bold text-[13px] text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <CheckCheck size={12} />
                All read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 bg-slate-200 rounded-full w-3/4" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                      <div className="h-2 bg-slate-100 rounded-full w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 px-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bell size={22} className="text-blue-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">All caught up! 🎉</p>
                <p className="text-xs text-slate-400 text-center">
                  Stay active in your circles — notifications will appear here.
                </p>
              </div>
            ) : (
              recent.map((n) => (
                <DropdownRow
                  key={n._id}
                  notif={n}
                  onRead={markRead}
                  onDelete={deleteNotif}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 py-3 text-[12px] text-blue-600 font-bold border-t border-slate-100 hover:bg-blue-50 transition-colors group"
            >
              View all notifications
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {/* Dropdown animation keyframe */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
