"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { UserCheck, UserX, Clock, Shield, Search, Loader2 } from "lucide-react";

export default function JoinRequestsTab({ circleId, requests, onAction }) {
  const [processing, setProcessing] = useState(null);

  const handleAction = async (memberId, status) => {
    setProcessing(memberId);
    try {
      await api.put(`/api/circles/${circleId}/members/${memberId}`, { status });
      onAction(); // Refresh data
    } catch (err) {
      console.error("Failed to manage join request:", err);
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCheck size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Inbox Zero!</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">
          There are no pending join requests for this circle at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Pending Requests</h2>
          <p className="text-slate-500 font-medium">Review professionals who want to join your community.</p>
        </div>
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
          {requests.length} Waiting
        </span>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div 
            key={request._id} 
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                {request.user.profilePicture ? (
                  <img 
                    src={request.user.profilePicture} 
                    alt={request.user.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 font-black text-xl">
                    {request.user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center text-white">
                  <Clock size={12} />
                </div>
              </div>
              
              <div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {request.user.name}
                </h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-1">
                  {request.user.headline || "Professional Member"}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <Clock size={10} /> Requested {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleAction(request._id, 'Approved')}
                disabled={processing === request._id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {processing === request._id ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                Approve
              </button>
              <button
                onClick={() => handleAction(request._id, 'Banned')}
                disabled={processing === request._id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <UserX size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
