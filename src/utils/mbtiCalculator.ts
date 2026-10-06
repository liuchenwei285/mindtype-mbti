import { QUESTIONS } from '../data/questions'
import type {
  AnswerMap,
  AnswerValue,
  DimensionAxis,
  DimensionKey,
  MbtiCode,
  MbtiLetter,
  MbtiResult,
  Question,
} from '../types/mbti'

export const DIMENSION_META: Record<
  DimensionKey,
  {
    title: string
    first: MbtiLetter
    second: MbtiLetter
    firstLabel: string
    secondLabel: string
  }
> = {
  EI: { title: '能量来源', first: 'E', second: 'I', firstLabel: '外向', secondLabel: '内向' },
  SN: { title: '信息偏好', first: 'S', second: 'N', firstLabel: '感觉', secondLabel: '直觉' },
  TF: { title: '决策方式', first: 'T', second: 'F', firstLabel: '思考', secondLabel: '情感' },
  JP: { title: '生活方式', first: 'J', second: 'P', firstLabel: '判断', secondLabel: '感知' },
}

const DIMENSION_ORDER = ['EI', 'SN', 'TF', 'JP'] as const

export function getAnsweredCount(answers: AnswerMap, questions: Question[] = QUESTIONS) {
  return questions.reduce((count, question) => count + (answers[question.id] === undefined ? 0 : 1), 0)
}

export function isComplete(answers: AnswerMap, questions: Question[] = QUESTIONS) {
  return getAnsweredCount(answers, questions) === questions.length
}

export function buildAxes(answers: AnswerMap, questions: Question[] = QUESTIONS): DimensionAxis[] {
  return DIMENSION_ORDER.map((key) => {
    const meta = DIMENSION_META[key]
    let firstScore = 0
    let secondScore = 0
    let answered = 0

    questions.forEach((question) => {
      if (question.dimension !== key) return
      const answer = answers[question.id]
      if (answer === undefined) return

      answered += 1
      const weight = question.weight ?? 1
      const signedValue = answer * question.direction
      if (signedValue > 0) firstScore += Math.abs(signedValue) * weight
      if (signedValue < 0) secondScore += Math.abs(signedValue) * weight
    })

    const total = firstScore + secondScore
    const firstPercent = total === 0 ? 50 : Math.round((firstScore / total) * 1000) / 10
    const secondPercent = Math.round((100 - firstPercent) * 10) / 10
    const preferred = firstScore >= secondScore ? meta.first : meta.second

    return {
      key,
      title: meta.title,
      first: meta.first,
      second: meta.second,
      firstLabel: meta.firstLabel,
      secondLabel: meta.secondLabel,
      firstScore,
      secondScore,
      firstPercent,
      secondPercent,
      preferred,
      strength: Math.round(Math.abs(firstPercent - 50) * 10) / 10,
      answered,
    }
  })
}

export function calculateResult(
  answers: AnswerMap,
  questions: Question[] = QUESTIONS,
): MbtiResult {
  if (!isComplete(answers, questions)) {
    const answered = getAnsweredCount(answers, questions)
    throw new Error(`测试尚未完成：已答 ${answered} / ${questions.length} 题`)
  }

  const axes = buildAxes(answers, questions)
  const code = axes.map((axis) => axis.preferred).join('') as MbtiCode

  return {
    code,
    axes,
    answeredCount: questions.length,
    completedAt: new Date().toISOString(),
  }
}

export function getTieBreakNote(axes: DimensionAxis[]) {
  const tied = axes.filter((axis) => axis.firstScore === axis.secondScore)
  if (tied.length === 0) return ''
  return `在 ${tied.map((axis) => axis.title).join('、')} 上两种倾向接近，系统按题目设定采用了 ${tied
    .map((axis) => axis.preferred)
    .join('/')} 作为结果字母；这通常意味着你会在不同情境中灵活切换。`
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === 'number' && Number.isInteger(value) && value >= -3 && value <= 3
}
