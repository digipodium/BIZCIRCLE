"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Search, Plus, Users, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Quick fake login flow for testing
    const ensureAuth = async () => {
      try {
        if (!localStorage.getItem('token')) {
          router.push('/login');
        } else {

          fetchGroups();
        }
      } catch (err) {
        console.error("Auth helper failed:", err);
      }
    };

    ensureAuth();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/group');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDemoGroup = async () => {
    try {
      await api.post('/group', {
        name: "New Enterprise Cluster",
        description: "Official tech discussions and announcements.",
        category: "Technology",
        isPrivate: false
      });
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Groups</h1>
          <p className="text-gray-500 mt-2 text-lg">Join communities that match your professional interests.</p>
        </div>
        <button
          onClick={createDemoGroup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm shadow-blue-200 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Group
        </button>
      </div>

      <div className="relative mb-8 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          placeholder="Search for marketing, tech, sales..."
        />
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Link href={`/groups/${group._id}`} key={group._id} className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="w-24 h-24" />
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{group.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                      {group.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {group.description}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Members</span>
                  </div>
                  {group.isPrivate ? (
                    <div className="flex items-center text-sm text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                      <Shield className="w-3 h-3 mr-1" /> Private
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-blue-600">Join Now &rarr;</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
