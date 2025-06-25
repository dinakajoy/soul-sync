"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const router = useRouter();

  const handleLogin = () => {
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/popup`,
      "Login with Google",
      "width=500,height=600"
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

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
    <section className="w-full flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-100 to-white">
      <h1 className="text-5xl font-bold text-purple-700">Soul Sync</h1>
      <p className="mt-4 text-xl text-gray-700">
        “Sync with your soul, one reflection at a time.”
      </p>
      <Button
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3 rounded-full cursor-pointer"
        onClick={handleLogin}
      >
        Start Your Journey →
      </Button>
    </section>
  );
}
