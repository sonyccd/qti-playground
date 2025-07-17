import posthog from 'posthog-js';

// Initialize PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_66Xgtvuy4yjnx4zELkUPtNxKGwDHbDlPubLNW4rteNq', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      // Capture pageview events automatically
      capture_pageview: true,
      // Capture performance metrics
      capture_performance: true,
    });
  }
};

export { posthog };