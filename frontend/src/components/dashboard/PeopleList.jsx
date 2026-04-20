"use client";

import React from "react";
import { UserPlus, UserCheck, Loader2, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

const PersonCard = ({ _id, name, headline, profilePicture, domain, location }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={name} 
              className="w-16 h-16 rounded-2xl object-cover shadow-lg shadow-blue-100 border-2 border-white"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-100 border-2 border-white">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-slate-800 truncate">{name}</h3>
          <p className="text-sm text-blue-600 font-bold truncate">@{name.toLowerCase().replace(/ /g, "")}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 font-medium mb-6 line-clamp-2 min-h-[40px]">
        {headline || "Professional Member of BizCircle"}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <Briefcase size={12} className="text-blue-500" />
          {domain || "Tech & Business"}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <MapPin size={12} className="text-blue-500" />
          {location || "Lucknow, India"}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2">
          <UserPlus size={14} /> Connect
        </button>
        <Link 
          href={`/profile/${_id}`}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold flex items-center justify-center"
        >
          View
        </Link>
      </div>
    </div>
  );
};

const PeopleList = ({ title, people, loading }) => {
  return (
    <section className="mb-10 pt-4 -mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {people?.length || 0} Professionals
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : people?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {people.map((person) => (
            <PersonCard key={person._id} {...person} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[2rem] py-16 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
            <UserPlus className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-bold text-lg mb-1">No professionals found</p>
          <p className="text-slate-400 font-medium text-sm">Try expanding your search criteria</p>
        </div>
      )}
    </section>
  );
};

export default PeopleList;
