"use client"

import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const initials: string = alt
    .trim()
    .split(/\s+/)
    .map((word: string) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NA'; // Fallback to "NA" if alt is empty

  return (
    <div className="relative w-10 h-10">
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className="w-10 h-10 rounded-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium text-sm">
          {initials}
        </div>
      )}
    </div>
  );
};
