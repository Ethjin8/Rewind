import { useState } from 'react';
import MovieDetail from './MovieDetail';

/**
 * PosterCard
 *
 * Props:
 *   movie     {object}                           - TMDB movie object
 *   dateAdded {number}                           - Unix timestamp (ms), app-specific, shown in hover panel
 *   actions   {{ text: string, onClick: fn }[]}  - buttons shown in the hover panel
 */
export default function PosterCard({ movie, dateAdded, actions = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Card ─────────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(true)}
        className="group relative aspect-[2/3] overflow-hidden border border-white outline outline-[3px] outline-black shadow-[6px_6px_0_black] bg-[#2d4675] cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        {movie.poster_path ? (
          <img
            src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[#ede4c5] font-bold text-sm">
            {movie.title}
          </div>
        )}

        {/* Slide-up panel — stopPropagation so clicking here doesn't open the modal */}
        <div
          className="absolute inset-x-0 bottom-0 bg-black translate-y-[calc(100%-2.5rem)] group-hover:translate-y-0 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Always-visible title bar */}
          <p className="min-h-10 flex items-center px-2 py-1 text-white text-xs font-black uppercase leading-tight">
            {movie.title}
          </p>

          {dateAdded && (
            <p className="px-2 pb-1 text-xs text-gray-400">
              Added {new Date(dateAdded).toLocaleDateString()}
            </p>
          )}

          <div className="flex flex-col gap-1 px-2 pt-1 pb-2">
            {actions.map(({ text, onClick }) => (
              <button
                key={text}
                onClick={(e) => { e.preventDefault(); onClick(); }}
                className="bg-transparent w-full py-1 text-sm text-[#ede4c5] font-bold border-2 border-[#ede4c5] shadow-[3px_3px_0_#ede4c5] hover:shadow-[5px_5px_0_#ede4c5] hover:-translate-x-[2px] hover:-translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {open && (
        <MovieDetail
          movie={movie}
          onClose={() => setOpen(false)}
          actions={actions}
        />
      )}
    </>
  );
}
