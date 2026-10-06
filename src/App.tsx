import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PERSONALITIES } from './data/personalities'
import { useHashRoute } from './hooks/useHashRoute'
import { STORAGE_KEYS, useTestSession } from './hooks/useTestSession'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { ResultPage } from './pages/ResultPage'
import type { StoredResult } from './types/mbti'
import { calculateResult, getAnsweredCount } from './utils/mbtiCalculator'

export default function App() {
  const { route, navigate } = useHashRoute()
  const { session, answerQuestion, goTo, reset } = useTestSession()
  const [storedResult, setStoredResult, clearStoredResult] = useLocalStorageState<StoredResult | null>(
    STORAGE_KEYS.result,
    null,
  )

  const result = useMemo(() => {
    if (!storedResult) return null
    try {
      return calculateResult(storedResult.answers)
    } catch {
      return null
    }
  }, [storedResult])

  const profile = result ? PERSONALITIES[result.code] : null
  const answeredCount = getAnsweredCount(session.answers)

  const startNewTest = () => {
    reset()
    clearStoredResult()
    navigate('/test')
  }

  const finishTest = () => {
    try {
      const calculated = calculateResult(session.answers)
      setStoredResult({
        code: calculated.code,
        answers: session.answers,
        completedAt: calculated.completedAt,
      })
      navigate('/result')
    } catch {
      navigate('/test')
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
        {route === '/' && (
          <HomePage
            progressCount={answeredCount}
            hasResult={Boolean(result)}
            onStart={startNewTest}
            onResume={() => navigate('/test')}
            onViewResult={() => navigate('/result')}
          />
        )}

        {route === '/test' && (
          <QuizPage
            session={session}
            onAnswer={answerQuestion}
            onGoTo={goTo}
            onFinish={finishTest}
            onExit={() => navigate('/')}
          />
        )}

        {route === '/result' && (
          <ResultPage
            result={result}
            profile={profile}
            onRestart={startNewTest}
            onHome={() => navigate('/')}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
