import { Platform } from 'react-native';

// Set this to true to use the local server, or false to use the deployed Render server
const USE_LOCAL_BACKEND = false;

export const BACKEND_URL = USE_LOCAL_BACKEND
  ? (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')
  : 'https://toeic-quest-rpg-hub.onrender.com';

// WebSocket config uses the same URL but with ws/wss protocol implicitly handled by socket.io-client
export const WEBSOCKET_URL = BACKEND_URL;

// Analytics (PostHog)
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_PLACEHOLDER_KEY';
export const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
