import type { MbtiResult, PersonalityProfile } from '../types/mbti'
import { getAxisDisplay } from '../utils/result'
import { Logo } from './Logo'

interface ShareCardProps {
  result: MbtiResult
  profile: PersonalityProfile
}

export function ShareCard({ result, profile }: ShareCardProps) {
  return (
    <div
      className="relative aspect-[4/5.6] w-full max-w-[340px] shrink-0 overflow-hidden rounded-[30px] border border-white/80 p-5 shadow-[0_28px_70px_rgba(31,31,44,0.14)]"
      style={{
        background: `radial-gradient(circle at 88% 6%, ${profile.accent}38, transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.96), ${profile.soft} 58%, #f6f6f8)`,
      }}
    >
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#7f7f8b]">Your profile</span>
      </div>

      <div className="mt-6">
        <p className="text-[52px] font-extrabold leading-none tracking-[-0.07em]" style={{ color: profile.accent }}>
          {result.code}
        </p>
        <p className="mt-2 text-[17px] font-bold tracking-[-0.03em] text-[#202029]">
          {profile.nameZh} · {profile.nameEn}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#72727f]">{profile.tagline}</p>
      </div>

      <div className="mt-5 space-y-3">
        {result.axes.map((axis) => {
          const [preferred, other] = getAxisDisplay(axis)
          return (
            <div key={axis.key}>
              <div className="mb-1 flex items-end justify-between">
                <span className="text-[10px] font-semibold text-[#3c3c47]">
                  <b className="mr-1 text-[14px]" style={{ color: profile.accent }}>{preferred.letter}</b>
                  {preferred.label}
                </span>
                <span className="text-[11px] font-bold text-[#30303a]">{preferred.percent}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-black/[0.07]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${preferred.percent}%`, backgroundColor: profile.accent }}
                />
              </div>
              <p className="mt-0.5 text-[8px] text-[#9696a0]">
                {other.letter} {other.label} {other.percent}%
              </p>
            </div>
          )
        })}
      </div>

      <div className="absolute inset-x-5 bottom-4 border-t border-black/[0.07] pt-2.5">
        <p className="text-[9px] font-medium text-[#555560]">Discover yourself, understand your patterns.</p>
        <p className="mt-0.5 text-[7px] text-[#9a9aa3]">仅用于自我探索与娱乐参考</p>
      </div>
    </div>
  )
}


