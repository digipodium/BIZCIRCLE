"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import api from "@/lib/axios";

const NotificationContext = createContext(null);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Fetch from REST on mount
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/api/notifications?limit=50");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchNotifications();

    // Socket.io — join personal room
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      s.emit("join_user", payload.id);
    } catch {/* ignore */}

    // Listen for pushed notifications
    s.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => s.disconnect();
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {/* silent */}
  };

  const markUnread = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/unread`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
      );
      setUnreadCount((c) => c + 1);
    } catch {/* silent */}
  };

  const markAllRead = async () => {
    try {
      await api.put("/api/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {/* silent */}
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      const removed = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (removed && !removed.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    } catch {/* silent */}
  };

  const clearAll = async () => {
    try {
      await api.delete("/api/notifications/clear-all");
      setNotifications([]);
      setUnreadCount(0);
    } catch {/* silent */}
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markRead,
        markUnread,
        markAllRead,
        deleteNotif,
        clearAll,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};

export default NotificationContext;
