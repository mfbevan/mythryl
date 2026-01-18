/**
 * Check if the app is running inside Tauri
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  return "__TAURI_INTERNALS__" in window;
}

/**
 * Check if the app is running in Tauri development mode
 */
export function isTauriDev(): boolean {
  if (!isTauri()) return false;
  return process.env.NODE_ENV === "development";
}
