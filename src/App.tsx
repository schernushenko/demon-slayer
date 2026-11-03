import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BreathingTrial from './components/BreathingTrial/BreathingTrial'
import type { CharacterId } from './components/Quiz/quizData'
import './App.css'

const Quiz = lazy(() => import('./components/Quiz/Quiz'))

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

type Theme = 'dark' | 'light'

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Tanjiro Kamado',
    age: 15,
    gender: 'Male',
    race: 'Human',
    description:
      'Старший сын семьи Камадо, который наследует силу и сострадание, чтобы защищать близких и идти к свету даже в darkest moments.',
    img: 'https://placehold.co/800x1100/101013/f7f4ed?text=Tanjiro',
    affiliation_id: 1,
    arc_id: 1,
    quote: 'Потерянная душа ведёт к рассвету.',
  },
  {
    id: 2,
    name: 'Zenitsu Agatsuma',
    age: 16,
    gender: 'Male',
    race: 'Human',
    description:
      'Пугающийся воина с удивительной скоростью и громовым дыханием, который раскрывает свой талант лишь в моменты настоящей опасности.',
    img: 'https://placehold.co/800x1100/2f2d2c/f5d26b?text=Zenitsu',
    affiliation_id: 1,
    arc_id: 2,
    quote: 'Если я умру, пусть это будет быстро.',
  },
  {
    id: 3,
    name: 'Inosuke Hashibira',
    age: 15,
    gender: 'Male',
    race: 'Human',
    description:
      'Непредсказуемый боец с диким нравом, который принимает битву как естественную часть жизни и превращает хаос в силу.',
    img: 'https://placehold.co/800x1100/3b3e2f/b9d97a?text=Inosuke',
    affiliation_id: 1,
    arc_id: 3,
    quote: 'Я не хочу быть любым — я хочу быть сильнейшим!',
  },
  {
    id: 4,
    name: 'Giyu Tomioka',
    age: 21,
    gender: 'Male',
    race: 'Human',
    description:
      'Страж, чья тишина и дисциплина делают его одним из самых грозных и непроницаемых мечников в Корпусе.',
    img: 'https://placehold.co/800x1100/1b2a36/b7d8f8?text=Giyu',
    affiliation_id: 2,
    arc_id: 4,
    quote: 'Лишь тот, кто выдерживает тишину, слышит истину.',
  },
  {
    id: 5,
    name: 'Shinobu Kocho',
    age: 18,
    gender: 'Female',
    race: 'Human',
    description:
      'Лёгкая и опасная, она сочетает тонкую красоту с холодной точностью, превращая любое столкновение в смертельную игру.',
    img: 'https://placehold.co/800x1100/3a2137/f9d9ea?text=Shinobu',
    affiliation_id: 2,
    arc_id: 5,
    quote: 'Слово врага — это лишь вторая смерть.',
  },
  {
    id: 6,
    name: 'Kyojuro Rengoku',
    age: 20,
    gender: 'Male',
    race: 'Human',
    description:
      'Огненный столп, чей бесстрашный дух ощущается даже без слов — мощный, яркий и неукротимый.',
    img: 'https://placehold.co/800x1100/44251a/f8b26a?text=Rengoku',
    affiliation_id: 2,
    arc_id: 6,
    quote: 'Пламя не знает страха, пока сердце не дрогнет.',
  },
  {
    id: 7,
    name: 'Nezuko Kamado',
    age: 14,
    gender: 'Female',
    race: 'Demon',
    description:
      'Братская защита и непреодолимая воля — судьба Нэдзуко была сломана, но она всё равно выбирает путь человечности.',
    img: 'https://placehold.co/800x1100/2d1624/f3c7d8?text=Nezuko',
    affiliation_id: 1,
    arc_id: 2,
    quote: 'Они не должны погибнуть. Я не позволю этому.',
  },
  {
    id: 8,
    name: 'Muichiro Tokito',
    age: 14,
    gender: 'Male',
    race: 'Human',
    description:
      'Его движения будто туман: предельно быстрые, почти неуловимые, а внутренняя холодность делает его суровым защитником.',
    img: 'https://placehold.co/800x1100/18222d/cfeaf8?text=Muichiro',
    affiliation_id: 2,
    arc_id: 7,
    quote: 'Память и воля — это всё, что остаётся после боли.',
  },
]

const quizCharacterNames: Record<CharacterId, string> = {
  tanjiro: 'Tanjiro Kamado',
  zenitsu: 'Zenitsu Agatsuma',
  inosuke: 'Inosuke Hashibira',
  shinobu: 'Shinobu Kocho',
  giyu: 'Giyu Tomioka',
  rengoku: 'Kyojuro Rengoku',
}

