"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { Calendar, Video, MapPin, Search, Plus, Edit3, Trash2 } from 'lucide-react';
import CreateEventModal from './CreateEventModal';
import { useProfile } from '@/lib/useProfile';

export default function EventsTab({ targetId, targetModel = 'Group', members = [] }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useProfile();
  
  const currentUserId = user?._id || user?.id || localStorage.getItem('userId');
  const isSystemAdmin = user?.role?.toLowerCase() === 'admin';
  const isCircleAdmin = members.some(m => (m.user?._id === currentUserId || m.user === currentUserId) && m.role === 'Admin' && m.status === 'Approved');
  const canSchedule = isSystemAdmin || isCircleAdmin;
  
  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get(`/api/events/${targetId}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreated = (savedEvent) => {
    if (editingEvent) {
      setEvents(prev => prev.map(ev => ev._id === savedEvent._id ? savedEvent : ev));
    } else {
      setEvents(prev => [...prev, savedEvent]);
    }
    setEditingEvent(null);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/events/${eventId}`);
      setEvents(prev => prev.filter(ev => ev._id !== eventId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const handleRSVP = async (eventId, hasRSVPed) => {
    try {
      const status = hasRSVPed ? 'Not Attending' : 'Attending';
      const res = await api.post(`/api/events/${eventId}/rsvp`, { status });
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
        {canSchedule && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Schedule Event
          </button>
        )}
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
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              {canSchedule 
                ? "Be the first to schedule a meetup or workshop for this circle!" 
                : "Check back later for upcoming meetups and workshops."}
            </p>
          </div>
        ) : (
          events.map(ev => {
            const date = new Date(ev.dateTime);
            const hasRSVPed = ev.rsvp?.some(r => r.user === currentUserId || r.user?._id === currentUserId);
            const isEventAdmin = canSchedule; // Use the component-level admin check

            return (
              <div key={ev._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-center mb-5 relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 text-white py-2 px-4 rounded-2xl text-center shadow-lg shadow-blue-100">
                      <div className="text-[10px] uppercase font-black tracking-widest opacity-80">{date.toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-2xl font-black">{date.getDate()}</div>
                    </div>
                    {isEventAdmin && (
                      <div className="flex flex-col space-y-1 ml-2">
                        <button 
                          onClick={() => handleEdit(ev)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ev._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all shadow-sm ${
                      hasRSVPed 
                        ? 'bg-green-600 text-white hover:bg-red-500 hover:shadow-red-200 group/rsvp' 
                        : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                    }`}
                  >
                    <span className={hasRSVPed ? 'group-hover/rsvp:hidden' : ''}>
                      {hasRSVPed ? 'Attending' : 'RSVP Now'}
                    </span>
                    {hasRSVPed && <span className="hidden group-hover/rsvp:inline">Cancel</span>}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <CreateEventModal 
          targetId={targetId} 
          targetModel={targetModel}
          event={editingEvent}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }} 
          onCreated={handleCreated} 
        />
      )}
    </div>
  );
}
