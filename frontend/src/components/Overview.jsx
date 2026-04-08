"use client";

import { MapPin, Users, Zap } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

const colorMap = {
  0: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  1: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  2: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
};

export default function Overview() {
  const { user, loading } = useProfile();

  const skills = user?.skills || [];
  const circles = user?.circles || [];
  const bio = user?.bio;

  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Bio */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">About</h2>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-4/6 animate-pulse" />
          </div>
        ) : (
          <p className="text-slate-700 text-sm leading-relaxed">
            {bio || (
              <span className="text-slate-400 italic">
                No bio yet. Add one in Personal Info → Edit.
              </span>
            )}
          </p>
        )}
      </div>

      {/* Current Role */}
      {(user?.role || user?.organization) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Current Position</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
              {user?.organization?.[0]?.toUpperCase() || user?.role?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{user?.role || "—"}</p>
              <p className="text-sm text-slate-500">
                {user?.organization || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Skills</h2>
        </div>
        {loading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-slate-100 rounded-full animate-pulse" />
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100 hover:border-blue-200 transition-all duration-150 cursor-default hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-sm">No skills added yet. Update in Professional Details.</p>
        )}
      </div>

      {/* Circles Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">My Circles</h2>
          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
            {circles.length} joined
          </span>
        </div>
        {loading ? (
          <div className="grid gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : circles.length > 0 ? (
          <div className="grid gap-3">
            {circles.map((circle, i) => {
              const c = colorMap[i % 3];
              return (
                <div
                  key={circle._id || circle.name || i}
                  className={`flex items-center gap-3 rounded-xl p-3 ${c.bg} border border-transparent hover:border-blue-200 transition-all duration-200 hover:scale-[1.01] cursor-pointer`}
                >
                  <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${c.text}`}>{circle.name || "Circle"}</p>
                    {circle.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {circle.location}
                      </p>
                    )}
                  </div>
                  {circle.members !== undefined && (
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Users size={11} />
                      <span>{circle.members}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 italic text-sm text-center py-4">
            You haven&apos;t joined any circles yet.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInTab {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
      `}</style>
    </div>
  );
}