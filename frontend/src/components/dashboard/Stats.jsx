"use client";

import React from "react";
import { Users, Link2, UserPlus } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
      </div>
    </div>
  </div>
);

const Stats = () => {
  const { user } = useProfile();
  
  const stats = [
    { 
      label: "Circles Joined", 
      value: `${user?.circles?.length || 0}/3`, 
      icon: Users, 
      color: "bg-blue-600" 
    },
    { 
      label: "Connections", 
      value: user?.connections?.length || "0", 
      icon: Link2, 
      color: "bg-indigo-600" 
    },
    { 
      label: "Referrals", 
      value: user?.referralsGiven || "0", 
      icon: UserPlus, 
      color: "bg-sky-600" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default Stats;
