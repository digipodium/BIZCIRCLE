"use client";

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Users, Activity, Grid, FileText, AlertCircle, TrendingUp, TrendingDown 
} from 'lucide-react';
import { ENGAGEMENT_STATS, MOCK_STATS as INITIAL_MOCK_STATS, USER_GROWTH_DATA as INITIAL_USER_GROWTH_DATA, RECENT_ACTIVITY as INITIAL_RECENT_ACTIVITY } from '@/lib/adminMockData';
import api from '@/lib/axios';

export default function OverviewSection() {
  const [stats, setStats] = useState(INITIAL_MOCK_STATS);
  const [userGrowth, setUserGrowth] = useState(INITIAL_USER_GROWTH_DATA);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [engagementStats, setEngagementStats] = useState(ENGAGEMENT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => {
        setStats(res.data.stats);
        setUserGrowth(res.data.userGrowth);
        setRecentActivity(res.data.recentActivity);
        if (res.data.engagementStats) setEngagementStats(res.data.engagementStats);
      })
      .catch(err => console.error('Failed to fetch admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const ICON_MAP = {
    Users: Users,
    Activity: Activity,
    Grid: Grid,
    FileText: FileText,
    AlertCircle: AlertCircle
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
            Send Announcement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = ICON_MAP[stat.icon];
          const isPositive = stat.trend.toString().startsWith('+');
          return (
            <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors" style={{ color: stat.color }}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 leading-none">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-500 mt-2">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">User Growth</h3>
            <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'user' ? 'bg-blue-500' : 
                  activity.type === 'post' ? 'bg-pink-500' : 
                  activity.type === 'group' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{activity.action}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{activity.target} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Stats Bar Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8">Weekly Engagement</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', radius: 10 }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Bar dataKey="posts" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="likes" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
