/**
 * Image Optimization Utilities
 * Provides lazy loading and responsive image helpers
 */

/**
 * LazyImage Component - Optimized image loading with blur placeholder
 */
import { useState, useEffect, useRef } from "react";

export const LazyImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-wrapper ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-secondary-bg)",
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          {...props}
        />
      )}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #0a0e1a 0%, #131318 50%, #0a0e1a 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * Preload critical images
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = (sources) => {
  return Promise.all(sources.map(preloadImage));
};

/**
 * Get optimized image URL (placeholder for future CDN integration)
 */
export const getOptimizedImageUrl = (src, options = {}) => {
  const { width, quality = 80, format = "webp" } = options;
  
  // For now, return original src
  // In production, you could integrate with a CDN like Cloudinary or imgix
  // Example: `https://your-cdn.com/${src}?w=${width}&q=${quality}&f=${format}`
  
  return src;
};

export default LazyImage;
