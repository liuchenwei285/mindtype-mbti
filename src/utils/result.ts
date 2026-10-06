import type { DimensionAxis, MbtiResult, PersonalityProfile } from '../types/mbti'

export function getAxisDisplay(axis: DimensionAxis) {
  const first = {
    letter: axis.first,
    label: axis.firstLabel,
    percent: axis.firstPercent,
  }
  const second = {
    letter: axis.second,
    label: axis.secondLabel,
    percent: axis.secondPercent,
  }
  return axis.preferred === axis.first ? [first, second] : [second, first]
}

export function formatResultText(result: MbtiResult, profile: PersonalityProfile) {
  const axes = result.axes
    .map((axis) => {
      const [preferred, other] = getAxisDisplay(axis)
      return `${preferred.letter} ${preferred.percent}% / ${other.letter} ${other.percent}%`
    })
    .join('\n')

  return [
    `MindType · 我的人格倾向是 ${result.code}`,
    `${profile.nameZh} / ${profile.nameEn}`,
    profile.tagline,
    '',
    axes,
    '',
    'MBTI 测试结果仅用于自我探索与娱乐参考，不代表严格的心理学诊断。',
  ].join('\n')
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2,
) {
  const chars = [...text]
  const lines: string[] = []
  let line = ''
  for (const char of chars) {
    const candidate = line + char
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = char
      if (lines.length === maxLines - 1) break
    } else {
      line = candidate
    }
  }
  if (line && lines.length < maxLines) lines.push(line)
  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight))
  return y + lines.length * lineHeight
}

export function createShareCardBlob(result: MbtiResult, profile: PersonalityProfile) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  const background = ctx.createLinearGradient(0, 0, 1080, 1350)
  background.addColorStop(0, '#f8f5ef')
  background.addColorStop(0.52, profile.soft)
  background.addColorStop(1, '#f3f4f7')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, 1080, 1350)

  const glow = ctx.createRadialGradient(860, 180, 0, 860, 180, 520)
  glow.addColorStop(0, `${profile.accent}55`)
  glow.addColorStop(1, `${profile.accent}00`)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1080, 1350)

  ctx.save()
  ctx.shadowColor = '#2b2b3a20'
  ctx.shadowBlur = 70
  ctx.shadowOffsetY = 28
  roundRect(ctx, 62, 58, 956, 1234, 54)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.80)'
  ctx.fill()
  ctx.restore()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)'
  ctx.lineWidth = 2
  roundRect(ctx, 62, 58, 956, 1234, 54)
  ctx.stroke()

  ctx.fillStyle = '#17171f'
  ctx.font = '700 28px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('MindType', 112, 136)
  ctx.fillStyle = '#7b7b88'
  ctx.font = '500 22px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('PERSONALITY PROFILE', 968, 136)
  ctx.textAlign = 'left'

  ctx.fillStyle = profile.accent
  ctx.font = '800 194px "Arial", sans-serif'
  ctx.fillText(result.code, 106, 365)

  ctx.fillStyle = '#1b1b23'
  ctx.font = '700 50px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(`${profile.nameZh} · ${profile.nameEn}`, 112, 444)

  ctx.fillStyle = '#555562'
  ctx.font = '400 28px "PingFang SC", "Microsoft YaHei", sans-serif'
  const taglineEnd = drawWrappedText(ctx, profile.tagline, 112, 500, 790, 43, 2)

  let y = Math.max(taglineEnd + 48, 612)
  result.axes.forEach((axis) => {
    const [preferred, other] = getAxisDisplay(axis)
    ctx.fillStyle = '#1b1b23'
    ctx.font = '800 32px "Arial", sans-serif'
    ctx.fillText(preferred.letter, 112, y)
    ctx.fillStyle = '#4a4a56'
    ctx.font = '500 27px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(preferred.label, 158, y)
    ctx.textAlign = 'right'
    ctx.fillStyle = profile.accent
    ctx.font = '700 31px "Arial", sans-serif'
    ctx.fillText(`${preferred.percent}%`, 968, y)
    ctx.textAlign = 'left'

    roundRect(ctx, 112, y + 24, 856, 15, 8)
    ctx.fillStyle = '#e5e5eb'
    ctx.fill()
    roundRect(ctx, 112, y + 24, Math.max(18, (856 * preferred.percent) / 100), 15, 8)
    ctx.fillStyle = profile.accent
    ctx.fill()

    ctx.fillStyle = '#9a9aa5'
    ctx.font = '500 20px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(`${other.letter} ${other.label} ${other.percent}%`, 112, y + 74)
    y += 128
  })

  ctx.strokeStyle = 'rgba(20, 20, 30, 0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(112, 1110)
  ctx.lineTo(968, 1110)
  ctx.stroke()

  ctx.fillStyle = '#25252f'
  ctx.font = '600 25px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('Discover yourself, understand your patterns.', 112, 1164)
  ctx.fillStyle = '#91919b'
  ctx.font = '400 20px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('仅用于自我探索与娱乐参考，不构成心理学诊断。', 112, 1206)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('结果卡片生成失败'))
    }, 'image/png')
  })
}
