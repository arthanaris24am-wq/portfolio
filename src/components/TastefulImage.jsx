import { useState } from 'react';

/**
 * TastefulImage: Robust image component with fallback UI
 * If image fails to load or path doesn't exist, it displays an aesthetic dark card
 * with a subtle gradient and accent emblem rather than a broken image icon.
 */
export default function TastefulImage({
  src,
  alt = 'Portfolio item',
  className = '',
  aspectRatio = 'aspect-[16/10]',
  fallbackTitle = 'Engineering Preview',
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#0d0d12] border border-white/5 ${aspectRatio} ${className}`}
    >
      {!hasError && src ? (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`h-full w-full object-cover object-top transition-all duration-700 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
          {/* Subtle loading shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-[#ff5a1f]/40 border-t-[#ff5a1f] animate-spin" />
            </div>
          )}
        </>
      ) : (
        /* Tasteful Fallback */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#12131a] via-[#0d0d12] to-[#07070a]">
          <div className="w-12 h-12 rounded-xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center mb-3 text-[#ff5a1f]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="font-display font-semibold text-white/90 text-sm tracking-wide">
            {fallbackTitle}
          </span>
          <span className="text-xs text-neutral-500 font-mono mt-1">
            Photo placeholder
          </span>
        </div>
      )}
    </div>
  );
}

