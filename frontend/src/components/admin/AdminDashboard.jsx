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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="font-bold">Syncing Platform Data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-700">
          {renderSection()}
        </div>
      </nav>

      {/* Main Content */ }
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

        <div className="fade-up" style={{ animationDelay: "0.2s" }}>
          <ConstraintBanner />
        </div>

        <div className="fade-up" style={{ animationDelay: "0.25s" }}>
          <GroupsSection groups={groups} />
        </div>

        <div className="fade-up" style={{ animationDelay: "0.3s" }}>
          <JoinRequestsSection
            requests={requests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </>
    )
    }
  </main >

  {/* Create Group Modal */ }
  {
    showModal && (
      <CreateGroupModal
        currentGroupCount={groups.length}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateGroup}
      />
    )
  }
    </AdminLayout >
  );
}
