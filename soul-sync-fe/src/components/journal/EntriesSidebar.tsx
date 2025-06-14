import { formattedDate } from "@/lib/utils";
import { JournalEntry } from "@/types";

export default function EntriesSidebar({
  journalEntries,
  onSearch,
  onEntryClick,
}: {
  journalEntries: JournalEntry[];
  onSearch: (term: string) => void;
  onEntryClick: (entry: JournalEntry) => void;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border h-full overflow-auto shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-purple-700">
        📂 Past Entries
      </h3>

      <input
        type="text"
        placeholder="Search by text..."
        className="w-full mb-3 px-3 py-2 border rounded-md border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700 placeholder:text-gray-300 transition"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="space-y-3">
        {journalEntries.length === 0 ? (
          <p className="text-gray-600">No journal entries yet.</p>
        ) : (
          journalEntries.map((entry) => (
            <div
              key={entry._id}
              onClick={() => onEntryClick(entry)}
              className="p-3 bg-white rounded shadow-sm border cursor-pointer hover:bg-purple-50 transition"
            >
              <p className="text-sm text-gray-600">
                {formattedDate(entry.date)}
              </p>
              <p className="font-medium text-purple-700">
                <span className="font-semibold">Mood: </span>
                {entry.mood}
              </p>
              <p className="text-sm text-gray-500">{entry.entry}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
