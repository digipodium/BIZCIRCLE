"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CircleList from "@/components/dashboard/CircleList";
import api from "@/lib/axios";
import { Search, Compass, Loader2, Users, MapPin, Plus } from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import CreateCircleModal from "@/components/dashboard/CreateCircleModal";

const ExploreCirclesPage = () => {
  const { user } = useProfile();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCircles();
  }, [search]);

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/circles?search=${search}`);
      setCircles(data);
    } catch (err) {
      console.error("Error fetching circles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-12 lg:mt-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-100">
                  <Compass size={20} className="text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">Explore Circles</h1>
              </div>
              <p className="text-slate-500 font-medium text-lg ml-1">
                Discover and join professional communities in your domain.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={18} /> Create New Circle
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-10">
            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-[2rem] px-8 py-5 shadow-sm focus-within:shadow-xl focus-within:shadow-blue-50 focus-within:border-blue-200 transition-all">
              <Search className="text-slate-400" size={24} />
              <input 
                type="text"
                placeholder="Search circles by name, industry or location..."
                className="flex-1 bg-transparent outline-none text-slate-800 font-bold text-lg placeholder:text-slate-400 placeholder:font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {loading && <Loader2 className="animate-spin text-blue-500" size={20} />}
            </div>
          </div>

          {/* Circles Grid */}
          <CircleList 
            title={search ? `Search results for "${search}"` : "All Circles"} 
            circles={circles} 
            loading={loading}
          />
        </div>
      </main>

      <CreateCircleModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchCircles();
        }} 
      />
    </div>
  );
};

export default ExploreCirclesPage;
