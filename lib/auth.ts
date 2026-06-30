/**
 * Local API-key storage. The key never leaves the device except as a Bearer
 * token to the hosted API. Self-hosters can also set it via env if preferred.
 */
const STORAGE_KEY = 'gwanggo_api_key'

export function getKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim())
}

export function clearKey(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasKey(): boolean {
  return !!getKey()
}