type BreathingStyle =
  | 'water'
  | 'thunder'
  | 'beast'
  | 'flower'
  | 'insect'
  | 'sound'
  | 'love'
  | 'flame'
  | 'mist'
  | 'stone'
  | 'serpent'
  | 'wind'
  | 'sun'
  | 'moon'

const characterBreathingStyles: Record<string, BreathingStyle> = {
  'Tanjiro Kamado': 'water',
  'Giyu Tomioka': 'water',
  'Sakonji Urokodaki': 'water',
  Sabito: 'water',
  Makomo: 'water',
  'Aoi Kanzaki': 'water',
  'Murata': 'water',
  'Zenitsu Agatsuma': 'thunder',
  'Inosuke Hashibira': 'beast',
  'Kanao Tsuyuri': 'flower',
  'Shinobu Kocho': 'insect',
  'Tengen Uzui': 'sound',
  'Mitsuri Kanroji': 'love',
  'Kyojuro Rengoku': 'flame',
  'Muichiro Tokito': 'mist',
  'Gyomei Himejima': 'stone',
  'Obanai Iguro': 'serpent',
  'Sanemi Shinazugawa': 'wind',
  Yoriichi: 'sun',
  Kokushibo: 'moon',
}

const breathingStyleLabels: Record<BreathingStyle, string> = {
  water: 'Дыхание воды',
  thunder: 'Дыхание грома',
  beast: 'Дыхание зверя',
  flower: 'Дыхание цветка',
  insect: 'Дыхание насекомого',
  sound: 'Дыхание звука',
  love: 'Дыхание любви',
  flame: 'Дыхание пламени',
  mist: 'Дыхание тумана',
  stone: 'Дыхание камня',
  serpent: 'Дыхание змеи',
  wind: 'Дыхание ветра',
  sun: 'Дыхание солнца',
  moon: 'Дыхание луны',
}

const breathingStyleColors: Record<BreathingStyle, string> = {
  water: '#4b8fa7',
  thunder: '#c59a28',
  beast: '#81964e',
  flower: '#c47799',
  insect: '#8a72b0',
  sound: '#d2754e',
  love: '#d87191',
  flame: '#c84d38',
  mist: '#82999d',
  stone: '#9a8265',
  serpent: '#557d68',
  wind: '#719a67',
  sun: '#cc9639',
  moon: '#7566a5',
}

const neutralBreathingColor = '#b8afa3'

