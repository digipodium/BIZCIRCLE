"use client";
import { useState } from "react";
import { MapPin, Edit3, Camera, Shield, Check, BookOpen, Star, Briefcase, User } from "lucide-react";

export default function ProfileOverview() {
 const ProfileOverview = () => {
   const [editBio, setEditBio] = useState(false);
   const [bio, setBio] = useState("Senior product strategist helping startups scale from 0→1. Passionate about B2B SaaS, GTM strategy, and building world-class teams across global markets.");
   const [tempBio, setTempBio] = useState(bio);
 
   const stats = [
     { v: "347", l: "Connections", icon: User },
     { v: "82",  l: "Posts",       icon: BookOpen },
     { v: "4.9", l: "Rating",      icon: Star },
     { v: "12",  l: "Projects",    icon: Briefcase },
   ];
 
   return (
     <div className="panel-accent" style={{ overflow: "hidden", animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0s both" }}>
       <div className="accent-bar" />
       {/* Banner */}
       <div style={{ height: 120, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 50%, #e0f2fe 100%)" }}>
         <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle at 15% 50%, #93c5fd 0%, transparent 55%), radial-gradient(circle at 85% 50%, #7dd3fc 0%, transparent 55%)" }} />
         <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
           <defs>
             <pattern id="pg" width="28" height="28" patternUnits="userSpaceOnUse">
               <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#3b82f6" strokeWidth="0.6" />
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#pg)" />
         </svg>
         <button className="btn-outline" style={{ position: "absolute", top: 12, right: 12, padding: "5px 12px", fontSize: "0.78rem" }}>
           <Edit3 size={11} /> Edit Cover
         </button>
       </div>
 
       <div style={{ padding: "0 24px 24px" }}>
         {/* Avatar + actions */}
         <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -32, marginBottom: 18 }}>
           <div style={{ position: "relative" }}>
             <div className="avatar-ring">
               <img src="https://api.dicebear.com/7.x/personas/svg?seed=bizuser&backgroundColor=dbeafe"
                 style={{ width: 76, height: 76, borderRadius: "50%", display: "block" }} alt="avatar" />
             </div>
             <button className="btn-primary" style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, borderRadius: "50%", padding: 0, justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
               <Camera size={12} />
             </button>
           </div>
           <div style={{ display: "flex", gap: 8 }}>
             <button className="btn-outline"><Shield size={13} /> Verify</button>
             <button className="btn-primary"><Edit3 size={13} /> Edit Profile</button>
           </div>
         </div>
 
         {/* Name */}
         <div style={{ marginBottom: 16 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
             <h1 className="f-display" style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>Rahul Mehta</h1>
             <span className="badge-blue">Pro Member</span>
             <span className="badge-green">Open to Work</span>
           </div>
           <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 4 }}>
             @rahulmehta &nbsp;·&nbsp; <span style={{ color: "#2563eb", fontWeight: 600 }}>BIZ-2847</span>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", color: "#64748b" }}>
             <MapPin size={13} color="#3b82f6" /> Mumbai, India
           </div>
         </div>
 
         {/* Bio */}
         <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
           {editBio ? (
             <>
               <textarea value={tempBio} onChange={e => setTempBio(e.target.value)} rows={3}
                 className="inp" style={{ resize: "none", marginBottom: 10 }} />
               <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                 <button className="btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                   onClick={() => { setTempBio(bio); setEditBio(false); }}>Cancel</button>
                 <button className="btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                   onClick={() => { setBio(tempBio); setEditBio(false); }}>
                   <Check size={12} /> Save
                 </button>
               </div>
             </>
           ) : (
             <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
               <p style={{ flex: 1, fontSize: "0.875rem", lineHeight: 1.7, color: "#475569" }}>{bio}</p>
               <button onClick={() => { setTempBio(bio); setEditBio(true); }}
                 style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", flexShrink: 0 }}>
                 <Edit3 size={14} />
               </button>
             </div>
           )}
         </div>
 
         {/* Stats */}
         <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
           {stats.map(s => (
             <div key={s.l} className="stat-card">
               <s.icon size={14} color="#3b82f6" style={{ margin: "0 auto 6px" }} />
               <div className="f-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{s.v}</div>
               <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{s.l}</div>
             </div>
           ))}
         </div>
 
         {/* Completion */}
         <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
           <CompletionRing pct={78} />
           <div style={{ flex: 1 }}>
             <div className="f-display" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Profile Completion</div>
             <div style={{ height: 6, borderRadius: 99, background: "#dbeafe", marginBottom: 6 }}>
               <div className="bar-fill" style={{ "--target-w": "78%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #2563eb, #38bdf8)" }} />
             </div>
             <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
               Add LinkedIn & portfolio to reach <span style={{ color: "#2563eb", fontWeight: 600 }}>100%</span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
}