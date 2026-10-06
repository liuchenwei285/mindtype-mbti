import { motion } from 'framer-motion'
import type { DimensionAxis } from '../types/mbti'
import { getAxisDisplay } from '../utils/result'
import { AnimatedNumber } from './AnimatedNumber'
import { cn } from '../utils/cn'

interface AxisBarProps {
  axis: DimensionAxis
  index?: number
  compact?: boolean
}

export function AxisBar({ axis, index = 0, compact = false }: AxisBarProps) {
  const [preferred, other] = getAxisDisplay(axis)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[22px] border border-black/[0.055] bg-white/58 p-5 backdrop-blur-xl',
        compact && 'rounded-[18px] p-4',
      )}
    >
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-bold tracking-[-0.05em] text-[#191921] sm:text-3xl">{preferred.letter}</span>
          <span className="text-[13px] font-medium text-[#777783]">{preferred.label}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-semibold tracking-[-0.03em] text-[#25252e] sm:text-2xl">
            <AnimatedNumber value={preferred.percent} decimals={Number.isInteger(preferred.percent) ? 0 : 1} suffix="%" />
          </span>
        </div>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-black/[0.065]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: '#191921' }}
          initial={{ width: 0 }}
          animate={{ width: `${preferred.percent}%` }}
          transition={{ delay: 0.18 + index * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
      </div>

      <div className="mt-3 flex items-center justify-between text-[12px] text-[#95959f]">
        <span>
          {preferred.letter} {preferred.label}
        </span>
        <span>
          {other.letter} {other.label} {other.percent}%
        </span>
      </div>
    </motion.div>
  )
}
