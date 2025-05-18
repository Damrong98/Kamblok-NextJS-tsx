"use client";

import { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const initials: string = alt
    .trim()
    .split(/\s+/)
    .map((word: string) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NA';

  const handleError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setRetryCount((prev) => prev + 1); // Force re-render by changing key
  };

  return (
    <div className="relative w-10 h-10">
      {!hasError ? (
        <Image
          key={retryCount} // Force reload on retry
          src={src}
          alt={alt}
          width={40}
          height={40}
          className="rounded-full object-cover"
          onError={handleError}
          unoptimized // Use if src is external; remove if using Next.js image optimization
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium text-sm cursor-pointer"
          onClick={handleRetry}
          title="Click to retry loading image"
        >
          {initials}
        </div>
      )}
    </div>
  );
};