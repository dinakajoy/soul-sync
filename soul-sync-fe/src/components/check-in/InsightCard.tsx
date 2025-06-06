"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckinResponse } from "@/types";

export default function InsightCard({
  response,
}: {
  response: CheckinResponse;
}) {
  const [showAffirmation, setShowAffirmation] = useState(false);
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-purple-100">
      <p className="text-gray-700">You are {response.emotion.toLowerCase()}.</p>
      <p className="text-gray-700">{response.message}</p>

      {showAffirmation &&
        response.affirmations &&
        response.affirmations.length > 0 && (
          <div className="bg-purple-50 border-l-4 border-purple-300 p-4 rounded-md space-y-2">
            <h3 className="text-purple-700 font-semibold">🌿 Affirmations</h3>
            <ul className="list-disc list-inside text-purple-800 text-sm space-y-1">
              {response.affirmations.map((text, index) => (
                <li key={index} className="leading-relaxed">
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200"
          onClick={() => setShowAffirmation(!showAffirmation)}
        >
          💬 Affirmation
        </button>
        <Link
          href="/sync"
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
        >
          🔮 Start Sync
        </Link>
        <Link
          href="/journal"
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
        >
          📓 Journal It
        </Link>
      </div>
    </div>
  );
}
