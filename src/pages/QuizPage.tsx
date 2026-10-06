import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { ChoiceScale } from '../components/ChoiceScale'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, GridIcon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { QUESTION_COUNT, QUESTIONS } from '../data/questions'
import { getAnsweredCount } from '../utils/mbtiCalculator'
import type { AnswerValue, TestSession } from '../types/mbti'
import { cn } from '../utils/cn'

interface QuizPageProps {
  session: TestSession
  onAnswer: (questionId: number, value: AnswerValue) => void
  onGoTo: (index: number) => void
  onFinish: () => void
  onExit: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function QuizPage({ session, onAnswer, onGoTo, onFinish, onExit }: QuizPageProps) {
  const [showMap, setShowMap] = useState(false)
  const question = QUESTIONS[session.currentIndex]
  const selectedAnswer = session.answers[question.id]
  const answeredCount = getAnsweredCount(session.answers)
  const allComplete = answeredCount === QUESTION_COUNT
  const isLast = session.currentIndex === QUESTION_COUNT - 1
  const firstUnansweredIndex = useMemo(
    () => QUESTIONS.findIndex((item) => session.answers[item.id] === undefined),
    [session.answers],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [session.currentIndex])

  const handleNext = () => {
    if (isLast) {
      if (allComplete) onFinish()
      else if (firstUnansweredIndex >= 0) {
        onGoTo(firstUnansweredIndex)
        setShowMap(false)
      }
      return
    }
    onGoTo(session.currentIndex + 1)
  }

  const nextLabel = isLast ? (allComplete ? '查看我的结果' : '查看未回答问题') : '下一题'

  return (
    <div className="relative min-h-dvh overflow-hidden pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-44 top-[-180px] h-[520px] w-[520px] rounded-full bg-[#e2ddff]/50 blur-[120px]" />
        <div className="absolute right-[-180px] top-[24%] h-[480px] w-[480px] rounded-full bg-[#d9f3ed]/60 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-[35%] h-[430px] w-[430px] rounded-full bg-[#ffe8df]/45 blur-[120px]" />
      </div>

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 pb-4 pt-6 sm:px-8 sm:pt-8">
        <Logo />
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-black/[0.06] bg-white/55 px-3.5 py-2 text-[12px] font-semibold text-[#6f6f7a] backdrop-blur-xl transition hover:bg-white hover:text-[#272730]"
        >
          保存并退出
        </button>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pt-4 sm:px-8 sm:pt-7">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-[#292932]">
              第 <span className="text-[20px] font-bold">{session.currentIndex + 1}</span> / {QUESTION_COUNT} 题
            </p>
            <p className="mt-1 text-[12px] text-[#92929d]">已完成 {answeredCount} 题 · 选择后不会自动跳题</p>
          </div>
          <button
            type="button"
            onClick={() => setShowMap((value) => !value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-semibold transition',
              showMap
                ? 'border-[#191921] bg-[#191921] text-white'
                : 'border-black/[0.06] bg-white/60 text-[#666672] hover:bg-white',
            )}
          >
            <GridIcon className="h-4 w-4" />
            答题卡
          </button>
        </div>

        <ProgressBar value={(answeredCount / QUESTION_COUNT) * 100} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -18, filter: 'blur(8px)' }}
            transition={{ duration: 0.36, ease }}
            className="mt-5 rounded-[30px] border border-white/85 bg-white/65 p-5 shadow-[0_28px_80px_rgba(34,34,48,0.09)] backdrop-blur-2xl sm:p-9 lg:p-11"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9898a2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5746d8]" />
              Self reflection · {String(question.id).padStart(2, '0')}
            </div>

            <h1 className="mt-7 max-w-4xl text-[25px] font-bold leading-[1.5] tracking-[-0.035em] text-[#1d1d25] sm:text-[31px] sm:leading-[1.48]">
              {question.text}
            </h1>

            <p className="mt-4 text-[13px] leading-6 text-[#858590]">
              请根据你多数时候的自然反应作答，不需要选择“更理想”或“更受欢迎”的答案。
            </p>

            <div className="mt-9 sm:mt-11">
              <ChoiceScale value={selectedAnswer} onChange={(value) => onAnswer(question.id, value)} />
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-[24px] border border-black/[0.055] bg-white/45 p-3 backdrop-blur-xl sm:p-4">
          <Button
            variant="ghost"
            size="md"
            disabled={session.currentIndex === 0}
            onClick={() => onGoTo(session.currentIndex - 1)}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">上一题</span>
          </Button>

          <div className="hidden text-center text-[12px] text-[#92929d] sm:block">
            {isLast && !allComplete ? `还有 ${QUESTION_COUNT - answeredCount} 题没有回答` : '你的进度会自动保存'}
          </div>

          <Button size="md" disabled={selectedAnswer === undefined} onClick={handleNext} className="min-w-[118px] sm:min-w-[150px]">
            {nextLabel}
            {isLast && allComplete ? <CheckIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-[24px] border border-black/[0.055] bg-white/65 p-5 backdrop-blur-xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#34343e]">答题卡</p>
                    <p className="mt-0.5 text-[11px] text-[#91919b]">点击题号可以返回修改</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#777782]">{answeredCount} / {QUESTION_COUNT}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-12 sm:gap-2">
                  {QUESTIONS.map((item, index) => {
                    const isAnswered = session.answers[item.id] !== undefined
                    const isCurrent = index === session.currentIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onGoTo(index)
                          setShowMap(false)
                        }}
                        className={cn(
                          'grid aspect-square place-items-center rounded-lg text-[11px] font-semibold transition-all',
                          isCurrent && 'ring-2 ring-[#5746d8] ring-offset-2 ring-offset-white',
                          isAnswered
                            ? 'bg-[#191921] text-white hover:bg-[#343440]'
                            : 'bg-black/[0.055] text-[#8d8d97] hover:bg-black/[0.09]',
                        )}
                      >
                        {item.id}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
