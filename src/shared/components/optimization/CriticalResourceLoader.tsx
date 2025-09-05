import React, { useEffect, useState } from 'react';

// Critical resource types
type ResourceType = 'font' | 'image' | 'style' | 'script' | 'prefetch' | 'preconnect';

interface CriticalResource {
  href: string;
  type: ResourceType;
  as?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  priority?: 'high' | 'low' | 'auto';
  sizes?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

interface CriticalResourceLoaderProps {
  children: React.ReactNode;
  customResources?: CriticalResource[];
  enableLCPOptimization?: boolean;
  enableFontOptimization?: boolean;
  enableImageOptimization?: boolean;
}

// Enhanced critical resources with LCP focus
const DEFAULT_CRITICAL_RESOURCES: CriticalResource[] = [
  // Critical fonts for immediate text rendering
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    type: 'style',
    priority: 'high',
  },
  // Preload critical images that contribute to LCP
  {
    href: '/logo-light.png',
    type: 'image',
    as: 'image',
    priority: 'high',
    fetchpriority: 'high',
  },
  {
    href: '/logo-dark.png',
    type: 'image',
    as: 'image',
    priority: 'high',
    fetchpriority: 'high',
  },
];

// Enhanced font preloading for better FOUT/FOIT handling
const FONT_RESOURCES: CriticalResource[] = [
  {
    href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
    type: 'font',
    as: 'font',
    crossorigin: 'anonymous',
    priority: 'high',
    fetchpriority: 'high',
  },
];

// Image optimization resources
const IMAGE_RESOURCES: CriticalResource[] = [
  {
    href: '/placeholder.svg',
    type: 'image',
    as: 'image',
    priority: 'low',
  },
];

