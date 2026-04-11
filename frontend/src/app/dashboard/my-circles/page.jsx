"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CircleList from "@/components/dashboard/CircleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useProfile } from "@/lib/useProfile";

const MyCirclesPage = () => {
  const { user, loading } = useProfile();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 mt-12 lg:mt-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Circles</h1>
            <p className="text-slate-500 font-medium text-lg">
              Manage the professional communities you belong to.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <CircleList 
                title="Active Circles" 
                circles={user?.circles || []} 
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
    </div>
  );
};

export default MyCirclesPage;
