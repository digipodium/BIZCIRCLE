"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Clock, Trash2, Eye, User, MessageSquare, Grid } from 'lucide-react';
import api from '@/lib/axios';

export default function ReportsSection() {
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get('/api/admin/reports');
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId) => {
    try {
      await api.put(`/api/admin/reports/${reportId}/status`, { status: 'Resolved' });
      fetchReports();
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };

  const filteredReports = reports.filter(r => filter === "All" || r.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 animate-pulse">
        <AlertCircle size={48} className="mb-4 animate-spin" />
        <p className="font-bold text-lg">Loading Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Complaints</h1>
        <p className="text-slate-500 font-medium">Review community flags and take action on violations.</p>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
        {['All', 'Pending', 'Resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${
              filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className={`p-4 rounded-2xl flex-shrink-0 ${
                report.type === 'Post' ? 'bg-blue-50 text-blue-600' :
                report.type === 'User' ? 'bg-purple-50 text-purple-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {report.type === 'Post' ? <MessageSquare size={24} /> :
                 report.type === 'User' ? <User size={24} /> :
                 <Grid size={24} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    report.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Report #{report.id}249</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                  {report.type} Violation: <span className="text-blue-600">{report.target}</span>
                </h3>
                <p className="text-slate-500 font-semibold text-sm mb-4">
                  Reason: <span className="text-slate-700 italic">&quot;{report.reason}&quot;</span>
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-xl w-fit">
                  <div className="flex items-center gap-1.5">
                    <User size={14} /> Reported by {report.reporter}
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} /> 2 hours ago
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {report.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleResolve(report.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      <CheckCircle size={14} /> Resolve
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100">
                      <Trash2 size={14} /> Remove Content
                    </button>
                  </>
                )}
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Eye size={14} /> Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">All Clear!</h3>
            <p className="text-slate-500 font-medium">No reports found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
