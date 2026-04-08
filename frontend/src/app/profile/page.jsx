"use client";

import { useState } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileTabs from "@/components/ProfileTabs";
import Overview from "@/components/Overview";
import PersonalInfo from "@/components/PersonalInfo";
import ProfessionalDetails from "@/components/ProfessionalDetails";
import Circles from "@/components/Circles";
import Activity from "@/components/Activity";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "personal":
        return <PersonalInfo />;
      case "professional":
        return <ProfessionalDetails />;
      case "circles":
        return <Circles />;
      case "activity":
        return <Activity />;
      default:
        return <Overview />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans">
      {/* Top Nav Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-slate-800 font-bold text-lg tracking-tight">
            Biz<span className="text-blue-600">Circle</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="hidden sm:inline hover:text-blue-600 cursor-pointer transition-colors">Explore</span>
          <span className="hidden sm:inline hover:text-blue-600 cursor-pointer transition-colors">Circles</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
            AK
          </div>
        </div>
      </nav>

      {/* Profile Banner */}
      <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900/30 to-transparent" />
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 animate-fadeIn">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pt-0 lg:pt-20 animate-fadeInUp">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4">{renderTab()}</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }
      `}</style>
    </main>
  );
}