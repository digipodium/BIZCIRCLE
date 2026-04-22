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
  const [circleMembers, setCircleMembers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('meetings');
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchCircle = async () => {
      try {
        const { data } = await api.get(`/api/circles/${circleId}`);
        setCircle(data.circle);
        setCircleMembers(data.members || []);
        setIsJoined(data.isJoined || false);
      } catch (err) {
        console.error("Failed to fetch circle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCircle();
  }, [circleId]);

  const handleJoin = async () => {
    if (isJoined || isJoining) return;
    setIsJoining(true);
    try {
      await api.post('/api/circles/join', { circleId });
      alert("Join request sent! Please wait for admin approval if the circle is private.");
      // Refresh to check if it's auto-approved or pending
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join");
    } finally {
      setIsJoining(false);
    }
  };

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

          {!isJoined ? (
            /* Membership Required View */
            <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Shield size={40} className="text-blue-600" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-4">Membership Required</h2>
               <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                 This is a professional community. To access the chat, meetings, and member list, you must first join the circle.
               </p>
               <button 
                 onClick={handleJoin}
                 disabled={isJoining}
                 className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 mx-auto disabled:opacity-50"
               >
                 {isJoining ? "Processing..." : "Join This Circle"}
               </button>
            </div>
          ) : (
            /* Full Member View */
            <>
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
                {activeTab === 'members' && <MembersTab members={circleMembers} />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
