"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { useEffect, useState } from "react";
import { BarChart, Bar } from "recharts";
import { LucideSmile, LucideMic, LucideBookOpen } from "lucide-react";
import { AllEntries, Counts } from "@/types";

const emotionToMood: Record<string, { score: number; label: string }> = {
  Happy: { score: 1, label: "Happy 😊" },
  Excited: { score: 2, label: "Excited 😄" },
  Anxious: { score: 3, label: "Anxious 😟" },
  Tired: { score: 4, label: "Tired 😴" },
  Sad: { score: 5, label: "Sad 😔" },
  Frustrated: { score: 6, label: "Frustrated 😤" },
  Overwhelmed: { score: 7, label: "Overwhelmed 🤯" },
  Confused: { score: 8, label: "Confused 😕" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const moodLabel = payload[0].payload.moodLabel;
    return (
      <div className="bg-white border shadow-md p-2 rounded text-sm text-gray-600">
        <p className="font-semibold">{label}</p>
        <p>Mood: {moodLabel}</p>
      </div>
    );
  }

  return null;
};

export default function InsightsPage() {
  const [summaryData, setSummaryData] = useState<Counts | null>(null);
  const [allData, setAllData] = useState<AllEntries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/counts`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error("Failed to fetch data");
        }

        const [countData, allData] = await Promise.all([
          res1.json(),
          res2.json(),
        ]);

        setSummaryData(countData);
        setAllData(allData);
      } catch (error) {
        console.error("Error loading journal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  const moodData = allData?.checkins?.map((entry) => {
    const date = new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const { score, label } = emotionToMood[entry.emotion] || {
      score: 3,
      label: "Neutral",
    };

    return {
      date,
      mood: score,
      moodLabel: label,
    };
  });

  // Transform data to mood frequency
  const moodCounts = allData?.journals.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart-friendly format
  const chartData = Object.entries(moodCounts || {}).map(([mood, count]) => ({
    mood,
    count,
  }));

  return (
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
            value={summaryData ? summaryData?.checkInCount : 0}
          />
          <StatCard
            icon={<LucideMic />}
            label="Sync Sessions"
            value={summaryData ? summaryData?.syncSessionCount : 0}
          />
          <StatCard
            icon={<LucideBookOpen />}
            label="Journal Entries"
            value={summaryData ? summaryData?.journalCount : 0}
          />
        </div>

        {/* Mood Trends + Journal Themes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              📅 Checkin Mood Timeline
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[1, 10]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
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
            <div className="border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 italic">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={chartData}>
                  <XAxis dataKey="mood" />
                  <YAxis ticks={[0, 10, 20, 30, 40]} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
