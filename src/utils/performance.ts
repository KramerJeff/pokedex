/**
 * Performance monitoring utilities
 * Tracks key metrics for the Pokédex application
 */

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Measure and log Core Web Vitals
 */
export const measureWebVitals = () => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
      renderTime?: number;
      loadTime?: number;
    };
    const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;

    logMetric({
      name: 'LCP',
      value: lcp,
      rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
    });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
      logMetric({
        name: 'FID',
        value: fid,
        rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
      });
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[]) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // CLS not supported
  }

  // Log CLS on page unload
  window.addEventListener('beforeunload', () => {
    logMetric({
      name: 'CLS',
      value: clsValue,
      rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
    });
  });
};

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string, startTime: number) => {
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (import.meta.env.DEV) {
    console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  }

  return renderTime;
};

/**
 * Measure API call duration
 */
export const measureApiCall = async <T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;

    if (import.meta.env.DEV) {
      console.log(`[Performance] ${apiName} completed in ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    if (import.meta.env.DEV) {
      console.error(`[Performance] ${apiName} failed after ${duration.toFixed(2)}ms`);
    }

    throw error;
  }
};

/**
 * Log performance metric
 */
const logMetric = (metric: PerformanceMetrics) => {
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `[Performance] ${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );
  }
};

/**
 * Get memory usage (Chrome only)
 */
export const getMemoryUsage = () => {
  if (typeof window === 'undefined') return null;

  const performance = window.performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  };

  if (!performance.memory) return null;

  const usedMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
  const totalMB = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);

  if (import.meta.env.DEV) {
    console.log(`[Performance] Memory: ${usedMB}MB / ${totalMB}MB`);
  }

  return {
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit,
  };
};

/**
 * Monitor scroll performance
 */
export const monitorScrollPerformance = (element: HTMLElement | null) => {
  if (!element) return () => {};

  let lastScrollTime = performance.now();
  let frameCount = 0;
  let totalFrameTime = 0;

  const handleScroll = () => {
    const currentTime = performance.now();
    const frameTime = currentTime - lastScrollTime;

    frameCount++;
    totalFrameTime += frameTime;

    // Log FPS every 60 frames
    if (frameCount >= 60) {
      const avgFrameTime = totalFrameTime / frameCount;
      const fps = 1000 / avgFrameTime;

      if (import.meta.env.DEV) {
        const emoji = fps >= 55 ? '✅' : fps >= 30 ? '⚠️' : '❌';
        console.log(`[Performance] ${emoji} Scroll FPS: ${fps.toFixed(1)}`);
      }

      frameCount = 0;
      totalFrameTime = 0;
    }

    lastScrollTime = currentTime;
  };

  element.addEventListener('scroll', handleScroll, { passive: true });

  return () => element.removeEventListener('scroll', handleScroll);
};
