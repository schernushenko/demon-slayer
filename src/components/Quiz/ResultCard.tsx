import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CharacterResult } from './quizData'

interface ResultCardProps {
  character: CharacterResult
  type: CharacterResult['type']
  onRestart: () => void
}

function ResultCard({ character, type, onRestart }: ResultCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const isMuzan = character.id === 'muzan'

  return (
    <motion.article
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`quiz-result-card quiz-result-card-${type}${isMuzan ? ' quiz-result-card-muzan' : ''}`}
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.78, y: prefersReducedMotion ? 0 : 20 }}
      style={{ '--result-color': character.color } as CSSProperties}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="quiz-result-portrait">
        <img alt={character.name} src={character.image} />
        <span aria-hidden="true" className="quiz-result-emoji">{character.emoji}</span>
        <span aria-hidden="true" className="quiz-result-halo" />
      </div>
      <div className="quiz-result-copy">
        <p className="quiz-kicker">
          {type === 'demon' ? 'ТЬМА ОТКРЫЛА ТВОЁ ЛИЦО' : 'ТВОЙ ПУТЬ ВЕДЁТ К'}
        </p>
        <p className="quiz-result-title">{character.title}</p>
        <h3>{character.name}</h3>
        <p className="quiz-result-description">{character.description}</p>
        <blockquote>{character.quote}</blockquote>
        {type === 'demon' ? (
          <>
            <p className="quiz-result-message quiz-result-twist">
              Твоя душа балансирует на грани. Ты мог бы стать истребителем, но тьма взяла верх...
            </p>
            {isMuzan && (
              <p className="quiz-result-message quiz-result-muzan">
                Ты — Мудзан. Твоя сила абсолютна, но твоя душа пуста. Даже победив, ты останешься один в своей бесконечной ночи.
              </p>
            )}
          </>
        ) : (
          <p className="quiz-result-message quiz-result-light">
            Ты выбрал свет. Твоя сила — в человечности.
          </p>
        )}
        <button className="quiz-restart-button" onClick={onRestart} type="button">
          Пройти заново <span aria-hidden="true">↻</span>
        </button>
      </div>
    </motion.article>
  )
}

export default ResultCard
