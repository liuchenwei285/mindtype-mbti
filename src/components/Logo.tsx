import { cn } from '../utils/cn'

interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[13px] bg-[#17171f] shadow-[0_8px_24px_rgba(23,23,31,0.18)]">
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#9f8cff] opacity-90" />
        <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-white/90" />
        <span className="absolute bottom-1.5 left-4 h-1.5 w-1.5 rounded-full bg-white/45" />
        <span className="absolute bottom-1.5 left-6.5 h-1.5 w-1.5 rounded-full bg-white/20" />
      </span>
      {!compact && (
        <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#191921]">MindType</span>
      )}
    </div>
  )
}
