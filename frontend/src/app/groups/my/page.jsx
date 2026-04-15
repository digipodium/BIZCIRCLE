"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Search, Users, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyGroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const ensureAuth = async () => {
      try {
        if (!localStorage.getItem('token')) {
          router.push('/login');
        } else {
          fetchMyGroups();
        }
      } catch (err) {
        console.error("Auth helper failed:", err);
      }
    };
    ensureAuth();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/group/my');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Groups</h1>
          <p className="text-gray-500 mt-2 text-lg">Circles you are actively participating in.</p>
        </div>
      </div>

      <div className="relative mb-8 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          placeholder="Search your groups..."
        />
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 shadow-sm mt-8">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Groups Yet</h3>
          <p className="text-gray-500 mb-6">You haven&apos;t joined any circles. Explore the community and find your people.</p>
          <button onClick={() => router.push('/groups')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all">
            Discover Groups
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Link href={`/groups/${group._id}`} key={group._id} className="group cursor-pointer">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full hover:shadow-[0_20px_48px_rgba(37,99,235,0.13)]">
                
                {/* Banner Gradient */}
                <div 
                  className={`h-24 relative flex items-end p-5 bg-gradient-to-br ${group.color || 'from-blue-500 to-blue-700'}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-md border-2 border-white/50 flex flex-shrink-0 items-center justify-center text-2xl absolute -bottom-5 left-5 shadow-sm">
                    {group.icon || '💻'}
                  </div>
                  {group.isPrivate && (
                    <div className="absolute top-4 right-4 bg-amber-100/90 backdrop-blur-sm text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs font-bold flex items-center">
                      <Shield className="w-3 h-3 mr-1" /> Private
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="pt-8 px-5 pb-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                    {group.name}
                  </h3>
                  
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-bold">
                      {group.domain || group.category || 'General'}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-medium flex items-center gap-1">
                      📍 {group.location || 'Global'}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px] flex-1">
                    {group.description || 'A community to connect, grow, and network with professionals.'}
                  </p>
                  
                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                    <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 w-full justify-center">
                      Enter Group <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
