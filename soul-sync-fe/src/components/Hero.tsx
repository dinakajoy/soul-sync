"use client";

import { Button } from "@/components/ui/button";

export default function Hero({ handleLogin }: { handleLogin: () => void }) {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-100 to-white">
      <h1 className="text-5xl font-bold text-purple-700">Soul Sync</h1>
      <p className="mt-4 text-xl text-gray-700">
        Sync with your soul, one reflection at a time.
      </p>
      <Button
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3 rounded-full cursor-pointer"
        onClick={handleLogin}
      >
        Get Started →
      </Button>
    </section>
  );
}