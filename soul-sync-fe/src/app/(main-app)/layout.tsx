"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import TopBar from "@/components/TopBar";
import useCurrentUser from "@/lib/useUser";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const { setUser } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else {
        setUser(user);
        setIsReady(true);
      }
    }
  }, [loading, user, router, setUser]);

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access_token");
    localStorage.removeItem("access_token");
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout/${accessToken}`;
  };

  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.gif" alt="Loading..." className="w-32 h-32" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar handleLogout={handleLogout} />
      <main className="p-6">{children}</main>
    </div>
  );
}
