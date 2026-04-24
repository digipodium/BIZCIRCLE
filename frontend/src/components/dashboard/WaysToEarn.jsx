"use client";

import React, { useState } from "react";
import { 
  UserCircle, 
  Link2, 
  Rocket, 
  Briefcase, 
  Star
} from "lucide-react";
import { usePoints } from "@/context/PointsContext";

const EarnCard = ({ icon: Icon, title, points, action, completed }) => {
  const { earnPoints } = usePoints();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = () => {
    if (completed) return;
    setIsProcessing(true);
    // Simulate process
    setTimeout(() => {
      earnPoints(points, title);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className={`
      relative group bg-white p-5 rounded-2xl border transition-all duration-300
      ${completed ? 'border-green-100 bg-green-50/30' : 'border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1'}
    `}>
      <div className={`
        w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors
        ${completed ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}
      `}>
        <Icon size={20} />
      </div>
      
      <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
      <p className="text-amber-600 font-bold text-xs">+{points} pts</p>
      
      <button 
        onClick={handleAction}
        disabled={completed || isProcessing}
        className={`
          mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all
          ${completed 
            ? 'bg-green-100 text-green-700 cursor-default' 
            : 'bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white'}
        `}
      >
        {isProcessing ? 'Processing...' : completed ? 'Completed ✓' : action}
      </button>
    </div>
  );
};

const WaysToEarn = () => {


  const tasks = [
    { icon: UserCircle, title: "Complete your profile", points: 50, action: "Finalize Profile", completed: true },
    { icon: Link2, title: "Make a new connection", points: 10, action: "Browse People" },
    { icon: Rocket, title: "Join a collaboration", points: 100, action: "Find Projects" },
    { icon: Briefcase, title: "Post an opportunity", points: 25, action: "Create Post" },
    { icon: Star, title: "Endorse a skill", points: 5, action: "Endorse" },
  ];

  return (
    <section className="mt-12 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Ways to Earn BizPoints</h2>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Rewards</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {tasks.map((task, i) => (
          <EarnCard key={i} {...task} />
        ))}
      </div>


    </section>
  );
};

export default WaysToEarn;
