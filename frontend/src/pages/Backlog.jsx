import { useState } from 'react';
import PosterCard from '../components/PosterCard';

const MEDIA_TYPES = ['Movie', 'TV Show', 'Book', 'Game'];

const initialItems = [
  { id: 1, title: 'placeholder 1', type: 'Movie',   genre: 'Sci-Fi',  addedAt: 1 },
  //added at is unix time
  { id: 2, title: 'placeholder 2', type: 'TV Show', genre: 'Drama',   addedAt: 1019331 },
  { id: 3, title: 'placeholder 3', type: 'Game',    genre: 'RPG',     addedAt: 17100010 },
  { id: 4, title: 'what kind of awesome is this?', type: 'Book', genre: 'Sci-Fi', addedAt: 193813519 },
];

const emptyForm = { title: '', type: 'Movie', genre: '' };

export default function Backlog() {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');

  const sortedItems = [...items].sort((a, b) =>
    sortOrder === 'latest' ? b.addedAt - a.addedAt : a.addedAt - b.addedAt
  );

  function handleAdd(e) {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      title: form.title,
      type: form.type,
      genre: form.genre,
      addedAt: Date.now(),
    };
    setItems([...items, newItem]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function handleDelete(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl">My Backlog</h1>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="latest">Latest Added</option>
          <option value="oldest">First Added</option>
        </select>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-gray-900 text-white rounded text-sm"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 flex gap-3 items-end border border-gray-200 rounded p-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Title</label>
            <input
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Type</label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {MEDIA_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Genre</label>
            <input
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Genre"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-400 text-white rounded text-sm"
          >
            Add
          </button>
        </form>
      )}

      {sortedItems.length > 0 && (
        <div className="w-2/3 mx-auto mb-6 flex gap-6">
          <img
            src="/testposter.webp"
            alt={sortedItems[0].title}
            className="w-48 object-cover shrink-0"
          />
          <div className="flex flex-col justify-end gap-2 text-left">
            <p className="text-2xl">{sortedItems[0].title}</p>
            <p className="text-sm text-gray-400">
              Added {new Date(sortedItems[0].addedAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(sortedItems[0].id)}
              className="w-fit px-4 py-1 bg-gray-900 text-white text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="w-2/3 mx-auto grid grid-cols-4 gap-3">
        {sortedItems.map((item) => (
          <PosterCard
            key={item.id}
            title={item.title}
            image="/testposter.webp"
            dateAdded={item.addedAt}
            buttonText="Remove"
            onButtonClick={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
