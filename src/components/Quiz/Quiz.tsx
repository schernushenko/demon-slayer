import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ResultCard from './ResultCard'
import { characterResults, questions } from './quizData'
import type { AnswerOption, CharacterId } from './quizData'
import './Quiz.css'

type QuizStage = 'intro' | 'question' | 'result'
type ScoreBoard = Record<CharacterId, number>

const emptyScores = (): ScoreBoard => ({
  tanjiro: 0,
  zenitsu: 0,
  inosuke: 0,
  shinobu: 0,
  giyu: 0,
  rengoku: 0,
})

function getWinner(scores: ScoreBoard, primaryChoices: ScoreBoard): CharacterId {
  const leaders = (Object.keys(scores) as CharacterId[]).filter(
    (characterId) => scores[characterId] === Math.max(...Object.values(scores)),
  )

  if (leaders.length === 1) return leaders[0]

  const mostPrimaryChoices = Math.max(...leaders.map((characterId) => primaryChoices[characterId]))
  const primaryLeaders = leaders.filter(
    (characterId) => primaryChoices[characterId] === mostPrimaryChoices,
  )

  if (primaryLeaders.includes('tanjiro')) return 'tanjiro'
  return primaryLeaders[0]
}

function Quiz() {
  const prefersReducedMotion = useReducedMotion()
  const [stage, setStage] = useState<QuizStage>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [scores, setScores] = useState<ScoreBoard>(emptyScores)
  const [primaryChoices, setPrimaryChoices] = useState<ScoreBoard>(emptyScores)
  const [resultId, setResultId] = useState<CharacterId | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentQuestion = questions[questionIndex]
  const progress = stage === 'intro' ? 0 : stage === 'result' ? questions.length : questionIndex + 1

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
  }, [])

  function applyAnswer(option: AnswerOption) {
    const nextScores = { ...scores }
    const nextPrimaryChoices = { ...primaryChoices }
    let primaryId: CharacterId | null = null
    let highestOptionScore = -1

    for (const characterId of Object.keys(option.scores) as CharacterId[]) {
      const points = option.scores[characterId]
      if (points === undefined) continue

      nextScores[characterId] += points
      // When an option has tied scores, its first character is the primary choice.
      if (points > highestOptionScore) {
        highestOptionScore = points
        primaryId = characterId
      }
    }

    if (primaryId) nextPrimaryChoices[primaryId] += 1
    setScores(nextScores)
    setPrimaryChoices(nextPrimaryChoices)
    setSelectedOption(null)

    if (questionIndex === questions.length - 1) {
      setResultId(getWinner(nextScores, nextPrimaryChoices))
      setStage('result')
      return
    }

    setQuestionIndex((index) => index + 1)
  }

  function chooseAnswer(option: AnswerOption, optionIndex: number) {
    if (selectedOption !== null || !currentQuestion) return

    setSelectedOption(optionIndex)
    transitionTimer.current = setTimeout(() => applyAnswer(option), 240)
  }

  function restartQuiz() {
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    setStage('intro')
    setQuestionIndex(0)
    setScores(emptyScores())
    setPrimaryChoices(emptyScores())
    setResultId(null)
    setSelectedOption(null)
  }

  const motionOffset = prefersReducedMotion ? 0 : 20

  return (
    <section aria-labelledby="quiz-title" className="quiz-section" id="quiz">
      <div className="quiz-heading">
        <p className="section-index">05 — ТВОЙ ПУТЬ</p>
        <h2 id="quiz-title">Кто ты из <em>Клинка?</em></h2>
        <p>Прислушайся к себе — и узнай, чей характер ближе твоему.</p>
      </div>

      <div className="quiz-shell">
        <div
          aria-label={`Пройдено вопросов: ${progress} из ${questions.length}`}
          aria-valuemax={questions.length}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="quiz-progress"
          role="progressbar"
        >
          <div className="quiz-progress-meta">
            <span>
              {stage === 'intro'
                ? '9 вопросов · 1 путь'
                : stage === 'result'
                  ? 'ПУТЬ ПРОЙДЕН'
                  : currentQuestion?.isBonus
                    ? `БОНУСНЫЙ ВОПРОС · ${questionIndex + 1} ИЗ ${questions.length}`
                    : `ВОПРОС ${questionIndex + 1} ИЗ ${questions.length}`}
            </span>
            <span>{String(progress).padStart(2, '0')} / {questions.length}</span>
          </div>
          <div aria-hidden="true" className="quiz-progress-track">
            <motion.span
              animate={{ width: `${(progress / questions.length) * 100}%` }}
              className="quiz-progress-fill"
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="quiz-stage">
          <AnimatePresence initial={false} mode="wait">
            {stage === 'intro' && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="quiz-intro"
                exit={{ opacity: 0, y: -motionOffset }}
                initial={{ opacity: 0, y: motionOffset }}
                key="intro"
                transition={{ duration: 0.35 }}
              >
                <span aria-hidden="true" className="quiz-intro-mark">呼吸</span>
                <div className="quiz-intro-copy">
                  <p className="quiz-kicker">УЗНАЙ СВОЙ СТИЛЬ</p>
                  <h3>Сила начинается<br />с понимания себя.</h3>
                  <p>
                    Девять вопросов помогут найти героя, который ближе тебе по духу.
                    Отвечай интуитивно — результат останется тайной до самого конца.
                  </p>
                  <button
                    className="quiz-start-button"
                    onClick={() => setStage('question')}
                    type="button"
                  >
                    Начать викторину <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <span aria-hidden="true" className="quiz-intro-orbit quiz-intro-orbit-one" />
                <span aria-hidden="true" className="quiz-intro-orbit quiz-intro-orbit-two" />
              </motion.div>
            )}

            {stage === 'question' && currentQuestion && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="quiz-question"
                exit={{ opacity: 0, y: -motionOffset }}
                initial={{ opacity: 0, y: motionOffset }}
                key={`question-${currentQuestion.id}`}
                transition={{ duration: 0.32 }}
              >
                <div className="quiz-question-heading">
                  <p className="quiz-kicker">
                    {currentQuestion.isBonus ? 'ВОПРОС · БОНУСНЫЙ' : 'ВОПРОС · ПУТЬ ГЕРОЯ'}
                  </p>
                  <h3>{currentQuestion.text}</h3>
                </div>
                <div className="quiz-options">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      animate={
                        selectedOption === index
                          ? { scale: prefersReducedMotion ? 1 : 1.015 }
                          : { scale: 1 }
                      }
                      className={`quiz-option ${selectedOption === index ? 'quiz-option-selected' : ''}`}
                      disabled={selectedOption !== null}
                      key={option.text}
                      onClick={() => chooseAnswer(option, index)}
                      type="button"
                      whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                    >
                      <span className="quiz-option-index">{String.fromCharCode(65 + index)}</span>
                      <span>{option.text}</span>
                      <span aria-hidden="true" className="quiz-option-arrow">↗</span>
                    </motion.button>
                  ))}
                </div>
                <p className="quiz-secret-note">
                  <span aria-hidden="true">✦</span> Твой результат пока в секрете
                </p>
              </motion.div>
            )}

            {stage === 'result' && resultId && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="quiz-result"
                exit={{ opacity: 0, y: -motionOffset }}
                initial={{ opacity: 0, y: motionOffset }}
                key="result"
                transition={{ duration: 0.4 }}
              >
                <div aria-hidden="true" className="quiz-confetti">
                  {Array.from({ length: 28 }, (_, index) => (
                    <span
                      className="quiz-confetti-piece"
                      key={index}
                      style={{
                        '--confetti-delay': `${(index % 9) * 0.12}s`,
                        '--confetti-x': `${(index * 37) % 100}%`,
                        '--confetti-hue': `${(index * 31) % 360}deg`,
                      } as CSSProperties}
                    />
                  ))}
                </div>
                <p className="quiz-kicker quiz-result-kicker">ТВОЙ РЕЗУЛЬТАТ</p>
                <ResultCard character={characterResults[resultId]} onRestart={restartQuiz} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Quiz
