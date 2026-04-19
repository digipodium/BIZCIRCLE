"use client";

import { useState } from "react";
import { Search, Filter, Trash2, Flag, CheckCircle, Clock, AlertTriangle, User, Calendar } from 'lucide-react';

const MOCK_POSTS = [
  { id: 1, author: 'Alice Johnson', content: 'Loving the new features in BizCircle! #networking', date: '2026-04-19', status: 'Active', flagged: false },
  { id: 2, author: 'Bob Smith', content: 'Check out this totally legitimate crypto investment opportunity! [Link]', date: '2026-04-18', status: 'Flagged', flagged: true },
  { id: 3, author: 'Charlie Brown', content: 'Anyone available for a quick sync on the marketing strategy?', date: '2026-04-18', status: 'Active', flagged: false },
  { id: 4, author: 'David Wilson', content: 'This platform is amazing, I just found my next co-founder!', date: '2026-04-17', status: 'Active', flagged: false },
  { id: 5, author: 'Eve Adams', content: 'ANOTHER SPAM MESSAGE TO TEST MODERATION', date: '2026-04-17', status: 'Flagged', flagged: true },
];

export default function ContentModerationSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                          (activeFilter === 'Flagged' && post.flagged) ||
                          (activeFilter === 'Clean' && !post.flagged);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Content Moderation</h1>
          <p className="text-slate-500 font-medium">Review and moderate posts to maintain platform quality.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search post content or author..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['All', 'Flagged', 'Clean'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            {post.flagged && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{post.author}</p>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                      <Calendar size={10} /> {post.date}
                    </p>
                  </div>
                  {post.flagged && (
                    <span className="ml-2 flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-rose-100 animate-pulse">
                      <AlertTriangle size={10} /> FLAG INAPPROPRIATE
                    </span>
                  )}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{post.content}</p>
              </div>

              <div className="flex sm:flex-col items-center justify-end gap-2">
                <button className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                  <CheckCircle size={14} /> Keep
                </button>
                <button className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100">
                  <Trash2 size={14} /> Delete
                </button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                  <Flag size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No posts match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
