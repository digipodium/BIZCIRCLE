"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

// ── Category emoji map ────────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
    referral:     '🔗',
    connection:   '👥',
    messaging:    '💬',
    opportunity:  '💼',
    event:        '📅',
    achievement:  '🏆',
    announcement: '📢',
    reminder:     '⏰',
};

import api from '@/lib/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount]     = useState(0);
    const [loading, setLoading]             = useState(true);
    const socketRef                         = useRef(null);

    // ── Fetch all notifications for logged-in user ──────────────────────────
    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        try {
            const { data } = await api.get('/api/notifications');
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount    || 0);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Socket.IO connection ─────────────────────────────────────────────────
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) { setLoading(false); return; }

        fetchNotifications();

        const socket = io(BASE_URL, { autoConnect: true });
        socketRef.current = socket;

        // Join personal notification room
        socket.emit('join_user', userId);

        // Handle incoming real-time notification
        socket.on('new_notification', (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // ── Rich toast popup (top-right, 5 s, clickable) ───────────────
            const emoji   = CATEGORY_EMOJI[newNotif.category] || '🔔';
            const preview = (newNotif.message || 'New notification').length > 70
                ? (newNotif.message || '').slice(0, 70) + '…'
                : (newNotif.message || 'New notification');

            toast.custom(
                (t) => (
                    <div
                        onClick={() => {
                            toast.dismiss(t.id);
                            window.location.href = '/notifications';
                        }}
                        style={{ pointerEvents: 'auto' }}
                        className={[
                            'flex items-start gap-3 w-80 max-w-full cursor-pointer',
                            'bg-white border border-slate-200 rounded-2xl shadow-2xl',
                            'px-4 py-3',
                        ].join(' ')}
                    >
                        {/* Emoji bubble */}
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-lg leading-none">
                            {emoji}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-slate-900 leading-snug capitalize">
                                {newNotif.category || 'Notification'}
                            </p>
                            <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                                {preview}
                            </p>
                            <p className="text-[10px] text-blue-500 font-semibold mt-1">
                                Tap to view →
                            </p>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toast.dismiss(t.id); }}
                            className="shrink-0 text-slate-300 hover:text-slate-500 text-sm leading-none"
                            aria-label="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                ),
                { duration: 5000, position: 'top-right' }
            );
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [fetchNotifications]);

    // ── Mark single as read ──────────────────────────────────────────────────
    const markRead = async (id) => {
        try {
            const res = await api.patch(`/api/notifications/${id}/read`);
            if (res.status === 200) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // ── Mark single as unread ────────────────────────────────────────────────
    const markUnread = async (id) => {
        try {
            const res = await api.patch(`/api/notifications/${id}/unread`);
            if (res.status === 200) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, read: false } : n)
                );
                setUnreadCount(prev => prev + 1);
            }
        } catch (err) {
            console.error('Error marking notification as unread:', err);
        }
    };

    // ── Mark ALL as read ─────────────────────────────────────────────────────
    const markAllRead = async () => {
        try {
            const res = await api.patch('/api/notifications/mark-all-read');
            if (res.status === 200) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error marking all read:', err);
        }
    };

    // ── Delete single ────────────────────────────────────────────────────────
    const deleteNotif = async (id) => {
        try {
            const res = await api.delete(`/api/notifications/${id}`);
            if (res.status === 200) {
                setNotifications(prev => {
                    const wasUnread = prev.find(n => n._id === id && !n.read);
                    if (wasUnread) setUnreadCount(c => Math.max(0, c - 1));
                    return prev.filter(n => n._id !== id);
                });
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    // ── Clear all ────────────────────────────────────────────────────────────
    const clearAll = async () => {
        try {
            const res = await api.delete('/api/notifications/clear-all');
            if (res.status === 200) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error clearing all notifications:', err);
        }
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

export const useNotifications = () => useContext(NotificationContext);