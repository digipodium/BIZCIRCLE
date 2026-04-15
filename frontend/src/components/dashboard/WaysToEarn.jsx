"use client";

import React, { useState } from "react";
import { 
  UserCircle, 
  Link2, 
  Rocket, 
  Briefcase, 
  UserPlus, 
  Star,
  Send
} from "lucide-react";
import { usePoints } from "@/context/PointsContext";
import api from "@/lib/axios";

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
  const [referring, setReferring] = useState(false);
  const { earnPoints } = usePoints();

  const handleReferral = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    setReferring(true);
    try {
      await api.post("/api/referrals", { 
        candidateEmail: email,
        candidateName: email.split('@')[0], // Fallback name
        message: "Referred via Dashboard quick link"
      });
      earnPoints(30, "Refer a friend");
      e.target.reset();
      alert("Referral sent successfully!");
    } catch (err) {
      console.error("Referral error:", err);
      alert(err.response?.data?.message || "Failed to send referral");
    } finally {
      setReferring(false);
    }
  };

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

      {/* Referral Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-2">Refer a friend & earn 30 pts</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Grow the BizCircle community and get rewarded. Share your unique referral link or enter their email below.
            </p>
          </div>
          
          <form onSubmit={handleReferral} className="flex-1 w-full max-w-md">
            <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
              <input 
                required
                type="email" 
                placeholder="friend@email.com" 
                className="flex-1 bg-transparent px-4 py-3 placeholder:text-blue-200 outline-none text-white text-sm"
              />
              <button 
                type="submit"
                disabled={referring}
                className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                {referring ? 'Sending...' : (
                  <>Send <Send size={16} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WaysToEarn;
