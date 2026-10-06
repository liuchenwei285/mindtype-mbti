import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

interface ProgressBarProps {
  value: number
  className?: string
  showGlow?: boolean
}

export function ProgressBar({ value, className, showGlow = true }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]', className)}>
      <motion.div
        className="relative h-full rounded-full bg-[#191921]"
        initial={false}
        animate={{ width: `${safeValue}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      >
        {showGlow && <span className="absolute right-0 top-0 h-full w-10 bg-gradient-to-r from-transparent to-white/40" />}
      </motion.div>
    </div>
  )
}
