'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getOptimizedImageProps } from '@/lib/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  sizes,
  className,
  fill = false,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  const imageProps = getOptimizedImageProps(src, alt, {
    width,
    height,
    priority,
    quality,
    sizes,
  });

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''}`}>
      <Image
        {...imageProps}
        fill={fill}
        className={className}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
      />
    </div>
  );
}