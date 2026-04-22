"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import api from "@/lib/axios";
import {
  MapPin, Users, Award, GitBranch, Share2, UserPlus, Star, Link as LinkIcon, Briefcase, GraduationCap, Code
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/lib/useProfile";

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { fetchProfile } = useProfile();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/api/user/${id}`);
        setUser(data);
      } catch (err) {
        setError("User not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post(`/user/connect/${id}`);
      setConnected(true);
      fetchProfile();
    } catch {
      setConnected(true); // Optimistic fallback
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Users className="text-slate-400" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Unavailable</h2>
          <p className="text-slate-500 text-sm">{error || "This user does not exist."}</p>
          <button onClick={() => router.back()} className="mt-6 text-blue-600 hover:underline text-sm font-semibold">
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans overflow-y-auto relative pb-12">
        
        {/* Banner */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900/30 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* ── Left Sidebar (Profile Info) ── */}
            <div className="w-full lg:w-72 flex-shrink-0 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                {/* Avatar */}
                <div className="flex justify-center -mt-14 mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                    {initials}
                  </div>
                </div>

                {/* Points Badge */}
                {user.points > 0 && (
                  <div className="flex justify-center mb-5">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-1.5 flex items-center gap-2 shadow-sm">
                      <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                      <span className="text-amber-700 font-bold text-sm">{user.points} Points</span>
                    </div>
                  </div>
                )}

                {/* Name & Headline */}
                <div className="text-center mb-5">
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
                  <p className="text-sm text-blue-600 font-medium mt-0.5">{user.headline || user.category}</p>
                  {user.location && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-slate-400 text-xs">
                      <MapPin size={12} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                {/* Connect Button */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={handleConnect}
                    disabled={connecting || connected}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      connected
                        ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:scale-[1.02] active:scale-95 shadow-blue-200"
                    }`}
                  >
                    {connecting ? "Connecting..." : connected ? "✓ Connected" : <><UserPlus size={16} /> Connect</>}
                  </button>
                  <button className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl px-3 py-2.5 transition-all">
                    <Share2 size={16} />
                  </button>
                </div>

                <div className="border-t border-slate-100 mb-4" />

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors">
                    <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600"><GitBranch size={15} /></div>
                      Circles Joined
                    </div>
                    <span className="font-bold text-blue-600">{user.circles?.length || 0}</span>
                  </div>
                </div>

                {user.organization && (
                  <>
                    <div className="border-t border-slate-100 my-4" />
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold mb-1">Organization</p>
                      <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {user.organization}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Right Content Area ── */}
            <div className="flex-1 min-w-0 pt-0 lg:pt-20 animate-fadeInUp">
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="flex items-center gap-6 px-6 border-b border-slate-100 overflow-x-auto hide-scrollbar">
                  {["Overview", "Circles", "Activity"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.toLowerCase()
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6 lg:p-8">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Bio */}
                      <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About</h2>
                        {user.bio ? (
                          <p className="text-slate-600 text-sm leading-relaxed">{user.bio}</p>
                        ) : (
                          <p className="text-slate-400 text-sm italic">No bio available.</p>
                        )}
                      </section>

                      {/* Skills */}
                      {user.skills?.length > 0 && (
                        <section>
                          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Experience */}
                      {user.experience?.length > 0 && (
                        <section>
                          <h2 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            <Briefcase size={14} /> Experience
                          </h2>
                          <div className="space-y-6">
                            {user.experience.map((exp, i) => (
                              <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-white" />
                                <h3 className="font-bold text-slate-800 text-sm">{exp.role}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-blue-600 font-semibold text-xs">{exp.company}</span>
                                  {exp.period && <span className="text-slate-400 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md">{exp.period}</span>}
                                </div>
                                {exp.desc && <p className="text-slate-500 text-xs mt-2 leading-relaxed">{exp.desc}</p>}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  )}

                  {activeTab === "circles" && (
                    <div>
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Joined Circles</h2>
                      {user.circles?.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {user.circles.map(c => (
                            <div key={c._id} className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-lg">
                                {c.icon || "💼"}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c.domain}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm italic">Not a member of any circles yet.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="text-center py-10">
                      <p className="text-slate-400 text-sm italic">No recent activity.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
