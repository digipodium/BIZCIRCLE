"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { Download, Calendar, ArrowUpRight, ArrowDownRight, Users, MessageSquare, Heart, Clock } from 'lucide-react';
import api from '@/lib/axios';

const INITIAL_PIE_DATA = [
  { name: 'Technology', value: 400, color: '#2563eb' },
  { name: 'Finance', value: 300, color: '#059669' },
  { name: 'Marketing', value: 300, color: '#7c3aed' },
  { name: 'Design', value: 200, color: '#ea580c' },
];

export default function AnalyticsSection() {
  const [userGrowth, setUserGrowth] = useState([]);
  const [engagementStats, setEngagementStats] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => {
        setUserGrowth(res.data.userGrowth);
        setEngagementStats(res.data.engagementStats);
        setStats(res.data.stats);
      })
      .catch(err => console.error('Failed to fetch analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const getStatValue = (id) => stats.find(s => s.id === id)?.value || '0';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 animate-pulse">
        <BarChart size={48} className="mb-4 animate-spin" />
        <p className="font-bold text-lg">Analyzing Platform Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 font-medium">Deep dive into platform growth and user behavior metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Daily Active', value: getStatValue('active-users'), trend: '+0%', icon: Users, color: 'blue' },
          { label: 'Post Volume', value: getStatValue('posts-today'), trend: '+0%', icon: MessageSquare, color: 'emerald' },
          { label: 'Total Members', value: getStatValue('total-users'), trend: '+0%', icon: Heart, color: 'pink' },
          { label: 'Pending Reports', value: getStatValue('pending-reports'), trend: '0', icon: Clock, color: 'amber' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${item.color}-50 text-${item.color}-600`}>
                <item.icon size={20} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {item.trend}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1">{item.label}</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Acquisition Area Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">User Acquisition</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  fillOpacity={1} 
                  strokeWidth={3}
                  fill="url(#colorAcq)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Group Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INITIAL_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {INITIAL_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Engagement Bar Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800">Engagement Patterns</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-xs font-bold text-slate-500">Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-xs font-bold text-slate-500">Likes</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="posts" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
