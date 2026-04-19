"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { X, Calendar, Clock, AlignLeft, Video } from "lucide-react";

export default function CreateEventModal({ targetId, targetModel = 'Group', onClose, onCreated, event = null }) {
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    dateTime: event?.dateTime ? new Date(event.dateTime).toISOString().slice(0, 16) : "",
    meetingLink: event?.meetingLink || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.dateTime) {
      setError("Title and Date/Time are required");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (event) {
        // Edit mode
        res = await api.put(`/api/events/${event._id}`, form);
      } else {
        // Create mode
        res = await api.post("/api/events", {
          ...form,
          targetId,
          targetModel
        });
      }
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${event ? 'update' : 'create'} event. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">{event ? 'Update Event' : 'Plan an Event'}</h2>
            <p className="text-blue-100 text-sm">{event ? 'Modify the details of your activity' : 'Create an upcoming activity for your circle'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <Calendar className="w-4 h-4" />
              </span>
              Event Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Monthly Developers Meetup"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <Clock className="w-4 h-4" />
              </span>
              Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <AlignLeft className="w-4 h-4" />
              </span>
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
              placeholder="Tell your members what's happening..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <Video className="w-4 h-4" />
              </span>
              Meeting Link (Optional)
            </label>
            <input
              type="url"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://meet.google.com/..."
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (event ? "Updating..." : "Scheduling...") : (event ? "✦ Update Event" : "✦ Schedule Event")}
          </button>
        </form>
      </div>
    </div>
  );
}
