"use client";

import { useState } from "react";
import { useJournal } from "@/context/JournalContext";
import AppLayout from "@/components/layouts/AppLayout";

const themes = [
  { emoji: "🧘", label: "Calm Anxiety" },
  { emoji: "💭", label: "Clarity & Focus" },
  { emoji: "💔", label: "Healing from Grief" },
  { emoji: "✨", label: "Self-worth Boost" },
];

const prompts = [
  "What’s been on your mind lately?",
  "Can you describe how that’s made you feel?",
  "If your best friend felt this way, what would you say to them?",
  "What’s one small step you can take today to feel a bit better?",
];

export default function SyncSessionPage() {
  const { journal } = useJournal();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleNext = () => {
    if (input.trim()) {
      setResponses([...responses, input]);
      setInput("");
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const restart = () => {
    setSelectedTheme(null);
    setCurrentPromptIndex(0);
    setResponses([]);
    setInput("");
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-purple-700">
            🔮 Sync Session
          </h1>

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
                    className="flex items-center gap-3 p-4 bg-purple-700 hover:bg-purple-500 border border-purple-200 rounded-lg text-lg font-medium transition"
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
              <p className="text-xl font-semibold mb-4">
                {prompts[currentPromptIndex]}
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Type your thoughts here..."
              />
              <button
                onClick={handleNext}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Next
              </button>
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
                  <li key={idx}>
                    <strong>Step {idx + 1}:</strong> {res}
                  </li>
                ))}
              </ul>
              <button
                onClick={restart}
                className="mt-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Restart Session
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// 🧘 Future Additions You Can Add:
// ✨ Fade-in animation between steps (with Framer Motion)
// 🎤 Voice input (optional)
// 🧠 Integrate AI response after each step
// 📝 Save responses to backend
