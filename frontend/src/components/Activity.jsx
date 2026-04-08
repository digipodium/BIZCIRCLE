"use client";

import { GitBranch, UserPlus, Star, MessageSquare, Award, Share2, FileText } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "circle_joined",
    icon: GitBranch,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Joined WebDev Delhi circle",
    desc: "You are now a member of WebDev Delhi (Web Development · New Delhi)",
    time: "2 hours ago",
    tag: "Circle",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    type: "referral",
    icon: Award,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Sent a referral to Priya Sharma",
    desc: "Referred Priya for a Frontend Developer role at Growthify Pvt. Ltd.",
    time: "1 day ago",
    tag: "Referral",
    tagColor: "bg-amber-50 text-amber-600",
  },
  {
    id: 3,
    type: "connection",
    icon: UserPlus,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Connected with Rahul Verma",
    desc: "Rahul Verma (UI Designer · Mumbai) accepted your connection request.",
    time: "2 days ago",
    tag: "Connection",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 4,
    type: "post",
    icon: FileText,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Shared a post in Frontend Mumbai",
    desc: '"Top 10 React optimization tricks I learned during my internship" — 34 reactions, 12 comments',
    time: "3 days ago",
    tag: "Post",
    tagColor: "bg-violet-50 text-violet-600",
  },
  {
    id: 5,
    type: "circle_joined",
    icon: GitBranch,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "Joined Frontend Mumbai circle",
    desc: "You are now a member of Frontend Mumbai (Frontend Development · Mumbai)",
    time: "5 days ago",
    tag: "Circle",
    tagColor: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 6,
    type: "endorsement",
    icon: Star,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Received a skill endorsement",
    desc: 'Kiran Mehta endorsed your skill: "React.js" in the JS Bangalore circle.',
    time: "1 week ago",
    tag: "Endorsement",
    tagColor: "bg-rose-50 text-rose-600",
  },
  {
    id: 7,
    type: "referral",
    icon: Share2,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    title: "Received a referral from Ankita Roy",
    desc: "Ankita referred you for a Full Stack Developer internship at TechNova Labs.",
    time: "1 week ago",
    tag: "Referral",
    tagColor: "bg-sky-50 text-sky-600",
  },
  {
    id: 8,
    type: "circle_joined",
    icon: GitBranch,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Joined JS Bangalore circle",
    desc: "You are now a member of JS Bangalore (JavaScript · Bangalore)",
    time: "2 weeks ago",
    tag: "Circle",
    tagColor: "bg-violet-50 text-violet-600",
  },
];

export default function Activity() {
  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Circles Joined", value: "3", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Referrals Given", value: "17", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Connections", value: "284", color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-transparent`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Recent Activity</h2>

        <div className="relative pl-6 space-y-1">
          {/* Timeline line */}
          <div className="absolute left-[9px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-200 via-slate-200 to-slate-100" />

          {activities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="relative group"
                style={{ animationDelay: `${i * 60}ms`, animation: "fadeInRow 0.4s ease-out both" }}
              >
                {/* Timeline dot */}
                <div className={`absolute -left-6 top-4 w-4 h-4 rounded-full ${item.iconBg} border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform`}>
                  <Icon size={8} className={item.iconColor} />
                </div>

                <div className="ml-2 mb-4 p-4 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-transparent hover:border-blue-100 transition-all duration-200 group-hover:shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-2">
          <button className="text-sm text-blue-600 font-semibold hover:underline">Load more activity →</button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInTab { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
        @keyframes fadeInRow { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}