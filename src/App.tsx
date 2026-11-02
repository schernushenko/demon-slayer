import { useEffect, useRef, useState } from 'react'
import './App.css'

type Character = {
  id: number
  name: string
  age: number | null
  gender: string
  race: string
  description: string
  img: string
  affiliation_id: number
  arc_id: number
  quote: string | null
}

const charactersApiUrl = 'https://www.demonslayer-api.com/api/v1/characters?page=1&limit=100'

function isCharacter(value: unknown): value is Character {
  if (typeof value !== 'object' || value === null) return false

  const character = value as Record<string, unknown>
  return (
    typeof character.id === 'number' &&
    typeof character.name === 'string' &&
    (typeof character.age === 'number' || character.age === null) &&
    typeof character.gender === 'string' &&
    typeof character.race === 'string' &&
    typeof character.description === 'string' &&
    typeof character.img === 'string' &&
    typeof character.affiliation_id === 'number' &&
    typeof character.arc_id === 'number' &&
    (typeof character.quote === 'string' || character.quote === null)
  )
}

function parseCharacters(data: unknown): Character[] {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('content' in data) ||
    !Array.isArray(data.content) ||
    !data.content.every(isCharacter)
  ) {
    throw new Error('Сервер вернул данные в неожиданном формате.')
  }

  return data.content
}

function localizedValue(value: string) {
  const translations: Record<string, string> = {
    Human: 'Человек',
    Demon: 'Демон',
    Male: 'Мужчина',
    Female: 'Женщина',
  }

  return translations[value] ?? value
}

