import { describe, expect, it } from 'vitest'
import { QUESTIONS, QUESTIONS_BY_DIMENSION, QUESTION_COUNT } from '../data/questions'
import { PERSONALITIES } from '../data/personalities'
import type { AnswerMap, DimensionKey, MbtiCode } from '../types/mbti'
import { DIMENSION_META, buildAxes, calculateResult, getAnsweredCount, isComplete } from './mbtiCalculator'

const allCodes: MbtiCode[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

function answersForCode(code: MbtiCode): AnswerMap {
  const answers: AnswerMap = {}
  QUESTIONS.forEach((question) => {
    const meta = DIMENSION_META[question.dimension]
    const sideLetter = question.direction === 1 ? meta.first : meta.second
    answers[question.id] = code.includes(sideLetter) ? 3 : -3
  })
  return answers
}

describe('question data', () => {
  it('contains 48 questions with 12 in every dimension', () => {
    expect(QUESTION_COUNT).toBe(48)
    ;(['EI', 'SN', 'TF', 'JP'] as DimensionKey[]).forEach((dimension) => {
      expect(QUESTIONS_BY_DIMENSION[dimension]).toHaveLength(12)
    })
  })

  it('mixes forward and reverse worded questions evenly', () => {
    ;(['EI', 'SN', 'TF', 'JP'] as DimensionKey[]).forEach((dimension) => {
      const questions = QUESTIONS_BY_DIMENSION[dimension]
      expect(questions.filter((question) => question.direction === 1)).toHaveLength(6)
      expect(questions.filter((question) => question.direction === -1)).toHaveLength(6)
    })
  })

  it('defines all 16 personality profiles', () => {
    expect(Object.keys(PERSONALITIES)).toHaveLength(16)
    allCodes.forEach((code) => {
      const profile = PERSONALITIES[code]
      expect(profile.code).toBe(code)
      expect(profile.nameZh.length).toBeGreaterThan(0)
      expect(profile.strengths.length).toBeGreaterThanOrEqual(4)
      expect(profile.challenges.length).toBeGreaterThanOrEqual(4)
    })
  })
})

describe('MBTI calculator', () => {
  it('tracks completion and rejects an incomplete result', () => {
    const answers: AnswerMap = { 1: 3, 2: -2 }
    expect(getAnsweredCount(answers)).toBe(2)
    expect(isComplete(answers)).toBe(false)
    expect(() => calculateResult(answers)).toThrow(/尚未完成/)
  })

  it('uses the first letter as the deterministic tie-break', () => {
    const neutral = Object.fromEntries(QUESTIONS.map((question) => [question.id, 0])) as AnswerMap
    expect(calculateResult(neutral).code).toBe('ESTJ')
    expect(calculateResult(neutral).axes.every((axis) => axis.firstPercent === 50 && axis.secondPercent === 50)).toBe(true)
  })

  it('can generate every one of the 16 personality types', () => {
    allCodes.forEach((code) => {
      const result = calculateResult(answersForCode(code))
      expect(result.code).toBe(code)
    })
  })

  it('handles reverse-worded statements in the correct direction', () => {
    const reverseQuestion = QUESTIONS_BY_DIMENSION.EI.find((question) => question.direction === -1)!
    const answers: AnswerMap = Object.fromEntries(
      QUESTIONS.map((question) => [question.id, question.id === reverseQuestion.id ? 3 : 0]),
    )
    const [axis] = buildAxes(answers)
    expect(axis.first).toBe('E')
    expect(axis.second).toBe('I')
    expect(axis.preferred).toBe('I')
    expect(axis.secondScore).toBe(3)
    expect(axis.secondPercent).toBe(100)
  })

  it('returns percentages that add up to 100 on each axis', () => {
    allCodes.forEach((code) => {
      const result = calculateResult(answersForCode(code))
      result.axes.forEach((axis) => {
        expect(axis.firstPercent + axis.secondPercent).toBeCloseTo(100, 8)
        expect(axis.preferred === axis.first ? axis.firstPercent : axis.secondPercent).toBeGreaterThan(50)
      })
    })
  })
})

