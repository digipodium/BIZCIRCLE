import React, { useState } from "react";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";
import { Users, MapPin, ChevronRight, Plus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const CircleCard = ({ _id, name, domain, location, members, isJoined: propIsJoined, icon, color, description, memberCount, type, createdBy, membershipRole }) => {
  const { earnPoints } = usePoints();
  const { user, fetchProfile } = useProfile();
  const [joined, setJoined] = useState(propIsJoined);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = user?.role?.toLowerCase() === 'admin' || 
                    membershipRole === 'Admin' ||
                    (createdBy && (createdBy._id || createdBy) === user?.id) ||
                    (createdBy && (createdBy._id || createdBy) === user?._id);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/circles/${_id}`);
      await fetchProfile(); // Refresh dashboard data
    } catch (err) {
      console.error("Failed to delete circle:", err);
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to delete circle");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleJoin = async () => {
    if (joined || isJoining) return;

    setIsJoining(true);
    try {
      const endpoint = "/api/circles/join";
      const payload = { circleId: _id };

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
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
            {domain}
          </span>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Circle"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          )}
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
