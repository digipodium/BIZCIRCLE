"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Trash2, Shield, Eye, CheckCircle, XCircle, Users } from 'lucide-react';

// Reusing domain colors from original GroupsSection
const domainColors = {
  Technology: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  Marketing: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  Finance: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Design: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  Healthcare: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

export default function GroupManagementSection({ groups, requests, onAccept, onReject }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = (groups || []).filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Group Management</h1>
          <p className="text-slate-500 font-medium">Manage communities, approve circles, and assign moderators.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
          <Plus size={18} />
          Create New Circle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {[
          { id: 'all', label: 'All Groups', count: groups?.length },
          { id: 'pending', label: 'Creation Requests', count: requests?.length },
          { id: 'active', label: 'Active', count: groups?.filter(g => g.members > 0).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search groups by name or domain..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const domStyle = domainColors[group.domain] || domainColors.Technology;
            return (
              <div key={group.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-24 relative" style={{ 
                  background: group.color.includes('from-') ? '' : `linear-gradient(135deg, #2563eb, #7c3aed)`,
                }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.color}`}></div>
                  <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl border-4 border-white">
                    {group.icon || '⬡'}
                  </div>
                </div>
                <div className="p-8 pt-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider border ${domStyle.bg} ${domStyle.text} ${domStyle.border}`}>
                      {group.domain}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mb-6 flex items-center gap-1">
                    <Users size={12} />
                    {group.members} members • By {group.creator || 'Admin'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-colors">
                      <Eye size={14} /> View
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                      <Shield size={14} /> Roles
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(requests || []).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {req.groupName?.[0] || 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{req.groupName}</p>
                          <p className="text-xs font-semibold text-slate-500">{req.domain || 'Tech'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{req.userName}</p>
                      <p className="text-xs font-semibold text-slate-500">Member ID: {req.userId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      Just now
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onAccept?.(req.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => onReject?.(req.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(requests?.length || 0) === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-bold">No pending group requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
