"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Calendar, Video, ArrowRight, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function UpcomingMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await api.get("/api/my-meetings");
        setMeetings(data);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden relative group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">Your Meetings</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Upcoming Sessions</p>
        </div>
        <Link href="/dashboard/referrals" className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
          <ArrowRight size={20} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const date = new Date(meeting.dateTime);
            const isLive = Math.abs(date - new Date()) < 15 * 60 * 1000; // 15 mins window

            return (
              <div key={meeting._id} className="p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all relative group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-center shadow-sm border border-slate-100 min-w-[45px]">
                       <div className="text-[9px] uppercase font-black text-blue-600">{date.toLocaleString('default', { month: 'short' })}</div>
                       <div className="text-lg font-black text-slate-800 leading-none">{date.getDate()}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{meeting.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight flex items-center gap-1">
                        <Clock size={10} /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {isLive && (
                    <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full" /> LIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                     {meeting.targetId?.icon || '⭐'} {meeting.targetId?.name}
                  </div>
                  {meeting.meetingLink && (
                    <a 
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center"
                    >
                      <Video size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
           <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
           <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No meetings scheduled</p>
           <p className="text-[10px] text-slate-400 mt-1">Join a circle to see upcoming events.</p>
        </div>
      )}
    </div>
  );
}
