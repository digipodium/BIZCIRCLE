"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, Mail, Briefcase, Globe, Info, Clock, CheckCircle2, ShieldCheck, Send, Loader2 } from "lucide-react";

import api from "@/lib/axios";
import { useProfile } from "@/lib/useProfile";

export default function ReferralList({ referrals, type, onUpdate }) {
  const { fetchProfile } = useProfile();
  const [actionLoading, setActionLoading] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/api/referrals/${id}/status`, { status });
      await fetchProfile();
      onUpdate();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResend = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/api/referrals/${id}/resend`);
      alert("Verification email resent to candidate!");
    } catch (err) {
      console.error("Failed to resend:", err);
      alert(err.response?.data?.message || "Failed to resend email");
    } finally {
      setActionLoading(null);
    }
  };

  if (referrals.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
          <UserPlus size={32} />
        </div>
        <p className="text-slate-500 font-medium">No {type} referrals found.</p>
        <p className="text-xs text-slate-400 mt-1">When you log or receive a referral, it will appear here.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-600 border-amber-100",
      Verified: "bg-blue-50 text-blue-600 border-blue-100",
      Successful: "bg-green-50 text-green-600 border-green-100",
      Rejected: "bg-red-50 text-red-600 border-red-100",
      Expired: "bg-slate-100 text-slate-500 border-slate-200"
    };
    return (
      <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {referrals.map((ref) => (
        <div key={ref._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center font-bold">
                {ref.candidateName[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">{ref.candidateName}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                   <Clock size={10} /> {formatDistanceToNow(new Date(ref.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            {getStatusBadge(ref.status)}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail size={12} className="text-slate-400" />
              <span>{ref.candidateEmail}</span>
            </div>
            {ref.role && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Briefcase size={12} className="text-slate-400" />
                <span>{ref.role}</span>
              </div>
            )}
            {ref.targetCircle && (
              <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                <Globe size={12} />
                <span>{ref.targetCircle.name}</span>
              </div>
            )}
          </div>

          {ref.message && (
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 italic flex gap-2 mb-4">
              <Info size={12} className="shrink-0 mt-0.5 text-slate-400" />
              <span>&quot;{ref.message}&quot;</span>
<<<<<<< HEAD
=======
            </div>
          )}

          {ref.status === 'Verified' && ref.verifiedAt && (
            <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-bold uppercase mb-4">
              <ShieldCheck size={12} /> Verified by Candidate
>>>>>>> a9f8f002775334877bb039486d216a68adc064dd
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {type === 'shared' ? 'To: ' : 'From: '}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {type === 'shared' 
                     ? (ref.receiver?.name || "Anonymous") 
                     : (ref.sender?.name || "Anonymous")}
                </span>
             </div>

             <div className="flex gap-2">
               {type === 'shared' && ref.status === 'Pending' && (
                 <button 
                   disabled={actionLoading === ref._id}
                   onClick={() => handleResend(ref._id)}
                   className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-[10px] font-bold uppercase transition-colors"
                 >
                   {actionLoading === ref._id ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                   Resend Verify
                 </button>
               )}

               {type === 'received' && ref.status === 'Verified' && (
                 <button 
                   disabled={actionLoading === ref._id}
                   onClick={() => handleStatusUpdate(ref._id, 'Successful')}
                   className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-100"
                 >
                   {actionLoading === ref._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                   Mark Success
                 </button>
               )}

               {type === 'received' && ref.status === 'Pending' && (
                 <div className="text-[10px] text-slate-400 font-bold italic py-1.5">
                   Awaiting Candidate...
                 </div>
               )}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
