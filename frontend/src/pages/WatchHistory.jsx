export default function WatchHistory() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Watch History</h1>

      <div className="flex flex-col gap-3">
        {['placeholder 1', 'placeholder 2', 'placeholder 3'].map((title) => (
          <div key={title} className="border border-gray-200 rounded p-4 flex justify-between text-sm">
            <span className="text-gray-400">{title}</span>
            <span className="text-gray-300">Completed: yyyy-mm-dd</span>
          </div>
        ))}
      </div>
    </div>
  );
}
