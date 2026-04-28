"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  GitMerge, Clock, ChevronRight, Loader2,
  ShieldCheck, AlertCircle, CheckCircle2, UserPlus
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const STATUS_STYLES = {
  Pending:    { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-400"  },
  Verified:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100",   dot: "bg-blue-500"   },
  Successful: { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100",  dot: "bg-green-500"  },
  Rejected:   { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-100",    dot: "bg-red-400"    },
  Expired:    { bg: "bg-slate-100", text: "text-slate-500",  border: "border-slate-200",  dot: "bg-slate-400"  },
};

const STATUS_ICONS = {
  Pending:    AlertCircle,
  Verified:   ShieldCheck,
  Successful: CheckCircle2,
  Rejected:   AlertCircle,
  Expired:    Clock,
};

export default function ReceivedReferralsWidget() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/referrals/received")
      .then(res => setReferrals(res.data.slice(0, 3))) // Show latest 3 on dashboard
      .catch(err => console.error("Failed to fetch received referrals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <GitMerge size={14} className="text-violet-600" />
          </div>
          <span className="font-bold text-sm text-slate-800">Received Referrals</span>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <GitMerge size={14} className="text-violet-600" />
          </div>
          <span className="font-bold text-sm text-slate-800">Received Referrals</span>
        </div>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3 border border-slate-100">
            <UserPlus size={22} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No referrals yet</p>
          <p className="text-xs text-slate-400 mt-1">Referrals shared with you will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <GitMerge size={14} className="text-violet-600" />
          </div>
          <span className="font-bold text-sm text-slate-800">Received Referrals</span>
          <span className="bg-violet-100 text-violet-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {referrals.length}
          </span>
        </div>
        <Link
          href="/dashboard/referrals"
          className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:text-blue-700 transition-colors"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>

      {/* Referral Items */}
      <div className="divide-y divide-slate-50">
        {referrals.map((ref) => {
          const style  = STATUS_STYLES[ref.status] || STATUS_STYLES.Pending;
          const Icon   = STATUS_ICONS[ref.status]  || AlertCircle;
          const initials = ref.candidateName
            ? ref.candidateName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
            : "??";

          return (
            <div key={ref._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm shadow-violet-900/20">
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{ref.candidateName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">
                    from <span className="font-semibold text-slate-600">{ref.sender?.name || "Someone"}</span>
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock size={9} /> {formatDistanceToNow(new Date(ref.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {ref.role && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{ref.role}</p>
                )}
              </div>

              {/* Status badge */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${style.bg} ${style.text} ${style.border} shrink-0`}>
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {ref.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <Link
        href="/dashboard/referrals"
        className="flex items-center justify-center gap-1.5 py-3 text-[12px] text-violet-600 font-bold border-t border-slate-50 hover:bg-violet-50 transition-colors group"
      >
        Manage all referrals
        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
