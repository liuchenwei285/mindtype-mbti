import { motion } from 'framer-motion'
import { ANSWER_OPTIONS } from '../data/questions'
import type { AnswerValue } from '../types/mbti'
import { cn } from '../utils/cn'

const mobileLabels = ['很不同', '不同', '略不同', '中立', '略同意', '同意', '很同意']

interface ChoiceScaleProps {
  value?: AnswerValue
  onChange: (value: AnswerValue) => void
}

export function ChoiceScale({ value, onChange }: ChoiceScaleProps) {
  const selected = ANSWER_OPTIONS.find((option) => option.value === value)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3" role="radiogroup" aria-label="选择你的同意程度">
        {ANSWER_OPTIONS.map((option, index) => {
          const isSelected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.short}
              onClick={() => onChange(option.value)}
              className="group flex min-w-0 flex-col items-center gap-2 outline-none"
            >
              <motion.span
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: isSelected ? 1 : 0.92,
                  backgroundColor: isSelected ? '#191921' : 'rgba(255,255,255,0.72)',
                  borderColor: isSelected ? '#191921' : 'rgba(20,20,30,0.10)',
                  boxShadow: isSelected
                    ? '0 12px 28px rgba(25,25,33,0.24)'
                    : '0 6px 18px rgba(25,25,33,0.05)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={cn(
                  'grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md sm:h-14 sm:w-14',
                  'group-hover:-translate-y-0.5 group-hover:border-black/20 group-focus-visible:ring-4 group-focus-visible:ring-[#5746d8]/15',
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors sm:h-2.5 sm:w-2.5',
                    isSelected ? 'bg-white' : 'bg-black/15 group-hover:bg-black/30',
                  )}
                />
              </motion.span>
              <span className="hidden text-center text-[11px] font-medium leading-tight text-[#71717d] transition-colors group-hover:text-[#292932] sm:block">
                {option.short}
              </span>
              <span className="block text-center text-[9px] font-medium leading-none text-[#8b8b96] sm:hidden">
                {mobileLabels[index]}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex min-h-6 items-center justify-center gap-2 text-center">
        {selected ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[#5746d8]" />
            <span className="text-[13px] font-medium text-[#5d5d68]">
              {selected.label} · {selected.description}
            </span>
          </>
        ) : (
          <span className="text-[13px] text-[#9a9aa4]">选择一个最接近你真实反应的选项</span>
        )}
      </div>
    </div>
  )
}
