export default function RichInput({
  value,
  onChange,
  response,
}: {
  value: string;
  onChange: (v: string) => void;
  response?: string | null;
}) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        🖊️ What’s on your heart today?
      </label>
      <textarea
        disabled={!!response}
        rows={8}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder:text-gray-300"
        placeholder="Write freely..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
