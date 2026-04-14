"use client";

const statCards = [
  {
    id: "total-groups",
    label: "Total Groups",
    icon: "⬡",
    suffix: "/ 3",
    color: "#2563eb",
    bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "#bfdbfe",
    iconBg: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  },
  {
    id: "total-members",
    label: "Total Members",
    icon: "👥",
    suffix: "",
    color: "#059669",
    bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "#bbf7d0",
    iconBg: "linear-gradient(135deg, #059669, #047857)",
  },
  {
    id: "pending-requests",
    label: "Pending Requests",
    icon: "🕐",
    suffix: "",
    color: "#d97706",
    bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "#fde68a",
    iconBg: "linear-gradient(135deg, #d97706, #b45309)",
  },
];

export default function StatsSection({ totalGroups, totalMembers, pendingRequests }) {
  const values = [totalGroups, totalMembers, pendingRequests];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
      marginBottom: "28px",
    }}>
      {statCards.map((card, i) => (
        <div
          key={card.id}
          id={card.id}
          className="card-hover"
          style={{
            background: card.bg,
            border: `1px solid ${card.border}`,
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: card.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            {card.icon}
          </div>
          <div>
            <div style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1,
              letterSpacing: "-1px",
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}>
              {values[i]}
              {card.suffix && (
                <span style={{ fontSize: "16px", color: "#9ca3af", fontWeight: 500 }}>
                  {card.suffix}
                </span>
              )}
            </div>
            <div style={{ color: "#6b7280", fontSize: "13px", fontWeight: 500, marginTop: "4px" }}>
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
