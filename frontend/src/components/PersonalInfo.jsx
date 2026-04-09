"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, Globe, Shield, Check, Loader2 } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

export default function PersonalInfo() {
  const { user, loading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [form, setForm] = useState(null);

  const startEdit = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      location: user?.location || "",
      website: user?.website || "",
    });
    setEditMode(true);
    setSaveMsg("");
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(null);
    setSaveMsg("");
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      setSaveMsg("Saved!");
      setEditMode(false);
      setForm(null);
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveMsg(result.message || "Save failed");
    }
  };

  const fields = [
    { label: "Full Name", key: "name", value: user?.name, icon: User, editable: true },
    { label: "Email Address", key: "email", value: user?.email, icon: Mail, editable: false },
    { label: "Phone Number", key: "phone", value: user?.phone, icon: Phone, editable: true },
    { label: "Date of Birth", key: "dob", value: user?.dob, icon: Calendar, editable: true },
    { label: "Current Location", key: "location", value: user?.location, icon: MapPin, editable: true },
    { label: "Website", key: "website", value: user?.website, icon: Globe, editable: true },
  ];

  return (
    <div className="space-y-4 animate-fadeInTab">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Personal Information</h2>
          <div className="flex items-center gap-2">
            {saveMsg && (
              <span className={`text-xs font-semibold ${saveMsg === "Saved!" ? "text-emerald-600" : "text-red-500"}`}>
                {saveMsg}
              </span>
            )}
            {editMode ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="text-xs text-slate-500 font-semibold hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button onClick={startEdit} className="text-xs text-blue-600 font-semibold hover:underline">
                Edit
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(({ label, key, value, icon: Icon, editable }) => (
              <div
                key={label}
                className="group flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 flex-shrink-0 transition-colors border border-slate-100 group-hover:border-blue-200">
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                  {editMode && editable ? (
                    <input
                      type="text"
                      value={form[key] || ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full text-sm text-slate-800 font-medium bg-white border border-blue-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 font-medium mt-0.5 truncate">
                      {value || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 flex items-start gap-3">
        <Shield size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Privacy Protected</p>
          <p className="text-xs text-blue-500 mt-0.5 leading-relaxed">
            Your personal information is only visible to your circle members and accepted connections. 
            You can control visibility in Settings.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInTab {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
      `}</style>
    </div>
  );
}
