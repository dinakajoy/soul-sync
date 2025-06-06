import { MoodOption, moods } from "@/types";

export default function MoodSelector({
  selected,
  onSelect,
}: {
  selected: MoodOption | null;
  onSelect: (mood: MoodOption) => void;
}) {
  return (
    <div>
      <h2 className="font-semibold text-gray-700 mb-2">How are you feeling?</h2>
      <div className="flex gap-3">
        {moods.map((m) => (
          <div className="relative group" key={m.label}>
            <button
              key={m.label}
              onClick={() => onSelect(m)}
              className={`text-2xl p-2 rounded-full border transition cursor-pointer ${
                selected?.label === m.label
                  ? "bg-purple-100 border-purple-500"
                  : "border-gray-300 hover:border-purple-300"
              }`}
            >
              {m.emoji}
            </button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
