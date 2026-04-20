"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Bell, X, Video, Calendar, ExternalLink } from "lucide-react";

export default function MeetingReminder() {
  const [activeReminders, setActiveReminders] = useState([]);
  const [permission, setPermission] = useState("default");

  const triggerReminder = (meeting) => {
    // 1. Browser Notification
    if (Notification.permission === "granted") {
      new Notification("Upcoming Meeting: " + meeting.title, {
        body: `Starting in 5 minutes! Click to join.`,
        icon: "/logo.png" // assuming a logo exists
      });
    }

    // 2. In-App Toast
    setActiveReminders(prev => {
      if (prev.find(r => r._id === meeting._id)) return prev;
      return [...prev, meeting];
    });
  };

  const removeReminder = (id) => {
    setActiveReminders(prev => prev.filter(r => r._id !== id));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(setPermission);
      }
    }

    const checkMeetings = async () => {
      try {
        const { data } = await api.get("/api/my-meetings");
        const now = new Date();
        
        data.forEach(meeting => {
          const meetingTime = new Date(meeting.dateTime);
          const diffMinutes = (meetingTime - now) / (1000 * 60);

          // If meeting starts in within 5 minutes and hasn't started yet
          if (diffMinutes > 0 && diffMinutes <= 5) {
            triggerReminder(meeting);
          }
        });
      } catch (err) {
        console.error("Reminder check failed:", err);
      }
    };

    const interval = setInterval(checkMeetings, 60000); // Check every minute
    checkMeetings();

    return () => clearInterval(interval);
  }, []);

  if (activeReminders.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[2000] space-y-4 w-full max-w-sm pointer-events-none">
      {activeReminders.map((meeting) => (
        <div 
          key={meeting._id}
          className="pointer-events-auto bg-slate-900 text-white rounded-[2rem] p-6 shadow-2xl border border-white/10 overflow-hidden relative group animate-in slide-in-from-right-10 duration-500"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-blue-500 w-full animate-progress" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Video size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight">Meeting Starting Soon</h4>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Happening in 5 minutes</p>
              </div>
            </div>
            <button 
              onClick={() => removeReminder(meeting._id)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 mb-6 relative z-10">
            <h3 className="text-lg font-bold line-clamp-1">{meeting.title}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
               <Calendar size={12} /> {meeting.targetId?.name || "Professional Community"}
            </p>
          </div>

          <div className="flex gap-2 relative z-10">
            {meeting.meetingLink ? (
              <a 
                href={meeting.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-xs font-black shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                Join Now <ExternalLink size={14} />
              </a>
            ) : (
              <div className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-bold text-white/40 flex items-center justify-center italic">
                No link provided
              </div>
            )}
            <button 
              onClick={() => removeReminder(meeting._id)}
              className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
            >
              Dismiss
            </button>
          </div>

          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
        </div>
      ))}
    </div>
  );
}
