"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useProfile } from "@/lib/useProfile";
import api from "@/lib/axios";

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
  const { user } = useProfile();
  const [points, setPoints] = useState(0); 
  const [lastEarned, setLastEarned] = useState(null);

  // Sync with user's backend points whenever user data changes
  useEffect(() => {
    if (user && typeof user.points === 'number') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPoints(user.points);
    }
  }, [user]);

  const earnPoints = async (amount, reason) => {
    // Optimistic update
    setPoints((prev) => prev + amount);
    setLastEarned({ amount, reason, timestamp: Date.now() });

    try {
      // Persist to backend
      await api.put("/user/points", { amount });
    } catch (err) {
      console.error("Failed to save points to backend:", err);
      // Rollback on failure (optional, but good for accuracy)
      // setPoints((prev) => prev - amount);
    }
    
    // Clear toast after 5 seconds
    setTimeout(() => {
      setLastEarned(null);
    }, 5000);
  };

  return (
    <PointsContext.Provider value={{ points, earnPoints, lastEarned }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};
