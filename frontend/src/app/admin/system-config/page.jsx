"use client";

import SystemConfig from "@/components/admin/SystemConfig";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SystemConfigPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SystemConfig />
    </ProtectedRoute>
  );
}
