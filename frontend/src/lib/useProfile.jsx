"use client";

import { useState, useEffect, createContext, useContext } from "react";
import api from "@/lib/axios";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/user/profile");
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put("/user/profile", updates);
      setUser(data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ user, loading, error, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
