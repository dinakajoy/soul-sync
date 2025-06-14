import { formattedDate } from "@/lib/utils";
import { JournalEntry } from "@/types";
import { X } from "lucide-react";

export default function JournalDrawer({
  entry,
  onClose,
}: {
  entry: JournalEntry;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#332e3287]">
      <div className="w-full sm:w-1/2 h-full bg-white shadow-xl p-6 relative animate-slide-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-purple-700 mb-2">
          Journal Entry
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {formattedDate(entry.date)}
        </p>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            🖊️ What’s on your heart today?
          </label>
          <textarea
            disabled
            rows={8}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder:text-gray-300"
            placeholder="Write freely..."
            value={entry.entry}
          />
        </div>

        <div className="bg-white border border-purple-100 rounded-lg p-6 space-y-4 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">🤖 Reflection</h2>
          <p className="text-gray-800">
            Mood: <span className="font-medium">{entry?.mood}</span>
          </p>
          <p className="text-gray-700">{entry?.reflection}</p>

          <div>
            <span className="text-gray-600 font-medium"> Core Feelings:</span>
            <div className="flex flex-wrap mt-1 gap-2">
              {entry?.themes.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
