import { useState } from 'react';

interface PokemonSpriteProps {
  url: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PokemonSprite = ({ url, alt, size = 'md' }: PokemonSpriteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  if (!url || hasError) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <span className="text-3xl">❓</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-contain pixelated ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
