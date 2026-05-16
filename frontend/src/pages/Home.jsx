export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Home</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Recommended For You</h2>
        <div className="grid grid-cols-3 gap-4">
          {['placeholder 1', 'placeholder 2', 'placeholder 3'].map((title) => (
            <div key={title} className="border border-gray-200 rounded p-4 text-sm text-gray-400">
              {title}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Trending</h2>
        <div className="grid grid-cols-3 gap-4">
          {['placeholder 1', 'placeholder 2', 'placeholder 3'].map((title) => (
            <div key={title} className="border border-gray-200 rounded p-4 text-sm text-gray-400">
              {title}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
