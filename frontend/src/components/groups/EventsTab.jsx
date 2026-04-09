"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Calendar, Video, MapPin, Search, Plus } from 'lucide-react';
import CreateEventModal from './CreateEventModal';

export default function EventsTab({ groupId }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchEvents = async () => {
    try {
      const res = await api.get(`/api/events/${groupId}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [groupId]);

  const handleCreated = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleRSVP = async (eventId, currentStatus) => {
    try {
      // Toggle logic: if already "Going", we might want to cancel, 
      // but for simplicity let's just send "Going"
      const res = await api.post(`/api/events/${eventId}/rsvp`, { status: 'Going' });
      // Update local state
      setEvents(prev => prev.map(ev => ev._id === eventId ? res.data : ev));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-20 bg-white border border-gray-100 rounded-3xl animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-50 w-48 mx-auto rounded-full"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Events Planned</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">Be the first to schedule a meetup or workshop for this circle!</p>
          </div>
        ) : (
          events.map(ev => {
            const date = new Date(ev.dateTime);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const hasRSVPed = ev.rsvp?.some(r => r.user === user.id || r.user?._id === user.id);

            return (
              <div key={ev._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="bg-blue-600 text-white py-2 px-4 rounded-2xl text-center shadow-lg shadow-blue-100">
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-80">{date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl font-black">{date.getDate()}</div>
                  </div>
                  <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${hasRSVPed ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {hasRSVPed ? '✓ Attending' : 'Upcoming'}
                  </span>
                </div>

                <h4 className="font-extrabold text-xl text-gray-900 mb-2 relative z-10 group-hover:text-blue-600 transition-colors">{ev.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] relative z-10">{ev.description || 'No description provided.'}</p>
                
                <div className="mt-5 space-y-2.5 relative z-10">
                  <div className="flex items-center text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                  {ev.meetingLink && (
                    <a 
                      href={ev.meetingLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center text-sm font-bold text-blue-600 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50 hover:bg-blue-600 hover:text-white transition-all group/link"
                    >
                      <Video className="w-4 h-4 mr-3 text-blue-500 group-hover/link:text-white transition-colors" />
                      <span className="truncate">Join Meeting</span>
                    </a>
                  )}
                </div>
                
                <div className="mt-7 pt-5 border-t border-gray-50 flex justify-between items-center relative z-10">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{ev.rsvp?.length || 0} Attending</span>
                  </div>
                  <button 
                    onClick={() => handleRSVP(ev._id, hasRSVPed)}
                    disabled={hasRSVPed}
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all shadow-sm ${
                      hasRSVPed 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                    }`}
                  >
                    {hasRSVPed ? 'Going' : 'RSVP Now'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <CreateEventModal 
          groupId={groupId} 
          onClose={() => setShowModal(false)} 
          onCreated={handleCreated} 
        />
      )}
    </div>
  );
}
