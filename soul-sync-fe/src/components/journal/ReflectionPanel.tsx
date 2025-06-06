export default function ReflectionPanel({ text }: { text: string }) {
  // Mock AI analysis
  const mockSummary = "Here’s what I gathered from your entry...";
  const mockThemes = ["Gratitude", "Stress", "Hope"];

  return (
    <div className="bg-white border border-purple-100 rounded-lg p-6 space-y-4 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">🤖 AI Reflection</h2>
      <p className="text-gray-700">{mockSummary}</p>
      <p className="text-sm text-gray-500 italic">“{text.slice(0, 100)}...”</p>

      <div>
        <span className="text-gray-600 font-medium">Themes:</span>
        <div className="flex flex-wrap mt-1 gap-2">
          {mockThemes.map((tag) => (
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