const storyArcs = [
  {
    title: 'Отбор на горе Фудзикасанэ',
    caption: 'Начало пути',
    description: 'Первое испытание на пути истребителя демонов.',
    glyph: '藤',
  },
  {
    title: 'Асакуса',
    caption: 'След демона',
    description: 'Встреча с новым врагом среди огней большого города.',
    glyph: '浅',
  },
  {
    title: 'Особняк барабанщика',
    caption: 'Новые союзники',
    description: 'Неожиданная встреча меняет дорогу героев.',
    glyph: '鼓',
  },
  {
    title: 'Гора Натагумо',
    caption: 'Паутина тайн',
    description: 'Опасное испытание в лесу, где каждый шаг имеет значение.',
    glyph: '蜘蛛',
  },
  {
    title: 'Поезд «Бесконечность»',
    caption: 'Сквозь ночной экспресс',
    description: 'Путешествие, в котором воля проходит проверку сном.',
    glyph: '夢',
  },
  {
    title: 'Квартал развлечений',
    caption: 'Огни большого города',
    description: 'Тайная миссия в сияющем квартале Тайсё.',
    glyph: '祭',
  },
  {
    title: 'Деревня кузнецов',
    caption: 'Клинок и наследие',
    description: 'Новая глава начинается там, где рождаются клинки.',
    glyph: '鍛',
  },
  {
    title: 'Тренировка столпов',
    caption: 'Перед рассветом',
    description: 'Истребители готовятся к решающему испытанию.',
    glyph: '柱',
  },
  {
    title: 'Бесконечная крепость',
    caption: 'Последнее сражение',
    description: 'Все пути сходятся в сердце демонического мира.',
    glyph: '城',
  },
]

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
  const prefersReducedMotion = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('kimetsu-theme') === 'light' ? 'light' : 'dark',
  )
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.arc-entry', timeline).forEach((entry) => {
        const scene = entry.querySelector<HTMLElement>('.arc-scene')
        const content = entry.querySelector<HTMLElement>('.arc-card-content')

        if (content) {
          gsap.fromTo(
            content,
            { autoAlpha: 0, y: 42 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: entry,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }

        if (scene) {
          gsap.fromTo(
            scene,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: entry,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    }, timeline)

    return () => context.revert()
  }, [prefersReducedMotion])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('kimetsu-theme', theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101013' : '#f7f4ed')
  }, [theme])

  useEffect(() => {
    let isActive = true

    async function loadCharacters() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const localData = {
          content: mockCharacters,
        }

        const parsedCharacters = parseCharacters(localData)

        if (!isActive) return
        setCharacters(parsedCharacters)
      } catch (error) {
        if (!isActive) return
        setLoadError(
          error instanceof Error
            ? `Не удалось загрузить персонажей: ${error.message}`
            : 'Не удалось загрузить персонажей. Попробуйте ещё раз.',
        )
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadCharacters()
    return () => {
      isActive = false
    }
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

  const quizCharacterImages = (Object.keys(quizCharacterNames) as CharacterId[]).reduce<
    Partial<Record<CharacterId, string>>
  >((images, id) => {
    const character = characters.find((item) => item.name === quizCharacterNames[id])
    if (character) images[id] = character.img
    return images
  }, {})

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
          <a href="#quiz">Викторина</a>
          <a href="#styles">Дыхания</a>
          <a href="#arcs">Арки</a>
        </nav>
        <div className="header-actions">
          <button
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              {theme === 'dark' ? (
                <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </>
              )}
            </svg>
            <span>{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
          </button>
          <a className="header-link" href="#characters">
            Войти в Корпус <span aria-hidden="true">↗</span>
          </a>
        </div>
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
            <span>ЛОКАЛЬНЫЕ МОК-ДАННЫЕ</span>
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
              {characters.map((character) => {
                const breathingStyle = characterBreathingStyles[character.name]
                const breathingColor = breathingStyle
                  ? breathingStyleColors[breathingStyle]
                  : neutralBreathingColor

                return (
                  <motion.button
                    aria-label={`Подробнее о персонаже ${character.name}`}
                    className="character-card"
                    initial={false}
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    style={{ borderColor: 'transparent' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    whileHover={{
                      scale: prefersReducedMotion ? 1 : 1.035,
                      borderColor: breathingColor,
                      boxShadow: `0 14px 32px ${breathingColor}40`,
                    }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.99 }}
                    type="button"
                  >
                    <span className="character-art">
                      <img
                        alt=""
                        className="character-art-portrait"
                        loading="lazy"
                        src={character.img}
                      />
                      <span className="art-number">{String(character.id).padStart(2, '0')}</span>
                      <span className="art-caption">
                        {breathingStyle
                          ? breathingStyleLabels[breathingStyle]
                          : localizedValue(character.race)}
                      </span>
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
                  </motion.button>
                )
              })}
            </div>
          )}
        </section>

        <Suspense
          fallback={(
            <section aria-busy="true" className="quiz-section" id="quiz">
              <p className="section-index">ЗАГРУЖАЕМ ВИКТОРИНУ…</p>
            </section>
          )}
        >
          <Quiz characterImages={quizCharacterImages} />
        </Suspense>

        <section className="styles-section" id="styles">
          <div className="styles-heading">
            <p className="section-index">04 — ПУТЬ МЕЧА</p>
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
          <BreathingTrial />
        </section>

        <section className="arcs-section" id="arcs">
          <div className="section-heading">
            <div>
              <p className="section-index">05 — ХРОНИКИ</p>
              <h2>Путь сквозь ночь</h2>
            </div>
            <p className="section-aside">Каждая встреча меняет<br />ход истории.</p>
          </div>
          <div className="arc-timeline" ref={timelineRef}>
            <span aria-hidden="true" className="timeline-spine" />
            {storyArcs.map((arc, index) => (
              <article
                className={`arc-entry ${index % 2 === 1 ? 'arc-entry-reversed' : ''}`}
                key={arc.title}
              >
                <span aria-hidden="true" className="timeline-marker">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={`arc-card arc-${['first', 'second', 'third'][index % 3]}`}>
                  <div aria-hidden="true" className="arc-scene" />
                  <div className="arc-card-content">
                    <span className="arc-number">ГЛАВА {String(index + 1).padStart(2, '0')}</span>
                    <div className="arc-copy">
                      <p>{arc.caption}</p>
                      <h3>{arc.title}</h3>
                      <span className="arc-description">{arc.description}</span>
                    </div>
                    <span className="arc-decoration" aria-hidden="true">{arc.glyph}</span>
                  </div>
                </div>
              </article>
            ))}
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
