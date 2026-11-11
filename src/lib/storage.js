export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function save(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify(v))
  } catch {
    /* storage unavailable (private mode / quota) – app still works */
  }
}

export const JSON_KEY = 'qpfe.json'
export const SETTINGS_KEY = 'qpfe.settings'
