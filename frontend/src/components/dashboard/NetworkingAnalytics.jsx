"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { TrendingUp, Activity, BarChart3, Loader2 } from "lucide-react";

export default function NetworkingAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/user/analytics");
        setData(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const maxCount = Math.max(...data.map(d => d.count), 5);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Networking Power</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Activity</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-50 border border-blue-100">
          <TrendingUp size={22} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculating Metrics...</p>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-end justify-between h-40 gap-2 mb-8">
            {data.map((day, idx) => {
              const height = (day.count / maxCount) * 100;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group/bar">
                  <div className="relative w-full flex flex-col items-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-xl pointer-events-none mb-2">
                       {day.count} Activities
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-slate-50 border border-slate-100/50 rounded-xl overflow-hidden relative group-hover/bar:border-blue-200 transition-all flex flex-col justify-end"
                      style={{ height: '160px' }}
                    >
                      <div 
                        className="bg-gradient-to-t from-blue-600 to-indigo-500 w-full rounded-t-lg transition-all duration-700 ease-out"
                        style={{ height: `${height}%` }}
                      >
                         <div className="w-full h-1/2 bg-white/10 blur-xl" />
                      </div>
                    </div>
                  </div>
                  <span className="mt-4 text-[10px] font-black text-slate-400 group-hover/bar:text-blue-600 transition-colors">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                   <Activity size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Total Growth</span>
                </div>
                <div className="text-2xl font-black text-slate-800">
                  +{data.reduce((acc, d) => acc + d.count, 0)}
                </div>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                   <BarChart3 size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Success Rate</span>
                </div>
                <div className="text-2xl font-black text-slate-800">82%</div>
             </div>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl" />
    </div>
  );
}
