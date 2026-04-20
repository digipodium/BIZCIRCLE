"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Shield, UserX, Trash2, Eye } from 'lucide-react';
import api from '@/lib/axios';

export default function UserManagementSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await api.put(`/api/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Suspended': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Banned': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage permissions, roles, and account statuses.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="User">User</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-sm font-bold text-white hover:bg-slate-800 transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* users table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500 font-bold">Loading users...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {user.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs font-semibold text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 
                        user.role === 'Moderator' ? 'bg-blue-50 text-blue-600' : 
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{user.joined}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Make Moderator" onClick={() => handleUpdateRole(user.id, 'moderator')} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Shield size={16} />
                        </button>
                        <button title="Make Admin" onClick={() => handleUpdateRole(user.id, 'admin')} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        {user.status !== 'Banned' ? (
                          <button title="Ban User" onClick={() => handleUpdateStatus(user.id, 'Banned')} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <UserX size={16} />
                          </button>
                        ) : (
                          <button title="Activate User" onClick={() => handleUpdateStatus(user.id, 'Active')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-bold">No users found matching your criteria.</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">1</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
