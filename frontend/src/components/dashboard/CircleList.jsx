import React, { useState } from "react";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";
import { Users, MapPin, ChevronRight, Plus, Loader2 } from "lucide-react";
import api from "@/lib/axios";

const CircleCard = ({ _id, name, domain, location, members, isJoined }) => {
  const { earnPoints } = usePoints();
  const { fetchProfile } = useProfile();
  const [joined, setJoined] = useState(isJoined);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (joined || isJoining) return;
    
    setIsJoining(true);
    try {
      await api.post("/api/circles/join", { circleId: _id });
      setJoined(true);
      earnPoints(10, `Joining ${name}`);
      await fetchProfile(); // Refresh global user stats
    } catch (err) {
      console.error("Failed to join circle:", err);
      alert(err.response?.data?.error || "Failed to join circle");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Users size={24} />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 truncate max-w-[120px]">
          {domain}
        </span>
      </div>
      
      <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{name}</h3>
      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
        <MapPin size={14} className="shrink-0" />
        <span className="truncate">{location}</span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">+{members?.length || members || 0} members</span>
        </div>
        
        <button 
          onClick={handleJoin}
          disabled={isJoining}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all
            ${joined 
              ? "bg-slate-50 text-slate-600 hover:bg-slate-100" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"}
          `}
        >
          {isJoining ? (
            <Loader2 size={14} className="animate-spin" />
          ) : joined ? (
            <>View <ChevronRight size={14} /></>
          ) : (
            <>Join <Plus size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
};

const CircleList = ({ title, circles, showLimitMessage, id, loading }) => {
  return (
    <section id={id} className="mb-10 pt-4 -mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {showLimitMessage && (
          <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            You can join up to 3 circles in similar domains
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
