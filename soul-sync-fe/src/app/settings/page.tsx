"use client";

import { useState } from "react";
import { LucideTrash2, LucideDownload, LucideUser } from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      alert("Your data has been exported as JSON.");
      setExporting(false);
    }, 1000);
  };

  const handleDelete = () => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete all your data? This action cannot be undone."
    );
    if (confirm) {
      setIsDeleting(true);
      setTimeout(() => {
        alert("Your data has been deleted.");
        setIsDeleting(false);
      }, 1500);
    }
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
              <strong>Name:</strong> Joy Odinaka
            </p>
            <p>
              <strong>Email:</strong> joy@example.com
            </p>
            <p>
              <strong>Member since:</strong> May 2023
            </p>
          </div>
        </section>

        {/* Privacy Controls */}
        <section className="bg-white shadow rounded p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            🔐 Data & Privacy
          </h2>

          <div className="space-y-4">
            {/* Export */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
            >
              <LucideDownload className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export Entries (JSON)"}
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
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
