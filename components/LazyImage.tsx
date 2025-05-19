import { useState, useEffect } from "react";
import Image from "next/image";

interface LazyImageProps {
  src: string;
  alt: string;
  className: string;
}

const LazyImage = ({ src, alt, className }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleImageError = () => {
    setHasError(true);
    // Try a proxy approach to fix CORS
    if (src.startsWith("https://") && !src.includes("proxy")) {
      try {
        // Use a proxy or just fall back to placeholder
        setImageSrc(`/api/imageProxy?url=${encodeURIComponent(src)}`);
      } catch (e) {
        console.error("Error with image proxy", e);
      }
    }
  };

  if (hasError) {
    return (
      <div
        className={`${className} bg-[#4D4F5C] rounded-full flex items-center justify-center`}
      >
        <span className="text-white text-xs font-bold">{alt.charAt(0)}</span>
      </div>
    );
  }

  // Use a regular img tag instead of Next.js Image for remote images
  // This avoids issues with the Next.js Image component's default loader
  return (
    <div className={`relative ${className} overflow-hidden`}>
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-contain"
        onError={handleImageError}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#4D4F5C] rounded-full animate-pulse" />
      )}
    </div>
  );
};

export { LazyImage };
