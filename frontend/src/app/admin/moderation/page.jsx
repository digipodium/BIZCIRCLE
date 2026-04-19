"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import toast from "react-hot-toast";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Eye, 
  CheckCircle, 
  UserX, 
  AlertTriangle,
  Loader2,
  Clock,
  User as UserIcon,
  Search
} from "lucide-react";
import api from "@/lib/axios";

export default function AdminModerationPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/feedback/all");
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
      toast.error("Access denied or server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (reportId, action) => {
    try {
      // action: 'block' or 'ignore'
      const { data } = await api.post(`/api/feedback/${reportId}/moderate`, { action });
      if (data.success) {
        toast.success(data.message);
        fetchReports(); // Refresh
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = 
      r.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.reportedUser?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-blue-600 w-8 h-8" />
                Moderation Panel
              </h1>
              <p className="text-slate-500 mt-1 font-medium">Review and take action on flagged content & reports.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
              {['pending', 'resolved', 'rejected', 'all'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search reports, users, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 outline-none rounded-2xl pl-12 pr-4 py-4 text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
              <p className="text-slate-500 font-bold">Loading moderation queue...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <CheckCircle className="text-emerald-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">All Clear!</h3>
              <p className="text-slate-500 mt-1 font-medium">No pending reports found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredReports.map((report) => (
                <div key={report._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Reporter Info */}
                    <div className="lg:w-48 shrink-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          {report.userId?.profilePicture ? <img src={report.userId.profilePicture} className="w-full h-full object-cover rounded-xl" /> : <UserIcon size={20} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reporter</p>
                          <p className="font-bold text-slate-900 text-sm truncate w-28">{report.userId?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock size={14} />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          report.category === 'report' ? 'bg-red-50 text-red-600' :
                          report.category === 'bug' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {report.category}
                        </span>
                      </div>
                    </div>

                    {/* Report Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                          {report.title || report.type}
                        </h3>
                        {report.reportedUser && (
                          <div className="bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={14} />
                            <span className="text-xs font-bold text-red-700">Reported User: {report.reportedUser.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {report.message}
                        </p>
                      </div>
                      {report.reportedUrl && (
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                          <Eye size={14} />
                          <a href={report.reportedUrl} target="_blank" className="hover:underline">View Flagged Content</a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex flex-col gap-3">
                      {report.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleAction(report._id, 'block')}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100 active:scale-95"
                          >
                            <UserX size={18} /> Block User
                          </button>
                          <button 
                            onClick={() => handleAction(report._id, 'ignore')}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                          >
                            <Trash2 size={18} /> Ignore
                          </button>
                        </>
                      ) : (
                        <div className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold ${
                          report.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {report.status === 'resolved' ? <CheckCircle size={18} /> : <Trash2 size={18} />}
                          <span className="capitalize">{report.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
