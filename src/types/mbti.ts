export type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP'

export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export type MbtiCode =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export type AnswerValue = -3 | -2 | -1 | 0 | 1 | 2 | 3

export interface Question {
  id: number
  dimension: DimensionKey
  /** 1 表示同意时偏向第一个字母，-1 表示同意时偏向第二个字母 */
  direction: 1 | -1
  text: string
  weight?: number
}

export type AnswerMap = Record<number, AnswerValue>

export interface DimensionAxis {
  key: DimensionKey
  title: string
  first: MbtiLetter
  second: MbtiLetter
  firstLabel: string
  secondLabel: string
  firstScore: number
  secondScore: number
  firstPercent: number
  secondPercent: number
  preferred: MbtiLetter
  strength: number
  answered: number
}

export interface MbtiResult {
  code: MbtiCode
  axes: DimensionAxis[]
  answeredCount: number
  completedAt: string
}

export interface PersonalityProfile {
  code: MbtiCode
  nameZh: string
  nameEn: string
  tagline: string
  summary: string
  strengths: string[]
  challenges: string[]
  learningStyle: string
  workStyle: string
  relationshipStyle: string
  stressResponse: string
  growthDirections: string[]
  accent: string
  soft: string
}

export interface TestSession {
  answers: AnswerMap
  currentIndex: number
  startedAt: string
  updatedAt: string
}

export interface StoredResult {
  code: MbtiCode
  answers: AnswerMap
  completedAt: string
}
