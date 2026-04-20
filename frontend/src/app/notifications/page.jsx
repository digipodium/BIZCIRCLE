"use client";

import React, { useState, useMemo } from "react";
import {
  Bell, Trash2, CheckCheck, RefreshCw, X,
  Users, Briefcase, Calendar, Trophy, Megaphone,
  Clock, MessageCircle, GitMerge, Zap, ArrowRight,
  Eye, EyeOff, Star, TrendingUp, ShieldAlert, UserPlus, Settings
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useProfile } from "@/lib/useProfile";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  referral:     { icon: GitMerge,      label: "Referral",      bg: "bg-violet-500",  soft: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200", ring: "ring-violet-200" },
  connection:   { icon: Users,         label: "Connection",    bg: "bg-blue-500",    soft: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",   ring: "ring-blue-200"   },
  messaging:    { icon: MessageCircle, label: "Message",       bg: "bg-emerald-500", soft: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200",ring: "ring-emerald-200"},
  opportunity:  { icon: Briefcase,     label: "Opportunity",   bg: "bg-amber-500",   soft: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",  ring: "ring-amber-200"  },
  event:        { icon: Calendar,      label: "Event",         bg: "bg-pink-500",    soft: "bg-pink-50",    text: "text-pink-600",    border: "border-pink-200",   ring: "ring-pink-200"   },
  achievement:  { icon: Trophy,        label: "Achievement",   bg: "bg-yellow-500",  soft: "bg-yellow-50",  text: "text-yellow-600",  border: "border-yellow-200", ring: "ring-yellow-200" },
  announcement: { icon: Megaphone,     label: "Announcement",  bg: "bg-red-500",     soft: "bg-red-50",     text: "text-red-600",     border: "border-red-200",    ring: "ring-red-200"    },
  reminder:     { icon: Clock,         label: "Reminder",      bg: "bg-slate-500",   soft: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200",  ring: "ring-slate-200"  },
};

const ADMIN_CATEGORY_CONFIG = {
  Reports: { icon: ShieldAlert, label: "Reports", bg: "bg-red-500",    soft: "bg-red-50",     text: "text-red-600",     border: "border-red-200",    ring: "ring-red-200"    },
  Users:   { icon: Users,       label: "Users",   bg: "bg-blue-500",   soft: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",   ring: "ring-blue-200"   },
  Groups:  { icon: UserPlus,    label: "Groups",  bg: "bg-emerald-500",soft: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200",ring: "ring-emerald-200" },
  System:  { icon: Settings,    label: "System",  bg: "bg-slate-500",  soft: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200",  ring: "ring-slate-200"  },
};

const ADMIN_TYPE_MAP = {
  user_registered: "Users",
  report_pending:  "Reports",
  user_flagged:    "Reports",
  group_created:   "Groups",
  system_config:   "System",
  test:            "System",
};

const PRIORITY_CONFIG = {
  high:   { label: "Urgent",  bar: "bg-red-500",   badge: "bg-red-100 text-red-600 border-red-200"   },
  medium: { label: "Normal",  bar: "bg-amber-400", badge: "bg-amber-50 text-amber-600 border-amber-200" },
  low:    { label: "Low",     bar: "bg-slate-200", badge: "bg-slate-100 text-slate-500 border-slate-200" },
};

const FILTERS = ["all", "unread", "high"];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getDateGroup(date) {
  const d    = new Date(date);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return "This Week";
  return "Earlier";
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "BC";
}

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-pink-500 to-pink-700",
  "from-amber-500 to-amber-700",
];

function avatarColor(id = "") {
  const n = id.charCodeAt(id.length - 1) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATION CARD
// ─────────────────────────────────────────────────────────────

const NotifCard = ({ notif, onRead, onUnread, onDelete, isNew, isAdmin }) => {
  const adminCat = isAdmin ? ADMIN_TYPE_MAP[notif.type] : null;
  const config = isAdmin ? ADMIN_CATEGORY_CONFIG : CATEGORY_CONFIG;
  const cat = config[adminCat || notif.category] || config.reminder || ADMIN_CATEGORY_CONFIG.System;
  const pri = PRIORITY_CONFIG[notif.priority] || PRIORITY_CONFIG.medium;
  const Icon = cat.icon;
  const unread = !notif.read && !notif.isRead; // Handle both read and isRead field names

  const senderName    = notif.sender?.name || "BizCircle";
  const senderInitials = getInitials(senderName);
  const gradColor     = avatarColor(notif._id || "");

  return (
    <div
      className={`
        group relative flex gap-4 px-5 py-4 rounded-2xl border transition-all duration-300
        hover:shadow-md hover:-translate-y-0.5 cursor-pointer
        ${unread
          ? "bg-gradient-to-r from-blue-50/80 to-white border-blue-100 shadow-sm"
          : "bg-white border-slate-100 hover:border-slate-200"
        }
        ${isNew ? "ring-2 ring-blue-400 ring-offset-1" : ""}
      `}
      onClick={() => {
        if (unread) onRead(notif._id);
        if (isAdmin) console.log("Admin clicked notification:", notif);
      }}
    >
      {/* Priority bar on left edge */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${pri.bar} opacity-${unread ? "100" : "30"}`} />

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradColor} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
          {senderInitials}
        </div>
        {/* Category icon badge */}
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${cat.bg} flex items-center justify-center shadow-sm ring-2 ring-white`}>
          <Icon size={10} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Sender name */}
            <span className={`text-[13px] font-bold ${unread ? "text-slate-900" : "text-slate-700"}`}>
              {senderName}
            </span>
            {/* Category chip inline */}
            <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${cat.soft} ${cat.text} ${cat.border}`}>
              {cat.label}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Priority badge only for high */}
            {notif.priority === "high" && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border bg-red-50 text-red-600 border-red-200">
                <Zap size={9} className="fill-red-500" />
                Urgent
              </span>
            )}
            {/* Unread dot */}
            {unread && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200 shrink-0" />}
          </div>
        </div>

        {/* Message */}
        <p className={`mt-1 text-sm leading-relaxed ${unread ? "text-slate-800" : "text-slate-500"}`}>
          {notif.message}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-[11px] text-slate-400 font-medium">{timeAgo(notif.createdAt)}</span>

          {/* Action buttons - visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {notif.linkTo && (
              <Link
                href={notif.linkTo}
                onClick={(e) => { e.stopPropagation(); !unread || onRead(notif._id); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cat.soft} ${cat.text} hover:brightness-95 transition-all`}
              >
                View <ArrowRight size={10} />
              </Link>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); unread ? onRead(notif._id) : onUnread(notif._id); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title={unread ? "Mark read" : "Mark unread"}
            >
              {unread ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Delete"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DATE GROUP HEADER
// ─────────────────────────────────────────────────────────────

const GroupHeader = ({ label, count }) => (
  <div className="flex items-center gap-3 mb-3 mt-6 first:mt-0">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-slate-100" />
    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// STAT CARD (clickable filter)
// ─────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, active, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`
      group w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-200
      hover:shadow-md hover:-translate-y-0.5
      ${active
        ? `bg-white border-${colorClass}-500 shadow-sm ring-1 ring-${colorClass}-500`
        : "bg-white border-slate-100 hover:border-slate-200"
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${active ? `bg-${colorClass}-50` : "bg-slate-50 group-hover:bg-slate-100"}`}>
        <Icon size={20} className={active ? `text-${colorClass}-600` : "text-slate-500"} />
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${active ? `text-${colorClass}-700` : "text-slate-700"}`}>{label}</p>
        {sub && <p className={`text-[11px] font-medium mt-0.5 ${active ? `text-${colorClass}-500/80` : "text-slate-400"}`}>{sub}</p>}
      </div>
    </div>
    <div className={`text-2xl font-black ${active ? `text-${colorClass}-600` : "text-slate-800"}`}>
      {value}
    </div>
  </button>
);

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────

const EmptyState = ({ filter, isAdmin }) => {
  const states = {
    all: { 
      icon: Bell, 
      title: "You're all caught up!", 
      body: isAdmin 
        ? "No system alerts at the moment. Your platform is running smoothly." 
        : "No notifications yet. Stay active in your circles to see updates here.", 
      cta: isAdmin ? "Admin Dashboard" : "Explore Circles", 
      href: isAdmin ? "/admin" : "/dashboard/discover" 
    },
    unread: { 
      icon: CheckCheck, 
      title: "Nothing unread!", 
      body: isAdmin
        ? "You've reviewed all pending alerts. Great job keeping the platform safe."
        : "You've read everything. Great job staying on top of things.", 
      cta: isAdmin ? "Manage Users" : "See all activity", 
      href: isAdmin ? "/admin/moderation" : "/dashboard" 
    },
    high: { 
      icon: Zap, 
      title: "No urgent alerts", 
      body: isAdmin
        ? "There are no high-priority reports or system errors requiring immediate action."
        : "You have no high-priority items right now. Everything's smooth.", 
      cta: isAdmin ? "System Config" : "Check opportunities", 
      href: isAdmin ? "/admin/system-config" : "/dashboard" 
    },
  };
  const s = states[filter] || states.all;
  const Icon = s.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <Icon size={28} className="text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">{s.body}</p>
      <Link
        href={s.href}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 active:scale-95 transition-all"
      >
        {s.cta} <ArrowRight size={16} />
      </Link>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 animate-pulse">
    <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3 w-24 bg-slate-200 rounded-full" />
        <div className="h-3 w-14 bg-slate-100 rounded-full" />
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full" />
      <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
      <div className="h-3 w-16 bg-slate-100 rounded-full mt-2" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const {
    notifications, unreadCount, loading,
    markRead, markUnread, markAllRead,
    deleteNotif, clearAll, refresh,
  } = useNotifications();
  const { user } = useProfile();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const categoryConfig = isAdmin ? ADMIN_CATEGORY_CONFIG : CATEGORY_CONFIG;

  const [activeFilter, setActiveFilter]     = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [newIds]                            = useState(new Set()); // track real-time arrivals

  // Stat card click → set quick filter
  const statCards = [
    {
      icon: Bell, label: "Total",   value: notifications.length,
      sub: "All time",             colorClass: "blue",
      filter: "all",
    },
    {
      icon: Star, label: "Unread",  value: unreadCount,
      sub: "Needs attention",      colorClass: "amber",
      filter: "unread",
    },
    {
      icon: Zap,  label: "Urgent",  value: notifications.filter(n => n.priority === "high").length,
      sub: "High priority",        colorClass: "red",
      filter: "high",
    },
    {
      icon: CheckCheck, label: "Read", value: notifications.length - unreadCount,
      sub: "Completed",             colorClass: "emerald",
      filter: "all",
    },
  ];

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === "unread" && (n.read || n.isRead)) return false;
      if (activeFilter === "high"   && n.priority !== "high") return false;
      const cat = isAdmin ? ADMIN_TYPE_MAP[n.type] : n.category;
      if (activeCategory !== "all"  && cat !== activeCategory) return false;
      return true;
    });
  }, [notifications, activeFilter, activeCategory, isAdmin]);

  // Group by date
  const grouped = useMemo(() => {
    const order  = ["Today", "Yesterday", "This Week", "Earlier"];
    const groups = {};
    filtered.forEach((n) => {
      const key = getDateGroup(n.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return order.filter((k) => groups[k]).map((k) => ({ label: k, items: groups[k] }));
  }, [filtered]);

  // Category counts for pills
  const catCounts = useMemo(() =>
    notifications.reduce((acc, n) => { 
      const cat = isAdmin ? ADMIN_TYPE_MAP[n.type] : n.category;
      acc[cat] = (acc[cat] || 0) + 1; 
      return acc; 
    }, {}),
    [notifications, isAdmin]
  );

  const activeCats = Object.keys(catCounts);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 mt-12 lg:mt-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
                  <Bell size={18} className="text-white" />
                </div>
              <h1 className="text-3xl font-bold text-slate-900">{isAdmin ? "Admin Notifications" : "Notifications"}</h1>
              </div>
              <p className="text-slate-500 text-sm ml-12">
                {isAdmin ? "Monitor system activity, user reports, and platform updates" : "Stay updated on your connections, opportunities, and rewards"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={refresh}
                className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 bg-white border border-slate-200 transition-all shadow-sm"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md shadow-blue-200 active:scale-95"
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Stat Cards ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <StatCard
                key={s.label}
                icon={s.icon}
                label={s.label}
                value={s.value}
                sub={s.sub}
                colorClass={s.colorClass}
                active={activeFilter === s.filter && s.filter !== "all"}
                onClick={() => setActiveFilter(activeFilter === s.filter ? "all" : s.filter)}
              />
            ))}
          </div>

        {/* ── Quick Filter Pills ───────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {/* All */}
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            All · {notifications.length}
          </button>

          {activeCats.map((cat) => {
            const cfg      = categoryConfig[cat];
            if (!cfg) return null;
            const Icon     = cfg.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? "all" : cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? `${cfg.bg} text-white border-transparent shadow-sm`
                    : `bg-white ${cfg.text} ${cfg.border} hover:${cfg.soft}`
                }`}
              >
                <Icon size={11} />
                {cfg.label} · {catCounts[cat]}
              </button>
            );
          })}

          {/* Unread toggle */}
          <button
            onClick={() => setActiveFilter(activeFilter === "unread" ? "all" : "unread")}
            className={`flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeFilter === "unread"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
            }`}
          >
            {activeFilter === "unread" ? <Eye size={11} /> : <EyeOff size={11} />}
            Unread only
          </button>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={activeFilter} isAdmin={isAdmin} />
        ) : (
          <div>
            {grouped.map(({ label, items }) => (
              <div key={label}>
                <GroupHeader label={label} count={items.length} />
                <div className="space-y-2">
                  {items.map((n) => (
                    <NotifCard
                      key={n._id}
                      notif={n}
                      onRead={markRead}
                      onUnread={markUnread}
                      onDelete={deleteNotif}
                      isNew={newIds.has(n._id)}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Load more hint */}
            {filtered.length >= 20 && (
              <p className="text-center text-xs text-slate-400 mt-8 mb-2">
                Showing {filtered.length} notifications
              </p>
            )}
          </div>
        )}
        </div> {/* end max-w-6xl content wrapper */}
      </main>
    </div>
  );
}
