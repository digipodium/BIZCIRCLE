"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/useProfile";
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// ─────────────────────────────────────────────
// ICONS (inline SVG to avoid any import issues)
// ─────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  Settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v3m0-12V3m9 9h-3M6 12H3m12.364-6.364l-2.122 2.122M8.636 18.364l-2.122 2.122M18.364 18.364l-2.122-2.122M8.636 5.636L6.514 7.758",
  Users:       "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm12 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  Shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  Bell:        "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  Flag:        "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  Link:        "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  Database:    "M12 2C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5zM2 17c0 2.76 4.48 5 10 5s10-2.24 10-5M2 12c0 2.76 4.48 5 10 5s10-2.24 10-5",
  Save:        "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  RefreshCw:   "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
  Moon:        "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  Sun:         "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  Check:       "M20 6L9 17l-5-5",
  X:           "M18 6L6 18M6 6l12 12",
  Plus:        "M12 5v14M5 12h14",
  Trash:       "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  Eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  Upload:      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  Key:         "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  Globe:       "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  ChevronRight:"M9 18l6-6-6-6",
  AlertCircle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01",
  LogOut:      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// DESIGN TOKENS (Using CSS Variables for Real Dark Mode)
// ─────────────────────────────────────────────
const T = {
  primary:      "var(--primary)",
  primaryDark:  "var(--primaryDark)",
  primaryLight: "var(--primaryLight)",
  primaryBorder:"var(--primaryBorder)",
  success:      "var(--success)",
  successBg:    "var(--successBg)",
  successBorder:"var(--successBorder)",
  error:        "var(--error)",
  errorBg:      "var(--errorBg)",
  errorBorder:  "var(--errorBorder)",
  warning:      "var(--warning)",
  warningBg:    "var(--warningBg)",
  text:         "var(--text)",
  textMid:      "var(--textMid)",
  textSoft:     "var(--textSoft)",
  textLighter:  "var(--textLighter)",
  border:       "var(--border)",
  borderDark:   "var(--borderDark)",
  bg:           "var(--bg)",
  bgCard:       "var(--bgCard)",
  sidebarBg:    "var(--sidebarBg)",
  navHeight:    "64px",
  sidebarW:     "260px",
};

// ─────────────────────────────────────────────
// SIDEBAR CONFIG
// ─────────────────────────────────────────────
const SECTIONS = [
  { id: "general",      label: "General Settings",       icon: "Settings"  },
  { id: "users",        label: "User Management",         icon: "Users"     },
  { id: "security",     label: "Security Settings",       icon: "Shield"    },
  { id: "notifications",label: "Notifications",           icon: "Bell"      },
  { id: "moderation",   label: "Content Moderation",      icon: "Flag"      },
  { id: "integrations", label: "Integrations",            icon: "Link"      },
  { id: "backup",       label: "Backup & Maintenance",    icon: "Database"  },
];

// ─────────────────────────────────────────────
// DEFAULT SETTINGS STATE
// ─────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  general: {
    platformName:   "BizCircle",
    contactEmail:   "support@bizcircle.io",
    supportPhone:   "+1 (555) 000-1234",
    defaultLanguage:"en",
    timezone:       "Asia/Kolkata",
    maintenanceMode:false,
    logoUrl:        "",
  },
  users: {
    registrationEnabled: true,
    emailVerification:   true,
    profileVisibility:   "public",
    defaultRole:         "user",
    allowSocialLogin:    true,
  },
  security: {
    minPasswordLength:   8,
    requireSpecialChars: true,
    twoFactorAuth:       false,
    sessionTimeout:      30,
    maxLoginAttempts:    5,
    lockoutDuration:     15,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications:  false,
    adminAlerts:        true,
    digestFrequency:    "daily",
    marketingEmails:    false,
  },
  moderation: {
    autoFlag:            true,
    keywordFilter:       true,
    keywords:            ["spam", "abuse", "scam", "fake"],
    reportHandling:      "manual",
    autoRemoveThreshold: 3,
  },
  integrations: {
    googleEnabled:   true,
    linkedinEnabled: true,
    slackEnabled:    false,
    apiKey:          "bzc_prod_k8f2m9x1p4r7t3q6w0y5v2n8a",
    webhookUrl:      "https://hooks.bizcircle.io/events",
    webhookSecret:   "wh_s3cr3t_abc123",
  },
  backup: {
    autoBackup:     true,
    backupSchedule: "daily",
    retentionDays:  30,
    logs: [
      { time: "2026-04-18 06:00", type: "Auto Backup",    status: "success", size: "142 MB" },
      { time: "2026-04-17 18:30", type: "Manual Backup",  status: "success", size: "139 MB" },
      { time: "2026-04-17 06:00", type: "Auto Backup",    status: "success", size: "137 MB" },
      { time: "2026-04-16 12:15", type: "System Update",  status: "warning", size: "—"      },
      { time: "2026-04-16 06:00", type: "Auto Backup",    status: "success", size: "135 MB" },
      { time: "2026-04-15 20:45", type: "Config Change",  status: "info",    size: "—"      },
    ],
  },
};

