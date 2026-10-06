import { useEffect, useState } from 'react'

export type AppRoute = '/' | '/test' | '/result'

function normalizeHash(hash: string): AppRoute {
  const clean = hash.replace(/^#/, '')
  if (clean === '/test' || clean === '/result') return clean
  return '/'
}

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === 'undefined' ? '/' : normalizeHash(window.location.hash),
  )

  useEffect(() => {
    const handleChange = () => setRoute(normalizeHash(window.location.hash))
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const navigate = (next: AppRoute) => {
    if (window.location.hash !== `#${next}`) {
      window.location.hash = next
    } else {
      setRoute(next)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { route, navigate }
}
