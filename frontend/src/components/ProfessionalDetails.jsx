"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  Building2,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";

export default function ProfessionalDashboard() {

  const [user] = useState({
    name: "Rahul Mehta",
    role: "Senior Product Strategist",
    company: "GrowthLabs Pvt. Ltd.",
    email: "rahul.mehta@example.com",
    phone: "+91 98765 43210",
    experience: "8+ Years",
    skills: ["Product Strategy", "GTM", "Agile", "Fundraising"],
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User /> Welcome, {user.name}
        </h1>
        <p className="text-gray-500">{user.role} at {user.company}</p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <User /> Profile
          </h2>
          <p><Mail size={14} className="inline mr-1"/> {user.email}</p>
          <p><Phone size={14} className="inline mr-1"/> {user.phone}</p>
        </div>

        {/* Experience */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase /> Experience
          </h2>
          <p>{user.experience}</p>
        </div>

        {/* Company */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Building2 /> Company
          </h2>
          <p>{user.company}</p>
        </div>

      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp /> Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-black text-white rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}