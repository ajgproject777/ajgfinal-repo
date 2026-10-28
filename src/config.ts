// App-wide configuration. Change values here, not inside screens.

// While the FastAPI backend is not connected, the app runs in demo mode:
// auth and search resolve locally and the UI says so. Set to false once the
// backend is ready; the services in src/services will then throw until they
// are wired to real API calls.
// Expo-compatible environment configuration (EXPO_PUBLIC_ prefix makes them client-safe)
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE !== 'false'
export const DEMO_LATENCY_MS = 700

// Base URL of the FastAPI backend (used once DEMO_MODE is false).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const MIN_PASSWORD_LENGTH = 8
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_PATTERN = /^\+?[0-9\s-]{10,15}$/

export const HERO_IMAGE_URI =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&auto=format'
