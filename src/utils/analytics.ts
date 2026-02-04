// Google Analytics 4 utility functions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom GA4 event
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log(`[GA4] Event tracked: ${eventName}`, parameters);
  }
};

/**
 * Track demo button click
 */
export const trackDemoClick = (buttonText: string) => {
  trackEvent('demo_click', {
    page_path: window.location.pathname,
    button_text: buttonText,
  });
};
