"use client";

import { useState } from "react";
import { MapPin, Users, Globe, Plus, Check, AlertTriangle, X, Info } from "lucide-react";

const MAX_CIRCLES = 3;

const allCircles = [
  { id: 1, name: "WebDev Delhi", domain: "Web Development", location: "New Delhi", members: 128, joined: true, color: "blue" },
  { id: 2, name: "Frontend Mumbai", domain: "Frontend Development", location: "Mumbai", members: 94, joined: true, color: "indigo" },
  { id: 3, name: "JS Bangalore", domain: "JavaScript", location: "Bangalore", members: 210, joined: true, color: "violet" },
  { id: 4, name: "React Chennai", domain: "React.js", location: "Chennai", members: 73, joined: false, color: "sky" },
  { id: 5, name: "Finance Hub Delhi", domain: "Finance", location: "New Delhi", members: 156, joined: false, color: "emerald" },
  { id: 6, name: "Marketing Pune", domain: "Digital Marketing", location: "Pune", members: 89, joined: false, color: "amber" },
];

// Domains considered "similar" to Web Development
const SIMILAR_DOMAINS = ["web development", "frontend development", "javascript", "react.js", "ui/ux", "full stack", "software development", "backend development", "app development"];

function isSimilarDomain(domain) {
  return SIMILAR_DOMAINS.some((d) => domain.toLowerCase().includes(d.split(" ")[0].toLowerCase()) || d.includes(domain.toLowerCase().split(" ")[0]));
}

const colorConfig = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500", btn: "bg-blue-600 hover:bg-blue-700" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", btn: "bg-indigo-600 hover:bg-indigo-700" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500", btn: "bg-violet-600 hover:bg-violet-700" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-500", btn: "bg-sky-600 hover:bg-sky-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", btn: "bg-emerald-600 hover:bg-emerald-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500", btn: "bg-amber-600 hover:bg-amber-700" },
};

export default function Circles() {
  const [circles, setCircles] = useState(allCircles);
  const [toast, setToast] = useState(null);

  const joinedCircles = circles.filter((c) => c.joined);
  const availableCircles = circles.filter((c) => !c.joined);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleJoin = (circle) => {
    if (joinedCircles.length >= MAX_CIRCLES) {
      showToast("You can only join up to 3 circles in similar domains.", "error");
      return;
    }
    if (!isSimilarDomain(circle.domain)) {
      showToast(`"${circle.domain}" is not related to your primary domain (Web Development). Circles must belong to the same or closely related domain.`, "domain");
      return;
    }
    setCircles((prev) => prev.map((c) => c.id === circle.id ? { ...c, joined: true } : c));
    showToast(`Successfully joined "${circle.name}"!`, "success");
  };

  const handleLeave = (circle) => {
    setCircles((prev) => prev.map((c) => c.id === circle.id ? { ...c, joined: false } : c));
    showToast(`Left "${circle.name}".`, "info");
  };

  return (
    <div className="space-y-4 animate-fadeInTab relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 text-sm font-medium animate-slideIn border
          ${toast.type === "error" ? "bg-red-50 text-red-700 border-red-200" : ""}
          ${toast.type === "domain" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
          ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
          ${toast.type === "info" ? "bg-slate-50 text-slate-700 border-slate-200" : ""}
        `}>
          {toast.type === "error" && <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />}
          {toast.type === "domain" && <Info size={16} className="flex-shrink-0 mt-0.5" />}
          {toast.type === "success" && <Check size={16} className="flex-shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info size={16} className="flex-shrink-0 mt-0.5" />}
          <span className="leading-snug">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-slate-800 text-base">My Circles</h2>
            <p className="text-xs text-slate-400 mt-0.5">You can join up to 3 circles in the same or closely related domain.</p>
          </div>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${n <= joinedCircles.length ? "bg-blue-600 border-blue-600 text-white scale-110" : "bg-white border-slate-200 text-slate-400"}`}
              >
                {n <= joinedCircles.length ? <Check size={13} /> : n}
              </div>
            ))}
            <span className={`text-xs font-bold ml-1 ${joinedCircles.length >= 3 ? "text-blue-600" : "text-slate-400"}`}>
              {joinedCircles.length}/3
            </span>
          </div>
        </div>

        {joinedCircles.length >= MAX_CIRCLES && (
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <span>You can only join up to 3 circles in similar domains. Leave a circle to join a new one.</span>
          </div>
        )}
      </div>

      {/* Joined Circles */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Joined</h2>
        <div className="space-y-3">
          {joinedCircles.map((circle) => {
            const c = colorConfig[circle.color];
            return (
              <div
                key={circle.id}
                className={`flex items-center gap-4 p-4 rounded-xl ${c.bg} border ${c.border} group hover:shadow-sm transition-all duration-200`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.dot} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {circle.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${c.text}`}>{circle.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className={`${c.badge} px-2 py-0.5 rounded-full font-medium`}>{circle.domain}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{circle.location}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{circle.members} members</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLeave(circle)}
                  className="flex-shrink-0 text-xs font-medium border border-slate-200 hover:border-red-300 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                  Leave
                </button>
              </div>
            );
          })}
          {joinedCircles.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">You haven't joined any circles yet.</p>
          )}
        </div>
      </div>

      {/* Available Circles */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Discover Circles</h2>
        <div className="space-y-3">
          {availableCircles.map((circle) => {
            const c = colorConfig[circle.color];
            const canJoin = isSimilarDomain(circle.domain);
            const limitReached = joinedCircles.length >= MAX_CIRCLES;

            return (
              <div
                key={circle.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm
                  ${!canJoin ? "bg-slate-50 border-slate-100 opacity-70" : `${c.bg} ${c.border}`}`}
              >
                <div className={`w-10 h-10 rounded-xl ${canJoin ? c.dot : "bg-slate-300"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {circle.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-bold text-sm ${canJoin ? c.text : "text-slate-500"}`}>{circle.name}</p>
                    {!canJoin && (
                      <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-medium">Different domain</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className={`${canJoin ? c.badge : "bg-slate-100 text-slate-500"} px-2 py-0.5 rounded-full font-medium`}>{circle.domain}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{circle.location}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{circle.members} members</span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(circle)}
                  disabled={limitReached && canJoin || !canJoin}
                  className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150
                    ${canJoin && !limitReached
                      ? `${c.btn} text-white hover:scale-105 active:scale-95 shadow-sm`
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  <Plus size={12} />
                  Join
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule Box */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <Globe size={20} className="flex-shrink-0 mt-0.5 opacity-80" />
          <div>
            <p className="font-bold text-sm">BizCircle Domain Rule</p>
            <p className="text-xs text-blue-200 mt-1 leading-relaxed">
              All circles you join must belong to the <strong className="text-white">same or closely related domain</strong>. 
              This ensures focused networking and relevant referrals. Your primary domain is set based on your first joined circle.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Web Development", "Frontend Dev", "JavaScript", "React.js"].map((d) => (
                <span key={d} className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full">{d}</span>
              ))}
              <span className="text-[11px] bg-white/10 text-blue-300 px-2 py-0.5 rounded-full">+ related</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInTab { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.3s ease-out both; }
      `}</style>
    </div>
  );
}