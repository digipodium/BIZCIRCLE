"use client";

import Link from "next/link";

const domainColors = {
  Technology: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  Marketing: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  Finance: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Design: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  Healthcare: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

function GroupCard({ group }) {
  const domStyle = domainColors[group.domain] || domainColors.Technology;

  return (
    <div
      id={`group-card-${group.id}`}
      className="card-hover"
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Card Top Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${group.color.replace("from-", "").replace(" to-", ", ")})`,
        backgroundImage: group.color.includes("from-")
          ? undefined
          : `linear-gradient(135deg, #2563eb, #1d4ed8)`,
        height: "90px",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: "0 20px 16px",
      }}
        className={`bg-gradient-to-br ${group.color}`}
      >
        {/* Group Icon */}
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          position: "absolute",
          bottom: "-20px",
          left: "20px",
        }}>
          {group.icon}
        </div>

        {/* Pending badge */}
        {group.pending > 0 && (
          <div style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "#fef3c7",
            color: "#d97706",
            border: "1px solid #fde68a",
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "11px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}>
            🕐 {group.pending} pending
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: "28px 20px 20px", flex: 1 }}>
        <h3 style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "6px",
          lineHeight: 1.3,
        }}>
          {group.name}
        </h3>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 10px",
            background: domStyle.bg,
            color: domStyle.text,
            border: `1px solid ${domStyle.border}`,
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
          }}>
            {group.domain}
          </span>
          <span style={{
            padding: "3px 10px",
            background: "#f9fafb",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}>
            📍 {group.location}
          </span>
        </div>

        {/* Member count */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "20px",
          color: "#6b7280",
          fontSize: "13px",
        }}>
          <span>👥</span>
          <span><strong style={{ color: "#111827" }}>{group.members}</strong> members</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href={`/dashboard/circles/${group.id}`}
            id={`manage-btn-${group.id}`}
            style={{
              flex: 1,
              padding: "9px 0",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              textAlign: "center",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.3)";
            }}
          >
            ⚙️ Manage
          </Link>
          <Link
            href={`/dashboard/circles/${group.id}`}
            id={`view-btn-${group.id}`}
            style={{
              flex: 1,
              padding: "9px 0",
              background: "white",
              color: "#2563eb",
              border: "1.5px solid #bfdbfe",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eff6ff";
              e.currentTarget.style.borderColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#bfdbfe";
            }}
          >
            👁 View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GroupsSection({ groups }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>
            Your Groups
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>
            {groups.length} of 3 circles active
          </p>
        </div>
        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "120px",
            height: "6px",
            background: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${(groups.length / 3) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              borderRadius: "4px",
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
            {groups.length}/3
          </span>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
      }}>
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}

        {/* Empty slot placeholders */}
        {Array.from({ length: Math.max(0, 3 - groups.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              borderRadius: "16px",
              border: "2px dashed #e5e7eb",
              background: "#fafafa",
              minHeight: "240px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#d1d5db",
            }}
          >
            <div style={{ fontSize: "36px" }}>＋</div>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>Empty Slot</span>
          </div>
        ))}
      </div>
    </section>
  );
}
