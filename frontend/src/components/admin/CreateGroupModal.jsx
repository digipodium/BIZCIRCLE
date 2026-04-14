"use client";

import { useState } from "react";

const DOMAINS = ["Technology", "Marketing", "Finance", "Design", "Healthcare"];
const LOCATIONS = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Lucknow"];
const GROUP_ICONS = ["💻", "⚙️", "🤖", "📊", "🎨", "💡", "🚀", "🔬"];
const COLORS = [
  "from-blue-500 to-blue-700",
  "from-sky-500 to-sky-700",
  "from-indigo-500 to-indigo-700",
  "from-violet-500 to-violet-700",
  "from-cyan-500 to-cyan-700",
];

export default function CreateGroupModal({ currentGroupCount, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    domain: "",
    location: "",
    icon: GROUP_ICONS[0],
    color: COLORS[0],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Group name is required";
    else if (form.name.trim().length < 4) errs.name = "Name must be at least 4 characters";
    if (!form.domain) errs.domain = "Please select a domain";
    if (!form.location) errs.location = "Please select a location";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onCreate({ ...form, name: form.name.trim() });
      setSubmitting(false);
    }, 600);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: hasError ? "#fff5f5" : "white",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  return (
    <div
      id="create-group-modal"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "white",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
        animation: "fadeUp 0.3s ease",
        overflow: "hidden",
      }}>
        {/* Modal Header */}
        <div style={{
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "18px", margin: 0 }}>
              Create New Circle
            </h2>
            <p style={{ color: "#93c5fd", fontSize: "13px", marginTop: "4px" }}>
              {currentGroupCount + 1} of 3 circles will be used
            </p>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
          {/* Group Name */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle} htmlFor="group-name">Group Name</label>
            <input
              id="group-name"
              type="text"
              placeholder="e.g. Delhi Tech Innovators"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              style={inputStyle(!!errors.name)}
              onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? "#fca5a5" : "#2563eb"}
              onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? "#fca5a5" : "#e5e7eb"}
            />
            {errors.name && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>
            )}
          </div>

          {/* Domain + Location row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
            <div>
              <label style={labelStyle} htmlFor="group-domain">Domain</label>
              <select
                id="group-domain"
                value={form.domain}
                onChange={(e) => {
                  setForm({ ...form, domain: e.target.value });
                  if (errors.domain) setErrors({ ...errors, domain: "" });
                }}
                style={{ ...inputStyle(!!errors.domain), cursor: "pointer" }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.domain ? "#fca5a5" : "#2563eb"}
                onBlur={(e) => e.currentTarget.style.borderColor = errors.domain ? "#fca5a5" : "#e5e7eb"}
              >
                <option value="">Select domain</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.domain && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.domain}</p>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="group-location">Location</label>
              <select
                id="group-location"
                value={form.location}
                onChange={(e) => {
                  setForm({ ...form, location: e.target.value });
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                style={{ ...inputStyle(!!errors.location), cursor: "pointer" }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.location ? "#fca5a5" : "#2563eb"}
                onBlur={(e) => e.currentTarget.style.borderColor = errors.location ? "#fca5a5" : "#e5e7eb"}
              >
                <option value="">Select city</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {errors.location && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.location}</p>
              )}
            </div>
          </div>

          {/* Icon picker */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Group Icon</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    border: form.icon === icon ? "2px solid #2563eb" : "2px solid #e5e7eb",
                    background: form.icon === icon ? "#eff6ff" : "white",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Card Color</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: COLORS[0], hex: ["#3b82f6", "#1d4ed8"] },
                { label: COLORS[1], hex: ["#0ea5e9", "#0369a1"] },
                { label: COLORS[2], hex: ["#6366f1", "#4338ca"] },
                { label: COLORS[3], hex: ["#8b5cf6", "#6d28d9"] },
                { label: COLORS[4], hex: ["#06b6d4", "#0e7490"] },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setForm({ ...form, color: c.label })}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: form.color === c.label ? "3px solid #111827" : "3px solid transparent",
                    background: `linear-gradient(135deg, ${c.hex[0]}, ${c.hex[1]})`,
                    cursor: "pointer",
                    transition: "transform 0.15s",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            id="submit-create-group"
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "13px",
              background: submitting
                ? "#93c5fd"
                : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: submitting ? "wait" : "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {submitting ? (
              <>
                <span style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Creating...
              </>
            ) : (
              <>✦ Create Circle</>
            )}
          </button>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </form>
      </div>
    </div>
  );
}
