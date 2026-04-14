"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { BarChart2, Plus, CheckCircle2, TrendingUp } from 'lucide-react';
import CreatePollModal from './CreatePollModal';

export default function PollsTab({ groupId }) {
  const [polls, setPolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchPolls = async () => {
    try {
      const res = await api.get(`/api/polls/${groupId}`);
      setPolls(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [groupId]);

  const handleCreated = (newPoll) => {
    setPolls(prev => [newPoll, ...prev]);
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const res = await api.post(`/api/polls/${pollId}/vote`, { optionId });
      // Update local state with returned poll data
      setPolls(prev => prev.map(p => p._id === pollId ? res.data : p));
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Community Polls</h3>
          <p className="text-gray-500 text-sm font-medium mt-1">Vote on decisions and share your opinion</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center shadow-lg shadow-gray-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Start a Poll
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 text-center py-20 bg-white border border-gray-100 rounded-[32px] animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-50 w-48 mx-auto rounded-full"></div>
          </div>
        ) : polls.length === 0 ? (
          <div className="col-span-2 text-center py-24 bg-white border border-gray-100 rounded-[40px] shadow-sm">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No Active Polls</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">Have a question for the group? Start a poll to gather feedback!</p>
          </div>
        ) : (
          polls.map(poll => {
            const currentUserId = localStorage.getItem('userId');
            const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
            const hasVoted = poll.options.some(opt => opt.votes?.some(vId => vId === currentUserId || vId?._id === currentUserId));

            return (
              <div key={poll._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Live Poll</span>
                </div>

                <h4 className="font-black text-xl text-gray-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {poll.question}
                </h4>
                
                <div className="space-y-4">
                  {poll.options.map(option => {
                    const votesCount = option.votes?.length || 0;
                    const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                    const isMyOption = option.votes?.some(vId => vId === currentUserId || vId?._id === currentUserId);
                    
                    return (
                      <div 
                        key={option._id} 
                        onClick={() => !hasVoted && handleVote(poll._id, option._id)}
                        className={`relative rounded-2xl transition-all overflow-hidden border ${
                          hasVoted 
                            ? (isMyOption ? 'border-blue-200' : 'border-gray-100') 
                            : 'border-gray-100 hover:border-blue-400 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-center z-10 relative px-5 py-4">
                          <div className="flex items-center">
                            {isMyOption && <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />}
                            <span className={`text-sm font-bold ${isMyOption ? 'text-blue-700' : 'text-gray-700'}`}>
                              {option.text}
                            </span>
                          </div>
                          {hasVoted && <span className="text-sm font-black text-blue-600">{percentage}%</span>}
                        </div>
                        
                        {/* Progress Bar Background */}
                        {hasVoted && (
                          <div 
                            className={`absolute inset-0 bg-blue-50/70 transition-all duration-1000 ease-out -z-10`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{totalVotes} Votes Cast</span>
                  </div>
                  {hasVoted ? (
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full tracking-widest">
                      Response Recorded
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Select an option to vote
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <CreatePollModal 
          groupId={groupId} 
          onClose={() => setShowModal(false)} 
          onCreated={handleCreated} 
        />
      )}
    </div>
  );
}
