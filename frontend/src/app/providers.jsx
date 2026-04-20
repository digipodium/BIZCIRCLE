"use client";

import React from "react";
import { PointsProvider } from "@/context/PointsContext";
import { ProfileProvider } from "@/lib/useProfile";
import { NotificationProvider } from "@/context/NotificationContext";
import PointsToast from "@/components/dashboard/PointsToast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ProfileProvider>
        <PointsProvider>
          <NotificationProvider>
            {children}
            <PointsToast />
          </NotificationProvider>
        </PointsProvider>
      </ProfileProvider>
    </GoogleOAuthProvider>
  );
}
