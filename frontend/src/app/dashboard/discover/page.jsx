"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CircleList from "@/components/dashboard/CircleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useProfile } from "@/lib/useProfile";
import api from "@/lib/axios";

const DiscoverCirclesPage = () => {
  const { user } = useProfile();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const { data } = await api.get("/api/circles");
        // Filter out circles the user is already in
        const joinedIds = user?.circles?.map(c => c._id || c) || [];
        const filtered = data.filter(c => !joinedIds.includes(c._id));
        setCircles(filtered);
      } catch (err) {
        console.error("Failed to fetch circles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCircles();
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 mt-12 lg:mt-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover Circles</h1>
            <p className="text-slate-500 font-medium text-lg">
              Find new professional communities that match your domain.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <CircleList 
                title="Recommended for You" 
                circles={circles} 
                loading={loading}
                showLimitMessage={true}
              />
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
