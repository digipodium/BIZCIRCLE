"use client";

import React from "react";
import { PointsProvider } from "@/context/PointsContext";
import { ProfileProvider } from "@/lib/useProfile";
import { NotificationProvider } from "@/context/NotificationContext";
import PointsToast from "@/components/dashboard/PointsToast";

export function Providers({ children }) {
  return (
    <ProfileProvider>
      <PointsProvider>
        <NotificationProvider>
          {children}
          <PointsToast />
        </NotificationProvider>
      </PointsProvider>
    </ProfileProvider>
  );
}
