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
      }
    }
  }, [user, loading, router]);

  const handleBecomeAdmin = async () => {
    try {
      const api = (await import("@/lib/axios")).default;
      await api.put("/user/profile", { role: "admin" });
      window.location.reload(); // Reload to refresh user profile with new role
    } catch (err) {
      alert("Failed to update role. Make sure the backend is running.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-500 font-medium animate-pulse">Verifying secure access...</div>
        </div>
      </div>
    );
  }

  // If we have a user and their role is allowed, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Unauthorized state
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-100 border border-blue-50 text-center">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Admin Access Required</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Your current account (role: <span className="font-bold text-blue-600">{user.role}</span>) does not have permission to view this page.
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleBecomeAdmin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
            >
              Become Admin (Dev Mode)
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
