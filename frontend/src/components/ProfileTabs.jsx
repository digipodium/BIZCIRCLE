"use client";

import { LayoutDashboard, User, Briefcase, GitBranch, Activity } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "circles", label: "Circles", icon: GitBranch },
  { id: "activity", label: "Activity", icon: Activity },
];

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center
              ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              }
            `}
          >
            <Icon size={15} className="flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}