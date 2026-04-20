"use client";

export default function NetworkingActivitySection({ activities = [] }) {
  // Mock data if activities array is empty
  const networkActivities = activities.length > 0 ? activities : [
    { id: 1, type: "connection", text: "Alex established a new connection with Sarah", time: "2 hours ago" },
    { id: 2, type: "post", text: "Mark posted an update in 'Tech Startup Hub'", time: "4 hours ago" },
    { id: 3, type: "milestone", text: "BizCircle reached 1,000 active members today!", time: "1 day ago" }
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
          Networking Activity
        </h2>
        <span style={{ fontSize: "14px", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>
          View Activity Log &rarr;
        </span>
      </div>

      <div style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        {networkActivities.map((activity, index) => (
          <div key={activity.id} style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            paddingBottom: index !== networkActivities.length - 1 ? "16px" : "0",
            borderBottom: index !== networkActivities.length - 1 ? "1px solid #f3f4f6" : "none"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: activity.type === 'connection' ? '#e0e7ff' : activity.type === 'milestone' ? '#fef3c7' : '#f3f4f6',
              color: activity.type === 'connection' ? '#4f46e5' : activity.type === 'milestone' ? '#d97706' : '#4b5563',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0
            }}>
              {activity.type === 'connection' ? '🔗' : activity.type === 'milestone' ? '🎉' : '📢'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#374151" }}>
                {activity.text}
              </p>
              <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500, marginTop: "2px", display: "inline-block" }}>
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
