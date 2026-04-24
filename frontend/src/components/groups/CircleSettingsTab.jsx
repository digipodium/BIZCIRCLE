"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Save, Shield, Lock, Globe, Info, Palette, Layout, Trash2 } from "lucide-react";

export default function CircleSettingsTab({ circle, onUpdate }) {
  const [formData, setFormData] = useState({
    name: circle.name || "",
    description: circle.description || "",
    rules: circle.rules || "",
    isPrivate: circle.isPrivate || false,
    color: circle.color || "from-blue-600 to-blue-400",
    icon: circle.icon || "💻"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const { data } = await api.put(`/api/circles/${circle._id}`, formData);
      onUpdate(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update circle:", err);
      alert(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: "Blue", value: "from-blue-600 to-indigo-600" },
    { name: "Emerald", value: "from-emerald-600 to-teal-600" },
    { name: "Rose", value: "from-rose-600 to-pink-600" },
    { name: "Amber", value: "from-amber-500 to-orange-600" },
    { name: "Purple", value: "from-purple-600 to-violet-600" },
    { name: "Slate", value: "from-slate-700 to-slate-900" },
  ];

  const icons = ["💻", "🚀", "🎨", "📈", "🏥", "⚖️", "🎓", "🍕", "🌍", "💡"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Circle Preferences</h2>
            <p className="text-slate-500 font-medium">Manage your community settings and visibility.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Info size={14} /> Circle Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="e.g. Fintech Innovators"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Layout size={14} /> Visibility
              </label>
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    !formData.isPrivate ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Globe size={16} /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.isPrivate ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Lock size={16} /> Private
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[100px]"
              placeholder="Tell people what this circle is about..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Community Rules
            </label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[100px]"
              placeholder="Set some guidelines for your members..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Palette size={14} /> Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c.value })}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.value} transition-all ${
                      formData.color === c.value ? "ring-4 ring-blue-500/20 scale-110 shadow-lg" : "opacity-60 hover:opacity-100"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Circle Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      formData.icon === icon ? "bg-blue-600 text-white shadow-lg scale-110" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
             <div className="text-xs font-medium text-slate-400">
                Last updated: {new Date(circle.updatedAt).toLocaleDateString()}
             </div>
             <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
                  success 
                  ? "bg-green-500 text-white" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                } disabled:opacity-50`}
             >
                {loading ? "Saving..." : success ? "Settings Saved!" : "Save Changes"}
                {!loading && !success && <Save size={18} />}
             </button>
          </div>
        </form>
      </div>

      <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
            <p className="text-red-600 text-sm font-medium">Once you delete a circle, there is no going back. Please be certain.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all">
            <Trash2 size={18} /> Delete Circle
          </button>
        </div>
      </div>
    </div>
  );
}
