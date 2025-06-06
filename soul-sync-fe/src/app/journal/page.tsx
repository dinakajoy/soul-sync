"use client";

import { useState } from "react";
import { useJournal } from "@/context/JournalContext";
import AppLayout from "@/components/layouts/AppLayout";
import RichInput from "@/components/journal/RichInput";
import ReflectionPanel from "@/components/journal/ReflectionPanel";
import EntriesSidebar from "@/components/journal/EntriesSidebar";

export default function JournalPage() {
  const { journal } = useJournal();
  const [entry, setEntry] = useState(journal || "");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (entry.trim()) setSubmitted(true);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col justify-center lg:flex-row gap-6 h-full p-4">
          {/* Sidebar */}
          <div className="lg:w-2/5 w-full">
            <EntriesSidebar />
          </div>

          {/* Main Area */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold text-purple-700">
              Your Journal
            </h1>

            {!submitted ? (
              <>
                <RichInput value={entry} onChange={setEntry} />
                <button
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={handleSubmit}
                >
                  Submit Entry
                </button>
              </>
            ) : (
              <ReflectionPanel text={entry} />
            )}
            <ReflectionPanel text={entry} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Additions You Can Build Later:
// 🧑‍🔬 AI-powered summary (use OpenAI API)
// 🕰️ Sort/filter entries by mood, date, or keywords
// 🎤 Speech-to-text with Web Speech API or react-speech-recognition
// 🧾 Save/load entries from database
