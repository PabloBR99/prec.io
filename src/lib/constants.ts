export const PRICE_MIN = 0;
export const PRICE_MAX = 100;
export const PRICE_STEP = 0.05;
export const PRICE_DEFAULT = 0;

export const ERROR_THRESHOLD_GOOD = 10;
export const ERROR_THRESHOLD_OK = 25;

export const LAUNCH_DATE = "2026-03-11";
export const GAME_TIMEZONE = "Europe/Madrid";

export const STORAGE_KEY_PREFIX = "precigame";
export const SESSION_ID_KEY = "precigame-session-id";

export const ERROR_COLORS = {
  perfect: "#ffd700",
  excellent: "#0ead69",
  good: "#f4a261",
  poor: "#e63946",
} as const;

export const BRAND_COLORS = {
  primary: "#1a1a2e",
  accent: "#e94560",
  surface: "#16213e",
  surfaceLight: "#f8f9fa",
} as const;
