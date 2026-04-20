"use client";

export default function EngagementAnalyticsSection({ stats }) {
  const metrics = [
    {
      id: "posts",
      label: "Total Posts",
      value: stats?.totalPosts || 0,
      icon: "📝",
      color: "#8b5cf6",
      bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
      border: "#ddd6fe",
      iconBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    },
    {
      id: "comments",
      label: "Total Comments",
      value: stats?.totalComments || 0,
      icon: "💬",
      color: "#ec4899",
      bg: "linear-gradient(135deg, #fdf2f8, #fbcfe8)",
      border: "#f9a8d4",
      iconBg: "linear-gradient(135deg, #ec4899, #be185d)",
    },
    {
      id: "reactions",
      label: "Total Reactions",
      value: stats?.totalReactions || 0,
      icon: "❤️",
      color: "#f43f5e",
      bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
      border: "#fecdd3",
      iconBg: "linear-gradient(135deg, #f43f5e, #be123c)",
    },
    {
      id: "engagement",
      label: "Avg Engagement",
      value: `${stats?.engagementRate || 0}%`,
      icon: "📈",
      color: "#10b981",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      border: "#a7f3d0",
      iconBg: "linear-gradient(135deg, #10b981, #047857)",
    }
  ];

  return (
    <div style={{ marginBottom: "36px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          letterSpacing: "-0.3px",
        }}>
          Engagement Analytics
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}>
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="card-hover"
            style={{
              background: metric.bg,
              border: `1px solid ${metric.border}`,
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: metric.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "white",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              {metric.icon}
            </div>
            <div>
              <div style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1,
                letterSpacing: "-0.5px",
              }}>
                {metric.value}
              </div>
              <div style={{ color: "#6b7280", fontSize: "13px", fontWeight: 500, marginTop: "4px" }}>
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
