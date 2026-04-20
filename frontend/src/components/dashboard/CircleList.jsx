import React, { useState } from "react";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";
import { Users, MapPin, ChevronRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const CircleCard = ({ _id, name, domain, location, members, isJoined, icon, color, description, memberCount, type }) => {
  const { earnPoints } = usePoints();
  const { fetchProfile } = useProfile();
  const [joined, setJoined] = useState(isJoined);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (joined || isJoining) return;
    
    setIsJoining(true);
    try {
      const endpoint = type === 'group' ? `/group/${_id}/join` : "/api/circles/join";
      const payload = type === 'group' ? {} : { circleId: _id };
      
      await api.post(endpoint, payload);
      setJoined(true);
      earnPoints(10, `Joining ${name}`);
      await fetchProfile(); // Refresh global user stats
    } catch (err) {
      console.error("Failed to join community:", err);
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to join community");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Link 
      href={`/dashboard/circles/${_id}`}
      className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl ${color || 'bg-blue-600'} text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-100`}>
          {icon || name.charAt(0)}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
            {domain}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{name}</h3>
      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 min-h-[40px]">
        {description || "Building a stronger professional community."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {i === 3 ? `+${memberCount || members?.length || 0}` : ''}
            </div>
          ))}
        </div>
        
        <div className={`
          flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all
          ${joined 
            ? "text-blue-600 group-hover:translate-x-1" 
            : "bg-blue-600 text-white shadow-md shadow-blue-100"}
        `}>
          {joined ? (
            <>View Details <ChevronRight size={14} /></>
          ) : (
            <>Join Circle <Plus size={14} /></>
          )}
        </div>
      </div>
    </Link>
  );
};

const CircleList = ({ title, circles, showLimitMessage, id, loading }) => {
  return (
    <section id={id} className="mb-10 pt-4 -mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {showLimitMessage && (
          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Expand your network within your domain
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : circles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {circles.map((circle, i) => (
            <CircleCard key={circle._id || i} {...circle} isJoined={title === "My Circles"} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl py-12 text-center border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-sm">No circles found to display.</p>
        </div>
      )}
    </section>
  );
};

export default CircleList;
