"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Download, Trash2, Calendar, User, Shield, Info, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function LogsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Failed to load logs:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(log => 
    log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Logs & Activity Tracking</h1>
          <p className="text-slate-500 font-medium">Track administrator actions and system modifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Export Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors border border-rose-100">
            <Trash2 size={16} /> Clear Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by admin, action, or target..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer appearance-none">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer appearance-none">
            <option>All Admins</option>
            <option>Sudeshna</option>
            <option>Rahul</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500 font-bold">Loading logs...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Administrator</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action Type</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Target Entity</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{log.admin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                        log.action.includes('Ban') || log.action.includes('Delete') ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-600">{log.target}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">
                      {log.time}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 group-hover:bg-slate-100 rounded-lg transition-all">
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && filteredLogs.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold">No activity logs found matching your search.</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center gap-3">
          <AlertCircle className="text-slate-400" size={16} />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Logs are retained for 90 days. For older logs, please use the system backup.
          </p>
        </div>
      </div>
    </div>
  );
}
