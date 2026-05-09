export default function Search() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm w-80"
          placeholder="Search by title..."
        />
        <button className="bg-blue-400 text-white px-4 py-2 rounded text-sm">Search</button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm w-80"
          placeholder="Search by mood or tone (e.g. dark, funny, tense)..."
        />
        <button className="bg-blue-400 text-white px-4 py-2 rounded text-sm">Search</button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm w-80"
          placeholder="Filter by platform (e.g. Netflix, Steam)..."
        />
        <button className="bg-blue-400 text-white px-4 py-2 rounded text-sm">Search</button>
      </div>

      <div className="text-sm text-gray-400">Results will appear here.</div>
    </div>
  );
}
