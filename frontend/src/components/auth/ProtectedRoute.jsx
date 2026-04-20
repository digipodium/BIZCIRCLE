"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/useProfile";

export default function ProtectedRoute({ children, allowedRoles = ["user", "admin"] }) {
  const { user, loading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        console.warn(`[AUTH] Unauthorized access attempt by ${user.email}. Role: ${user.role}`);
        router.push("/dashboard"); // Redirect to a safe place
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        height: "100vh", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--textSoft)"
      }}>
        <div className="animate-pulse">Loading secure content...</div>
      </div>
    );
  }

  // If we have a user and their role is allowed, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (or a forbidden message) while redirecting
  return null;
}
