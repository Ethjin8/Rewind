/**
 * PosterCard
 *
 * Props:
 *   title         {string}    - displayed in the hover overlay
 *   image         {string}    - URL for the poster image (optional)
 *   dateAdded     {number}    - Unix timestamp (ms) shown in the hover overlay
 *   buttonText    {string}    - label on the action button
 *   onButtonClick {function}  - callback fired when the button is clicked
 */
export default function PosterCard({ title, image, dateAdded, buttonText, onButtonClick }) {
  return (
    <div className="group relative aspect-[2/3] overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-black translate-y-[calc(100%-4rem)] group-hover:translate-y-0 transition-transform duration-300">
        <p className="min-h-16 flex items-center px-2 text-white text-sm">
          {title}
        </p>
        {dateAdded && (
          <p className="px-2 pb-1 text-xs text-gray-400">
            Added {new Date(dateAdded).toLocaleDateString()}
          </p>
        )}
        <div className="flex px-2 pt-1 pb-1">
          <button
            onClick={onButtonClick}
            className="bg-white w-full py-1 text-sm text-black"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
}
