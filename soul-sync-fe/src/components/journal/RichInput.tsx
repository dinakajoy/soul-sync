export default function RichInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        🖊️ What’s on your heart today?
      </label>
      <textarea
        rows={8}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder:text-gray-300"
        placeholder="Write freely or record your voice..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
