"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJournal } from "@/context/JournalContext";
import { postSync, postTrackSync } from "@/lib/requests";

const themes = [
  { emoji: "🧘", label: "Calm Anxiety" },
  { emoji: "💭", label: "Clarity & Focus" },
  { emoji: "💔", label: "Healing from Grief" },
  { emoji: "✨", label: "Self-worth Boost" },
];

const defaultPrompt = ["What’s been on your mind lately?"];

export default function SyncSessionPage() {
  const queryClient = useQueryClient();
  const { journal } = useJournal();

  const [prompts, setPrompts] = useState(defaultPrompt);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [airesponses, setAIResponses] = useState<string[]>([]);
  const [input, setInput] = useState(journal || "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const syncMutation = useMutation({
    mutationFn: postSync,
    onSuccess: (data) => {
      setPrompts((prev) => [...prev, data.question]);
      setAIResponses((prev) => [...prev, data.response]);
      setSubmitted(false);
    },
    onError: (err: Error) => {
      setError(err.message);
      setSubmitted(false);
      queryClient.invalidateQueries({ queryKey: ["summaryCounts"] });
    },
  });

  const handleDone = () => {
    setSubmitted(true);
    setError("");
    setAIResponses(airesponses);

    const trimmedInput = input.trim();
    if (!trimmedInput || !selectedTheme) {
      setError("Please make an entry.");
      setSubmitted(false);
      return;
    }

    syncMutation.mutate({
      theme: selectedTheme,
      currentQuestion: prompts[currentPromptIndex],
      userResponse: trimmedInput,
    });
  };

  const handleNext = () => {
    if (input.trim()) {
      setResponses([...responses, input]);
      setInput("");
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const restartMutation = useMutation({
    mutationFn: async () =>
      postTrackSync({
        theme: selectedTheme || themes[0].label,
      }),
    onSuccess: async () => {
      setResponses([]);
      setInput("");

      await queryClient.invalidateQueries({ queryKey: ["summaryCounts"] });
    },
    onError: (err) => {
      console.error("Restart failed", err);
    },
  });

  const endSession = () => {
    restartMutation.mutate();
  };

  const restartSession = () => {
    setSelectedTheme(null);
    setPrompts(defaultPrompt);
    setAIResponses([]);
    setCurrentPromptIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="max-w-screen-md mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-purple-700">🔮 Sync Session</h1>

        {!selectedTheme ? (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Choose your intention for this session:
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setSelectedTheme(t.label)}
                  className="flex items-center gap-3 p-4 bg-purple-700 hover:bg-purple-500 border border-purple-200 rounded-lg text-lg font-medium transition cursor-pointer"
                >
                  <span className="text-2xl">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ) : currentPromptIndex < prompts.length ? (
          <div className="bg-white border rounded-lg p-6 shadow transition-all">
            <h3 className="text-md text-gray-500 mb-1">
              Theme: {selectedTheme}
            </h3>
            <blockquote className="text-gray-600 italic mt-2">
              {prompts[currentPromptIndex]}
            </blockquote>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-gray-300 text-gray-700 mt-4"
              placeholder="Type your thoughts here..."
              disabled={!!airesponses[currentPromptIndex]}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {airesponses[currentPromptIndex] && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-gray-700">
                  {airesponses[currentPromptIndex]}
                </p>
              </div>
            )}

            {!airesponses[currentPromptIndex] ? (
              <button
                onClick={handleDone}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitted}
              >
                {submitted ? "Loading..." : "Send"}
              </button>
            ) : (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleNext}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                >
                  Next
                </button>
                <button
                  onClick={() => {
                    prompts.pop();
                    handleNext();
                    endSession();
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                >
                  End
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              🌟 Great job completing your sync session!
            </h2>
            <p className="text-gray-700 mb-4">
              You reflected on <strong>{selectedTheme}</strong> and gave
              thoughtful answers.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              {responses.map((res, idx) => (
                <li key={idx} className="mb-2 p-2 border-b border-gray-200">
                  <div>
                    <strong>Prompt {idx + 1}:</strong> {prompts[idx]}
                  </div>
                  <div>
                    <strong>Response:</strong> {res}
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={restartSession}
              className="mt-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer"
            >
              Restart Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
