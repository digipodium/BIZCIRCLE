"use client";

import { GitBranch, UserPlus, Star, MessageSquare, Award, Share2, FileText } from "lucide-react";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useProfile } from "@/lib/useProfile";

const getIconData = (type) => {
  switch (type) {
    case "circle_joined": return { icon: GitBranch, iconBg: "bg-blue-100", iconColor: "text-blue-600", tag: "Circle", tagColor: "bg-blue-50 text-blue-600" };
    case "circle_left": return { icon: GitBranch, iconBg: "bg-slate-100", iconColor: "text-slate-600", tag: "Circle", tagColor: "bg-slate-50 text-slate-600" };
    case "referral": 
    case "referral_sent": return { icon: Award, iconBg: "bg-amber-100", iconColor: "text-amber-600", tag: "Referral Sent", tagColor: "bg-amber-50 text-amber-600" };
    case "referral_received": return { icon: Star, iconBg: "bg-purple-100", iconColor: "text-purple-600", tag: "Referral Received", tagColor: "bg-purple-50 text-purple-600" };
    case "connection": return { icon: UserPlus, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", tag: "Connection", tagColor: "bg-emerald-50 text-emerald-600" };
    default: return { icon: FileText, iconBg: "bg-violet-100", iconColor: "text-violet-600", tag: "Activity", tagColor: "bg-violet-50 text-violet-600" };
  }
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return isNaN(d) ? "Just now" : d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Activity() {
  const { user } = useProfile();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get("/api/feed");
        setActivities(data.feed || []);
      } catch (err) {
        console.error("Error fetching activities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Circles Joined", value: user?.circles?.length || "0", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Referrals Given", value: user?.referralsGiven || "0", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Connections", value: user?.connections?.length || "0", color: "text-emerald-600", bg: "bg-emerald-50" },
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

          {loading ? (
            <p className="text-slate-400 italic text-sm py-4">Loading activities...</p>
          ) : activities.length > 0 ? (
            activities.map((item, i) => {
              const info = getIconData(item.type);
              const Icon = info.icon;
              return (
                <div
                  key={item._id}
                  className="relative group"
                  style={{ animationDelay: `${i * 60}ms`, animation: "fadeInRow 0.4s ease-out both" }}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-6 top-4 w-4 h-4 rounded-full ${info.iconBg} border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform`}>
                    <Icon size={8} className={info.iconColor} />
                  </div>

                  <div className="ml-2 mb-4 p-4 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-transparent hover:border-blue-100 transition-all duration-200 group-hover:shadow-sm">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800">{item.description}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${info.tagColor}`}>
                            {info.tag}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400 italic text-sm py-4">No recent activity found.</p>
          )}
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