"use client";

import { useState } from "react";
import { Bell, Send, History, CheckCircle, Clock, Smartphone, Mail, Globe } from 'lucide-react';

const NOTIFICATION_HISTORY = [
  { id: 1, title: 'Platform Maintenance', body: 'The platform will be down for 2 hours tonight.', type: 'System', sentTo: 'All Users', date: '2026-04-18', status: 'Delivered' },
  { id: 2, title: 'New Feature Alert', body: 'Check out the new analytics dashboard!', type: 'Marketing', sentTo: 'Active Users', date: '2026-04-15', status: 'Delivered' },
  { id: 3, title: 'Policy Update', body: 'We have updated our terms of service.', type: 'Alert', sentTo: 'All Users', date: '2026-04-10', status: 'Delivered' },
];

export default function NotificationsSection() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Users");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notification Control</h1>
        <p className="text-slate-500 font-medium">Send announcements and push notifications to your community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creation Panel */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Send size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">New Announcement</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Notification Title</label>
              <input 
                type="text" 
                placeholder="Enter title..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
              <textarea 
                rows="4" 
                placeholder="Write your announcement here..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option>All Users</option>
                  <option>Active Users</option>
                  <option>New Users</option>
                  <option>Admins only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Channels</label>
                <div className="flex items-center gap-2 pt-2">
                  <button className="p-2 bg-blue-600 text-white rounded-lg"><Smartphone size={16} /></button>
                  <button className="p-2 bg-slate-100 text-slate-400 rounded-lg"><Mail size={16} /></button>
                  <button className="p-2 bg-slate-100 text-slate-400 rounded-lg"><Globe size={16} /></button>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-blue-600 rounded-2xl text-sm font-extrabold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              <Send size={18} />
              Push Notification
            </button>
          </div>
        </div>

        {/* Preview / Instructions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-blue-400 text-xs font-extrabold uppercase tracking-widest mb-2">Live Preview</h4>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60">BizCircle Platform</p>
                    <p className="text-sm font-extrabold">{title || 'Notification Title'}</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                  {message || 'Your message will appear here for users to read...'}
                </p>
              </div>
            </div>
            {/* Abstract Background element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="text-blue-900 text-sm font-extrabold mb-3">Announcement Tips</h4>
            <ul className="space-y-2">
              {['Keep titles short and punchy', 'Use emojis to increase engagement', 'Segment your audience for relevance'].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <CheckCircle size={14} /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
            <History size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Notification History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Announcement</th>
                <th className="pb-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Target</th>
                <th className="pb-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="pb-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="pb-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {NOTIFICATION_HISTORY.map((notif) => (
                <tr key={notif.id} className="group">
                  <td className="py-4">
                    <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                    <p className="text-xs font-semibold text-slate-500 truncate max-w-xs">{notif.body}</p>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-slate-600">{notif.sentTo}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 uppercase tracking-wider">
                      {notif.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle size={12} />
                      <span className="text-xs font-bold">{notif.status}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-slate-400">{notif.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
