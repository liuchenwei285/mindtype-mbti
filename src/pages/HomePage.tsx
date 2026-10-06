import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { ArrowRightIcon, SparkleIcon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { QUESTION_COUNT } from '../data/questions'

interface HomePageProps {
  progressCount: number
  hasResult: boolean
  onStart: () => void
  onResume: () => void
  onViewResult: () => void
}

const dimensions = [
  { letters: 'E / I', title: '能量来源', text: '你从哪里获得能量，又如何与外界互动。', color: '#5746d8', soft: '#eeebff' },
  { letters: 'S / N', title: '信息偏好', text: '你更自然地留意事实，还是可能性与关联。', color: '#178b83', soft: '#e1f7f4' },
  { letters: 'T / F', title: '决策方式', text: '做判断时，你更依赖逻辑标准还是价值与感受。', color: '#c14f74', soft: '#ffe9f2' },
  { letters: 'J / P', title: '生活方式', text: '你更喜欢计划与确定，还是开放与灵活调整。', color: '#d16b27', soft: '#fff0e6' },
]

const ease = [0.22, 1, 0.36, 1] as const

export function HomePage({ progressCount, hasResult, onStart, onResume, onViewResult }: HomePageProps) {
  const hasProgress = progressCount > 0

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[-140px] h-[520px] w-[520px] rounded-full bg-[#dfd8ff]/55 blur-[110px]" />
        <div className="absolute right-[-170px] top-[80px] h-[480px] w-[480px] rounded-full bg-[#d8f2ec]/65 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[28%] h-[460px] w-[460px] rounded-full bg-[#ffe2d6]/50 blur-[120px]" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-3 pt-6 sm:px-8 sm:pt-8">
        <Logo />
        <div className="flex items-center gap-2">
          {hasResult && (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onViewResult}>
              上次结果
            </Button>
          )}
          <span className="rounded-full border border-black/[0.06] bg-white/55 px-3 py-1.5 text-[11px] font-semibold text-[#777783] backdrop-blur-xl">
            Self discovery
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="grid min-h-[660px] items-center gap-14 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="relative z-10 max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/60 px-3.5 py-2 text-[12px] font-semibold text-[#666672] shadow-[0_8px_24px_rgba(30,30,40,0.05)] backdrop-blur-xl">
              <SparkleIcon className="h-3.5 w-3.5 text-[#5746d8]" />
              基于 MBTI 四维度的自我探索
            </div>

            <h1 className="text-[46px] font-bold leading-[0.98] tracking-[-0.065em] text-[#181820] sm:text-[64px] lg:text-[76px]">
              更懂自己，
              <br />
              <span className="bg-gradient-to-r from-[#5746d8] via-[#7658cf] to-[#158a82] bg-clip-text text-transparent">
                从思维倾向开始。
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-8 text-[#666672] sm:text-[18px]">
              了解你的思维方式、行为倾向与人格特征。用 48 个日常情境，整理你习惯如何获取能量、理解世界、做出决定与安排生活。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="group w-full sm:w-auto" onClick={hasProgress ? onResume : onStart}>
                {hasProgress ? '继续测试' : '开始测试'}
                <ArrowRightIcon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              {hasProgress && (
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onStart}>
                  重新开始
                </Button>
              )}
              {!hasProgress && hasResult && (
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onViewResult}>
                  查看上次结果
                </Button>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#858590]">
              <span><b className="mr-1 font-semibold text-[#3e3e48]">{QUESTION_COUNT}</b> 道原创题</span>
              <span className="h-1 w-1 rounded-full bg-black/15" />
              <span>约 8–12 分钟</span>
              <span className="h-1 w-1 rounded-full bg-black/15" />
              <span>进度自动保存在本机</span>
            </div>

            {hasProgress && (
              <div className="mt-8 max-w-md rounded-2xl border border-black/[0.055] bg-white/55 p-4 backdrop-blur-xl">
                <div className="mb-2.5 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#4a4a55]">上次答到 {progressCount} / {QUESTION_COUNT}</span>
                  <span className="text-[#8d8d98]">{Math.round((progressCount / QUESTION_COUNT) * 100)}%</span>
                </div>
                <ProgressBar value={(progressCount / QUESTION_COUNT) * 100} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="relative mx-auto aspect-[0.9] w-full max-w-[470px]">
              <div className="absolute inset-8 rounded-[52px] border border-white/80 bg-white/42 shadow-[0_40px_100px_rgba(38,38,55,0.13)] backdrop-blur-2xl" />
              <div className="absolute inset-16 rounded-[40px] border border-white/80 bg-gradient-to-br from-white/80 to-white/35" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[8%] top-[13%] w-[45%] rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-[0_22px_55px_rgba(39,39,55,0.11)] backdrop-blur-xl"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8a95]">Energy</span>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-[45px] font-extrabold leading-none tracking-[-0.07em] text-[#5746d8]">I</span>
                  <span className="text-[18px] font-bold text-[#363641]">68%</span>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-black/[0.065]">
                  <div className="h-full w-[68%] rounded-full bg-[#5746d8]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[5%] top-[29%] w-[43%] rounded-[26px] border border-white/80 bg-white/78 p-5 shadow-[0_22px_55px_rgba(39,39,55,0.10)] backdrop-blur-xl"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8a95]">Decisions</span>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-[45px] font-extrabold leading-none tracking-[-0.07em] text-[#c14f74]">F</span>
                  <span className="text-[18px] font-bold text-[#363641]">61%</span>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-black/[0.065]">
                  <div className="h-full w-[61%] rounded-full bg-[#c14f74]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute bottom-[12%] left-[19%] w-[52%] rounded-[30px] border border-white/80 bg-[#191921] p-6 text-white shadow-[0_28px_70px_rgba(25,25,33,0.25)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Your type</span>
                  <SparkleIcon className="h-4 w-4 text-white/55" />
                </div>
                <p className="mt-5 text-[48px] font-extrabold leading-none tracking-[-0.07em]">INFP</p>
                <p className="mt-3 text-[13px] font-medium text-white/60">调停者 · Mediator</p>
              </motion.div>

              <span className="absolute right-[11%] top-[9%] h-3 w-3 rounded-full bg-[#178b83]" />
              <span className="absolute bottom-[19%] right-[15%] h-2.5 w-2.5 rounded-full bg-[#e07a25]" />
            </div>
          </motion.div>
        </section>

        <section className="pt-12 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8c8c97]">What is MBTI</span>
            <h2 className="mt-4 text-[34px] font-bold tracking-[-0.05em] text-[#1b1b23] sm:text-[44px]">
              四个维度，组合出十六种倾向
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#70707b]">
              MBTI 用四个连续维度描述人们常见的偏好差异。它不是非黑即白的标签，而是一种帮助自我观察与沟通的语言。
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dimensions.map((dimension, index) => (
              <motion.div
                key={dimension.letters}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.06, ease }}
                className="rounded-[26px] border border-black/[0.055] bg-white/60 p-6 shadow-[0_18px_50px_rgba(34,34,48,0.055)] backdrop-blur-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-[13px] font-bold" style={{ backgroundColor: dimension.soft, color: dimension.color }}>
                  {dimension.letters}
                </div>
                <h3 className="mt-5 text-[17px] font-bold tracking-[-0.02em] text-[#24242d]">{dimension.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#777782]">{dimension.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-24 overflow-hidden rounded-[34px] bg-[#191921] px-7 py-10 text-white shadow-[0_30px_80px_rgba(25,25,33,0.22)] sm:px-12 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Ready when you are</span>
              <h2 className="mt-4 max-w-xl text-[30px] font-bold leading-tight tracking-[-0.045em] sm:text-[40px]">
                不用寻找“标准答案”，选择最像你的日常反应。
              </h2>
              <p className="mt-4 max-w-2xl text-[14px] leading-7 text-white/55">
                所有答案只保存在你的浏览器中。测试没有对错，也不会把人格限制成一个固定标签。
              </p>
            </div>
            <Button
              variant="light"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hasProgress ? '继续测试' : '开始测试'}
              <ArrowRightIcon className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-16 max-w-6xl px-5 text-center text-[11px] leading-5 text-[#92929d] sm:px-8">
        <p>MindType · 仅用于自我探索与娱乐参考，不代表严格的心理学诊断。</p>
      </footer>
    </div>
  )
}
