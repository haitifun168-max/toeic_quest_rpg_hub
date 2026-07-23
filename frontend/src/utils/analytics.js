import PostHog from 'posthog-react-native';
import { Platform } from 'react-native';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '../config';

const createWebStorage = () => ({
  getItem: (key) => Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key, value) => Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.setItem(key, value) : null),
  removeItem: (key) => Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.removeItem(key) : null),
});

let posthogInstance = null;

try {
  const options = {
    host: POSTHOG_HOST || 'https://app.posthog.com',
    enable: false, // Disabled for local dev to avoid unnecessary requests
  };

  if (Platform.OS === 'web') {
    options.storage = createWebStorage();
  }

  posthogInstance = new PostHog(POSTHOG_API_KEY || 'phc_PLACEHOLDER_KEY', options);
  
  // Ensure dummy debug method exists on web if posthog-react-native expects it
  if (posthogInstance && typeof posthogInstance.debug !== 'function') {
    posthogInstance.debug = () => {};
  }
} catch (e) {
  console.warn('PostHog init fallback:', e.message);
  posthogInstance = {
    capture: () => {},
    identify: () => {},
    reset: () => {},
    debug: () => {},
    optIn: () => {},
    optOut: () => {}
  };
}

export const posthog = posthogInstance;

export const trackEvent = (eventName, properties = {}) => {
  try {
    if (posthog && typeof posthog.capture === 'function') {
      posthog.capture(eventName, properties);
    }
  } catch (error) {
    console.warn('Analytics Error:', error);
  }
};

export const identifyUser = (userId, userProperties = {}) => {
  try {
    if (posthog && typeof posthog.identify === 'function') {
      posthog.identify(userId, userProperties);
    }
  } catch (error) {
    console.warn('Analytics Error:', error);
  }
};

export const resetUser = () => {
  try {
    if (posthog && typeof posthog.reset === 'function') {
      posthog.reset();
    }
  } catch (error) {
    console.warn('Analytics Error:', error);
  }
};
