"use client";
import { useState } from "react";

export default function Sidebar() {

const Sidebar = () => {
  const analytics = [
    { label: "Profile Views",       val: "1,204", delta: "+18%",    up: true },
    { label: "Connection Requests", val: "34",    delta: "+5 today", up: true },
    { label: "Post Impressions",    val: "8.7k",  delta: "+12%",    up: true },
    { label: "Search Appearances",  val: "421",   delta: "−3%",     up: false },
  ];
  const checklist = [
    { label: "Profile photo",      done: true },
    { label: "Bio & location",     done: true },
    { label: "Work experience",    done: true },
    { label: "Skills (5+)",        done: true },
    { label: "Domain & interests", done: true },
    { label: "LinkedIn URL",       done: false },
    { label: "Portfolio link",     done: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Quick Actions */}
      <div className="panel" style={{ padding: 20, animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}>
        <div className="section-eyebrow" style={{ marginBottom: 14 }}>Quick Actions</div>
        {[
          { icon: User,       label: "View Public Profile" },
          { icon: TrendingUp, label: "Analytics Dashboard" },
          { icon: Award,      label: "Claim Certifications" },
          { icon: Globe,      label: "Share Profile Link" },
        ].map(a => (
          <button key={a.label} className="action-btn">
            <a.icon size={15} color="#3b82f6" />
            {a.label}
            <ChevronRight size={13} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
          </button>
        ))}
      </div>

      {/* Analytics */}
      <div className="panel" style={{ padding: 20, animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.18s both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div className="section-eyebrow">This Week</div>
          <BarChart2 size={13} color="#3b82f6" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {analytics.map(a => (
            <div key={a.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{a.label}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{a.val}</div>
                <div style={{ fontSize: "0.72rem", color: a.up ? "#16a34a" : "#dc2626" }}>{a.delta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="panel" style={{ padding: 20, animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.26s both" }}>
        <div className="section-eyebrow" style={{ marginBottom: 14 }}>Complete Your Profile</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {checklist.map(c => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: c.done ? "linear-gradient(135deg,#2563eb,#38bdf8)" : "transparent", border: c.done ? "none" : "1.5px solid #e2e8f0" }}>
                {c.done && <Check size={11} color="white" />}
              </div>
              <span style={{ fontSize: "0.8rem", color: c.done ? "#94a3b8" : "#1e293b", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, height: 6, borderRadius: 99, background: "#e2e8f0" }}>
          <div style={{ width: "72%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#2563eb,#38bdf8)" }} />
        </div>
        <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 6 }}>5 of 7 complete</div>
      </div>
    </div>
  );
};
}