"use client";

import React from "react";
import { usePoints } from "@/context/PointsContext";
import { Star, X } from "lucide-react";

const PointsToast = () => {
  const { lastEarned } = usePoints();

  if (!lastEarned) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/20">
          <Star className="text-slate-900 fill-slate-900 w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-amber-400">+{lastEarned.amount} BizPoints!</p>
          <p className="text-xs text-slate-400 font-medium">Earned for: {lastEarned.reason}</p>
        </div>
      </div>
    </div>
  );
};

export default PointsToast;
