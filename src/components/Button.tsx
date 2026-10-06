import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'light'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#191921] text-white shadow-[0_12px_30px_rgba(25,25,33,0.20)] hover:bg-[#252532] hover:shadow-[0_16px_38px_rgba(25,25,33,0.24)]',
  secondary:
    'border border-black/[0.08] bg-white/75 text-[#272731] shadow-[0_8px_24px_rgba(30,30,40,0.06)] backdrop-blur-xl hover:bg-white',
  ghost: 'text-[#4f4f5a] hover:bg-black/[0.045] hover:text-[#191921]',
  soft: 'bg-[#eeebff] text-[#5746d8] hover:bg-[#e4dfff]',
  light: 'bg-white text-[#191921] shadow-[0_12px_30px_rgba(0,0,0,0.10)] hover:bg-white/90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-xl px-4 text-sm',
  md: 'h-12 rounded-2xl px-5 text-[15px]',
  lg: 'h-14 rounded-2xl px-7 text-[16px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
