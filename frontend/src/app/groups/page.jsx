"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GroupsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/circles");
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center">
      <div className="animate-pulse text-blue-600 font-bold">Redirecting to Circles...</div>
    </div>
  );
}
