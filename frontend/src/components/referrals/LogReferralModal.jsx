"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, Mail, Briefcase, Globe, Send, Loader2, Users } from "lucide-react";
import api from "@/lib/axios";
import { usePoints } from "@/context/PointsContext";
import { useProfile } from "@/lib/useProfile";

export default function LogReferralModal({ isOpen, onClose, onSuccess }) {
  const { earnPoints } = usePoints();
  const { user } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    role: "",
    targetCircle: "",
    receiverId: "",
    message: ""
  });

  const [availableCircles, setAvailableCircles] = useState([]);
  const [circlesLoading, setCirclesLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Default: show current user's own circles when no receiver selected
      const defaultCircles = [
        ...(user?.circles || []),
        ...(user?.joinedGroups || []),
      ];
      setAvailableCircles(defaultCircles);

      api.get("/user/all")
        .then(res => setUsers(res.data))
        .catch(err => console.error("Failed to fetch users:", err));
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!formData.receiverId) {
      const defaultCircles = [
        ...(user?.circles || []),
        ...(user?.joinedGroups || []),
      ];
      setAvailableCircles(defaultCircles);
      setFormData(prev => ({ ...prev, targetCircle: "" }));
      return;
    }

    // Fetch mutual Circles + mutual Groups in parallel
    setCirclesLoading(true);
    setAvailableCircles([]);
    setFormData(prev => ({ ...prev, targetCircle: "" }));

    Promise.all([
      api.get(`/api/circles/mutual/${formData.receiverId}`).catch(() => ({ data: [] })),
    ]).then(([circlesRes]) => {
      const allMutual = [
        ...(circlesRes.data || []),
      ];
      
      if (allMutual.length > 0) {
        setAvailableCircles(allMutual);
      } else {
        // Fallback to user's own circles if no mutuals found
        const myCircles = [
          ...(user?.circles || []),
          ...(user?.joinedGroups || []),
        ];
        setAvailableCircles(myCircles);
      }
    }).finally(() => setCirclesLoading(false));
  }, [formData.receiverId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/referrals", formData);
      earnPoints(30, `Referral for ${formData.candidateName}`);
      onSuccess(data);
      onClose();
      setFormData({
        candidateName: "",
        candidateEmail: "",
        role: "",
        targetCircle: "",
        receiverId: "",
        message: ""
      });
    } catch (err) {
      console.error("Failed to log referral:", err);
      alert(err.response?.data?.message || "Failed to log referral");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Log Meeting Referral</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Capture networking opportunities shared during meetings.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {(!user?.circles || user.circles.length === 0) ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
              <Users size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Join a Circle First</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                You must join at least one professional circle before you can share referrals with the community.
              </p>
            </div>
            <button 
              onClick={() => {
                onClose();
                window.location.href = '/dashboard/circles';
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all hover:scale-[1.01]"
            >
              Explore Circles
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Receiver / Connection */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4 mb-4">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-blue-500" /> Connection / Receiver
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
              value={formData.receiverId}
              onChange={(e) => setFormData({...formData, receiverId: e.target.value})}
              required
            >
              <option value="">Choose a connection you met with...</option>
              {users
                .filter(u => u.circles && u.circles.length > 0)
                .map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} {u.headline ? `- ${u.headline}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus size={12} className="text-blue-500" /> Candidate Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={formData.candidateName}
                onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} className="text-blue-500" /> Candidate Email
              </label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={12} className="text-blue-500" /> Role / Position
              </label>
              <input
                type="text"
                placeholder="Frontend Developer"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={12} className="text-blue-500" /> Target Circle
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.targetCircle}
                onChange={(e) => setFormData({...formData, targetCircle: e.target.value})}
                required
                disabled={circlesLoading}
              >
                {circlesLoading ? (
                  <option value="">Loading mutual circles...</option>
                ) : availableCircles.length === 0 && formData.receiverId ? (
                  <option value="">No mutual circles found</option>
                ) : (
                  <>
                    <option value="">Select Circle...</option>
                    {availableCircles.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name}{c.domain ? ` · ${c.domain}` : ""}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1.5">
               Notes & Recommendation
            </label>
            <textarea
              placeholder="Why are they a good fit?"
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging Referral...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Referral (+30 pts)
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
