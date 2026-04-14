"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  MapPin, 
  Globe, 
  Check, 
  Loader2,
  Tag,
  AlignLeft
} from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import api from "@/lib/axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useProfile();
  
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    headline: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        headline: user.headline || "",
        location: user.location || "",
        bio: user.bio || "",
        website: user.website || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    
    if (result.success) {
      setSaveMsg("Profile updated successfully!");
      setTimeout(() => {
        setSaveMsg("");
        router.push("/profile");
      }, 2000);
    } else {
      setSaveMsg(result.message || "Update failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setSaveMsg("Please select an image file.");
      return;
    }

    setUploading(true);
    setSaveMsg("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setForm(prev => ({ ...prev, profilePicture: data.url }));
      setSaveMsg("Image uploaded successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setSaveMsg(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Edit Profile</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden relative">
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
                {form.profilePicture ? (
                  <img 
                    src={form.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ""; // Clear if broken
                    }}
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase() || "?"
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform">
                <Camera size={18} />
              </div>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm font-semibold text-slate-600">Click photo to change</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid gap-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Headline</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer at Google"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Bio</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 text-slate-400" size={16} />
                  <textarea 
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Writie a short bio about yourself..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              Links & Socials
            </h2>
            
            <div className="grid gap-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="portfolio.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">GitHub Username</label>
                <div className="relative">
                  <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">LinkedIn Username</label>
                <div className="relative">
                  <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <p className={`text-sm font-semibold transition-all ${saveMsg.includes("successfully") ? "text-emerald-600" : "text-red-500"}`}>
              {saveMsg}
            </p>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        input::placeholder, textarea::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      `}</style>
    </main>
  );
}
