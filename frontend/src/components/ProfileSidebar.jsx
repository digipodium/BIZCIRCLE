"use client";

import { MapPin, Edit3, Share2, Users, GitBranch, Award, Star } from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import { usePoints } from "@/context/PointsContext";
import Link from "next/link";

export default function ProfileSidebar() {
  const { user, loading } = useProfile();
  const { points } = usePoints();

  // Build initials from name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const totalJoined = (user?.circles?.length || 0) + (user?.joinedGroups?.length || 0);

  const stats = [
    { label: "Circles Joined", value: user?.circles?.length ?? "—", icon: GitBranch, color: "text-blue-600" },
    { label: "Connections", value: user?.connections?.length ?? 0, icon: Users, color: "text-emerald-600" },
  ];

  const quickLinks = [
    user?.github && { label: user.github, icon: "⌥" },
    user?.linkedin && { label: user.linkedin, icon: "in" },
    user?.website && { label: user.website, icon: "🌐" },
  ].filter(Boolean);

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-visible pt-2 pb-6 px-5">
        {/* Avatar Area */}
        <div className="flex justify-center -mt-14 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white overflow-hidden">
              {loading ? (
                "..."
              ) : user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
          </div>
        </div>

        {/* BizPoints Badge (Integrated) */}
        <div className="flex justify-center mb-5">
          <div className="bg-amber-50 border border-amber-100/60 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm shadow-amber-900/5 animate-fadeIn">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shadow-sm">
              <Star className="text-slate-900 fill-slate-900 w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider leading-tight">BizPoints Balance</p>
              <p className="text-base font-bold text-slate-900 leading-none">{points}</p>
            </div>
          </div>
        </div>

        {/* Name & Headline */}
        <div className="text-center mb-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-5 bg-slate-100 rounded-full w-32 mx-auto animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-full w-48 mx-auto animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                {user?.name || "Your Name"}
              </h1>
              <p className="text-sm text-blue-600 font-medium mt-0.5">
                {user?.headline || user?.category || "Add your headline"}
              </p>
              {user?.location && (
                <div className="flex items-center justify-center gap-1 mt-2 text-slate-400 text-xs">
                  <MapPin size={12} />
                  <span>{user.location}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-5">
          <Link href="/profile/edit" className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl py-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm shadow-blue-200">
            <Edit3 size={14} />
            Edit Profile
          </Link>
          <button className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl px-3 py-2.5 transition-all duration-200">
            <Share2 size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* Stats */}
        <div className="space-y-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center justify-between group hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-white flex items-center justify-center ${color} transition-colors`}>
                  <Icon size={15} />
                </div>
                <span className="text-sm text-slate-600">{label}</span>
              </div>
              <span className={`text-base font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Domain Badge */}
        {user?.organization && (
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold mb-1">Organization</p>
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {user.organization}
            </span>
          </div>
        )}
      </div>

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-3">Quick Links</p>
          <div className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={`https://${link.label}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
              >
                <span className="text-xs font-mono bg-slate-50 rounded px-1.5 py-0.5 group-hover:bg-blue-50 transition-colors">
                  {link.icon}
                </span>
                <span className="truncate text-xs">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}