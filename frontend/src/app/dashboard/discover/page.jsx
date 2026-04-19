"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CircleList from "@/components/dashboard/CircleList";
import PeopleList from "@/components/dashboard/PeopleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useProfile } from "@/lib/useProfile";
import api from "@/lib/axios";
import { Search, X, Users, Globe } from "lucide-react";

const DiscoverCirclesPage = () => {
  const { user } = useProfile();
  const [activeTab, setActiveTab] = useState("communities"); // 'communities' or 'people'
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { search: searchTerm };
        
        if (activeTab === "communities") {
          // Fetch Circles and Groups in parallel
          const [circlesRes, groupsRes] = await Promise.all([
            api.get("/api/circles", { params }),
            api.get("/api/groups", { params })
          ]);
          
          const circles = (circlesRes.data || []).map(c => ({ ...c, type: 'circle' }));
          const groups = (groupsRes.data || []).map(g => ({ ...g, type: 'group' }));
          
          const combined = [...circles, ...groups];
          
          // Filter out what the user is already in
          const joinedCircleIds = user?.circles?.map(c => c._id || c) || [];
          const joinedGroupIds = user?.joinedGroups?.map(g => g._id || g) || [];
          
          const filtered = combined.filter(item => {
            if (item.type === 'circle') return !joinedCircleIds.includes(item._id);
            return !joinedGroupIds.includes(item._id);
          });
          
          setItems(filtered);
        } else {
          // Fetch People
          const { data } = await api.get("/user/all", { params });
          setItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch discovery data:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (user) fetchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [user, searchTerm, activeTab]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 mt-12 lg:mt-0">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Discover</h1>
            <p className="text-slate-500 font-medium text-lg mb-8">
              Expand your network and join professional communities.
            </p>

            {/* Tabs & Search Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button
                  onClick={() => { setActiveTab("communities"); setSearchTerm(""); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "communities" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Globe size={18} /> Communities
                </button>
                <button
                  onClick={() => { setActiveTab("people"); setSearchTerm(""); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "people" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Users size={18} /> People
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder={activeTab === 'communities' ? "Search circles & groups..." : "Search people by name or headline..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-700 font-semibold"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              {activeTab === "communities" ? (
                <CircleList 
                  title="Suggested Communities" 
                  circles={items} 
                  loading={loading}
                />
              ) : (
                <PeopleList 
                  title="Professionals to Follow" 
                  people={items} 
                  loading={loading}
                />
              )}
            </div>

            <div className="space-y-8">
              <ProfileCard />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscoverCirclesPage;

