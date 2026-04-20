"use client";

import React from "react";
import { ShieldAlert, LogOut, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function BlockedPage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md">
          <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Access Restricted</h1>
        <p className="text-slate-500 leading-relaxed mb-8">
          Your account has been blocked due to repeated policy violations or multiple community reports.
          If you believe this is a mistake, please contact our support team.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = "mailto:support@bizcircle.com"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <MessageCircle size={18} /> Contact Support
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-6 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          Error Code: SEC_POLICY_VIOLATION_BLOCKED
        </p>
      </div>
    </div>
  );
}
