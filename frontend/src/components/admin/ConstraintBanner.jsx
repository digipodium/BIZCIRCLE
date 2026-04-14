"use client";

export default function ConstraintBanner() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 20px",
      background: "linear-gradient(135deg, #eff6ff, #e0f2fe)",
      border: "1px solid #bfdbfe",
      borderLeft: "4px solid #2563eb",
      borderRadius: "12px",
      marginBottom: "28px",
    }}>
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        flexShrink: 0,
      }}>
        ℹ️
      </div>
      <div>
        <span style={{ fontWeight: 700, color: "#1e40af", fontSize: "14px" }}>
          Circle Limit Policy —{" "}
        </span>
        <span style={{ color: "#3b82f6", fontSize: "14px" }}>
          You can manage up to <strong>3 circles</strong> in similar domains. This helps maintain focused, high-quality communities.
        </span>
      </div>
    </div>
  );
}
