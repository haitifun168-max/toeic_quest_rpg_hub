import { Platform } from 'react-native';

// Fallback secure storage interface that works correctly on Web and Native
// using a SINGLE shared memory store for fallback to persist across screens
const memoryStore = {};

let SecureStore;

if (Platform.OS === 'web' || (typeof window !== 'undefined' && typeof localStorage !== 'undefined')) {
  SecureStore = {
    setItemAsync: async (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch (e) {
        console.warn('localStorage.setItem failed:', e);
      }
    },
    getItemAsync: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage.getItem failed:', e);
        return null;
      }
    },
    deleteItemAsync: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage.removeItem failed:', e);
      }
    }
  };
} else {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    // If expo-secure-store is not available (e.g. Android APK without the native module)
    // we fallback to the shared memoryStore so auth persists during the session!
    SecureStore = {
      setItemAsync: async (key, val) => { memoryStore[key] = val; },
      getItemAsync: async (key) => memoryStore[key] || null,
      deleteItemAsync: async (key) => { delete memoryStore[key]; }
    };
  }
}

export default SecureStore;
