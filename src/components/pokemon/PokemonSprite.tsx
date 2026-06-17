import { useState, useEffect, useRef } from 'react';

interface PokemonSpriteProps {
  url: string | null;
  shinyUrl?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean; // For above-the-fold images
}

export const PokemonSprite = ({ url, shinyUrl, alt, size = 'md', priority = false }: PokemonSpriteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isHovered, setIsHovered] = useState(false);
  const [shinyLoaded, setShinyLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Preload shiny sprite on hover
  useEffect(() => {
    if (isHovered && shinyUrl && !shinyLoaded) {
      const img = new Image();
      img.onload = () => setShinyLoaded(true);
      img.src = shinyUrl;
    }
  }, [isHovered, shinyUrl, shinyLoaded]);

  if (!url || hasError) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <span className="text-3xl">❓</span>
      </div>
    );
  }


  const displayUrl = isHovered && shinyUrl && shinyLoaded ? shinyUrl : url;

  return (
    <div
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => shinyUrl && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
      {!shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={shouldLoad ? displayUrl : undefined}
        alt={isHovered && shinyUrl ? `${alt} (shiny)` : alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        className={`w-full h-full object-contain pixelated ${isLoading || !shouldLoad ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {shinyUrl && (
        <div className="absolute bottom-1 right-1 text-xs bg-yellow-400 text-yellow-900 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ✨
        </div>
      )}
    </div>
  );
};