// ─────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────
function Toggle({ checked, onChange, id, disabled = false }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "48px",
        height: "26px",
        borderRadius: "13px",
        background: checked ? T.primary : "#d1d5db",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.25s",
        padding: 0,
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        position: "absolute",
        left: checked ? "24px" : "3px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.25s",
      }} />
    </button>
  );
}

// ─────────────────────────────────────────────
// CARD WRAPPER
// ─────────────────────────────────────────────
function Card({ title, subtitle, children, accent = false }) {
  return (
    <div className="card-hover" style={{
      background: T.bgCard,
      borderRadius: "14px",
      border: `1px solid ${accent ? T.primaryBorder : T.border}`,
      overflow: "hidden",
      marginBottom: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      {title && (
        <div style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${T.border}`,
          background: accent ? T.primaryLight : "transparent",
        }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: T.text }}>{title}</h3>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: "13px", color: T.textSoft }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FORM ROW
// ─────────────────────────────────────────────
function FormRow({ label, hint, children, required = false }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px 0",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ flex: "0 0 220px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: T.textMid }}>
          {label} {required && <span style={{ color: T.error }}>*</span>}
        </div>
        {hint && <div style={{ fontSize: "12px", color: T.textSoft, marginTop: "3px" }}>{hint}</div>}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────
function Input({ value, onChange, type = "text", placeholder = "", min, max, id, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      value={value}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: `1.5px solid ${focused ? T.primary : T.border}`,
        borderRadius: "8px",
        fontSize: "14px",
        color: T.text,
        background: "#fff",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────
function Select({ value, onChange, options, id }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: "9px 32px 9px 12px",
        border: `1.5px solid ${focused ? T.primary : T.border}`,
        borderRadius: "8px",
        fontSize: "14px",
        color: T.text,
        background: "#fff",
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        transition: "border-color 0.2s",
        minWidth: "160px",
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
function Badge({ children, color = "blue" }) {
  const colors = {
    blue:   { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    green:  { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    amber:  { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    gray:   { bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" },
    purple: { bg: "#faf5ff", text: "#7c3aed", border: "#e9d5ff" },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{
      padding: "2px 10px",
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 18px",
          borderRadius: "12px",
          background: t.type === "success" ? T.success : t.type === "error" ? T.error : T.warning,
          color: "white",
          fontWeight: 600,
          fontSize: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          animation: "slideInRight 0.3s ease",
          maxWidth: "340px",
          minWidth: "240px",
        }}>
          <span style={{ fontSize: "16px" }}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "⚠"}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "32px",
        maxWidth: "420px", width: "90%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        animation: "scaleIn 0.2s ease",
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: danger ? "#fef2f2" : T.primaryLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <Icon d={danger ? Icons.AlertCircle : Icons.Check} size={24}
            color={danger ? T.error : T.primary} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700, color: T.text }}>{title}</h3>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: T.textSoft, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            padding: "10px 20px", borderRadius: "8px",
            border: `1px solid ${T.border}`, background: "#fff",
            color: T.textMid, fontWeight: 600, fontSize: "14px",
            cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "10px 20px", borderRadius: "8px",
            border: "none",
            background: danger ? T.error : T.primary,
            color: "white", fontWeight: 600, fontSize: "14px",
            cursor: "pointer",
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION COMPONENTS
// ─────────────────────────────────────────────

function GeneralSection({ settings, update }) {
  const g = settings.general;
  const set = (k, v) => update("general", k, v);
  const fileRef = useRef(null);

  return (
    <div>
      <Card title="Platform Identity" subtitle="Configure your platform branding and contact details.">
        <FormRow label="Platform Name" required hint="Displayed across the platform.">
          <Input id="platform-name" value={g.platformName} onChange={v => set("platformName", v)} placeholder="BizCircle" />
        </FormRow>
        <FormRow label="Contact Email" required hint="Main support email address.">
          <Input id="contact-email" type="email" value={g.contactEmail} onChange={v => set("contactEmail", v)} placeholder="support@example.com" />
        </FormRow>
        <FormRow label="Support Phone" hint="Optional. Shown on help pages.">
          <Input id="support-phone" value={g.supportPhone} onChange={v => set("supportPhone", v)} placeholder="+1 (555) 000-0000" />
        </FormRow>
        <FormRow label="Platform Logo" hint="Upload a logo (PNG/SVG recommended).">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "10px",
              background: g.logoUrl ? `url(${g.logoUrl})` : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              backgroundSize: "cover", backgroundPosition: "center",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: "20px",
              border: `1px solid ${T.border}`,
            }}>
              {!g.logoUrl && (g.platformName ? g.platformName.charAt(0) : "B")}
            </div>
            <button
              id="upload-logo-btn"
              className="hover-scale"
              onClick={() => fileRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "8px",
                border: `1.5px solid ${T.primary}`, background: T.primaryLight,
                color: T.primary, fontWeight: 600, fontSize: "13px", cursor: "pointer",
              }}>
              <Icon d={Icons.Upload} size={15} color={T.primary} />
              Upload Logo
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files[0];
                if (f) set("logoUrl", URL.createObjectURL(f));
              }} />
          </div>
        </FormRow>
      </Card>

      <Card title="Regional Settings" subtitle="Locale and timezone configuration.">
        <FormRow label="Default Language" hint="Platform UI language for new users.">
          <Select id="default-language" value={g.defaultLanguage} onChange={v => set("defaultLanguage", v)} options={[
            { value: "en", label: "English (US)" },
            { value: "en-gb", label: "English (UK)" },
            { value: "hi", label: "Hindi" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" },
            { value: "es", label: "Spanish" },
          ]} />
        </FormRow>
        <FormRow label="Timezone" hint="Default timezone for timestamps.">
          <Select id="timezone" value={g.timezone} onChange={v => set("timezone", v)} options={[
            { value: "Asia/Kolkata",     label: "Asia/Kolkata (IST +5:30)" },
            { value: "America/New_York", label: "America/New_York (EST −5:00)" },
            { value: "America/Chicago",  label: "America/Chicago (CST −6:00)" },
            { value: "America/Los_Angeles", label: "America/Los_Angeles (PST −8:00)" },
            { value: "Europe/London",    label: "Europe/London (GMT 0:00)" },
            { value: "Europe/Paris",     label: "Europe/Paris (CET +1:00)" },
            { value: "Asia/Singapore",   label: "Asia/Singapore (SGT +8:00)" },
            { value: "UTC",              label: "UTC" },
          ]} />
        </FormRow>
      </Card>

      <Card title="Maintenance Mode" accent>
        <FormRow label="Enable Maintenance Mode" hint="When enabled, only admins can access the platform. Users see a maintenance message.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Toggle id="maintenance-toggle" checked={g.maintenanceMode} onChange={v => set("maintenanceMode", v)} />
            {g.maintenanceMode && (
              <Badge color="amber">🔧 Maintenance Active</Badge>
            )}
          </div>
        </FormRow>
      </Card>
    </div>
  );
}

function UsersSection({ settings, update }) {
  const u = settings.users;
  const set = (k, v) => update("users", k, v);

  return (
    <div>
      <Card title="Registration & Access" subtitle="Control how new users can join the platform.">
        <FormRow label="User Registration" hint="Allow new accounts to be created.">
          <Toggle id="registration-toggle" checked={u.registrationEnabled} onChange={v => set("registrationEnabled", v)} />
        </FormRow>
        <FormRow label="Email Verification" hint="Users must verify their email before accessing the platform.">
          <Toggle id="email-verify-toggle" checked={u.emailVerification} onChange={v => set("emailVerification", v)} />
        </FormRow>
        <FormRow label="Allow Social Login" hint="Enable Google and LinkedIn OAuth login.">
          <Toggle id="social-login-toggle" checked={u.allowSocialLogin} onChange={v => set("allowSocialLogin", v)} />
        </FormRow>
      </Card>

      <Card title="Profile & Permissions" subtitle="Define defaults for user roles and visibility.">
        <FormRow label="Default Profile Visibility" hint="Privacy setting applied to new user profiles.">
          <Select id="profile-visibility" value={u.profileVisibility} onChange={v => set("profileVisibility", v)} options={[
            { value: "public",     label: "🌐 Public — Anyone can view" },
            { value: "members",    label: "👥 Members Only — Logged-in users only" },
            { value: "connections",label: "🔗 Connections — 1st degree only" },
            { value: "private",    label: "🔒 Private — Only the user" },
          ]} />
        </FormRow>
        <FormRow label="Default User Role" hint="Role assigned to newly registered users.">
          <Select id="default-role" value={u.defaultRole} onChange={v => set("defaultRole", v)} options={[
            { value: "user",      label: "User — Standard member" },
            { value: "moderator", label: "Moderator — Can review content" },
            { value: "admin",     label: "Admin — Full access" },
          ]} />
        </FormRow>
      </Card>

      <Card title="Role Reference" subtitle="Quick overview of role capabilities.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
          {[
            { role: "Admin",     color: "purple", perms: ["Full platform access", "Manage all users", "Edit system config"] },
            { role: "Moderator", color: "blue",   perms: ["Review flagged content", "Approve/reject reports", "Manage groups"] },
            { role: "User",      color: "gray",   perms: ["Post & comment", "Join circles", "Send referrals"] },
          ].map(r => (
            <div key={r.role} style={{
              padding: "16px", borderRadius: "10px",
              border: `1px solid ${T.border}`, background: T.bg,
            }}>
              <Badge color={r.color}>{r.role}</Badge>
              <ul style={{ margin: "10px 0 0", padding: "0 0 0 16px", fontSize: "12px", color: T.textSoft, lineHeight: "1.8" }}>
                {r.perms.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SecuritySection({ settings, update }) {
  const s = settings.security;
  const set = (k, v) => update("security", k, v);

  return (
    <div>
      <Card title="Password Policy" subtitle="Define minimum password requirements.">
        <FormRow label="Minimum Length" hint="Minimum number of characters required.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Input id="min-password-length" type="number" value={s.minPasswordLength} onChange={v => set("minPasswordLength", Number(v))} min={6} max={32} style={{ width: "100px" }} />
            <span style={{ fontSize: "13px", color: T.textSoft }}>characters</span>
          </div>
        </FormRow>
        <FormRow label="Require Special Characters" hint="Password must include !@#$% etc.">
          <Toggle id="special-chars-toggle" checked={s.requireSpecialChars} onChange={v => set("requireSpecialChars", v)} />
        </FormRow>
      </Card>

      <Card title="Authentication" subtitle="Configure session and 2FA options.">
        <FormRow label="Two-Factor Authentication" hint="Enables TOTP-based 2FA for all users.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Toggle id="tfa-toggle" checked={s.twoFactorAuth} onChange={v => set("twoFactorAuth", v)} />
            {s.twoFactorAuth && <Badge color="green">Enabled</Badge>}
          </div>
        </FormRow>
        <FormRow label="Session Timeout" hint="Idle session duration before auto-logout.">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Select id="session-timeout" value={String(s.sessionTimeout)} onChange={v => set("sessionTimeout", Number(v))} options={[
              { value: "15",  label: "15 minutes" },
              { value: "30",  label: "30 minutes" },
              { value: "60",  label: "1 hour" },
              { value: "120", label: "2 hours" },
              { value: "480", label: "8 hours" },
            ]} />
          </div>
        </FormRow>
      </Card>

      <Card title="Login Protection" subtitle="Brute-force prevention settings.">
        <FormRow label="Max Login Attempts" hint="Number of failed attempts before account lockout.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Input id="max-login-attempts" type="number" value={s.maxLoginAttempts} onChange={v => set("maxLoginAttempts", Number(v))} min={2} max={20} style={{ width: "100px" }} />
            <span style={{ fontSize: "13px", color: T.textSoft }}>attempts</span>
          </div>
        </FormRow>
        <FormRow label="Lockout Duration" hint="How long an account remains locked after exceeding max attempts.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Input id="lockout-duration" type="number" value={s.lockoutDuration} onChange={v => set("lockoutDuration", Number(v))} min={1} max={120} style={{ width: "100px" }} />
            <span style={{ fontSize: "13px", color: T.textSoft }}>minutes</span>
          </div>
        </FormRow>
      </Card>
    </div>
  );
}

function NotificationsSection({ settings, update }) {
  const n = settings.notifications;
  const set = (k, v) => update("notifications", k, v);

  return (
    <div>
      <Card title="Delivery Channels" subtitle="Control how and where notifications are sent.">
        <FormRow label="Email Notifications" hint="Send system and activity emails to users.">
          <Toggle id="email-notif-toggle" checked={n.emailNotifications} onChange={v => set("emailNotifications", v)} />
        </FormRow>
        <FormRow label="Push Notifications" hint="Browser push notifications (requires HTTPS).">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Toggle id="push-notif-toggle" checked={n.pushNotifications} onChange={v => set("pushNotifications", v)} />
            {!n.pushNotifications && <Badge color="gray">Disabled</Badge>}
          </div>
        </FormRow>
        <FormRow label="Marketing Emails" hint="Send promotional and feature announcement emails.">
          <Toggle id="marketing-emails-toggle" checked={n.marketingEmails} onChange={v => set("marketingEmails", v)} />
        </FormRow>
      </Card>

      <Card title="Admin Alerts" subtitle="Configure platform-level alert notifications for admins.">
        <FormRow label="Admin Alert Emails" hint="Receive alerts for key platform events (new reports, signups, errors).">
          <Toggle id="admin-alerts-toggle" checked={n.adminAlerts} onChange={v => set("adminAlerts", v)} />
        </FormRow>
        <FormRow label="Email Digest Frequency" hint="How often to send bundled summaries.">
          <Select id="digest-frequency" value={n.digestFrequency} onChange={v => set("digestFrequency", v)} options={[
            { value: "realtime", label: "Real-time" },
            { value: "hourly",   label: "Hourly" },
            { value: "daily",    label: "Daily Digest" },
            { value: "weekly",   label: "Weekly Summary" },
            { value: "never",    label: "Never" },
          ]} />
        </FormRow>
      </Card>
    </div>
  );
}

function ModerationSection({ settings, update }) {
  const m = settings.moderation;
  const set = (k, v) => update("moderation", k, v);
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !m.keywords.includes(kw)) {
      set("keywords", [...m.keywords, kw]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw) => {
    set("keywords", m.keywords.filter(k => k !== kw));
  };

  return (
    <div>
      <Card title="Auto-Moderation" subtitle="Automated content review and flagging.">
        <FormRow label="Auto-Flag Inappropriate Content" hint="AI-assisted detection of harmful posts.">
          <Toggle id="auto-flag-toggle" checked={m.autoFlag} onChange={v => set("autoFlag", v)} />
        </FormRow>
        <FormRow label="Keyword Filter" hint="Automatically flag posts containing blocked keywords.">
          <Toggle id="keyword-filter-toggle" checked={m.keywordFilter} onChange={v => set("keywordFilter", v)} />
        </FormRow>
        <FormRow label="Auto-Remove Threshold" hint="Number of user reports that triggers auto-removal.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Input id="auto-remove-threshold" type="number" value={m.autoRemoveThreshold} onChange={v => set("autoRemoveThreshold", Number(v))} min={1} max={20} style={{ width: "100px" }} />
            <span style={{ fontSize: "13px", color: T.textSoft }}>reports</span>
          </div>
        </FormRow>
      </Card>

      <Card title="Blocked Keywords" subtitle="Content containing these words will be auto-flagged.">
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <Input
            id="new-keyword-input"
            value={newKeyword}
            onChange={setNewKeyword}
            placeholder="Add keyword..."
            style={{ maxWidth: "260px" }}
          />
          <button
            id="add-keyword-btn"
            onClick={addKeyword}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "8px",
              background: T.primary, border: "none",
              color: "white", fontWeight: 600, fontSize: "13px", cursor: "pointer",
            }}>
            <Icon d={Icons.Plus} size={15} color="white" />
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {m.keywords.map(kw => (
            <span key={kw} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "5px 12px",
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "20px", fontSize: "13px", fontWeight: 500, color: T.error,
            }}>
              {kw}
              <button
                onClick={() => removeKeyword(kw)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: T.error, padding: 0, display: "flex", alignItems: "center",
                }}>
                <Icon d={Icons.X} size={13} color={T.error} />
              </button>
            </span>
          ))}
          {m.keywords.length === 0 && (
            <span style={{ fontSize: "13px", color: T.textSoft, fontStyle: "italic" }}>
              No keywords added yet.
            </span>
          )}
        </div>
      </Card>

      <Card title="Report Handling" subtitle="Define how user-submitted reports are processed.">
        <FormRow label="Report Processing Mode" hint="How flagged content is handled after threshold is met.">
          <Select id="report-handling" value={m.reportHandling} onChange={v => set("reportHandling", v)} options={[
            { value: "manual",    label: "Manual Review — Admins review every report" },
            { value: "threshold", label: "Threshold Auto-Remove — Auto after N reports" },
            { value: "ai",        label: "AI Assisted — AI suggests, admin confirms" },
          ]} />
        </FormRow>
      </Card>
    </div>
  );
}

function IntegrationsSection({ settings, update }) {
  const i = settings.integrations;
  const set = (k, v) => update("integrations", k, v);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(i.apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const regenerate = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const rand = Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    set("apiKey", `bzc_prod_${rand}`);
  };

  return (
    <div>
      <Card title="OAuth Integrations" subtitle="Enable third-party login and data sync providers.">
        {[
          { key: "googleEnabled",   label: "Google",   logo: "🔵", desc: "OAuth 2.0 login and Calendar sync" },
          { key: "linkedinEnabled", label: "LinkedIn", logo: "💼", desc: "Professional profile import" },
          { key: "slackEnabled",    label: "Slack",    logo: "💬", desc: "Team notifications and alerts" },
        ].map(({ key, label, logo, desc }) => (
          <FormRow key={key} label={`${logo} ${label}`} hint={desc}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Toggle id={`${key}-toggle`} checked={i[key]} onChange={v => set(key, v)} />
              <Badge color={i[key] ? "green" : "gray"}>{i[key] ? "Connected" : "Disabled"}</Badge>
            </div>
          </FormRow>
        ))}
      </Card>

      <Card title="API Key Management" subtitle="Your platform's master API key for external service access.">
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "12px", borderRadius: "10px",
          background: T.bg, border: `1px solid ${T.border}`,
          marginBottom: "16px",
        }}>
          <Icon d={Icons.Key} size={18} color={T.textSoft} />
          <code style={{
            flex: 1, fontSize: "13px", fontFamily: "monospace",
            color: T.text, letterSpacing: "0.5px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {showKey ? i.apiKey : (i.apiKey.slice(0, 12) + "••••••••••••" + i.apiKey.slice(-4))}
          </code>
          <button id="toggle-key-visibility" onClick={() => setShowKey(!showKey)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: T.textSoft, padding: "4px",
          }}>
            <Icon d={Icons.Eye} size={16} color={T.textSoft} />
          </button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button id="copy-api-key-btn" onClick={copyKey} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "8px",
            border: `1px solid ${T.border}`, background: "#fff",
            color: T.textMid, fontWeight: 600, fontSize: "13px", cursor: "pointer",
          }}>
            {copied ? <><Icon d={Icons.Check} size={14} color={T.success} /> Copied!</> : "Copy Key"}
          </button>
          <button id="regenerate-api-key-btn" onClick={regenerate} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "8px",
            border: "none", background: "#fef2f2",
            color: T.error, fontWeight: 600, fontSize: "13px", cursor: "pointer",
          }}>
            <Icon d={Icons.RefreshCw} size={14} color={T.error} />
            Regenerate
          </button>
        </div>
      </Card>

      <Card title="Webhooks" subtitle="Configure event-driven webhooks for external systems.">
        <FormRow label="Webhook URL" hint="Endpoint that will receive POST requests on events.">
          <Input id="webhook-url" value={i.webhookUrl} onChange={v => set("webhookUrl", v)} placeholder="https://your-server.com/webhook" />
        </FormRow>
        <FormRow label="Webhook Secret" hint="Used to sign webhook payloads (HMAC-SHA256).">
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <Input
              id="webhook-secret"
              type={showSecret ? "text" : "password"}
              value={i.webhookSecret}
              onChange={v => set("webhookSecret", v)}
              placeholder="wh_secret_..."
            />
            <button onClick={() => setShowSecret(!showSecret)} style={{
              padding: "8px 12px", borderRadius: "8px",
              border: `1px solid ${T.border}`, background: "#fff",
              cursor: "pointer", color: T.textSoft,
            }}>
              <Icon d={Icons.Eye} size={16} color={T.textSoft} />
            </button>
          </div>
        </FormRow>
      </Card>
    </div>
  );
}

function BackupSection({ settings, update, showToast }) {
  const b = settings.backup;
  const set = (k, v) => update("backup", k, v);
  const [backing, setBacking] = useState(false);

  const handleManualBackup = async () => {
    setBacking(true);
    await new Promise(r => setTimeout(r, 2000)); // simulate
    const newLog = {
      time: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }).replace(",", ""),
      type: "Manual Backup",
      status: "success",
      size: `${Math.floor(139 + Math.random() * 20)} MB`,
    };
    set("logs", [newLog, ...b.logs]);
    setBacking(false);
    showToast("Backup completed successfully!", "success");
  };

  const statusStyle = (status) => ({
    success: { bg: "#f0fdf4", color: "#16a34a", label: "✓ Success" },
    warning: { bg: "#fffbeb", color: "#d97706", label: "⚠ Warning" },
    error:   { bg: "#fef2f2", color: "#dc2626", label: "✕ Failed"  },
    info:    { bg: "#eff6ff", color: "#2563eb", label: "ℹ Info"    },
  }[status] || { bg: T.bg, color: T.textSoft, label: status });

  return (
    <div>
      <Card title="Backup Configuration" subtitle="Automated and manual backup settings.">
        <FormRow label="Auto-Backup" hint="Automatically back up platform data on a schedule.">
          <Toggle id="auto-backup-toggle" checked={b.autoBackup} onChange={v => set("autoBackup", v)} />
        </FormRow>
        <FormRow label="Backup Schedule" hint="How frequently automatic backups run.">
          <Select id="backup-schedule" value={b.backupSchedule} onChange={v => set("backupSchedule", v)} options={[
            { value: "hourly",  label: "Every Hour" },
            { value: "daily",   label: "Daily (2:00 AM)" },
            { value: "weekly",  label: "Weekly (Sunday 2:00 AM)" },
            { value: "monthly", label: "Monthly (1st, 2:00 AM)" },
          ]} />
        </FormRow>
        <FormRow label="Retention Period" hint="How long backup files are kept before deletion.">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Input id="retention-days" type="number" value={b.retentionDays} onChange={v => set("retentionDays", Number(v))} min={7} max={365} style={{ width: "100px" }} />
            <span style={{ fontSize: "13px", color: T.textSoft }}>days</span>
          </div>
        </FormRow>
      </Card>

      <Card title="Manual Backup" accent>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "14px", color: T.textMid, fontWeight: 500 }}>
              Create an on-demand backup right now.
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: T.textSoft }}>
              This backs up all platform data including users, groups, and configurations.
            </p>
          </div>
          <button
            id="manual-backup-btn"
            onClick={handleManualBackup}
            disabled={backing}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 22px", borderRadius: "10px",
              background: backing ? "#9ca3af" : T.primary,
              border: "none", color: "white",
              fontWeight: 700, fontSize: "14px", cursor: backing ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}>
            {backing ? (
              <>
                <span style={{
                  display: "inline-block", width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Backing up...
              </>
            ) : (
              <><Icon d={Icons.Database} size={16} color="white" /> Run Backup Now</>
            )}
          </button>
        </div>
      </Card>

      <Card title="System Logs" subtitle="Recent platform activity and backup history.">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {["Timestamp", "Event Type", "Status", "Size"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left",
                    color: T.textSoft, fontWeight: 600, fontSize: "12px",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.logs.map((log, i) => {
                const s = statusStyle(log.status);
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 14px", color: T.textSoft, whiteSpace: "nowrap" }}>{log.time}</td>
                    <td style={{ padding: "10px 14px", color: T.text, fontWeight: 500 }}>{log.type}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px",
                        background: s.bg, color: s.color,
                        fontSize: "12px", fontWeight: 600,
                      }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "10px 14px", color: T.textSoft }}>{log.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
function SystemConfig() {
  const { user, loading: profileLoading } = useProfile();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bizcircle_system_config");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });
  const [savedSettings, setSavedSettings] = useState(settings);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null); 
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bizcircle_admin_theme") === "dark";
    }
    return false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Persistence Initialization
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Role Check (Production)
  useEffect(() => {
    if (!profileLoading && isInitialized) {
      if (!user || user.role?.toLowerCase() !== "admin") {
        console.warn("Access denied: User is not an admin.");
      }
    }
  }, [user, profileLoading, isInitialized]);

  // 3. Theme Persistence
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("bizcircle_admin_theme", darkMode ? "dark" : "light");
    }
  }, [darkMode, isInitialized]);

  const toastId = useRef(0);

  const showToast = useCallback((message, type = "success") => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const update = useCallback((section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSave = () => {
    // Validation
    if (!settings.general.platformName.trim()) {
      showToast("Platform name is required.", "error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(settings.general.contactEmail)) {
      showToast("Please enter a valid contact email.", "error");
      return;
    }
    setSavedSettings(JSON.parse(JSON.stringify(settings)));
    localStorage.setItem("bizcircle_system_config", JSON.stringify(settings));
    showToast("Settings saved successfully!", "success");
  };

  const handleReset = () => {
    setModal({
      title: "Reset to Defaults",
      message: "This will reset ALL settings to their factory defaults. This action cannot be undone.",
      danger: true,
      confirmLabel: "Reset Everything",
      onConfirm: () => {
        setSettings(DEFAULT_SETTINGS);
        setSavedSettings(DEFAULT_SETTINGS);
        localStorage.removeItem("bizcircle_system_config");
        setModal(null);
        showToast("Settings reset to defaults.", "success");
      },
    });
  };

  const sectionProps = { settings, update, showToast };

  const sectionContent = {
    general:       <GeneralSection {...sectionProps} />,
    users:         <UsersSection {...sectionProps} />,
    security:      <SecuritySection {...sectionProps} />,
    notifications: <NotificationsSection {...sectionProps} />,
    moderation:    <ModerationSection {...sectionProps} />,
    integrations:  <IntegrationsSection {...sectionProps} />,
    backup:        <BackupSection {...sectionProps} />,
  };

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label || "";

  if (!profileLoading && isInitialized && (!user || user.role?.toLowerCase() !== "admin")) {
    return (
      <div style={{
        height: "100vh", background: T.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px",
      }}>
        <div style={{ 
          width: "64px", height: "64px", background: T.errorBg, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px"
        }}>
          <Icon d={Icons.AlertCircle} size={32} color={T.error} />
        </div>
        <h2 style={{ color: T.text, marginBottom: "8px" }}>Restricted Access</h2>
        <p style={{ color: T.textSoft, marginBottom: "24px", maxWidth: "400px" }}>
          You do not have the necessary permissions to access the system configuration. 
          Please contact your administrator if you believe this is an error.
        </p>
        <button 
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "10px 24px", background: T.primary, color: "white", 
            border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer"
          }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div 
      className={darkMode ? "dark-theme-vars" : ""}
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: T.text,
      }}>


      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
          --primary: #2563eb;
          --primaryDark: #1d4ed8;
          --primaryLight: #eff6ff;
          --primaryBorder: #bfdbfe;
          --success: #16a34a;
          --successBg: #f0fdf4;
          --successBorder: #bbf7d0;
          --error: #dc2626;
          --errorBg: #fef2f2;
          --errorBorder: #fecaca;
          --warning: #d97706;
          --warningBg: #fffbeb;
          --text: #111827;
          --textMid: #374151;
          --textSoft: #6b7280;
          --textLighter: #9ca3af;
          --border: #e5e7eb;
          --borderDark: #d1d5db;
          --bg: #f8fafc;
          --bgCard: #ffffff;
          --sidebarBg: #ffffff;
        }

        .dark-theme-vars {
          --primary: #3b82f6;
          --primaryDark: #2563eb;
          --primaryLight: #1e293b;
          --primaryBorder: #334155;
          --success: #22c55e;
          --successBg: #064e3b;
          --successBorder: #065f46;
          --error: #ef4444;
          --errorBg: #451a1a;
          --errorBorder: #7f1d1d;
          --warning: #f59e0b;
          --warningBg: #451a03;
          --text: #f8fafc;
          --textMid: #e2e8f0;
          --textSoft: #94a3b8;
          --textLighter: #64748b;
          --border: #334155;
          --borderDark: #475569;
          --bg: #0f172a;
          --bgCard: #1e293b;
          --sidebarBg: #0f172a;
        }

        * { box-sizing: border-box; transition: background-color 0.2s, border-color 0.2s; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .section-content {
          animation: fadeUp 0.3s ease forwards;
        }
        .sidebar-link:hover {
          background: ${T.primaryLight} !important;
          color: ${T.primary} !important;
        }
        .sidebar-link:hover svg {
          stroke: ${T.primary} !important;
        }
        .save-btn:hover:not(:disabled) {
          background: ${T.primaryDark} !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(37,99,235,0.35) !important;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px var(--primaryLight) !important;
          border-color: var(--primary) !important;
        }
        .hover-scale { transition: transform 0.2s ease; }
        .hover-scale:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          .sidebar-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0,0,0,0.4) !important;
            z-index: 199 !important;
            display: block !important;
          }
          .sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            z-index: 200 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }
          .sidebar.open {
            transform: translateX(0) !important;
          }
        }
      `}</style>

      <Toast toasts={toasts} />

      {/* CONFIRM MODAL */}
      {modal && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          confirmLabel={modal.confirmLabel}
          danger={modal.danger}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      {/* ── TOP NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: T.navHeight,
        background: "#fff",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center",
        padding: "0 24px",
        gap: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* Mobile Hamburger */}
        <button
          id="sidebar-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: "none", // shown via media query below
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", color: T.textSoft,
          }}
          className="hamburger-btn"
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <a href="/admin" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: "15px",
          }}>B</div>
          <span style={{ fontWeight: 800, fontSize: "18px", color: "#1e40af", letterSpacing: "-0.3px" }}>
            BizCircle
          </span>
          <span style={{
            padding: "2px 9px",
            background: T.primaryLight, color: T.primary,
            borderRadius: "20px", fontSize: "11px", fontWeight: 600,
            border: `1px solid ${T.primaryBorder}`,
          }}>Admin</span>
        </a>

        <div style={{ flex: 1 }} />

        {/* Page Title (desktop) */}
        <div style={{ fontSize: "14px", fontWeight: 600, color: T.textSoft }}>
          System Configuration
        </div>

        <div style={{ flex: 1 }} />

        <AdminNotificationDropdown />

        {/* Dark Mode */}
        <button
          id="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          style={{
            background: "none", border: `1px solid ${T.border}`,
            borderRadius: "8px", padding: "7px", cursor: "pointer",
            display: "flex", alignItems: "center",
            color: T.textSoft,
          }}>
          <Icon d={darkMode ? Icons.Sun : Icons.Moon} size={17} color={T.textSoft} />
        </button>

        {/* Save Button */}
        <button
          id="save-changes-btn"
          onClick={handleSave}
          disabled={!hasChanges}
          className="save-btn"
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "9px 20px", borderRadius: "9px",
            background: hasChanges ? T.primary : "#9ca3af",
            border: "none", color: "white",
            fontWeight: 700, fontSize: "14px",
            cursor: hasChanges ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}>
          <Icon d={Icons.Save} size={15} color="white" />
          Save Changes
          {hasChanges && (
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#fbbf24", marginLeft: "2px",
            }} />
          )}
        </button>

        {/* Reset */}
        <button
          id="reset-defaults-btn"
          onClick={handleReset}
          className="reset-btn"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "9px",
            background: "#fff", border: `1px solid ${T.border}`,
            color: T.textMid, fontWeight: 600, fontSize: "13px",
            cursor: "pointer", transition: "background 0.2s",
          }}>
          <Icon d={Icons.RefreshCw} size={14} color={T.textMid} />
          Reset
        </button>

        {/* Avatar */}
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: "13px", cursor: "pointer",
          flexShrink: 0,
        }}>{user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "A"}</div>
      </nav>

      <div style={{ display: "flex", minHeight: `calc(100vh - ${T.navHeight})` }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: T.sidebarW,
          background: T.sidebarBg,
          borderRight: `1px solid ${T.border}`,
          flexShrink: 0,
          padding: "24px 0",
          position: "sticky",
          top: T.navHeight,
          height: `calc(100vh - ${T.navHeight})`,
          overflowY: "auto",
        }}>
          <div style={{ padding: "0 16px 16px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: T.textLighter, letterSpacing: "1px", textTransform: "uppercase" }}>
              Configuration
            </span>
          </div>

          <nav style={{ padding: "12px 10px" }}>
            {SECTIONS.map(s => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  id={`nav-${s.id}`}
                  onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                  className="sidebar-link"
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: "11px",
                    padding: "11px 14px", borderRadius: "10px",
                    background: active ? T.primaryLight : "transparent",
                    border: "none",
                    color: active ? T.primary : T.textMid,
                    fontWeight: active ? 700 : 500,
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    marginBottom: "2px",
                    borderLeft: active ? `3px solid ${T.primary}` : "3px solid transparent",
                  }}>
                  <Icon d={Icons[s.icon]} size={17} color={active ? T.primary : T.textSoft} />
                  {s.label}
                  {active && (
                    <span style={{ marginLeft: "auto" }}>
                      <Icon d={Icons.ChevronRight} size={14} color={T.primary} />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div style={{
            margin: "16px 10px 0",
            padding: "14px",
            borderRadius: "10px",
            background: T.primaryLight,
            border: `1px solid ${T.primaryBorder}`,
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: T.primary, marginBottom: "4px" }}>
              🔐 Admin Access Only
            </div>
            <div style={{ fontSize: "11px", color: T.textSoft, lineHeight: 1.5 }}>
              Changes here affect the entire platform. Proceed with care.
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: "32px", maxWidth: "860px", overflowY: "auto" }}>
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", color: T.textSoft, marginBottom: "8px",
          }}>
            <a href="/admin" style={{ color: T.textSoft, textDecoration: "none" }}>Admin</a>
            <Icon d={Icons.ChevronRight} size={13} color={T.textLighter} />
            <span style={{ color: T.primary, fontWeight: 600 }}>System Configuration</span>
          </div>

          {/* Section Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: T.text }}>
              {activeLabel}
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: T.textSoft }}>
              {hasChanges
                ? "⚠ You have unsaved changes. Click 'Save Changes' to apply them."
                : "All settings are up to date."}
            </p>
          </div>

          {/* Section Content */}
          <div key={activeSection} className="section-content">
            {sectionContent[activeSection]}
          </div>
        </main>
      </div>

      {/* Mobile hamburger CSS override */}
      <style>{`
        @media (max-width: 900px) {
          .hamburger-btn { display: flex !important; }
          aside {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            z-index: 200 !important;
            transform: translateX(${sidebarOpen ? "0" : "-100%"});
            transition: transform 0.3s ease !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.12) !important;
          }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 199,
          }}
        />
      )}
    </div>
  );
}

export default function ProtectedSystemConfig() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SystemConfig />
    </ProtectedRoute>
  );
}
