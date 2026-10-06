import { useCallback, useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Storage may be unavailable in private mode; the app still works in memory.
    }
  }, [key, state])

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore storage failures.
    }
  }, [key])

  return [state, setState, clear] as const
}
