"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Lock, Globe, Database, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function SystemSettingsSection() {
  const [activeTab, setActiveTab] = useState("general");
  const [platformName, setPlatformName] = useState("BizCircle");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Configure platform-wide preferences and global rules.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
          <Save size={18} />
          Save All Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy', icon: Lock },
            { id: 'regional', label: 'Regional', icon: Globe },
            { id: 'database', label: 'Database & Logs', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                      <input 
                        type="email" 
                        defaultValue="support@bizcircle.io"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Platform Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                      <ImageIcon size={32} />
                    </div>
                    <div className="space-y-2">
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                        Upload New Logo
                      </button>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PNG or SVG • Max 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Maintenance Mode</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">When enabled, only admins can access the platform.</p>
                    </div>
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : ''}`}></div>
                    </button>
                  </div>
                  {maintenanceMode && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                      <AlertCircle className="text-amber-600 flex-shrink-0" size={18} />
                      <p className="text-xs font-bold text-amber-700 leading-relaxed">
                        Platform is currently in maintenance mode. Regular users will see a &quot;Service Unavailable&quot; message.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'general' && (
              <div className="py-20 text-center">
                <div className="p-4 bg-slate-50 rounded-full inline-flex mb-4 text-slate-300">
                  <Settings size={32} className="animate-spin-slow" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Section Under Construction</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">
                  This configuration panel will be available in the next system update.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Security Audit Required</p>
                <p className="text-xs font-bold text-blue-700 opacity-80">Last audit was performed 14 days ago.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white rounded-xl text-xs font-extrabold text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors">
              Run Audit
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