function SunMark() {
  return (
    <svg aria-hidden="true" className="sun-mark" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="8" />
      <path d="M20 2v7m0 22v7M2 20h7m22 0h7M7.3 7.3l5 5m15.4 15.4 5 5m0-25.4-5 5m-15.4 15.4-5 5" />
    </svg>
  )
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCharacters() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await fetch(charactersApiUrl, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Ошибка сервера (${response.status}).`)
        }

        const data: unknown = await response.json()
        setCharacters(parseCharacters(data))
      } catch (error) {
        if (controller.signal.aborted) return

        setLoadError(
          error instanceof Error
            ? `Не удалось загрузить персонажей: ${error.message}`
            : 'Не удалось загрузить персонажей. Попробуйте ещё раз.',
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadCharacters()
    return () => controller.abort()
  }, [reloadKey])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (selectedCharacter && !dialog.open) dialog.showModal()
    if (!selectedCharacter && dialog.open) dialog.close()
  }, [selectedCharacter])

  useEffect(() => {
    if (!selectedCharacter) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedCharacter])

  function closeCharacterDialog() {
    dialogRef.current?.close()
    setSelectedCharacter(null)
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="На главную">
          <SunMark />
          <span>
            <strong>КИМЭЦУ</strong>
            <small>ФАН-СООБЩЕСТВО</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#story">О мире</a>
          <a href="#characters">Персонажи</a>
          <a href="#styles">Дыхания</a>
          <a href="#arcs">Арки</a>
        </nav>
        <a className="header-link" href="#characters">
          Войти в Корпус <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <div className="hero-grain" />
          </div>
          <div className="hero-content">
            <p className="eyebrow"><span /> ИСТОРИЯ О СИЛЕ ЧЕЛОВЕЧЕСКОГО ДУХА</p>
            <h1 id="hero-title">
              Даже ночь
              <br />
              <span>не вечна.</span>
            </h1>
            <p className="hero-description">
              Путеводитель по миру, где отвага становится оружием, а надежда
              горит ярче рассвета.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#story">
                Начать путешествие <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#characters">
                Познакомиться с героями <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="hero-caption">
            <span>ТАЙШО, ЯПОНИЯ</span>
            <span>35° 41′ С. Ш. · 139° 41′ В. Д.</span>
          </div>
        </section>

        <section className="intro-section content-grid" id="story">
          <p className="section-index">01 — ПРЕДАНИЕ</p>
          <div className="intro-copy">
            <h2>Когда заходит солнце,<br />начинается <em>история.</em></h2>
            <p>
              В эпоху Тайсё по дорогам Японии странствуют демоны. Корпус
              истребителей веками защищает людей — и каждый его боец знает:
              даже в самой глубокой тьме есть ради кого продолжать путь.
            </p>
          </div>
          <div className="intro-note">
            <span className="note-symbol">夜</span>
            <p>Одна дорога.<br />Тысячи судеб.</p>
          </div>
        </section>

        <section className="characters-section" id="characters">
          <div className="section-heading">
            <div>
              <p className="section-index">02 — ЛИЦА ИСТОРИИ</p>
              <h2>Персонажи</h2>
            </div>
            <p className="section-aside">Герои и демоны<br />из мира Kimetsu no Yaiba.</p>
          </div>
          <div className="character-toolbar">
            <span>ДАННЫЕ DEMON SLAYER API</span>
            {!isLoading && !loadError && <span>{characters.length} персонажей</span>}
          </div>
          {isLoading && <p className="character-message" role="status">Загружаем персонажей…</p>}
          {loadError && (
            <div className="character-message character-error" role="alert">
              <p>{loadError}</p>
              <button
                className="button button-primary"
                onClick={() => setReloadKey((key) => key + 1)}
                type="button"
              >
                Попробовать снова
              </button>
            </div>
          )}
          {!isLoading && !loadError && (
            <div className="character-grid">
              {characters.map((character) => (
                <button
                  aria-label={`Подробнее о персонаже ${character.name}`}
                  className="character-card"
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  type="button"
                >
                  <span className="character-art">
                    <img alt="" loading="lazy" src={character.img} />
                    <span className="art-number">{String(character.id).padStart(2, '0')}</span>
                    <span className="art-caption">{localizedValue(character.race)}</span>
                  </span>
                  <span className="character-info">
                    <span>
                      <span className="character-title">
                        {character.age === null ? 'Возраст неизвестен' : `${character.age} лет`}
                      </span>
                      <span className="character-name">{character.name}</span>
                    </span>
                    <span aria-hidden="true" className="card-arrow">↗</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="styles-section" id="styles">
          <div className="styles-heading">
            <p className="section-index">03 — ПУТЬ МЕЧА</p>
            <h2>Найди своё <em>дыхание.</em></h2>
            <p>Сосредоточься. Каждый стиль — это свой ритм, своя стихия и своя история.</p>
          </div>
          <div className="style-list">
            <a className="style-row" href="#characters">
              <span className="style-kanji">水</span>
              <span className="style-name">Вода</span>
              <span className="style-detail">Гибкость и спокойствие</span>
              <span className="style-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="style-row" href="#characters">
              <span className="style-kanji">炎</span>
              <span className="style-name">Пламя</span>
              <span className="style-detail">Несгибаемая решимость</span>
              <span className="style-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="style-row" href="#characters">
              <span className="style-kanji">雷</span>
              <span className="style-name">Гром</span>
              <span className="style-detail">Скорость одного удара</span>
              <span className="style-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="arcs-section" id="arcs">
          <div className="section-heading">
            <div>
              <p className="section-index">04 — ХРОНИКИ</p>
              <h2>Путь сквозь ночь</h2>
            </div>
            <p className="section-aside">Каждая встреча меняет<br />ход истории.</p>
          </div>
          <div className="arc-grid">
            <article className="arc-card arc-first">
              <span className="arc-number">ГЛАВА 01</span>
              <div><p>Начало пути</p><h3>Отбор на горе Фудзикасанэ</h3></div>
              <span className="arc-decoration" aria-hidden="true">藤</span>
            </article>
            <article className="arc-card arc-second">
              <span className="arc-number">ГЛАВА 02</span>
              <div><p>Новые союзники</p><h3>Поезд, следующий сквозь ночь</h3></div>
              <span className="arc-decoration" aria-hidden="true">夢</span>
            </article>
            <article className="arc-card arc-third">
              <span className="arc-number">ГЛАВА 03</span>
              <div><p>Огни большого города</p><h3>Тайна квартала развлечений</h3></div>
              <span className="arc-decoration" aria-hidden="true">祭</span>
            </article>
          </div>
        </section>

        <section className="closing-section">
          <SunMark />
          <p className="section-index">ДО РАССВЕТА ЕЩЁ ЕСТЬ ВРЕМЯ</p>
          <h2>История продолжается.</h2>
          <a className="button button-light" href="#home">Вернуться к началу <span aria-hidden="true">↑</span></a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <SunMark />
          <span><strong>КИМЭЦУ</strong><small>ФАН-СООБЩЕСТВО</small></span>
        </a>
        <p>Фанатский проект. Не связан с создателями оригинального произведения.</p>
        <span>СОЗДАНО С УВАЖЕНИЕМ И ЛЮБОВЬЮ</span>
      </footer>

      <dialog
        aria-labelledby="character-dialog-title"
        className="character-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeCharacterDialog()
        }}
        onCancel={(event) => {
          event.preventDefault()
          closeCharacterDialog()
        }}
        onClose={() => {
          setSelectedCharacter(null)
        }}
        ref={dialogRef}
      >
        {selectedCharacter && (
          <div className="character-dialog-content">
            <button
              aria-label="Закрыть"
              className="character-dialog-close"
              onClick={closeCharacterDialog}
              type="button"
            >
              ×
            </button>
            <div className="character-dialog-image">
              <img alt={selectedCharacter.name} src={selectedCharacter.img} />
            </div>
            <div className="character-dialog-details">
              <p className="section-index">ПЕРСОНАЖ · {String(selectedCharacter.id).padStart(2, '0')}</p>
              <h2 id="character-dialog-title">{selectedCharacter.name}</h2>
              <dl className="character-facts">
                <div><dt>Возраст</dt><dd>{selectedCharacter.age ?? 'Неизвестен'}</dd></div>
                <div><dt>Пол</dt><dd>{localizedValue(selectedCharacter.gender)}</dd></div>
                <div><dt>Вид</dt><dd>{localizedValue(selectedCharacter.race)}</dd></div>
              </dl>
              <p className="character-description">{selectedCharacter.description}</p>
              {selectedCharacter.quote && (
                <blockquote className="character-quote">«{selectedCharacter.quote}»</blockquote>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

export default App
