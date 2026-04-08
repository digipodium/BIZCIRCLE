"use client";
import { useEffect, useState, use } from 'react';
import api from '@/lib/axios';
import { Share2, Settings, Users, MessageSquare, Calendar, BarChart2, Shield } from 'lucide-react';

import ChatTab from '@/components/groups/ChatTab';
import MembersTab from '@/components/groups/MembersTab';
import EventsTab from '@/components/groups/EventsTab';
import PollsTab from '@/components/groups/PollsTab';

export default function GroupDetail({ params }) {
  const unwrappedParams = use(params);
  const { groupId } = unwrappedParams;

  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch group details
    api.get(`/group/${groupId}`).then(res => {
      setGroup(res.data);
    }).catch(err => {
      console.error(err);
      // Fallback for UI visualization if API fails
      setGroup({
        name: "Enterprise Tech Circle",
        description: "A community for tech leads and developers to share best practices.",
        category: "Technology",
        isPrivate: false,
        members: Array(12).fill({ user: { name: 'John Doe' }, role: 'Member' })
      });
    }).finally(() => {
      setLoading(false);
    });
  }, [groupId]);

  if (loading) {
    return (
      <div className="p-8 pb-20 max-w-6xl mx-auto flex space-x-4 animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-2xl"></div>
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
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-200">
              {group?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{group?.name}</h1>
                {group?.isPrivate && (
                  <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                    <Shield className="w-3 h-3 mr-1" /> Private
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-lg mb-3">{group?.description}</p>
              
              <div className="flex items-center space-x-4 text-sm font-medium">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">{group?.category}</span>
                <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <Users className="w-4 h-4 mr-1.5" />
                  {group?.members?.length || 0} Members
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
              <Share2 className="w-4 h-4" /> <span>Share</span>
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              <Settings className="w-4 h-4" /> <span>Manage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'chat' && <ChatTab groupId={groupId} />}
        {activeTab === 'members' && <MembersTab members={group?.members || []} />}
        {activeTab === 'events' && <EventsTab groupId={groupId} />}
        {activeTab === 'polls' && <PollsTab groupId={groupId} />}
      </div>
    </div>
  );
}
