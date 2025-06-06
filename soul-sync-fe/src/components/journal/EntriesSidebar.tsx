const mockEntries = [
  { date: '2025-06-03', mood: 'Hopeful', summary: 'Wrote about future goals' },
  { date: '2025-06-02', mood: 'Stressed', summary: 'Workload reflections' },
];

export default function EntriesSidebar() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border h-full">
      <h3 className="text-lg font-semibold mb-4 text-purple-700">📂 Past Entries</h3>

      <input
        type="text"
        placeholder="Search by text..."
        className="w-full mb-3 px-3 py-2 border rounded-md border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700 placeholder:text-gray-300"
      />

      <div className="space-y-3">
        {mockEntries.map((entry, index) => (
          <div key={index} className="p-3 bg-white rounded shadow-sm border">
            <p className="text-sm text-gray-600">{entry.date}</p>
            <p className="font-medium text-purple-700">{entry.mood}</p>
            <p className="text-sm text-gray-500">{entry.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
