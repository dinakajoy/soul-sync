import { JournalResponse } from "@/types";

export default function ReflectionPanel({
  response,
}: {
  response?: JournalResponse;
}) {
  return (
    <div className="bg-white border border-purple-100 rounded-lg p-6 space-y-4 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">🤖 Reflection</h2>
      <p className="text-gray-800">Mood: <span className="font-medium">{response?.mood}</span></p>
      <p className="text-gray-700">{response?.summary}</p>

      <div>
        <span className="text-gray-600 font-medium"> Core Feelings:</span>
        <div className="flex flex-wrap mt-1 gap-2">
          {response?.themes.map((tag) => (
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
  );
}