// Preload critical resources to improve LCP
export function preloadCriticalResources(resources: CriticalResource[]): void {
  resources.forEach(resource => {
    const link = document.createElement('link');
    
    // Set relationship based on type
    if (resource.type === 'font') {
      link.rel = 'preload';
    } else if (resource.type === 'image') {
      link.rel = 'preload';
    } else if (resource.type === 'style') {
      link.rel = 'preload';
      link.as = 'style';
    } else if (resource.type === 'script') {
      link.rel = 'preload';
      link.as = 'script';
    } else if (resource.type === 'prefetch') {
      link.rel = 'prefetch';
    }
    
    link.href = resource.href;
    
    if (resource.as) {
      link.as = resource.as;
    }
    
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }
    
    if (resource.priority) {
      // Modern browsers support fetchpriority
      if (resource.fetchpriority && 'fetchPriority' in link) {
        (link as any).fetchPriority = resource.fetchpriority;
      }
    }
    
    if (resource.media) {
      link.media = resource.media;
    }
    
    if (resource.sizes) {
      link.sizes = resource.sizes;
    }
    
    // Avoid duplicate preloads
    const existingLink = document.querySelector(`link[href="${resource.href}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
    }
  });
}

// Preload images that are likely to be LCP elements
export function preloadLCPImages(imageUrls: string[]) {
  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    if ('fetchPriority' in link) {
      (link as any).fetchPriority = 'high';
    }
    document.head.appendChild(link);
  });
}

// Hook for managing critical resource loading
export function useCriticalResourceLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Preload critical resources immediately
    preloadCriticalResources(DEFAULT_CRITICAL_RESOURCES);
    
    // Monitor loading state
    const checkLoadingState = () => {
      const links = document.querySelectorAll('link[rel="preload"]');
      const loadPromises = Array.from(links).map((link) => {
        return new Promise<string>((resolve, reject) => {
          const href = (link as HTMLLinkElement).href;
          
          if (loadedResources.has(href)) {
            resolve(href);
            return;
          }

          link.addEventListener('load', () => {
            setLoadedResources(prev => new Set([...prev, href]));
            resolve(href);
          });
          
          link.addEventListener('error', () => {
            console.warn(`Failed to preload resource: ${href}`);
            reject(href);
          });
        });
      });

      Promise.allSettled(loadPromises).then(() => {
        setIsLoaded(true);
      });
    };

    // Small delay to allow DOM to settle
    const timer = setTimeout(checkLoadingState, 100);
    
    return () => clearTimeout(timer);
  }, [loadedResources]);

  const preloadImage = (url: string) => {
    preloadLCPImages([url]);
  };

  const preloadResource = (resource: CriticalResource) => {
    preloadCriticalResources([resource]);
  };

  return {
    isLoaded,
    loadedResources: Array.from(loadedResources),
    preloadImage,
    preloadResource,
  };
}

// Component that automatically handles critical resource loading
export function CriticalResourceLoader({
  children,
  customResources = [],
  enableLCPOptimization = true,
  enableFontOptimization = true,
  enableImageOptimization = true,
}: CriticalResourceLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const loadCriticalResources = async () => {
      try {
        // Step 1: Inject critical CSS immediately
        if (enableLCPOptimization) {
          injectCriticalCSS();
        }
        
        // Step 2: Add resource hints
        addResourceHints();
        
        // Step 3: Build resource list based on options
        let resourcesToLoad = [...DEFAULT_CRITICAL_RESOURCES, ...customResources];
        
        if (enableFontOptimization) {
          resourcesToLoad.push(...FONT_RESOURCES);
        }
        
        if (enableImageOptimization) {
          resourcesToLoad.push(...IMAGE_RESOURCES);
        }
        
        // Step 4: Preload critical resources
        preloadCriticalResources(resourcesToLoad);
        
        // Step 5: Wait for critical fonts to load
        if (enableFontOptimization && 'fonts' in document) {
          await document.fonts.ready;
        }
        
        // Step 6: Mark as loaded
        setIsLoaded(true);
        
        // Step 7: Performance tracking
        if (typeof window !== 'undefined' && window.performance) {
          window.performance.mark('critical-resources-loaded');
        }
        
      } catch (error) {
        console.warn('Critical resource loading failed:', error);
        setIsLoaded(true); // Don't block rendering
      }
    };
    
    loadCriticalResources();
  }, [customResources, enableLCPOptimization, enableFontOptimization, enableImageOptimization]);
  
  // Performance optimization: render children immediately but mark loading state
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.add('critical-resources-loaded');
      
      // Remove loading indicators
      const loadingElements = document.querySelectorAll('.loading-skeleton, .loading-placeholder');
      loadingElements.forEach(el => {
        el.classList.add('loaded');
      });
    }
  }, [isLoaded]);
  
  return (
    <>
      {children}
      {/* Add loading indicator for development */}
      {!isLoaded && process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          Loading critical resources...
        </div>
      )}
    </>
  );
}

// Optimize images for better LCP
export function optimizeImageLoading(imgElement: HTMLImageElement) {
  // Add loading optimization
  imgElement.loading = 'eager'; // For LCP images
  imgElement.decoding = 'async';
  
  // Add priority hint if supported
  if ('fetchPriority' in imgElement) {
    (imgElement as any).fetchPriority = 'high';
  }

  // Preload the image if it's likely to be LCP
  const isAboveFold = imgElement.getBoundingClientRect().top < window.innerHeight;
  if (isAboveFold) {
    preloadLCPImages([imgElement.src]);
  }
}

// Critical CSS injection
export function injectCriticalCSS(): void {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    /* Loading states optimization */
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    
    /* Font display optimization */
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-display: swap;
    }
    
    /* Hero section critical styles for LCP */
    .hero-section {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Button critical styles */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: transform 0.2s ease;
    }
    
    /* Image optimization */
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Prevent layout shift */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = criticalCSS;
  document.head.insertBefore(styleElement, document.head.firstChild);
}

// Remove non-critical CSS to improve performance
export function deferNonCriticalCSS() {
  const links = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  
  links.forEach((link) => {
    const href = (link as HTMLLinkElement).href;
    
    // Create a new link that loads asynchronously
    const newLink = document.createElement('link');
    newLink.rel = 'preload';
    newLink.as = 'style';
    newLink.href = href;
    newLink.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
    };
    
    document.head.appendChild(newLink);
    
    // Remove the original blocking link
    link.remove();
  });
}

// Resource priority hints for modern browsers
export function addResourceHints(): void {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin !== undefined) {
      link.crossOrigin = hint.crossorigin;
    }
    
    const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  });
}

export type { CriticalResource, ResourceType }; 