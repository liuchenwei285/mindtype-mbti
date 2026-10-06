import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { AxisBar } from '../components/AxisBar'
import { Button } from '../components/Button'
import { CheckIcon, CopyIcon, DownloadIcon, RefreshIcon, ShareIcon, SparkleIcon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { ShareCard } from '../components/ShareCard'
import type { MbtiResult, PersonalityProfile } from '../types/mbti'
import { createShareCardBlob, formatResultText } from '../utils/result'
import { getTieBreakNote } from '../utils/mbtiCalculator'
import { cn } from '../utils/cn'

interface ResultPageProps {
  result: MbtiResult | null
  profile: PersonalityProfile | null
  onRestart: () => void
  onHome: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

function InfoCard({
  eyebrow,
  title,
  children,
  className,
  delay = 0,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.5, delay, ease }}
      className={cn(
        'rounded-[28px] border border-black/[0.055] bg-white/62 p-6 shadow-[0_20px_60px_rgba(34,34,48,0.055)] backdrop-blur-xl sm:p-8',
        className,
      )}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9696a0]">{eyebrow}</span>
      <h2 className="mt-3 text-[22px] font-bold tracking-[-0.035em] text-[#212129] sm:text-[25px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}

export function ResultPage({ result, profile, onRestart, onHome }: ResultPageProps) {
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!result || !profile) {
    return (
      <div className="relative grid min-h-dvh place-items-center px-5">
        <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white/65 p-8 text-center shadow-[0_28px_80px_rgba(34,34,48,0.10)] backdrop-blur-2xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eeebff] text-[#5746d8]">
            <SparkleIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-[24px] font-bold tracking-[-0.04em] text-[#202028]">还没有可展示的结果</h1>
          <p className="mt-3 text-[14px] leading-6 text-[#777782]">完成全部 48 道题后，这里会生成属于你的四维度人格报告。</p>
          <div className="mt-7 flex flex-col gap-3">
            <Button onClick={onRestart}>开始测试</Button>
            <Button variant="ghost" onClick={onHome}>返回首页</Button>
          </div>
        </div>
      </div>
    )
  }

  const copyResult = async () => {
    const text = formatResultText(result, profile)
    try {
      await navigator.clipboard.writeText(text)
      setToast('结果文字已复制')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      setToast('结果文字已复制')
    }
  }

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `MindType · ${result.code} ${profile.nameZh}`,
          text: formatResultText(result, profile),
          url: window.location.href,
        })
        setToast('已打开分享面板')
      } else {
        await copyResult()
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      await copyResult()
    }
  }

  const downloadCard = async () => {
    try {
      const blob = await createShareCardBlob(result, profile)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `MindType-${result.code}.png`
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setToast('结果卡片已下载')
    } catch {
      setToast('当前浏览器无法生成卡片，请尝试复制文字结果')
    }
  }

  const tieNote = getTieBreakNote(result.axes)

  return (
    <div className="relative min-h-dvh overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-260px] h-[680px] w-[680px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]" style={{ backgroundColor: profile.accent }} />
        <div className="absolute right-[-180px] top-[30%] h-[460px] w-[460px] rounded-full opacity-25 blur-[130px]" style={{ backgroundColor: profile.accent }} />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-4 pt-6 sm:px-8 sm:pt-8">
        <button type="button" onClick={onHome} aria-label="返回首页">
          <Logo />
        </button>
        <Button variant="secondary" size="sm" onClick={onRestart}>
          <RefreshIcon className="h-4 w-4" />
          重新测试
        </Button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pt-5 sm:px-8 sm:pt-9">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative overflow-hidden rounded-[36px] border border-white/85 bg-white/67 p-7 shadow-[0_34px_100px_rgba(34,34,48,0.11)] backdrop-blur-2xl sm:p-12 lg:p-14"
        >
          <div className="absolute right-[-90px] top-[-120px] h-[360px] w-[360px] rounded-full opacity-40 blur-[80px]" style={{ backgroundColor: profile.soft }} />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/65 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b7b86]">
                <SparkleIcon className="h-3.5 w-3.5" style={{ color: profile.accent }} />
                Your personality profile
              </div>
              <p className="mt-7 text-[76px] font-extrabold leading-[0.9] tracking-[-0.075em] sm:text-[112px]" style={{ color: profile.accent }}>
                {result.code}
              </p>
              <h1 className="mt-4 text-[30px] font-bold tracking-[-0.045em] text-[#1d1d25] sm:text-[42px]">
                {profile.nameZh} <span className="font-medium text-[#777782]">/ {profile.nameEn}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#666672] sm:text-[17px]">{profile.tagline}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {result.axes.map((axis) => {
                const letter = axis.preferred
                const percent = letter === axis.first ? axis.firstPercent : axis.secondPercent
                const label = letter === axis.first ? axis.firstLabel : axis.secondLabel
                return (
                  <div key={axis.key} className="rounded-[22px] border border-black/[0.055] bg-white/62 p-4 backdrop-blur-xl sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[24px] font-extrabold tracking-[-0.05em]" style={{ color: profile.accent }}>{letter}</span>
                      <span className="text-[13px] font-bold text-[#3a3a45]"><AnimatedNumber value={percent} decimals={Number.isInteger(percent) ? 0 : 1} suffix="%" /></span>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-[#898994]">{label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <InfoCard eyebrow="Overview" title="人格概述">
            <p className="text-[15px] leading-8 text-[#5f5f6b]">{profile.summary}</p>
            {tieNote && <p className="mt-4 rounded-2xl bg-black/[0.035] px-4 py-3 text-[12px] leading-6 text-[#757580]">{tieNote}</p>}
          </InfoCard>

          <InfoCard eyebrow="Four dimensions" title="四维度倾向" delay={0.06}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {result.axes.map((axis, index) => (
                <AxisBar key={axis.key} axis={axis} index={index} compact />
              ))}
            </div>
          </InfoCard>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <InfoCard eyebrow="Strengths" title="你可能具备的优势" delay={0.03}>
            <ul className="space-y-3.5">
              {profile.strengths.map((item) => (
                <li key={item} className="flex gap-3 text-[14px] leading-6 text-[#5f5f6b]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ backgroundColor: profile.soft, color: profile.accent }}>
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard eyebrow="Challenges" title="可能需要留意的挑战" delay={0.08}>
            <ul className="space-y-3.5">
              {profile.challenges.map((item) => (
                <li key={item} className="flex gap-3 text-[14px] leading-6 text-[#5f5f6b]">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: profile.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </InfoCard>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard eyebrow="Learning" title="学习方式" delay={0.02}>
            <p className="text-[14px] leading-7 text-[#62626e]">{profile.learningStyle}</p>
          </InfoCard>
          <InfoCard eyebrow="Work" title="工作方式" delay={0.06}>
            <p className="text-[14px] leading-7 text-[#62626e]">{profile.workStyle}</p>
          </InfoCard>
          <InfoCard eyebrow="Relationships" title="人际交往特点" delay={0.1}>
            <p className="text-[14px] leading-7 text-[#62626e]">{profile.relationshipStyle}</p>
          </InfoCard>
          <InfoCard eyebrow="Under pressure" title="压力下的表现" delay={0.14}>
            <p className="text-[14px] leading-7 text-[#62626e]">{profile.stressResponse}</p>
          </InfoCard>
        </section>

        <section className="mt-6 rounded-[32px] border border-black/[0.055] bg-[#191921] p-7 text-white shadow-[0_28px_80px_rgba(25,25,33,0.17)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Growth directions</span>
              <h2 className="mt-3 text-[27px] font-bold tracking-[-0.04em]">适合继续发展的方向</h2>
              <p className="mt-4 text-[13px] leading-6 text-white/50">人格倾向不是限制，而是理解自己惯用策略的起点。</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.growthDirections.map((item, index) => (
                <div key={item} className="rounded-[20px] border border-white/[0.08] bg-white/[0.045] p-4">
                  <span className="text-[11px] font-bold text-white/35">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-[13px] leading-6 text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <InfoCard eyebrow="Share" title="分享你的结果">
            <div className="flex flex-col items-center gap-5">
              <ShareCard result={result} profile={profile} />
              <div className="w-full max-w-[340px] space-y-3">
                <Button className="w-full" onClick={shareResult}>
                  <ShareIcon className="h-4 w-4" />
                  分享结果
                </Button>
                <Button variant="secondary" className="w-full" onClick={copyResult}>
                  <CopyIcon className="h-4 w-4" />
                  复制结果
                </Button>
                <Button variant="secondary" className="w-full" onClick={downloadCard}>
                  <DownloadIcon className="h-4 w-4" />
                  下载结果卡片
                </Button>
                <Button variant="ghost" className="w-full" onClick={onRestart}>
                  <RefreshIcon className="h-4 w-4" />
                  重新测试
                </Button>
              </div>
            </div>
          </InfoCard>

          <div className="space-y-6">
            <InfoCard eyebrow="How to read this" title="如何理解这份结果">
              <div className="space-y-4 text-[14px] leading-7 text-[#62626e]">
                <p>百分比表示在本次作答中，你在该维度更常选择哪一侧，而不是能力高低或优劣评分。接近 50% 表示两种倾向可能都比较常用。</p>
                <p>人格会随情境、阶段和经历变化。真正有帮助的不是把自己固定在四个字母里，而是观察这些倾向在什么情况下帮助了你，又在什么情况下限制了你。</p>
                <p>如果结果与你的自我感受差异较大，可以回想答题时是否受到近期情绪、工作状态或理想自我影响，并在不同时间重新测试。</p>
              </div>
            </InfoCard>

            <div className="rounded-[24px] border border-black/[0.05] bg-white/40 p-5 text-center text-[11px] leading-5 text-[#8e8e98] backdrop-blur-xl">
              MBTI 测试结果仅用于自我探索与娱乐参考，不代表严格的心理学诊断。
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#191921] px-5 py-3 text-[12px] font-semibold text-white shadow-[0_16px_40px_rgba(25,25,33,0.25)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


