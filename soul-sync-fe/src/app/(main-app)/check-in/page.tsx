"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJournal } from "@/context/JournalContext";
import MoodSelector from "@/components/check-in/MoodSelector";
import ReflectionInput from "@/components/check-in/ReflectionInput";
import InsightCard from "@/components/check-in/InsightCard";
import { MoodOption } from "@/types";
import { postCheckin } from "@/lib/requests";

export default function CheckInPage() {
  const queryClient = useQueryClient();
  const { setJournal } = useJournal();
  
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const submitCheckIn = async ({
    mood,
    reflection,
  }: {
    mood: { emoji: string; label: string } | null;
    reflection: string;
  }) => {
    if (!mood?.emoji || !reflection) {
      throw new Error("Please select a mood and enter your reflection.");
    }

    const data = await postCheckin({
      moodEmoji: mood.emoji,
      emotion: mood.label,
      reflection,
    });

    if (data.error) throw new Error(data.error);

    return data;
  };

  const {
    mutate: sendCheckin,
    isPending,
  } = useMutation({
    mutationFn: submitCheckIn,
    onSuccess: (data) => {
      setJournal(reflection);
      setResponse(data);
      
      // Invalidate the queries to refetch them
      queryClient.invalidateQueries({ queryKey: ["summaryCounts"] });
      queryClient.invalidateQueries({ queryKey: ["allJournalData"] });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError("");
    setResponse(null);
    sendCheckin({ mood, reflection });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">Daily Check-In</h1>
      <blockquote className="text-gray-500 italic mt-2">
        The purpose of Checkins is to build the habit of quickly reflecting on
        how you feel at any moment or daily.
      </blockquote>
      <p className="mt-2 text-gray-600">
        Let’s reflect on how you are feeling today.
      </p>

      <hr className="my-4 py-4" />

      <>
        <MoodSelector selected={mood} onSelect={setMood} />
        <ReflectionInput
          value={reflection}
          onChange={setReflection}
          response={response}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {!response && (
          <button
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Check-In"}
          </button>
        )}
      </>
      {response && <InsightCard response={response} />}
    </div>
  );
}
