"use client";

import { useState } from "react";
import { useJournal } from "@/context/JournalContext";
import AppLayout from "@/components/layouts/AppLayout";
import MoodSelector from "@/components/check-in/MoodSelector";
import ReflectionInput from "@/components/check-in/ReflectionInput";
import InsightCard from "@/components/check-in/InsightCard";
import { MoodOption } from "@/types";

export default function CheckInPage() {
  const { setJournal } = useJournal();
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [reflection, setReflection] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitted(true);
    setError("");
    setResponse(null);
    try {
      if (!mood?.emoji || !reflection) {
        setError("Please select a mood and enter your reflection.");
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-in`, {
        method: "POST",
        body: JSON.stringify({
          moodEmoji: mood?.emoji,
          emotion: mood?.label,
          reflection,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data) {
        setJournal(reflection);
        setResponse(data);
        setSubmitted(false);
      }
      // updateMoodGraph(data); // refresh chart
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Error during submission. Please try again.");
      setSubmitted(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-purple-700">Daily Check-In</h1>
        <p className="mt-2 text-gray-600">
          Let’s reflect on how you are feeling today.
        </p>
        <hr className="my-4 py-4" />

        <>
          <MoodSelector selected={mood} onSelect={setMood} />
          <ReflectionInput value={reflection} onChange={setReflection} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {response && (
            <p className="text-green-500 text-sm mt-2">{response}</p>
          )}
          <button
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={submitted || response!!}
          >
            Submit Check-In
          </button>
        </>
        {response && <InsightCard response={response} />}
      </div>
    </AppLayout>
  );
}
