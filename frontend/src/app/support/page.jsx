"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import toast from "react-hot-toast";
import { MessageSquareWarning, Bug, Flag, Star, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("feedback");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    type: "Suggestion",
    message: "",
    rating: 0,
    title: "",
    stepsToReproduce: "",
    severity: "Medium",
    reportedUrl: "",
  });

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFetching(false);
        return;
      }
      const { data } = await api.get("/api/feedback/my");
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        category: activeTab,
        ...formData
      };
      if (payload.rating === 0) delete payload.rating;

      const { data } = await api.post("/api/feedback", payload);

      if (data.success) {
        toast.success("Submitted successfully! We'll review it shortly.");
        // Reset form
        setFormData({
          type: activeTab === "feedback" ? "Suggestion" : activeTab === "bug" ? "UI Bug" : "Spam",
          message: "",
          rating: 0,
          title: "",
          stepsToReproduce: "",
          severity: "Medium",
          reportedUrl: "",
        });
        fetchTickets(); // Refresh the list
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.warning) {
        // Show a custom modal or specialized toast for warnings
        toast((t) => (
          <div className="flex items-start gap-3 p-1">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-slate-900 text-sm">Content Warning</p>
              <p className="text-xs text-slate-500 mt-1">{errorData.message}</p>
            </div>
          </div>
        ), { duration: 6000, style: { borderRadius: '16px', border: '1px solid #fef3c7' } });
      } else if (errorData?.blocked) {
        // Interceptor will handle the redirect, but we can show a final toast
        toast.error(errorData.message);
      } else {
        toast.error(errorData?.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFeedbackForm = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Feedback Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="Suggestion">💡 Suggestion</option>
          <option value="Compliment">⭐ Compliment</option>
          <option value="General">📝 General Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Thoughts</label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what you love or what we can improve..."
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Rate your experience (Optional)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
              className={`p-2 transition-all ${formData.rating >= star ? "text-amber-400 scale-110" : "text-slate-200 hover:text-amber-200"}`}
            >
              <Star className="fill-current w-8 h-8" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBugForm = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Issue Title</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Messaging page crashes on mobile"
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Severity</label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="Low">Low - Minor visual glitch</option>
          <option value="Medium">Medium - Feature hard to use</option>
          <option value="High">High - App is broken/crashing</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description & Steps to Reproduce</label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="1. Go to page X... 2. Click button Y... 3. Seeing error..."
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[140px] resize-y"
        />
      </div>
    </div>
  );

  const renderReportForm = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">What are you reporting?</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="Spam">Spam Content</option>
          <option value="Fake Profile">Fake Profile</option>
          <option value="Harassment">Harassment / Abuse</option>
          <option value="Other">Other Policy Violation</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content Link (Optional URL of post or user)</label>
        <input
          type="url"
          name="reportedUrl"
          value={formData.reportedUrl}
          onChange={handleChange}
          placeholder="https://localhost:3000/profile/..."
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Details</label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Please provide context or evidence for this report..."
          className="w-full bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-y"
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 transition-all duration-300 font-sans">
        
        {/* Header */}
        <div className="mb-8 max-w-6xl">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support & Feedback</h1>
          <p className="text-slate-500 mt-2">Help us make BizCircle the best professional networking platform.</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-stretch max-w-6xl">
          
          {/* Main Form Area */}
          <div className="w-full xl:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100 relative overflow-hidden flex flex-col">
             {/* Decorative Background Blur */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
             
             <div className="relative z-10 flex flex-col flex-1 h-full">
                {/* Custom Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => { setActiveTab("feedback"); setFormData({...formData, type: "Suggestion" }) }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'feedback' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    <MessageSquareWarning size={16} /> Send Feedback 
                  </button>
                  <button 
                    onClick={() => { setActiveTab("bug"); setFormData({...formData, type: "UI Bug" }) }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'bug' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    <Bug size={16} /> Report Issue
                  </button>
                  <button 
                    onClick={() => { setActiveTab("report"); setFormData({...formData, type: "Spam" }) }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'report' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    <Flag size={16} /> Flag Content
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                  {activeTab === "feedback" && renderFeedbackForm()}
                  {activeTab === "bug" && renderBugForm()}
                  {activeTab === "report" && renderReportForm()}

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end mt-auto">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Submit Ticket</>}
                    </button>
                  </div>
                </form>
             </div>
          </div>

          {/* Ticket History Sidebar */}
          <div className="w-full xl:w-1/3 flex flex-col">
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100 flex flex-col flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                My Tickets
                <span className="bg-slate-100 text-slate-600 text-xs py-1 px-2.5 rounded-full font-bold">{tickets.length}</span>
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {fetching ? (
                  <div className="flex justify-center py-10 opacity-50"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                      <MessageSquareWarning className="text-slate-300 w-8 h-8" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No tickets submitted yet.</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all cursor-default group">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          ticket.category === 'bug' ? 'bg-red-50 text-red-600' :
                          ticket.category === 'report' ? 'bg-violet-50 text-violet-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {ticket.category}
                        </span>
                        
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                           ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                           ticket.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                           'bg-slate-100 text-slate-500'
                        }`}>
                           {ticket.status}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug line-clamp-1">
                        {ticket.title || ticket.type}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {ticket.message}
                      </p>
                      <div className="mt-3 text-[10px] text-slate-400 font-semibold text-right">
                         {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
}
