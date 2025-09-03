"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import { Button } from "@/components/ui/button";

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

      const { token } = event.data;
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

      {/* Guest prediction section */}
      <div className="mt-2 text-center">
        <p className="text-md text-gray-600 mb-4">
          Not ready to sign up yet? Try our mental health treatment prediction
          tool as a guest:
        </p>
        <Link href="/guest-treatment-need">
          <Button className="bg-gray-200 hover:bg-gray-300 text-purple-700 text-lg px-6 py-3 rounded-full cursor-pointer">
            Try Prediction
          </Button>
        </Link>
      </div>
    </main>
  );
}
