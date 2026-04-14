"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Stats from "@/components/dashboard/Stats";
import CircleList from "@/components/dashboard/CircleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import WaysToEarn from "@/components/dashboard/WaysToEarn";
import { useProfile } from "@/lib/useProfile";
import api from "@/lib/axios";

const DashboardPage = () => {
  const { user, loading: profileLoading } = useProfile();
  const [suggestedCircles, setSuggestedCircles] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get("/api/circles");
        // Filter out circles the user is already in
        const joinedIds = user?.circles?.map(c => c._id || c) || [];
        const filtered = data.filter(c => !joinedIds.includes(c._id));
        setSuggestedCircles(filtered.slice(0, 3)); // Just take top 3 for dashboard
      } catch (err) {
        console.error("Failed to fetch suggested circles:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (user) fetchSuggestions();
  }, [user]);

  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-10 mt-12 lg:mt-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {profileLoading ? "..." : firstName} 👋
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Here's what's happening in your circles today.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column (Main Content) */}
            <div className="xl:col-span-2">
              <Stats />
              
              <CircleList 
                id="my-circles"
                title="My Circles" 
                circles={user?.circles || []} 
                loading={profileLoading}
              />
              
              <CircleList 
                id="discover"
                title="Discover Circles" 
                circles={suggestedCircles} 
                loading={loadingSuggestions}
                showLimitMessage={true}
              />

              <WaysToEarn />
            </div>

            {/* Right Column (Sidebar Content) */}
            <div className="space-y-8">
              <ProfileCard />
              <ActivityFeed />
              
              {/* Promo Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl shadow-blue-100">
                <h3 className="font-bold text-xl mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Join unlimited circles and get early access to exclusive networking events.
                </p>
                <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
