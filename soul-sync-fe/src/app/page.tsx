"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google/popup`,
      "_blank",
      "width=500,height=600"
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_SERVER_URL) return;

      console.log("Event ==== received:", event);
      const { token } = event.data;
      console.log("Token received:", token);
      if (token) {
        localStorage.setItem("access_token", token);
        router.push("/insights");
      }
    };

    window.addEventListener("message", messageHandler, false);

    // cleanup
    const cleanup = () => window.removeEventListener("message", messageHandler);
    popup?.addEventListener("beforeunload", cleanup);
  };
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Hero handleLogin={handleLogin} />
      <Benefits />
    </main>
  );
}
