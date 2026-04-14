"use client";

import React from "react";
import { PointsProvider } from "@/context/PointsContext";
import { ProfileProvider } from "@/lib/useProfile";
import PointsToast from "@/components/dashboard/PointsToast";

export function Providers({ children }) {
  return (
    <ProfileProvider>
      <PointsProvider>
        {children}
        <PointsToast />
      </PointsProvider>
    </ProfileProvider>
  );
}
