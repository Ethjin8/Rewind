import { Link } from 'react-router-dom';

/**
 * PosterCard
 *
 * Props:
 *   movieId   {string|number}                 - if provided, the card links to /movie/:movieId
 *   title     {string}                        - displayed in the hover overlay
 *   image     {string}                        - URL for the poster image (optional)
 *   dateAdded {number}                        - Unix timestamp (ms) shown in the hover overlay
 *   actions   {{ text: string, onClick: fn }[]} - one or more buttons shown on hover
 */
export default function PosterCard({ movieId, title, image, dateAdded, actions = [] }) {
  const Wrapper = movieId ? Link : 'div';
  const wrapperProps = movieId ? { to: `/movie/${movieId}` } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative aspect-[2/3] overflow-hidden border border-white outline outline-[3px] outline-black shadow-[6px_6px_0_black] bg-[#2d4675] block"
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[#ede4c5] font-bold text-sm">
          {title}
        </div>
      )}

      {/* Panel: title always visible, actions + date revealed on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-black translate-y-[calc(100%-4rem)] group-hover:translate-y-0 transition-transform duration-300">
        <p className="min-h-16 flex items-center px-2 text-white text-sm">
          {title}
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
              className="bg-transparent w-full py-1 text-sm text-[#ede4c5] font-bold border-2 border-[#ede4c5] shadow-[3px_3px_0_#ede4c5] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
