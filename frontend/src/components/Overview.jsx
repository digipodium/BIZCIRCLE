"use client";

import { MapPin, Users, Zap } from "lucide-react";

const skills = [
  "React.js", "Next.js", "Node.js", "TypeScript", "Tailwind CSS",
  "MongoDB", "PostgreSQL", "REST APIs", "Git", "Figma",
];

const circles = [
  { name: "WebDev Delhi", domain: "Web Development", location: "New Delhi", members: 128, color: "blue" },
  { name: "Frontend Mumbai", domain: "Frontend Dev", location: "Mumbai", members: 94, color: "indigo" },
  { name: "JS Bangalore", domain: "JavaScript", location: "Bangalore", members: 210, color: "violet" },
];

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
};

export default function Overview() {
  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Bio */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">About</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Final-year B.Tech CSE student passionate about building scalable web products. 
          I love turning ideas into reality through clean, maintainable code. 
          Currently exploring full-stack development with a focus on performance and great UX.
          Open to collaborations, internships, and referral opportunities within my circles.
        </p>
      </div>

      {/* Current Role */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Current Position</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
            G
          </div>
          <div>
            <p className="font-semibold text-slate-800">Frontend Intern</p>
            <p className="text-sm text-slate-500">Growthify Pvt. Ltd. · Hybrid · 2024–Present</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 font-bold border border-slate-100">
            DU
          </div>
          <div>
            <p className="font-semibold text-slate-700">Delhi University, NSIT</p>
            <p className="text-xs text-slate-400">B.Tech CSE · 2021–2025 · CGPA: 8.7</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Skills</h2>
        </div>
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
      </div>

      {/* Circles Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">My Circles</h2>
          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">3 / 3</span>
        </div>
        <div className="grid gap-3">
          {circles.map((circle) => {
            const c = colorMap[circle.color];
            return (
              <div
                key={circle.name}
                className={`flex items-center gap-3 rounded-xl p-3 ${c.bg} border border-transparent hover:border-blue-200 transition-all duration-200 hover:scale-[1.01] cursor-pointer`}
              >
                <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${c.text}`}>{circle.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {circle.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Users size={11} />
                  <span>{circle.members}</span>
                </div>
              </div>
            );
          })}
        </div>
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