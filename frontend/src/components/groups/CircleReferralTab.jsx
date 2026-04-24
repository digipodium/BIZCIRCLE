"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { UserPlus, Mail, Briefcase, Send, Loader2, Award, Info, Users } from "lucide-react";
import { usePoints } from "@/context/PointsContext";

export default function CircleReferralTab({ circle }) {
  const { earnPoints } = usePoints();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    role: "",
    targetCircle: circle._id,
    receiverId: "",
    message: ""
  });

  useEffect(() => {
    // Fetch users for optional internal recommendation
    api.get("/user/all")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.post("/api/referrals", formData);
      earnPoints(30, `Referral for ${formData.candidateName}`);
      setSuccess(true);
      setFormData({
        candidateName: "",
        candidateEmail: "",
        role: "",
        targetCircle: circle._id,
        receiverId: "",
        message: ""
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit referral:", err);
      alert(err.response?.data?.message || "Failed to submit referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Form */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl">
              <Award size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Refer & Earn Points</h2>
              <p className="text-slate-500 font-medium text-sm">Invite top talent to "{circle.name}" and earn 30 BizPoints.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Candidate Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Candidate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.candidateEmail}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Recommended Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="e.g. Senior Architect"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Member (Optional)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={formData.receiverId}
                    onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="">Direct to Community</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Recommendation Note</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-h-[100px] resize-none"
                placeholder="Why is this person a great addition to this circle?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all ${
                success 
                ? "bg-green-500 text-white shadow-lg shadow-green-100" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95"
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Sending Referral...
                </>
              ) : success ? (
                "Referral Sent Successfully! (+30 pts)"
              ) : (
                <>
                  <Send size={20} />
                  Submit Referral
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4">How it works</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black">1</div>
                  <p className="text-sm font-medium text-indigo-50">Enter the professional details of the person you're referring.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black">2</div>
                  <p className="text-sm font-medium text-indigo-50">They'll receive a verified invite to join BizCircle and this community.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black">3</div>
                  <p className="text-sm font-medium text-indigo-50">Once they verify their email, you instantly earn 30 BizPoints!</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-amber-500" size={20} />
              <h4 className="font-black text-amber-900">Why Refer?</h4>
            </div>
            <p className="text-amber-700 text-sm font-medium leading-relaxed">
              Referrals are the lifeblood of our professional network. By inviting high-quality members, you're helping grow "{circle.name}" and increasing your visibility within the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
