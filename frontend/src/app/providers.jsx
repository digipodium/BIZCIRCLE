"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { PointsProvider } from "@/context/PointsContext";
import { ProfileProvider } from "@/lib/useProfile";
import { NotificationProvider } from "@/context/NotificationContext";
import PointsToast from "@/components/dashboard/PointsToast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <ProfileProvider>
      <PointsProvider>
        <NotificationProvider>
          {children}
          <PointsToast />
          {/* Global toast renderer for real-time notification popups */}
          <Toaster
            position="top-right"
            gutter={10}
            containerStyle={{ top: 20, right: 20 }}
            toastOptions={{
              style: { background: "transparent", boxShadow: "none", padding: 0 },
            }}
          />
        </NotificationProvider>
      </PointsProvider>
    </ProfileProvider>
  );
}

