export type CharacterId =
  | 'tanjiro'
  | 'zenitsu'
  | 'inosuke'
  | 'shinobu'
  | 'giyu'
  | 'rengoku'

export interface CharacterResult {
  id: CharacterId
  name: string
  title: string
  description: string
  quote: string
  color: string
  emoji: string
}

export interface AnswerOption {
  text: string
  scores: Partial<Record<CharacterId, number>>
}

export interface Question {
  id: number
  text: string
  options: AnswerOption[]
  isBonus?: boolean
}

export const characterResults: Record<CharacterId, CharacterResult> = {
  tanjiro: {
    id: 'tanjiro',
    name: 'Тандзиро Камадо',
    title: 'Столп Воды (по духу)',
    description:
      'Ты — тот, кто идёт вперёд, даже когда сердце разрывается. Твоя сила — в эмпатии и упрямой доброте.',
    quote: '«Даже у демона есть прошлое»',
    color: '#4A90D9',
    emoji: '🌊',
  },
  zenitsu: {
    id: 'zenitsu',
    name: 'Дзеницу Агацума',
    title: 'Гром, который боится, но бьёт',
    description:
      'Ты недооцениваешь себя, но в решающий момент становишься сильнее, чем кажешься. Твоя чувствительность — не слабость.',
    quote: '«Я боюсь, но я всё равно иду»',
    color: '#F5C518',
    emoji: '⚡',
  },
  inosuke: {
    id: 'inosuke',
    name: 'Иноскэ Хасибира',
    title: 'Дикий инстинкт',
    description:
      'Ты живёшь настоящим и не боишься столкновений. Твоя прямота и энергия заражают.',
    quote: '«Сначала удар, потом вопросы»',
    color: '#7B9DBF',
    emoji: '🐗',
  },
  shinobu: {
    id: 'shinobu',
    name: 'Синобу Котё',
    title: 'Столп Насекомого',
    description:
      'Ты улыбаешься, но внутри — расчёт и глубина. Ты умеешь превращать боль в стратегию.',
    quote: '«Улыбка — тоже оружие»',
    color: '#9B59B6',
    emoji: '🦋',
  },
  giyu: {
    id: 'giyu',
    name: 'Гию Томиока',
    title: 'Столп Воды',
    description:
      'Ты молчишь, но твои поступки говорят громче слов. Твоя сдержанность скрывает доброту.',
    quote: '«Не позволяй другим решать твою судьбу»',
    color: '#2E86AB',
    emoji: '💧',
  },
  rengoku: {
    id: 'rengoku',
    name: 'Кёдзюро Рэнгоку',
    title: 'Столп Пламени',
    description:
      'Ты — огонь для окружающих. Твой оптимизм и прямота зажигают даже в темноте.',
    quote: '«Зажги огонь в своём сердце»',
    color: '#E67E22',
    emoji: '🔥',
  },
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'Ты видишь, как незнакомец попал в беду. Твоя первая реакция?',
    options: [
      { text: 'Броситься на помощь, даже не думая', scores: { inosuke: 2, tanjiro: 1 } },
      {
        text: 'Оценить обстановку и найти безопасный способ помочь',
        scores: { giyu: 2, shinobu: 1 },
      },
      {
        text: 'Испугаться, но всё равно сделать шаг вперёд',
        scores: { zenitsu: 2, tanjiro: 1 },
      },
      {
        text: 'Попытаться понять, почему это произошло',
        scores: { tanjiro: 2, shinobu: 1 },
      },
    ],
  },
  {
    id: 2,
    text: 'Что для тебя важнее всего в команде?',
    options: [
      { text: 'Абсолютное доверие и эмоциональная связь', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Чёткий план и хладнокровие', scores: { shinobu: 2, giyu: 1 } },
      { text: 'Скорость и решительность', scores: { inosuke: 2, rengoku: 1 } },
      { text: 'Честность и искренность', scores: { rengoku: 2, zenitsu: 1 } },
    ],
  },
  {
    id: 3,
    text: 'Как ты обычно справляешься со страхом?',
    options: [
      { text: 'Делаю вид, что его нет, и иду напролом', scores: { inosuke: 2, zenitsu: 1 } },
      { text: 'Замыкаюсь и анализирую', scores: { giyu: 2, shinobu: 1 } },
      { text: 'Ищу поддержку у близких', scores: { tanjiro: 2, zenitsu: 1 } },
      { text: 'Превращаю страх в энергию', scores: { rengoku: 2, inosuke: 1 } },
    ],
  },
  {
    id: 4,
    text: 'Твой стиль общения с людьми?',
    options: [
      { text: 'Тёплый и открытый, стараюсь понять каждого', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Сдержанный, лучше покажу делом', scores: { giyu: 2, shinobu: 1 } },
      { text: 'Громкий и прямой, без фильтров', scores: { inosuke: 2, rengoku: 1 } },
      { text: 'Могу быть разным, в зависимости от настроения', scores: { zenitsu: 2, shinobu: 1 } },
    ],
  },
  {
    id: 5,
    text: 'Что бы ты сделал, если бы получил силу демона?',
    options: [
      { text: 'Искал бы способ использовать её для защиты', scores: { tanjiro: 2, giyu: 1 } },
      { text: 'Использовал бы её, чтобы отомстить', scores: { shinobu: 2, inosuke: 1 } },
      { text: 'Боялся бы её и старался контролировать', scores: { zenitsu: 2, tanjiro: 1 } },
      { text: 'Проверил бы её пределы', scores: { inosuke: 2, rengoku: 1 } },
    ],
  },
  {
    id: 6,
    text: 'Какая фраза тебе ближе?',
    options: [
      { text: '«Зажги огонь в своём сердце»', scores: { rengoku: 2 } },
      { text: '«Даже у демона есть прошлое»', scores: { tanjiro: 2 } },
      { text: '«Я не боюсь, я просто осторожен»', scores: { zenitsu: 2 } },
      { text: '«Сначала удар, потом вопросы»', scores: { inosuke: 2 } },
    ],
  },
  {
    id: 7,
    text: 'Как ты принимаешь сложные решения?',
    options: [
      { text: 'Сердцем, даже если оно болит', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Холодным расчётом, отбросив эмоции', scores: { shinobu: 2, giyu: 1 } },
      { text: 'Полагаюсь на интуицию', scores: { inosuke: 2, zenitsu: 1 } },
      {
        text: 'Советуюсь с теми, кому доверяю',
        scores: { giyu: 1, tanjiro: 1, zenitsu: 1 },
      },
    ],
  },
  {
    id: 8,
    text: 'Что для тебя счастье?',
    options: [
      { text: 'Когда близкие в безопасности', scores: { tanjiro: 2, giyu: 1 } },
      { text: 'Когда я победил сильного врага', scores: { inosuke: 2, rengoku: 1 } },
      {
        text: 'Когда меня принимают таким, какой я есть',
        scores: { zenitsu: 2, tanjiro: 1 },
      },
      { text: 'Когда всё идёт по плану', scores: { shinobu: 2, giyu: 1 } },
    ],
  },
  {
    id: 9,
    text: 'Ты находишь старый дневник с секретами. Что сделаешь?',
    isBonus: true,
    options: [
      { text: 'Прочитаю — знания сила', scores: { shinobu: 3, giyu: 1 } },
      { text: 'Верну хозяину — это не моё', scores: { tanjiro: 3, rengoku: 1 } },
      { text: 'Выброшу — нечего копаться', scores: { inosuke: 3, zenitsu: 1 } },
      { text: 'Спрячу и буду наблюдать', scores: { zenitsu: 2, shinobu: 2 } },
    ],
  },
]
