"use client";

import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useProfile } from "../../lib/useProfile";
import AdminLayout from "./layout/AdminLayout";
import AdminHeader from "./AdminHeader";
import StatsSection from "./StatsSection";
import CreateGroupModal from "./CreateGroupModal";

// Sections
import OverviewSection from "./sections/OverviewSection";
import UserManagementSection from "./sections/UserManagementSection";
import GroupManagementSection from "./sections/GroupManagementSection";
import ContentModerationSection from "./sections/ContentModerationSection";
import ReportsSection from "./sections/ReportsSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import NotificationsSection from "./sections/NotificationsSection";
import SystemSettingsSection from "./sections/SystemSettingsSection";
import LogsSection from "./sections/LogsSection";

export default function AdminDashboard() {
  const [groups, setGroups] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useProfile();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found when fetching dashboard data');
        showToast("Session expired. Please log in again.", "error");
        return;
      }
      
      const res = await api.get('/group/admin/dashboard');
      setGroups(res.data.groups);
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load dashboard data";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const totalMembers = groups.reduce((sum, g) => sum + g.members, 0);
  const totalPending = groups.reduce((sum, g) => sum + g.pending, 0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAccept = async (id) => {
    try {
      const req = requests.find((r) => r.id === id);
      if (!req) return;
      await api.put(`/group/${req.groupId}/members/${id}`, { status: 'Approved' });
      fetchDashboardData();
      showToast(`${req.userName} has been accepted into ${req.groupName}`, "success");
    } catch(err) {
      showToast("Failed to accept request", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const req = requests.find((r) => r.id === id);
      if (!req) return;
      await api.put(`/group/${req.groupId}/members/${id}`, { status: 'Banned' });
      fetchDashboardData();
      showToast(`${req.userName}'s request has been rejected`, "error");
    } catch(err) {
      showToast("Failed to reject request", "error");
    }
  };

  const handleCreateGroup = async (newGroup) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("Session expired. Please log in again.", "error");
        return;
      }
      
      await api.post('/group', {
        ...newGroup,
        isPrivate: true,
        description: `Welcome to ${newGroup.name}`
      });
      fetchDashboardData();
      setShowModal(false);
      showToast(`"${newGroup.name}" has been created successfully!`, "success");
    } catch(err) {
      console.error('Create group error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to create group";
      showToast(errorMsg, "error");
    }
  };

  // Map activeSection to component
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "users":
        return <UserManagementSection />;
      case "groups":
        return (
          <GroupManagementSection 
            groups={groups} 
            requests={requests} 
            onAccept={handleAccept} 
            onReject={handleReject} 
          />
        );
      case "moderation":
        return <ContentModerationSection />;
      case "reports":
        return <ReportsSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "notifications":
        return <NotificationsSection />;
      case "settings":
        return <SystemSettingsSection />;
      case "logs":
        return <LogsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px",
            borderRadius: "12px",
            backgroundColor: toast.type === "success" ? "#22c55e" : "#ef4444",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
            animation: "slideIn 0.3s ease",
            maxWidth: "360px",
          }}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .card-hover {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px) scale(1.012);
          box-shadow: 0 20px 48px rgba(37,99,235,0.13);
        }
      `}</style>

      {/* Top Nav Bar */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: "16px",
          }}>B</div>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1e40af", letterSpacing: "-0.3px" }}>
            BizCircle
          </span>
          <span style={{
            marginLeft: "4px",
            padding: "2px 10px",
            background: "#eff6ff",
            color: "#2563eb",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            border: "1px solid #bfdbfe",
          }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "20px",
            padding: "6px",
            borderRadius: "8px",
            transition: "background 0.2s",
          }}>🔔</button>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
          }}>SG</div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px", color: "#6b7280" }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }} />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="fade-up">
              <AdminHeader
                groupCount={groups.length}
                maxGroups={3}
                onCreateGroup={() => setShowModal(true)}
              />
            </div>


            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              <StatsSection
                totalGroups={groups.length}
                totalMembers={totalMembers}
                pendingRequests={requests.length}
              />
            </div>
          </>
        )}
      </main>

      {/* Create Group Modal */}
      {showModal && (
        <CreateGroupModal
          currentGroupCount={groups.length}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </AdminLayout>
  );
}
