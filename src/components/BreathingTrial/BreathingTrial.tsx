import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BREATHING_FORMS } from './breathingData'
import type { BreathingForm, BreathingStyle } from './breathingData'
import './BreathingTrial.css'

const ROUND_LENGTH = 5
const ROUND_TIME = 30

const breathingStyles: {
  id: BreathingStyle
  name: string
  kanji: string
  color: string
  description: string
}[] = [
  {
    id: 'water',
    name: 'Вода',
    kanji: '水',
    color: '#4A90D9',
    description: 'Текучесть и точность',
  },
  {
    id: 'flame',
    name: 'Пламя',
    kanji: '炎',
    color: '#E67E22',
    description: 'Решимость и напор',
  },
  {
    id: 'thunder',
    name: 'Гром',
    kanji: '雷',
    color: '#F5C518',
    description: 'Скорость и фокус',
  },
]

type TrialStage = 'choose' | 'round' | 'result'

function shuffleForms(forms: BreathingForm[]) {
  const shuffled = [...forms]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function BreathingTrial() {
  const prefersReducedMotion = useReducedMotion()
  const [stage, setStage] = useState<TrialStage>('choose')
  const [selectedStyle, setSelectedStyle] = useState<BreathingStyle | null>(null)
  const [roundForms, setRoundForms] = useState<BreathingForm[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)
  const [selectedAnswer, setSelectedAnswer] = useState<BreathingStyle | null>(null)
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean | null>(null)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentForm = roundForms[questionIndex]
  const selectedStyleData = breathingStyles.find((style) => style.id === selectedStyle)
  const rank = score < 2 ? 'Новичок' : score < 4 ? 'Истребитель' : 'Столп'
  const prefersSlowTimer = timeLeft <= 10
  const visibleStage = stage === 'round' && timeLeft === 0 ? 'result' : stage

  useEffect(() => {
    if (stage !== 'round') return

    if (timeLeft <= 0) return

    const timer = window.setTimeout(() => {
      if (timeLeft === 1 && transitionTimer.current) {
        clearTimeout(transitionTimer.current)
        transitionTimer.current = null
      }
      setTimeLeft((remaining) => Math.max(remaining - 1, 0))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [stage, timeLeft])

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
  }, [])

  function startRound(style: BreathingStyle) {
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    setSelectedStyle(style)
    setRoundForms(shuffleForms(BREATHING_FORMS.filter((form) => form.style === style)))
    setQuestionIndex(0)
    setScore(0)
    setTimeLeft(ROUND_TIME)
    setSelectedAnswer(null)
    setAnswerIsCorrect(null)
    setStage('round')
  }

  function answer(style: BreathingStyle) {
    if (!currentForm || selectedAnswer || stage !== 'round' || timeLeft === 0) return

    const correct = style === currentForm.style
    setSelectedAnswer(style)
    setAnswerIsCorrect(correct)
    if (correct) setScore((currentScore) => currentScore + 1)

    transitionTimer.current = window.setTimeout(() => {
      setSelectedAnswer(null)
      setAnswerIsCorrect(null)

      if (questionIndex + 1 >= ROUND_LENGTH) {
        setStage('result')
        return
      }

      setQuestionIndex((index) => index + 1)
    }, prefersReducedMotion ? 0 : 550)
  }

  function restartRound() {
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    setStage('choose')
    setSelectedStyle(null)
    setRoundForms([])
    setQuestionIndex(0)
    setScore(0)
    setTimeLeft(ROUND_TIME)
    setSelectedAnswer(null)
    setAnswerIsCorrect(null)
  }

  const questionOptions = selectedStyleData
    ? breathingStyles.map((style) => ({
        ...style,
        isCorrect: style.id === currentForm?.style,
      }))
    : []

  return (
    <div
      className={`breathing-trial ${selectedStyle ? `breathing-trial-${selectedStyle}` : ''}`}
      style={{ '--trial-color': selectedStyleData?.color ?? '#d98275' } as CSSProperties}
    >
      <div className="trial-intro">
        <p className="trial-kicker">ПРОВЕРЬ СВОЁ МАСТЕРСТВО</p>
        <h3>Испытание Дыхания</h3>
        <p>Пять форм. Тридцать секунд. Выбери стихию и проверь свою память.</p>
      </div>

      <div aria-live="polite" className="trial-panel">
        <AnimatePresence initial={false} mode="wait">
          {visibleStage === 'choose' && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="trial-style-select"
              exit={{ opacity: 0, y: -16 }}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              key="choose"
              transition={{ duration: 0.3 }}
            >
              <p className="trial-prompt">ВЫБЕРИ СВОЁ ДЫХАНИЕ</p>
              <div className="trial-styles">
                {breathingStyles.map((style) => (
                  <motion.button
                    className="trial-style-button"
                    key={style.id}
                    onClick={() => startRound(style.id)}
                    style={{ '--trial-color': style.color } as CSSProperties}
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    <span aria-hidden="true" className="trial-style-kanji">{style.kanji}</span>
                    <span className="trial-style-name">{style.name}</span>
                    <span className="trial-style-description">{style.description}</span>
                    <span aria-hidden="true" className="trial-style-arrow">↗</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {visibleStage === 'round' && currentForm && selectedStyleData && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="trial-round"
              exit={{ opacity: 0, y: -16 }}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              key={`round-${currentForm.id}`}
              transition={{ duration: 0.28 }}
            >
              <div className="trial-round-meta">
                <span>ФОРМА {questionIndex + 1} ИЗ {ROUND_LENGTH}</span>
                <span className={`trial-clock ${prefersSlowTimer ? 'trial-clock-urgent' : ''}`}>
                  00:{String(timeLeft).padStart(2, '0')}
                </span>
              </div>
              <div
                aria-label={`Осталось ${timeLeft} секунд`}
                aria-valuemax={ROUND_TIME}
                aria-valuemin={0}
                aria-valuenow={timeLeft}
                className="trial-timer-track"
                role="progressbar"
              >
                <motion.span
                  animate={{ scaleX: timeLeft / ROUND_TIME }}
                  className="trial-timer-fill"
                  style={{ transformOrigin: 'left', backgroundColor: selectedStyleData.color }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="trial-form">
                <p className="trial-form-style">
                  {selectedStyleData.kanji} ДЫХАНИЕ {selectedStyleData.name.toLocaleUpperCase('ru')}
                </p>
                <h4 lang="ja">{currentForm.nameJp}</h4>
                <p className="trial-form-ru">{currentForm.nameRu}</p>
                <p className="trial-form-description">{currentForm.description}</p>
              </div>

              <div className="trial-answer-grid">
                {questionOptions.map((option) => {
                  const isSelected = selectedAnswer === option.id
                  const isCorrectAnswer = selectedAnswer !== null && option.isCorrect
                  const isWrongSelection = isSelected && answerIsCorrect === false

                  return (
                    <motion.button
                      animate={
                        isSelected
                          ? { scale: prefersReducedMotion ? 1 : 1.025 }
                          : { scale: 1 }
                      }
                      className={`trial-answer ${isSelected ? 'trial-answer-selected' : ''} ${
                        isCorrectAnswer ? 'trial-answer-correct' : ''
                      } ${isWrongSelection ? 'trial-answer-wrong' : ''}`}
                      disabled={selectedAnswer !== null}
                      key={option.id}
                      onClick={() => answer(option.id)}
                      style={{ '--trial-color': option.color } as CSSProperties}
                      type="button"
                      whileHover={selectedAnswer === null && !prefersReducedMotion ? { x: 4 } : undefined}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                    >
                      <span className="trial-answer-kanji">{option.kanji}</span>
                      <span>{option.name}</span>
                      <span aria-hidden="true" className="trial-answer-mark">
                        {isCorrectAnswer ? '✓' : isWrongSelection ? '×' : '↗'}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
              <p className="trial-score">ПРАВИЛЬНЫХ ФОРМ <strong>{score}</strong> / {ROUND_LENGTH}</p>
              {answerIsCorrect !== null && (
                <motion.span
                  animate={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.7 }}
                  className={`trial-flash ${answerIsCorrect ? 'trial-flash-correct' : 'trial-flash-wrong'}`}
                  initial={{ opacity: 0.75, scale: 0.75 }}
                  key={`${currentForm.id}-${answerIsCorrect}`}
                  transition={{ duration: 0.55 }}
                />
              )}
            </motion.div>
          )}

          {visibleStage === 'result' && selectedStyleData && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="trial-result"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              key="result"
              transition={{ duration: 0.4 }}
            >
              <span className="trial-result-kanji" aria-hidden="true">{selectedStyleData.kanji}</span>
              <p className="trial-prompt">ИСПЫТАНИЕ ЗАВЕРШЕНО</p>
              <h4>Ты освоил <span>{score} из {ROUND_LENGTH}</span> форм</h4>
              <p className="trial-rank">{rank}</p>
              <p className="trial-result-note">
                {timeLeft === 0
                  ? 'Время вышло — продолжай тренироваться, и клинок станет точнее.'
                  : 'Каждая форма начинается с правильного вдоха. Продолжай свой путь.'}
              </p>
              <button className="trial-restart" onClick={restartRound} type="button">
                Пройти заново <span aria-hidden="true">↻</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BreathingTrial
