// ============================================================
// Analytics Tracker — Lightweight client-side tracking
// Logs page views, scroll depth, and section views to Firestore
// ============================================================

import { logAnalyticsEvent } from './creatorService';

let scrollTracked: Record<string, boolean> = {};
let currentPage = '';

/** Track a page view with referrer info */
export function trackPageView(page: string, userId?: string) {
  currentPage = page;
  scrollTracked = {};

  logAnalyticsEvent({
    type: 'page_view',
    page,
    userId,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
  });
}

/** Track scroll depth milestones (25%, 50%, 75%, 100%) */
export function initScrollTracking(page: string, userId?: string) {
  if (typeof window === 'undefined') return;

  const milestones = [25, 50, 75, 100];

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    for (const milestone of milestones) {
      const key = `${page}-${milestone}`;
      if (scrollPercent >= milestone && !scrollTracked[key]) {
        scrollTracked[key] = true;
        logAnalyticsEvent({
          type: 'scroll_depth',
          page,
          userId,
          scrollDepth: milestone,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  // Debounce scroll handler
  let timeout: ReturnType<typeof setTimeout>;
  const debouncedScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(handleScroll, 300);
  };

  window.addEventListener('scroll', debouncedScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', debouncedScroll);
  };
}

/** Track when a specific section comes into view */
export function trackSectionView(sectionId: string, userId?: string) {
  logAnalyticsEvent({
    type: 'section_view',
    page: currentPage,
    userId,
    sectionId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Creates an IntersectionObserver for section tracking
 * Attach to section elements to auto-log when they scroll into view
 */
export function createSectionObserver(userId?: string): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  const observed = new Set<string>();

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId && !observed.has(sectionId)) {
            observed.add(sectionId);
            trackSectionView(sectionId, userId);
          }
        }
      });
    },
    { threshold: 0.3 }
  );
}
