import { useState } from 'react';

const MEDIA_TYPES = ['Movie', 'TV Show', 'Book', 'Game'];

const initialItems = [  
  { id: 1, title: 'placeholder 1', type: 'Movie',   genre: 'Sci-Fi',  addedAt: '2024-01-10' },
  { id: 2, title: 'placeholder 2', type: 'TV Show', genre: 'Drama',   addedAt: '2024-02-03' },
  { id: 3, title: 'placeholder 3', type: 'Game',    genre: 'RPG',     addedAt: '2024-03-15' },
  { id: 4, title: 'what kind of awesome is this?', type: 'Book',    genre: 'Sci-Fi',  addedAt: '2024-04-22' },
];

const emptyForm = { title: '', type: 'Movie', genre: '' };

export default function Backlog() {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      title: form.title,
      type: form.type,
      genre: form.genre,
      addedAt: new Date().toISOString().slice(0, 10),
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

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-neutral-300">{item.title}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-xl text-gray-400 hover:text-red-500 text-sm shrink-0"
              >
                Remove
              </button>
            </div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span className="border border-gray-200 rounded px-2">{item.type}</span>
              {item.genre && (
                <span className="border border-gray-200 rounded px-2">{item.genre}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">Date Added: {item.addedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
