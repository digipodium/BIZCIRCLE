"use client";

import React, { useState, useMemo } from "react";
import {
  Bell, Trash2, CheckCheck, RefreshCw, X,
  Users, Briefcase, Calendar, Trophy, Megaphone,
  Clock, MessageCircle, GitMerge, Zap, ArrowRight,
  Eye, EyeOff, Star, TrendingUp
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
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

const NotifCard = ({ notif, onRead, onUnread, onDelete, isNew }) => {
  const cat   = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.reminder;
  const pri   = PRIORITY_CONFIG[notif.priority] || PRIORITY_CONFIG.medium;
  const Icon  = cat.icon;
  const unread = !notif.isRead;

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
      onClick={() => unread && onRead(notif._id)}
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

const StatCard = ({ icon: Icon, label, value, sub, gradient, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      group w-full text-left p-4 rounded-2xl border transition-all duration-200
      hover:shadow-lg hover:-translate-y-0.5
      ${active
        ? "border-transparent shadow-lg shadow-blue-100 scale-[1.02]"
        : "bg-white border-slate-100 hover:border-slate-200"
      }
    `}
    style={active ? { background: gradient } : {}}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all ${active ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"}`}>
      <Icon size={16} className={active ? "text-white" : "text-slate-600"} />
    </div>
    <p className={`text-2xl font-black leading-none ${active ? "text-white" : "text-slate-900"}`}>{value}</p>
    <p className={`text-[11px] font-semibold mt-1 ${active ? "text-white/80" : "text-slate-500"}`}>{label}</p>
    {sub && <p className={`text-[10px] mt-0.5 ${active ? "text-white/60" : "text-slate-400"}`}>{sub}</p>}
  </button>
);

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────

const EmptyState = ({ filter }) => {
  const states = {
    all:    { emoji: "🎉", title: "You're all caught up!", body: "No notifications yet. Stay active in your circles to see updates here.", cta: "Explore Circles", href: "/dashboard/discover" },
    unread: { emoji: "✅", title: "Nothing unread!", body: "You've read everything. Great job staying on top of things.", cta: "See all activity", href: "/dashboard" },
    high:   { emoji: "🛡️", title: "No urgent notifications", body: "You have no high-priority items right now. Everything's smooth.", cta: "Check opportunities", href: "/dashboard" },
  };
  const s = states[filter] || states.all;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      {/* Animated ring */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center animate-pulse">
          <span className="text-5xl">{s.emoji}</span>
        </div>
        <div className="absolute inset-0 rounded-full ring-2 ring-blue-200 ring-offset-4 animate-ping opacity-20" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">{s.body}</p>
      <Link
        href={s.href}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
      >
        {s.cta} <ArrowRight size={14} />
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

  const [activeFilter, setActiveFilter]     = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [newIds]                            = useState(new Set()); // track real-time arrivals

  // Stat card click → set quick filter
  const statCards = [
    {
      icon: Bell, label: "Total",   value: notifications.length,
      sub: "all time",             gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
      filter: "all",
    },
    {
      icon: Star, label: "Unread",  value: unreadCount,
      sub: "need attention",        gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
      filter: "unread",
    },
    {
      icon: Zap,  label: "Urgent",  value: notifications.filter(n => n.priority === "high").length,
      sub: "high priority",         gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
      filter: "high",
    },
    {
      icon: TrendingUp, label: "Read", value: notifications.length - unreadCount,
      sub: "completed",             gradient: "linear-gradient(135deg,#10b981,#059669)",
      filter: "all",  // clicking read → show all
    },
  ];

  // Filtered list
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === "unread" && n.isRead) return false;
      if (activeFilter === "high"   && n.priority !== "high") return false;
      if (activeCategory !== "all"  && n.category !== activeCategory) return false;
      return true;
    });
  }, [notifications, activeFilter, activeCategory]);

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
    notifications.reduce((acc, n) => { acc[n.category] = (acc[n.category] || 0) + 1; return acc; }, {}),
    [notifications]
  );

  const activeCats = Object.keys(catCounts);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* ── Sticky Header ─────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm w-full">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Bell className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 leading-none">Notifications</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {unreadCount > 0 ? (
                  <span className="text-blue-600 font-semibold">{unreadCount} new</span>
                ) : "All caught up"}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 active:scale-95 transition-all"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
          </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Stat Cards ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {statCards.map((s) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
              sub={s.sub}
              gradient={s.gradient}
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
            const cfg      = CATEGORY_CONFIG[cat];
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
          <EmptyState filter={activeFilter} />
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
