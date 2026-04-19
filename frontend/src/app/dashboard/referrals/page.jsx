"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import LogReferralModal from "@/components/referrals/LogReferralModal";
import ReferralList from "@/components/referrals/ReferralList";
import api from "@/lib/axios";
import { Plus, Users, Send, Download } from "lucide-react";

export default function ReferralCenterPage() {
  const [activeTab, setActiveTab] = useState("shared");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referrals, setReferrals] = useState({ shared: [], received: [] });
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      const [{ data: sent }, { data: rec }] = await Promise.all([
        api.get("/api/referrals/sent"),
        api.get("/api/referrals/received")
      ]);
      setReferrals({ shared: sent, received: rec });
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 mt-12 lg:mt-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Referral Center</h1>
              <p className="text-slate-500 font-medium text-lg">
                Manage and track the professional value you share in meetings.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <Plus size={20} />
              Log Meeting Referral
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-100 inline-flex shadow-sm">
            <button
              onClick={() => setActiveTab("shared")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "shared" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Send size={16} /> Shared with Others
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "received" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Users size={16} /> Received from Others
            </button>
          </div>

          {/* List Content */}
          <div className="animate-fadeIn">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <ReferralList 
                referrals={activeTab === "shared" ? referrals.shared : referrals.received} 
                type={activeTab} 
                onUpdate={fetchReferrals}
              />
            )}
          </div>

          {/* Quick Tip */}
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
             <div className="relative z-10 text-center md:text-left">
               <h3 className="text-xl font-bold mb-2">Referral Best Practices</h3>
               <p className="text-indigo-100 text-sm max-w-md opacity-90 leading-relaxed">
                 High-quality referrals include specific candidate context and the target role. 
                 They help build your reputation and keep the BizCircle ecosystem thriving.
               </p>
             </div>
             <button className="relative z-10 bg-white text-indigo-700 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2">
               <Download size={16} /> Download CSV Report
             </button>
          </div>
        </div>
      </main>

      <LogReferralModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchReferrals}
      />
    </div>
  );
}
