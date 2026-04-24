"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CircleList from "@/components/dashboard/CircleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useProfile } from "@/lib/useProfile";
import { Plus, Compass } from "lucide-react";
import Link from "next/link";
import CreateCircleModal from "@/components/dashboard/CreateCircleModal";

const MyCirclesPage = () => {
  const { user, loading } = useProfile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-12 lg:mt-0">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">My Circles</h1>
              <p className="text-slate-500 font-medium text-lg">
                Manage the professional communities you belong to.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/circles"
                className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <Compass size={18} /> Explore More
              </Link>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Plus size={18} /> Create Circle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <CircleList 
                title="Active Circles" 
                circles={user?.joinedGroups || []} 
                loading={loading}
              />
            </div>

            <div className="space-y-8">
              <ProfileCard />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>

      <CreateCircleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default MyCirclesPage;
