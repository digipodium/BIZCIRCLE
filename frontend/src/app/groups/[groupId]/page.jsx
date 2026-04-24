"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Share2, Settings, Users, MessageSquare, Calendar, BarChart2, Shield, Lock } from 'lucide-react';

import ChatTab from '@/components/groups/ChatTab';
import MembersTab from '@/components/groups/MembersTab';
import EventsTab from '@/components/groups/EventsTab';
import PollsTab from '@/components/groups/PollsTab';

export default function GroupDetail({ params }) {
  const unwrappedParams = use(params);
  const { groupId } = unwrappedParams;
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const fetchGroup = () => {
    setLoading(true);
    api.get(`/api/circles/${groupId}`).then(res => {
      setGroup({ ...res.data.circle, members: res.data.members || [] });
      setIsJoined(res.data.isJoined);
      setIsPending(res.data.isPending);
    }).catch(err => {
      console.error(err);
      // Removed mock fallback as per user request to not view circle without approval
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleJoin = async () => {
    if (isJoined || isPending || isJoining) return;
    setIsJoining(true);
    try {
      await api.post('/api/circles/join', { circleId: groupId });
      fetchGroup();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 pb-20 max-w-6xl mx-auto flex flex-col space-y-6 animate-pulse">
        <div className="w-full h-48 bg-slate-100 rounded-3xl"></div>
        <div className="w-1/3 h-10 bg-slate-100 rounded-xl"></div>
        <div className="w-full h-64 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-20 text-center">
        <Shield size={48} className="mx-auto text-slate-200 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Circle not found</h2>
        <p className="text-slate-500 mt-2">The community you are looking for does not exist or is unavailable.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'polls', label: 'Polls', icon: BarChart2 }
  ];

  return (
    <div className="p-8 pb-20 max-w-6xl mx-auto space-y-8">
      {/* Group Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${group?.color || 'from-blue-600 to-indigo-600'} rounded-2xl text-white flex items-center justify-center text-3xl font-black shadow-lg`}>
              {group?.icon || group?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{group?.name}</h1>
                {group?.isPrivate && (
                  <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 uppercase tracking-wider">
                    <Shield className="w-3 h-3 mr-1.5" /> Private
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-lg mb-3">{group?.description}</p>
              
              <div className="flex items-center space-x-4 text-sm font-medium">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                  {group?.domain}
                </span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                  📍 {group?.location || 'Global'}
                </span>
                <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <Users className="w-4 h-4 mr-1.5" />
                  {group?.memberCount || 0} Members
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            {!isJoined ? (
              <button 
                onClick={handleJoin}
                disabled={isPending || isJoining}
                className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-3 rounded-xl transition-all font-bold shadow-lg ${
                    isPending 
                    ? 'bg-amber-100 text-amber-700 cursor-default' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {isJoining ? "Processing..." : isPending ? "Request Pending" : "Join Circle"}
              </button>
            ) : (
              <button 
                onClick={() => router.push('/admin')}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg"
              >
                <Settings className="w-4 h-4" /> <span>Manage</span>
              </button>
            )}
            <button 
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {!isJoined ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Content Locked</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                This is a private circle. You must be an approved member to view the chat, members, and exclusive events.
            </p>
            {!isPending && (
                <button 
                    onClick={handleJoin}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    Request Access
                </button>
            )}
            {isPending && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold border border-amber-100">
                    <Clock size={16} /> Your request is being reviewed by the admin
                </div>
            )}
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'chat' && <ChatTab groupId={groupId} />}
            {activeTab === 'members' && <MembersTab members={group?.members || []} />}
            {activeTab === 'events' && <EventsTab targetId={groupId} targetModel="Circle" members={group?.members || []} />}
            {activeTab === 'polls' && <PollsTab groupId={groupId} />}
          </div>
        </>
      )}
    </div>
  );
}
