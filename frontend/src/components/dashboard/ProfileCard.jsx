"use client";

import React from "react";
import { User, ShieldCheck, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";

const ProfileCard = () => {
  const { points } = usePoints();
  const { user, loading } = useProfile();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
      <div className="flex items-center gap-4">
        {/* Avatar Placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0 font-bold text-xl overflow-hidden border-2 border-white">
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
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-900 text-lg truncate">
              {user?.name || "Your Name"}
            </h3>
            <ShieldCheck size={18} className="text-blue-500 shrink-0" />
          </div>
          <p className="text-sm font-medium text-slate-500 truncate mb-2">
            {user?.headline || user?.role || "Add your headline"}
          </p>
          
          <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
            <Star className="text-amber-500 fill-amber-500 w-3 h-3" />
            <span className="text-xs font-bold text-amber-700">{points} pts</span>
          </div>
        </div>
        
        <Link 
          href="/profile"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
        >
          View Profile
          <ChevronRight size={16} />
        </Link>
      </div>
      
      {/* Mobile View Profile Button */}
      <Link 
        href="/profile"
        className="flex sm:hidden items-center justify-center gap-1.5 w-full mt-5 px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        View Profile
        <ChevronRight size={16} />
      </Link>
    </div>
  );
};

export default ProfileCard;
