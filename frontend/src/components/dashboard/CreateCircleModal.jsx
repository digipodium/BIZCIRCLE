"use client";

import React, { useState } from "react";
import { X, MapPin, Globe, Layout, Description, Plus, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import { useProfile } from "@/lib/useProfile";
import { usePoints } from "@/context/PointsContext";

const CreateCircleModal = ({ isOpen, onClose }) => {
  const { fetchProfile } = useProfile();
  const { earnPoints } = usePoints();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    location: "",
    description: "",
    relatedDomains: "",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        relatedDomains: formData.relatedDomains.split(",").map((d) => d.trim()).filter(Boolean),
      };

      const { data } = await api.post("/api/circles", payload);
      
      earnPoints(50, `Creating circle: ${data.name}`);
      await fetchProfile();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create circle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="relative p-8 lg:p-10">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
              <Plus size={32} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create a Circle</h2>
            <p className="text-slate-500 font-medium">Start a new community for your professional domain.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Circle Name</label>
              <div className="relative group">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Frontend Architecture"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Domain</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    name="domain"
                    placeholder="Web Dev"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    name="location"
                    placeholder="Global / Remote"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                name="description"
                placeholder="What is this circle about?"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Related Domains (Comma separated)</label>
              <input
                type="text"
                name="relatedDomains"
                placeholder="JavaScript, React, Next.js"
                value={formData.relatedDomains}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Launch Circle <Sparkles size={18} />
                </>
              )}
            </button>
            
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pt-2">
              Earn +50 BizPoints for building community
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCircleModal;
