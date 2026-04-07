"use client";

import ProfileOverview from "@/components/ProfileOverview";
import PersonalInfo from "@/components/PersonalInfo";
import ProfessionalDetails from "@/components/ProfessionalDetails";
import DomainsInterests from "@/components/DomainsInterests";
import Referrals from "@/components/Referrals";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import {
  MapPin, Mail, Phone, Calendar, User, Briefcase, Building2,
  Globe, Award, TrendingUp, Edit3, Check, X, Plus,
  ChevronRight, Star, BarChart2, Link, Camera, Shield,
  Clock, BookOpen, Target, Linkedin, Send, Inbox,
  UserCheck, UserPlus, ArrowUpRight, ArrowDownLeft,
  RefreshCw, Filter, Search, ThumbsUp, AlertCircle
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES — light mode, professional blue
───────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #f0f4fa;
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      min-height: 100vh;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #e2e8f0; }
    ::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }

    .f-display { font-family: 'Plus Jakarta Sans', sans-serif; }

    /* panels */
    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 1px 4px rgba(30,41,59,0.06);
    }
    .panel-accent {
      background: #ffffff;
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      box-shadow: 0 1px 6px rgba(59,130,246,0.08);
    }

    /* inputs */
    .inp {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      padding: 10px 14px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
    }
    .inp:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
    }
    .inp::placeholder { color: #94a3b8; }
    select.inp { cursor: pointer; }

    /* buttons */
    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
    }
    .btn-primary:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(59,130,246,0.35);
    }

    .btn-outline {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      font-size: 0.875rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
    }
    .btn-outline:hover {
      border-color: #3b82f6;
      color: #2563eb;
      background: #eff6ff;
    }

    .btn-sm {
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      border-radius: 8px;
      padding: 5px 12px;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.18s;
    }
    .btn-sm-blue {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    .btn-sm-blue:hover { background: #dbeafe; }
    .btn-sm-green {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
    .btn-sm-green:hover { background: #dcfce7; }
    .btn-sm-red {
      background: #fff1f2;
      color: #dc2626;
      border: 1px solid #fecdd3;
    }
    .btn-sm-red:hover { background: #ffe4e6; }
    .btn-sm-gray {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }
    .btn-sm-gray:hover { background: #f1f5f9; }

    /* nav tabs */
    .nav-tab {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 9px 16px;
      border-radius: 9px;
      cursor: pointer;
      transition: all 0.18s;
      color: #64748b;
      background: transparent;
      border: none;
      white-space: nowrap;
    }
    .nav-tab:hover { color: #1e293b; background: #f1f5f9; }
    .nav-tab.active {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
      font-weight: 600;
    }

    /* sub-tabs (referrals) */
    .sub-tab {
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      padding: 7px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.18s;
      color: #64748b;
      background: transparent;
      border: 1px solid transparent;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sub-tab:hover { background: #f1f5f9; color: #1e293b; }
    .sub-tab.active {
      background: #ffffff;
      border-color: #e2e8f0;
      color: #2563eb;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(30,41,59,0.08);
    }

    /* chips */
    .chip {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 99px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      transition: all 0.18s;
      font-family: 'Inter', sans-serif;
    }
    .chip:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
    .chip.active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #2563eb;
      font-weight: 600;
    }

    /* skill pills */
    .skill-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 0.78rem;
      color: #2563eb;
      font-family: 'Inter', sans-serif;
    }
    .skill-pill-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #93c5fd;
      line-height: 1;
      padding: 0;
      display: flex;
      align-items: center;
    }
    .skill-pill-btn:hover { color: #2563eb; }

    /* badges */
    .badge-blue {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #2563eb;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
    }
    .badge-green {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #16a34a;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
    }
    .badge-amber {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #d97706;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
    }
    .badge-gray {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
    }

    /* referral card */
    .ref-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .ref-card:hover {
      box-shadow: 0 4px 16px rgba(59,130,246,0.1);
      border-color: #bfdbfe;
    }

    /* link row */
    .link-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      transition: border-color 0.2s;
    }
    .link-row:hover { border-color: #93c5fd; }
    .link-row input {
      background: none;
      border: none;
      outline: none;
      flex: 1;
      font-size: 0.875rem;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
    }
    .link-row input::placeholder { color: #94a3b8; }

    /* stat card */
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s;
    }
    .stat-card:hover {
      border-color: #93c5fd;
      box-shadow: 0 4px 12px rgba(59,130,246,0.1);
      transform: translateY(-2px);
    }

    /* section eyebrow */
    .section-eyebrow {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #3b82f6;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* divider */
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 20px 0; }

    /* accent top bar */
    .accent-bar {
      height: 3px;
      background: linear-gradient(90deg, #2563eb, #38bdf8, #2563eb);
      border-radius: 16px 16px 0 0;
    }

    /* sidebar action btn */
    .action-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 10px;
      font-size: 0.85rem;
      color: #475569;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.18s;
      font-family: 'Inter', sans-serif;
      text-align: left;
    }
    .action-btn:hover {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #1e293b;
    }

    /* completion ring */
    .completion-ring { position: relative; width: 56px; height: 56px; flex-shrink: 0; }
    .completion-ring svg { transform: rotate(-90deg); }
    .ring-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      color: #2563eb;
    }

    /* avatar ring */
    .avatar-ring {
      background: linear-gradient(135deg, #2563eb, #38bdf8);
      padding: 3px;
      border-radius: 50%;
      display: inline-block;
    }

    /* animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

    @keyframes fillBar {
      from { width: 0; }
      to   { width: var(--target-w); }
    }
    .bar-fill { animation: fillBar 1s cubic-bezier(0.22,1,0.36,1) 0.4s both; }

    /* layout */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
    }
    .page-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 22px;
      align-items: start;
    }
    @media (max-width: 860px) {
      .page-grid { grid-template-columns: 1fr; }
      .sidebar-col { display: none; }
    }
    .tab-bar { overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; }
    .tab-bar::-webkit-scrollbar { display: none; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const CompletionRing = ({ pct }) => {
  const r = 22, circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <div className="completion-ring">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="url(#blueG)"
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`} />
        <defs>
          <linearGradient id="blueG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-label">{pct}%</div>
    </div>
  );
};

const FieldLabel = ({ icon: Icon, children }) => (
  <label style={{
    display: "flex", alignItems: "center", gap: 6,
    fontSize: "0.75rem", fontWeight: 500, color: "#64748b",
    marginBottom: 7, fontFamily: "'Inter', sans-serif"
  }}>
    {Icon && <Icon size={12} color="#3b82f6" />}
    {children}
  </label>
);

const Section = ({ title, icon: Icon, children, delay = "0s", accent = false }) => (
  <div className={accent ? "panel-accent" : "panel"}
    style={{ overflow: "hidden", animation: `fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${delay} both` }}>
    <div className="accent-bar" />
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: "#eff6ff", border: "1px solid #bfdbfe",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={15} color="#2563eb" />
        </div>
        <span className="f-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{title}</span>
      </div>
      {children}
    </div>
  </div>
);

const SaveBar = ({ onSave, saved }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
    <button className="btn-outline">Discard Changes</button>
    <button onClick={onSave} className="btn-primary">
      <Check size={14} />{saved ? "Saved!" : "Save Changes"}
    </button>
  </div>
);

const ChipGroup = ({ options, selected, setSelected }) => {
  const toggle = o => setSelected(
    selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => (
        <button key={o} onClick={() => toggle(o)}
          className={`chip ${selected.includes(o) ? "active" : ""}`}>{o}</button>
      ))}
    </div>
  );
};

const SkillInput = ({ skills, setSkills }) => {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !skills.includes(t)) setSkills([...skills, t]);
    setVal("");
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {skills.map(s => (
          <span key={s} className="skill-pill">
            {s}
            <button className="skill-pill-btn" onClick={() => setSkills(skills.filter(x => x !== s))}>
              <X size={11} />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No skills added yet.</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder='Type a skill and press Enter…'
          className="inp" style={{ flex: 1 }} />
        <button onClick={add} className="btn-primary" style={{ flexShrink: 0, padding: "9px 14px" }}>
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROFILE OVERVIEW
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   PERSONAL INFO
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   PROFESSIONAL DETAILS
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   DOMAINS & INTERESTS
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   REFERRALS TAB
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview",     label: "Overview" },
    { id: "personal",     label: "Personal Info" },
    { id: "professional", label: "Professional" },
    { id: "domains",      label: "Domains & Interests" },
    { id: "referrals",    label: "Referrals" },
  ];

  return (
    <>
      <GlobalStyles />

      {/* Top bar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(30,41,59,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="btn-primary f-display" style={{ width: 34, height: 34, borderRadius: 9, padding: 0, justifyContent: "center", fontSize: "0.95rem", fontWeight: 800, flexShrink: 0 }}>B</div>
            <span className="f-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>BizCircle</span>
            <span className="badge-blue">Profile Editor</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-outline">Preview</button>
            <button className="btn-primary"><Globe size={13} /> Go Public</button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div className="tab-bar" style={{ display: "flex", gap: 4, padding: "8px 0" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`nav-tab ${tab === t.id ? "active" : ""}`}>
                {t.label}
                {t.id === "referrals" && (
                  <span style={{ marginLeft: 6, background: "#dbeafe", color: "#2563eb", borderRadius: 99, fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px" }}>
                    <span className="badge-blue" style={{ marginLeft: 6 }}>Ref</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div className="page-grid">
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {tab === "overview"     && <ProfileOverview />}
            {tab === "personal"     && <PersonalInfo />}
            {tab === "professional" && <ProfessionalDetails />}
            {tab === "domains"      && <DomainsInterests />}
            {tab === "referrals"    && <Referrals />}
          </div>
          <div className="sidebar-col" style={{ position: "sticky", top: 80 }}>
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}