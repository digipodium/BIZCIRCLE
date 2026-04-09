"use client";

import { useState } from "react";

function RequestRow({ request, onAccept, onReject }) {
  const [hover, setHover] = useState(null);

  return (
    <div
      id={`request-${request.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid #f3f4f6",
        transition: "background 0.15s",
        flexWrap: "wrap",
        gap: "12px",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      {/* Left: Avatar + Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "200px" }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${request.avatarBg.replace("from-", "").replace(" to-", ", ")})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: "14px",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
          className={`bg-gradient-to-br ${request.avatarBg}`}
        >
          {request.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}>
            {request.userName}
          </div>
          <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "1px" }}>
            {request.role}
          </div>
        </div>
      </div>

      {/* Middle: Group + Time */}
      <div style={{ flex: 1, minWidth: "160px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          background: "#eff6ff",
          color: "#2563eb",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          border: "1px solid #bfdbfe",
        }}>
          <span>⬡</span>
          {request.groupName}
        </div>
        <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "6px" }}>
          {request.time}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          id={`accept-btn-${request.id}`}
          onClick={() => onAccept(request.id)}
          style={{
            padding: "8px 18px",
            background: hover === `accept-${request.id}`
              ? "linear-gradient(135deg, #16a34a, #15803d)"
              : "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 2px 6px rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          onMouseEnter={() => setHover(`accept-${request.id}`)}
          onMouseLeave={() => setHover(null)}
        >
          <span>✓</span> Accept
        </button>
        <button
          id={`reject-btn-${request.id}`}
          onClick={() => onReject(request.id)}
          style={{
            padding: "8px 18px",
            background: hover === `reject-${request.id}`
              ? "#fee2e2"
              : "white",
            color: "#dc2626",
            border: "1.5px solid #fecaca",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          onMouseEnter={() => setHover(`reject-${request.id}`)}
          onMouseLeave={() => setHover(null)}
        >
          <span>✕</span> Reject
        </button>
      </div>
    </div>
  );
}

export default function JoinRequestsSection({ requests, onAccept, onReject }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>
            Recent Join Requests
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>
            Review and manage incoming membership requests
          </p>
        </div>
        {requests.length > 0 && (
          <span style={{
            padding: "4px 14px",
            background: "#fef3c7",
            color: "#d97706",
            border: "1px solid #fde68a",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 700,
          }}>
            {requests.length} pending
          </span>
        )}
      </div>

      <div style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        {/* Table header */}
        <div style={{
          display: "flex",
          padding: "12px 20px",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          fontSize: "11px",
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          gap: "12px",
        }}>
          <span style={{ flex: "0 0 220px" }}>Applicant</span>
          <span style={{ flex: 1 }}>Requested Circle</span>
          <span>Actions</span>
        </div>

        {requests.length === 0 ? (
          <div style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#9ca3af",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#6b7280" }}>
              All caught up!
            </div>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>
              No pending join requests at the moment.
            </div>
          </div>
        ) : (
          requests.map((req) => (
            <RequestRow
              key={req.id}
              request={req}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))
        )}
      </div>
    </section>
  );
}
