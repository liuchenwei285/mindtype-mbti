import { useCallback } from 'react'
import { QUESTION_COUNT } from '../data/questions'
import type { AnswerMap, AnswerValue, TestSession } from '../types/mbti'
import { useLocalStorageState } from './useLocalStorageState'

export const STORAGE_KEYS = {
  session: 'mindtype.session.v1',
  result: 'mindtype.result.v1',
} as const

export function createEmptySession(): TestSession {
  const now = new Date().toISOString()
  return { answers: {}, currentIndex: 0, startedAt: now, updatedAt: now }
}

export function useTestSession() {
  const [session, setSession, clearSession] = useLocalStorageState<TestSession>(
    STORAGE_KEYS.session,
    createEmptySession(),
  )

  const answerQuestion = useCallback(
    (questionId: number, value: AnswerValue) => {
      setSession((current) => ({
        ...current,
        answers: { ...current.answers, [questionId]: value } satisfies AnswerMap,
        updatedAt: new Date().toISOString(),
      }))
    },
    [setSession],
  )

  const goTo = useCallback(
    (index: number) => {
      setSession((current) => ({
        ...current,
        currentIndex: Math.max(0, Math.min(index, QUESTION_COUNT - 1)),
        updatedAt: new Date().toISOString(),
      }))
    },
    [setSession],
  )

  const reset = useCallback(() => {
    clearSession()
    setSession(createEmptySession())
  }, [clearSession, setSession])

  return { session, answerQuestion, goTo, reset }
}
