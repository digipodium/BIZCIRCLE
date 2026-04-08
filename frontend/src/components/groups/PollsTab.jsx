"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { BarChart2, Plus, CheckCircle2 } from 'lucide-react';

export default function PollsTab({ groupId }) {
  const [polls, setPolls] = useState([]);
  
  useEffect(() => {
    // For now, load mock polls or attempt to load from API if it exists
    api.get(`/api/polls/${groupId}`).then(res => setPolls(res.data)).catch(() => {
      // Fallback mock data
      setPolls([
        {
          _id: '1',
          question: 'What framework should we use for our next internal tool?',
          options: [
            { id: '1a', text: 'React & Next.js', votes: 12 },
            { id: '1b', text: 'Vue & Nuxt', votes: 4 },
            { id: '1c', text: 'SvelteKit', votes: 7 },
          ],
          totalVotes: 23,
          hasVoted: false
        }
      ]);
    });
  }, [groupId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Group Polls</h3>
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Create Poll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white border border-gray-100 rounded-2xl">
            <BarChart2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No active polls in this group.</p>
          </div>
        ) : (
          polls.map(poll => (
            <div key={poll._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-gray-900 mb-4">{poll.question}</h4>
              
              <div className="space-y-3">
                {poll.options.map(option => {
                  const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  
                  return (
                    <div key={option.id} className="relative cursor-pointer group">
                      <div className="flex justify-between items-center z-10 relative px-4 py-2">
                        <span className="text-sm font-medium text-gray-800">{option.text}</span>
                        <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                      </div>
                      <div className="absolute inset-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group-hover:border-blue-200 transition-colors">
                        <div 
                          className="h-full bg-blue-100/50 transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                <span>{poll.totalVotes} total votes</span>
                {poll.hasVoted && (
                  <span className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Voted
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
