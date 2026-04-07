"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Calendar, Video, MapPin, Search } from 'lucide-react';

export default function EventsTab({ groupId }) {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    api.get(`/api/events/${groupId}`).then(res => setEvents(res.data)).catch(console.error);
  }, [groupId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
          + Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white border border-gray-100 rounded-2xl">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No active events in this group.</p>
          </div>
        ) : (
          events.map(ev => (
            <div key={ev._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-700 py-2 px-3 rounded-xl text-center min-w-[60px]">
                  <div className="text-xs uppercase font-bold">{new Date(ev.dateTime).toLocaleString('default', { month: 'short' })}</div>
                  <div className="text-xl font-black">{new Date(ev.dateTime).getDate()}</div>
                </div>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md font-medium border border-green-100">Scheduled</span>
              </div>
              <h4 className="font-bold text-lg text-gray-900">{ev.title}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ev.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(ev.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {ev.meetingLink && (
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-lg truncate">
                    <Video className="w-4 h-4 mr-2" />
                    <a href={ev.meetingLink} target="_blank" rel="noreferrer" className="hover:underline">{ev.meetingLink}</a>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-500 font-medium">{ev.rsvp?.length || 0} Attending</div>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  RSVP
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
