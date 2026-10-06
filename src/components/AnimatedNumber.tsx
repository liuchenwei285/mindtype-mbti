import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  suffix?: string
}

export function AnimatedNumber({ value, decimals = 0, suffix = '' }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [reduceMotion, value])

  return <>{display.toFixed(decimals)}{suffix}</>
}
