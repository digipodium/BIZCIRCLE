"use client";
import { Users, MoreVertical, Shield } from 'lucide-react';

export default function MembersTab({ members }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Group Members 
          <span className="ml-3 bg-blue-50 text-blue-600 text-xs py-1 px-2 rounded-full">{members?.length || 0}</span>
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {members?.map((member, i) => (
          <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold">
                {member.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{member.user?.name}</p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${member.role === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
