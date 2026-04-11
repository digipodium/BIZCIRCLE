"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Star, MessageSquare, CheckCircle, Loader2, LogOut } from "lucide-react";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

const ActivityItem = ({ title, time, icon: Icon, color }) => (
  <div className="flex gap-4 relative pb-6 last:pb-0">
    {/* Timeline Line */}
    <div className="absolute left-[17px] top-8 bottom-0 w-px bg-slate-100 last:hidden" />
    
    <div className={`w-9 h-9 rounded-full ${color} bg-opacity-10 flex items-center justify-center shrink-0 z-10`}>
      <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
    </div>
    
    <div className="pt-1">
      <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{title}</p>
      <p className="text-xs text-slate-400 font-medium">{time}</p>
    </div>
  </div>
);

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await api.get("/api/feed?limit=5");
        
        const mapped = data.feed.map(act => {
          let icon = CheckCircle;
          let color = "bg-blue-500";
          let title = act.description;

          switch(act.type) {
            case 'circle_joined':
              icon = CheckCircle;
              color = "bg-green-500";
              break;
            case 'circle_left':
              icon = LogOut;
              color = "bg-red-500";
              break;
            case 'referral_sent':
              icon = UserPlus;
              color = "bg-purple-500";
              break;
            default:
              icon = Star;
              color = "bg-amber-500";
          }

          return {
            title,
            time: formatDistanceToNow(new Date(act.createdAt), { addSuffix: true }),
            icon,
            color
          };
        });

        setActivities(mapped);
      } catch (err) {
        console.error("Failed to fetch activity feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs font-medium">Loading activity...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-1">
          {activities.map((activity, i) => (
            <ActivityItem key={i} {...activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400">No recent activity found.</p>
        </div>
      )}
      
      <button className="w-full mt-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default ActivityFeed;
