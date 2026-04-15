"use client";

import { useEffect, useState, use } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import api from '@/lib/axios';
import { Share2, Users, Calendar, MessageSquare, Info, Shield, Globe } from 'lucide-react';

import ChatTab from '@/components/groups/ChatTab';
import MembersTab from '@/components/groups/MembersTab';
import EventsTab from '@/components/groups/EventsTab';

export default function CircleDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { circleId } = unwrappedParams;
  const [circle, setCircle] = useState(null);
  const [activeTab, setActiveTab] = useState('meetings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircle = async () => {
      try {
        const { data } = await api.get(`/api/circles/${circleId}`);
        setCircle(data);
      } catch (err) {
        console.error("Failed to fetch circle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCircle();
  }, [circleId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 animate-pulse">
           <div className="h-64 bg-slate-200 rounded-3xl mb-8" />
           <div className="h-10 bg-slate-200 w-1/3 rounded-lg mb-4" />
           <div className="h-96 bg-slate-200 rounded-3xl" />
        </main>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Info size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Circle not found</h2>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'members', label: 'Members', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-80 h-80 ${circle.color || 'bg-blue-50'} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-20`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center space-x-6">
                <div className={`w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-200`}>
                  {circle.icon || circle.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{circle.name}</h1>
                    <span className="flex items-center text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                      <Shield size={12} className="mr-1.5" /> Official Circle
                    </span>
                  </div>
                  <p className="text-slate-500 text-lg font-medium mb-4 max-w-2xl">{circle.description || "Connecting professionals across domains."}</p>
                  
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 bg-slate-100/80 text-slate-600 px-4 py-1.5 rounded-xl text-sm font-bold">
                      <Globe size={14} /> {circle.domain}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100/80 text-slate-600 px-4 py-1.5 rounded-xl text-sm font-bold">
                      📍 {circle.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="bg-white border-2 border-slate-100 text-slate-700 px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold flex items-center gap-2">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {activeTab === 'meetings' && <EventsTab targetId={circleId} targetModel="Circle" members={[]} />}
             {activeTab === 'chat' && <ChatTab groupId={circleId} />}
             {activeTab === 'members' && <MembersTab members={circle.members || []} />}
          </div>
        </div>
      </main>
    </div>
  );
}
