export default function ReflectionInput({
  value,
  onChange,
  response
}: {
  value: string;
  onChange: (val: string) => void;
  response?: string | null;
}) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700 font-medium mb-1">
        🗣️ Tell me what’s on your mind...
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!!response}
        placeholder="Type here..."
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700 placeholder-gray-400 transition duration-200"
      />
    </div>
  );
}
