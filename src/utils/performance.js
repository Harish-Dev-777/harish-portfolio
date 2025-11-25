/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and provides performance insights
 */

/**
 * Report Web Vitals to analytics
 * Compatible with Google Analytics, Vercel Analytics, etc.
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV !== "development") return;

  // Performance Observer for monitoring
  if ("PerformanceObserver" in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("🎨 LCP:", lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log("⚡ FID:", entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log("📐 CLS:", clsScore);
        }
      }
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }

  // Navigation Timing
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      if (perfData) {
        console.log("⏱️ Performance Metrics:");
        console.log("  DNS Lookup:", perfData.domainLookupEnd - perfData.domainLookupStart);
        console.log("  TCP Connection:", perfData.connectEnd - perfData.connectStart);
        console.log("  Request Time:", perfData.responseStart - perfData.requestStart);
        console.log("  Response Time:", perfData.responseEnd - perfData.responseStart);
        console.log("  DOM Processing:", perfData.domComplete - perfData.domInteractive);
        console.log("  Total Load Time:", perfData.loadEventEnd - perfData.fetchStart);
      }
    }, 0);
  });
};

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName, callback) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  console.log(`🔧 ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
};

/**
 * Check if the page is loaded from cache
 */
export const isLoadedFromCache = () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  return perfData && perfData.transferSize === 0;
};

/**
 * Get performance score (simplified)
 */
export const getPerformanceScore = () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  if (!perfData) return null;

  const loadTime = perfData.loadEventEnd - perfData.fetchStart;
  
  // Simplified scoring (0-100)
  let score = 100;
  if (loadTime > 3000) score -= 30;
  else if (loadTime > 2000) score -= 20;
  else if (loadTime > 1000) score -= 10;

  return Math.max(0, score);
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = (resources) => {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
};

/**
 * Defer non-critical scripts
 */
export const deferNonCriticalScripts = () => {
  const scripts = document.querySelectorAll('script[data-defer="true"]');
  scripts.forEach((script) => {
    script.defer = true;
  });
};

export default {
  reportWebVitals,
  logPerformanceMetrics,
  measureRenderTime,
  isLoadedFromCache,
  getPerformanceScore,
  preloadCriticalResources,
  deferNonCriticalScripts,
};
