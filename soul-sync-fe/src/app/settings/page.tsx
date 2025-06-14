"use client";

import { useState } from "react";
import { LucideTrash2, LucideUser } from "lucide-react";
import { useUser } from "@/context/UserContext";
import AppLayout from "@/components/layouts/AppLayout";

export default function SettingsPage() {
  const { user } = useUser();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    const confirm = window.confirm(
      "Are you sure you want to permanently delete all your data? This action cannot be undone."
    );
    if (confirm) {
      setIsDeleting(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/deete-data/all`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setIsDeleting(false);
          return;
        }
        if (data) {
          alert("Your data has been deleted.");
          setIsDeleting(false);
        }
      } catch (error) {
        console.error("Error during submission:", error);
        setError("Error during submission. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const year = dateObj.getFullYear();
    return `${month}, ${year}`;
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-purple-700">⚙️ Settings</h1>

        {/* Account Info */}
        <section className="bg-white shadow rounded p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <LucideUser className="w-5 h-5 text-purple-500" />
            Account Info
          </h2>
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Member since:</strong>{" "}
              {user?.createdAt ? formattedDate(user?.createdAt) : "N/A"}
            </p>
          </div>
        </section>

        {/* Privacy Controls */}
        <section className="bg-white shadow rounded p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            🔐 Data & Privacy
          </h2>

          <div className="space-y-4">
            {error && <p className="p-2 text-red-500">{error}</p>}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <LucideTrash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete All Data"}
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
