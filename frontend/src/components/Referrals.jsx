"use client";
import { useState } from "react";

export default function Referrals() {

const statusStyles = {
  Accepted:  { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", dot: "#22c55e" },
  Pending:   { bg: "#fffbeb", border: "#fde68a", color: "#d97706", dot: "#f59e0b" },
  Declined:  { bg: "#fff1f2", border: "#fecdd3", color: "#dc2626", dot: "#ef4444" },
  Withdrawn: { bg: "#f8fafc", border: "#e2e8f0", color: "#64748b", dot: "#94a3b8" },
};

const StatusBadge = ({ status }) => {
  const s = statusStyles[status] || statusStyles["Pending"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

const sharedReferrals = [
  { id: 1, name: "Priya Sharma", role: "UX Designer", company: "DesignCo", avatar: "priya", status: "Accepted", date: "Mar 28, 2025", note: "Referred for Sr. UX Designer role. Priya has 5+ years in product design.", mutualConn: 12, yourNote: "Highly recommended for her attention to detail." },
  { id: 2, name: "Arjun Nair", role: "Full Stack Dev", company: "TechNova", avatar: "arjun", status: "Pending", date: "Apr 1, 2025", note: "Referred for Backend Engineering position.", mutualConn: 4, yourNote: "Strong Node.js and AWS background." },
  { id: 3, name: "Sneha Kulkarni", role: "Data Analyst", company: "FinEdge", avatar: "sneha", status: "Declined", date: "Mar 15, 2025", note: "Referred for Data Science role at FinEdge.", mutualConn: 7, yourNote: "Great SQL and Python skills." },
  { id: 4, name: "Vikram Patel", role: "Product Manager", company: "GrowthLabs", avatar: "vikram", status: "Accepted", date: "Feb 20, 2025", note: "Referred for PM position internally.", mutualConn: 21, yourNote: "Excellent cross-functional collaboration skills." },
];

const receivedReferrals = [
  { id: 1, from: "Ananya Mehrotra", fromRole: "VP Engineering @ InfraTech", avatar: "ananya", role: "Head of Product Strategy", company: "NovaSaaS", status: "Pending", date: "Apr 2, 2025", note: "Ananya believes your GTM expertise is a perfect fit for NovaSaaS's expansion.", mutualConn: 15 },
  { id: 2, from: "Rohan Desai", fromRole: "Partner @ Accel India", avatar: "rohan", role: "Chief Product Officer", company: "EdScale", status: "Accepted", date: "Mar 25, 2025", note: "Rohan has recommended you for CPO role based on your track record at GrowthLabs.", mutualConn: 9 },
  { id: 3, from: "Kavita Rao", fromRole: "Director @ McKinsey", avatar: "kavita", role: "Strategy Consultant", company: "McKinsey & Co.", status: "Withdrawn", date: "Mar 10, 2025", note: "Position was filled internally. Kavita will reach out for future opportunities.", mutualConn: 6 },
];

const ReferralCard = ({ ref: _, data, type }) => {
  const [expanded, setExpanded] = useState(false);
  const isShared = type === "shared";

  return (
    <div className="ref-card">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${isShared ? data.avatar : data.avatar}&backgroundColor=dbeafe`}
            style={{ width: 46, height: 46, borderRadius: 12, border: "2px solid #e2e8f0", display: "block" }} alt="avatar" />
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", border: "2px solid white", background: isShared ? "#3b82f6" : "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isShared ? <ArrowUpRight size={8} color="white" /> : <ArrowDownLeft size={8} color="white" />}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <div>
              <div className="f-display" style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
                {isShared ? data.name : data.role}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                {isShared ? `${data.role} · ${data.company}` : `at ${data.company}`}
              </div>
            </div>
            <StatusBadge status={data.status} />
          </div>

          {/* From / To label */}
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            {isShared ? (
              <><Send size={11} color="#3b82f6" /> Referred to {data.company}</>
            ) : (
              <><Inbox size={11} color="#8b5cf6" /> From <span style={{ color: "#475569", fontWeight: 500 }}>{data.from}</span> · {data.fromRole}</>
            )}
            <span style={{ marginLeft: "auto" }}>
              <Clock size={10} color="#94a3b8" style={{ display: "inline", marginRight: 3 }} />
              {data.date}
            </span>
          </div>

          {/* Note preview */}
          <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6, background: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #f1f5f9", marginBottom: 10 }}>
            "{data.note}"
          </p>

          {/* Mutual connections */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ display: "flex" }}>
              {[1,2,3].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/personas/svg?seed=mu${data.id}${i}&backgroundColor=eff6ff`}
                  style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid white", marginLeft: i === 1 ? 0 : -6, display: "block" }} alt="" />
              ))}
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{data.mutualConn} mutual connections</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {isShared ? (
              <>
                {data.status === "Pending" && (
                  <button className="btn-sm btn-sm-red"><X size={11} /> Withdraw</button>
                )}
                <button className="btn-sm btn-sm-gray" onClick={() => setExpanded(!expanded)}>
                  <ChevronRight size={11} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  {expanded ? "Less" : "View Note"}
                </button>
                <button className="btn-sm btn-sm-blue"><RefreshCw size={11} /> Follow Up</button>
              </>
            ) : (
              <>
                {data.status === "Pending" && (
                  <>
                    <button className="btn-sm btn-sm-green"><ThumbsUp size={11} /> Accept</button>
                    <button className="btn-sm btn-sm-red"><X size={11} /> Decline</button>
                  </>
                )}
                <button className="btn-sm btn-sm-blue" onClick={() => setExpanded(!expanded)}>
                  <ChevronRight size={11} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  {expanded ? "Less" : "Details"}
                </button>
              </>
            )}
          </div>

          {/* Expanded note */}
          {expanded && isShared && data.yourNote && (
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: "0.8rem", color: "#2563eb" }}>
              <span style={{ fontWeight: 600 }}>Your referral note: </span>{data.yourNote}
            </div>
          )}
          {expanded && !isShared && (
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: "#faf5ff", border: "1px solid #e9d5ff", fontSize: "0.8rem", color: "#7c3aed" }}>
              <span style={{ fontWeight: 600 }}>Referrer's message: </span>{data.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


  const [subTab, setSubTab] = useState("shared");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filterOpts = ["All", "Accepted", "Pending", "Declined", "Withdrawn"];
  const data = subTab === "shared" ? sharedReferrals : receivedReferrals;

  const filtered = data.filter(r => {
    const matchStatus = filter === "All" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (subTab === "shared"
        ? r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.role.toLowerCase().includes(q)
        : r.from.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.role.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const counts = {
    shared: { total: sharedReferrals.length, accepted: sharedReferrals.filter(r => r.status === "Accepted").length, pending: sharedReferrals.filter(r => r.status === "Pending").length },
    received: { total: receivedReferrals.length, accepted: receivedReferrals.filter(r => r.status === "Accepted").length, pending: receivedReferrals.filter(r => r.status === "Pending").length },
  };

  return (
    <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0s both" }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Shared", val: counts.shared.total, icon: Send, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
          { label: "Total Received", val: counts.received.total, icon: Inbox, color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
          { label: "Acceptance Rate", val: "71%", icon: UserCheck, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        ].map(s => (
          <div key={s.label} className="panel" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div className="f-display" style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>{s.val}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="panel" style={{ overflow: "hidden" }}>
        <div className="accent-bar" />
        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <UserPlus size={15} color="#2563eb" />
            </div>
            <span className="f-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Referrals</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                <Filter size={12} /> Filter
              </button>
              <button className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                <Plus size={12} /> New Referral
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 6, padding: "6px", background: "#f8fafc", borderRadius: 12, marginBottom: 18, border: "1px solid #e2e8f0" }}>
            <button onClick={() => setSubTab("shared")} className={`sub-tab ${subTab === "shared" ? "active" : ""}`} style={{ flex: 1, justifyContent: "center" }}>
              <Send size={13} />
              Shared
              <span style={{ marginLeft: 4, background: "#dbeafe", color: "#2563eb", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px" }}>{counts.shared.total}</span>
            </button>
            <button onClick={() => setSubTab("received")} className={`sub-tab ${subTab === "received" ? "active" : ""}`} style={{ flex: 1, justifyContent: "center" }}>
              <Inbox size={13} />
              Received
              <span style={{ marginLeft: 4, background: "#f3e8ff", color: "#7c3aed", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px" }}>{counts.received.total}</span>
            </button>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", marginBottom: 14 }}>
            <Search size={14} color="#94a3b8" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={subTab === "shared" ? "Search by name, company, or role…" : "Search by referrer, company, or role…"}
              style={{ background: "none", border: "none", outline: "none", flex: 1, fontSize: "0.875rem", color: "#1e293b", fontFamily: "'Inter',sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={13} /></button>}
          </div>

          {/* Status filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {filterOpts.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`chip ${filter === f ? "active" : ""}`}
                style={{ padding: "4px 12px", fontSize: "0.75rem" }}>{f}</button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <AlertCircle size={32} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontWeight: 600, color: "#475569", marginBottom: 4 }}>No referrals found</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Try adjusting your search or filter.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map(r => (
                <ReferralCard key={r.id} data={r} type={subTab} />
              ))}
            </div>
          )}

          {/* Footer info */}
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={13} color="#94a3b8" />
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {subTab === "shared"
                ? "Referrals you've shared are visible to the recipient and their organisation."
                : "Referrals received are only visible to you. Contact referrers directly to follow up."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

