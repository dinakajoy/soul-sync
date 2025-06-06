"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { BarChart, Bar } from "recharts";
import {
  LucideDownload,
  LucideSmile,
  LucideMic,
  LucideBookOpen,
} from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";

const moodData = [
  { date: "Jun 1", mood: 3 },
  { date: "Jun 2", mood: 5 },
  { date: "Jun 3", mood: 4 },
  { date: "Jun 4", mood: 2 },
  { date: "Jun 5", mood: 4 },
  { date: "Jun 6", mood: 5 },
  { date: "Jun 7", mood: 3 },
];

const summary = {
  checkIns: 45,
  syncSessions: 12,
  journalEntries: 33,
  mostCommonMood: "😊 Calm",
  bestTimeOfDay: "Evening (6PM – 9PM)",
};

export default function InsightsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      alert("Data exported as JSON!");
      setExporting(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-screen-xl mx-auto p-6 space-y-10">
          <h1 className="text-3xl font-bold text-purple-700">
            📊 Insights Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<LucideSmile />}
              label="Check-Ins"
              value={summary.checkIns}
            />
            <StatCard
              icon={<LucideMic />}
              label="Sync Sessions"
              value={summary.syncSessions}
            />
            <StatCard
              icon={<LucideBookOpen />}
              label="Journal Entries"
              value={summary.journalEntries}
            />
          </div>

          {/* Mood Trends + Journal Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                📅 Mood Timeline
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                📘 Journal Themes
              </h2>
              <div className="h-48 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 italic">
                Word cloud visualization coming soon...
              </div>
            </div>
          </div>

          {/* Trends + Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                🔄 Soul Sync Trends
              </h2>
              <ul className="text-gray-700 space-y-2 text-base">
                <li>
                  <strong>Most Common Mood:</strong> {summary.mostCommonMood}
                </li>
                <li>
                  <strong>Best Time for Reflection:</strong>{" "}
                  {summary.bestTimeOfDay}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded shadow p-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📤 Export Your Data
              </h2>
              <button
                className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
                onClick={handleExport}
                disabled={exporting}
              >
                <LucideDownload className="w-5 h-5" />
                {exporting ? "Exporting..." : "Export (JSON)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// 🔹 Summary Card Component
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded shadow p-5 flex items-center gap-4">
      <div className="bg-purple-100 text-purple-600 rounded-full p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-purple-700">{value}</p>
      </div>
    </div>
  );
}

// 🔧 Features:
// ✅ Mood Timeline: Uses Recharts LineChart with sample mood scores.
// 📘 Word Cloud Stub: Placeholder – can use a D3 or canvas-based word cloud later.
// 🔄 Trends Section: Shows common mood and best reflection time.
// 📤 Export Button: Simulates JSON export; can integrate real export/download logic.

// Would you like:
// A working PDF/JSON export function?
// A real calendar heatmap instead of the line chart?
// A Word Cloud component (e.g., using react-wordcloud)?

// 🧩 Next Steps (Optional Enhancements):
// Add real word cloud using react-wordcloud or D3
// Connect to backend: load real stats from user entries
// Add PDF export using jsPDF or react-to-print
// Show charts by category (e.g. journal themes, sync impact)
