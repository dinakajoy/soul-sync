"use client";

import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";

type TResponse = {
  role: string;
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ message, history }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const response = await res.json();
      setMessages([
        ...messages,
        { role: "user", content: message },
        { role: "assistant", content: response.reply },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Error during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="w-full max-w-lg mx-auto h-[70%]">
          <p className="text-sm text-gray-700 mb-2 italic font-semibold">
            TheraBot is an AI therapist trained only for emotional support.
            Please do not ask technical or code-related questions.
          </p>
          <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="max-h-[75vh] h-[66vh] overflow-y-auto p-2">
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={
                    msg.role === "user" ? "text-purple-600" : "text-gray-600"
                  }
                >
                  <strong>{msg.role === "user" ? "You" : "TheraBot"}:</strong>{" "}
                  {msg.content}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-purple-300 rounded mt-2 text-gray-700"
            />
            {error && (
              <p className="my-2 text-red-700 p-2 bg-red-100 rounded">
                ⚠️ {error}
              </p>
            )}
            <button
              onClick={sendMessage}
              className="w-full mt-2 p-2 bg-purple-500 text-white rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
