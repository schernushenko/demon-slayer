import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CharacterResult } from './quizData'

interface ResultCardProps {
  character: CharacterResult
  onRestart: () => void
}

function ResultCard({ character, onRestart }: ResultCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="quiz-result-card"
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.78, y: prefersReducedMotion ? 0 : 20 }}
      style={{ '--result-color': character.color } as CSSProperties}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <span aria-hidden="true" className="quiz-result-halo" />
      <span aria-hidden="true" className="quiz-result-emoji">{character.emoji}</span>
      <div className="quiz-result-copy">
        <p className="quiz-kicker">ТВОЙ ПУТЬ ВЕДЁТ К</p>
        <p className="quiz-result-title">{character.title}</p>
        <h3>{character.name}</h3>
        <p className="quiz-result-description">{character.description}</p>
        <blockquote>{character.quote}</blockquote>
        <button className="quiz-restart-button" onClick={onRestart} type="button">
          Пройти ещё раз <span aria-hidden="true">↻</span>
        </button>
      </div>
    </motion.article>
  )
}

export default ResultCard
