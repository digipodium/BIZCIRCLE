"use client";

export default function AdminHeader({ groupCount, maxGroups, onCreateGroup }) {
  const canCreate = groupCount < maxGroups;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "32px",
      flexWrap: "wrap",
      gap: "16px",
    }}>
      <div>
        <h1 style={{
          fontSize: "30px",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-0.5px",
          marginBottom: "6px",
        }}>
          Manage Your Circles
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px", fontWeight: 400 }}>
          Oversee and manage your professional communities
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a
          href="/admin/system-config"
          id="system-config-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            background: "#f8fafc",
            color: "#374151",
            border: "1.5px solid #e5e7eb",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.color = "#2563eb";
            e.currentTarget.style.background = "#eff6ff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.color = "#374151";
            e.currentTarget.style.background = "#f8fafc";
          }}
        >
          ⚙️ System Config
        </a>
      <button
        id="create-group-btn"
        onClick={onCreateGroup}
        disabled={!canCreate}
        title={!canCreate ? "You've reached the maximum of 3 circles" : "Create a new circle"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 22px",
          background: canCreate
            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
            : "#d1d5db",
          color: canCreate ? "white" : "#9ca3af",
          border: "none",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "14px",
          cursor: canCreate ? "pointer" : "not-allowed",
          boxShadow: canCreate ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (canCreate) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.45)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = canCreate ? "0 4px 14px rgba(37,99,235,0.35)" : "none";
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
        Create Group
        {!canCreate && (
          <span style={{
            fontSize: "11px",
            background: "#9ca3af",
            color: "white",
            padding: "2px 6px",
            borderRadius: "6px",
            marginLeft: "2px",
          }}>
            {groupCount}/{maxGroups}
          </span>
        )}
      </button>
      </div>
    </div>
  );
}
