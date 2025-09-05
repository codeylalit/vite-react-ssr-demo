import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

interface ImageState {
  isLoaded: boolean;
  isInView: boolean;
  hasError: boolean;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.svg',
  blurDataURL,
  priority = false,
  sizes = '100vw',
  width,
  height,
  onLoad,
  onError,
  style,
}: LazyImageProps) {
  const [state, setState] = useState<ImageState>({
    isLoaded: false,
    isInView: priority, // Load immediately if priority
    hasError: false,
  });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || state.isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(prev => ({ ...prev, isInView: true }));
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, state.isInView]);

  // Handle image load
  const handleLoad = () => {
    setState(prev => ({ ...prev, isLoaded: true }));
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setState(prev => ({ ...prev, hasError: true }));
    onError?.();
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string): string => {
    if (baseSrc.startsWith('data:') || baseSrc.includes('?')) {
      return baseSrc;
    }
    
    const extension = baseSrc.split('.').pop();
    const basePath = baseSrc.replace(`.${extension}`, '');
    
    return [
      `${basePath}-400w.${extension} 400w`,
      `${basePath}-800w.${extension} 800w`,
      `${basePath}-1200w.${extension} 1200w`,
      `${basePath}.${extension} 1600w`,
    ].join(', ');
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease',
    opacity: state.isLoaded ? 1 : 0,
  };

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: state.isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease',
    filter: blurDataURL ? 'blur(10px)' : 'none',
  };

  return (
    <div className={`lazy-image-container ${className}`} style={containerStyle}>
      {/* Placeholder/blur image */}
      {(placeholder || blurDataURL) && (
        <img
          src={blurDataURL || placeholder}
          alt=""
          style={placeholderStyle}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={state.isInView || priority ? src : undefined}
        srcSet={state.isInView || priority ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority && { fetchpriority: 'high' })}
      />
      
      {/* Error state */}
      {state.hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Failed to load image
        </div>
      )}
      
      {/* Loading indicator */}
      {!state.isLoaded && !state.hasError && state.isInView && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
    </div>
  );
}

// Hook for preloading images
export function useImagePreloader(imageSources: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const preloadPromises = imageSources.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    });
    
    Promise.allSettled(preloadPromises).then(results => {
      const loaded = new Set<string>();
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.add(imageSources[index]);
        }
      });
      setLoadedImages(loaded);
    });
  }, [imageSources]);
  
  return { loadedImages, isLoaded: (src: string) => loadedImages.has(src) };
}

// Component for preloading critical images
export function ImagePreloader({ sources }: { sources: string[] }) {
  useImagePreloader(sources);
  return null;
}

// Higher-order component for image optimization
export function withImageOptimization<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    useEffect(() => {
      // Add CSS for image optimization
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .lazy-image-container {
          background-color: #f3f4f6;
          background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .lazy-image-container img {
          transition: opacity 0.3s ease;
        }
      `;
      
      if (!document.querySelector('#image-optimization-styles')) {
        style.id = 'image-optimization-styles';
        document.head.appendChild(style);
      }
      
      return () => {
        const existingStyle = document.getElementById('image-optimization-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }, []);
    
    return <Component {...props} />;
  };
} 