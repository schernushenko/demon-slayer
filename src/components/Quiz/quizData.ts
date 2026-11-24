export type CharacterId =
  | 'tanjiro'
  | 'zenitsu'
  | 'inosuke'
  | 'shinobu'
  | 'giyu'
  | 'rengoku'
  | 'akaza'
  | 'daki'
  | 'gyutaro'
  | 'enmu'
  | 'rui'
  | 'doma'
  | 'muzan'

export interface CharacterResult {
  id: CharacterId
  name: string
  image: string
  title: string
  description: string
  quote: string
  color: string
  emoji: string
  type: 'slayer' | 'demon'
}

export interface AnswerOption {
  text: string
  scores: Partial<Record<CharacterId, number>>
}

export interface Question {
  id: number
  text: string
  options: AnswerOption[]
}

export const characterResults: Record<CharacterId, CharacterResult> = {
  tanjiro: {
    id: 'tanjiro',
    name: 'Тандзиро Камадо',
    image: '/persons/Tanjiro%20Kamado.webp',
    title: 'Столп Воды (по духу)',
    description:
      'Ты — тот, кто идёт вперёд, даже когда сердце разрывается. Твоя сила — в эмпатии и упрямой доброте.',
    quote: '«Даже у демона есть прошлое»',
    color: '#4A90D9',
    emoji: '🌊',
    type: 'slayer',
  },
  zenitsu: {
    id: 'zenitsu',
    name: 'Дзеницу Агацума',
    image: '/persons/Zenitsu%20Agatsuma.webp',
    title: 'Гром, который боится, но бьёт',
    description:
      'Ты недооцениваешь себя, но в решающий момент становишься сильнее, чем кажешься. Твоя чувствительность — не слабость.',
    quote: '«Я боюсь, но я всё равно иду»',
    color: '#F5C518',
    emoji: '⚡',
    type: 'slayer',
  },
  inosuke: {
    id: 'inosuke',
    name: 'Иноскэ Хасибира',
    image: '/persons/Inosuke%20Hashibira.webp',
    title: 'Дикий инстинкт',
    description:
      'Ты живёшь настоящим и не боишься столкновений. Твоя прямота и энергия заражают.',
    quote: '«Сначала удар, потом вопросы»',
    color: '#7B9DBF',
    emoji: '🐗',
    type: 'slayer',
  },
  shinobu: {
    id: 'shinobu',
    name: 'Синобу Котё',
    image: '/persons/Shinobu%20Kocho.webp',
    title: 'Столп Насекомого',
    description:
      'Ты улыбаешься, но внутри — расчёт и глубина. Ты умеешь превращать боль в стратегию.',
    quote: '«Улыбка — тоже оружие»',
    color: '#9B59B6',
    emoji: '🦋',
    type: 'slayer',
  },
  giyu: {
    id: 'giyu',
    name: 'Гию Томиока',
    image: '/persons/Giyu%20Tomioka.webp',
    title: 'Столп Воды',
    description:
      'Ты молчишь, но твои поступки говорят громче слов. Твоя сдержанность скрывает доброту.',
    quote: '«Не позволяй другим решать твою судьбу»',
    color: '#2E86AB',
    emoji: '💧',
    type: 'slayer',
  },
  rengoku: {
    id: 'rengoku',
    name: 'Кёдзюро Рэнгоку',
    image: '/persons/Kyojuro%20Rengoku.webp',
    title: 'Столп Пламени',
    description:
      'Ты — огонь для окружающих. Твой оптимизм и прямота зажигают даже в темноте.',
    quote: '«Зажги огонь в своём сердце»',
    color: '#E67E22',
    emoji: '🔥',
    type: 'slayer',
  },
  akaza: {
    id: 'akaza',
    name: 'Аказа',
    image: '/persons/Akaza.webp',
    title: 'Верхняя Луна Третья',
    description:
      'Ты — боец до мозга костей, но твоя сила питается яростью и жаждой доказать своё превосходство. Честь для тебя — всё, но ты забыл, что значит быть человеком.',
    quote: '«Сила — это всё»',
    color: '#E74C3C',
    emoji: '👊',
    type: 'demon',
  },
  daki: {
    id: 'daki',
    name: 'Даки',
    image: '/persons/Daki.webp',
    title: 'Верхняя Луна Шестая (сестра)',
    description:
      'Ты привык быть в центре внимания и болезненно зависишь от чужого одобрения. За красивой оболочкой скрывается страх остаться одной.',
    quote: '«Посмотри на меня!»',
    color: '#FF69B4',
    emoji: '🎀',
    type: 'demon',
  },
  gyutaro: {
    id: 'gyutaro',
    name: 'Гютаро',
    image: '/persons/Gyutaro.webp',
    title: 'Верхняя Луна Шестая (брат)',
    description:
      'Ты вырос в тени и научился защищаться единственным доступным способом — быть опасным. Твоя преданность тем, кого любишь, не знает границ.',
    quote: '«Я убью любого, кто тронет её»',
    color: '#2C3E50',
    emoji: '🪭',
    type: 'demon',
  },
  enmu: {
    id: 'enmu',
    name: 'Энму',
    image: '/persons/Enmu.webp',
    title: 'Бывшая Нижняя Луна Первая',
    description:
      'Ты — манипулятор и мечтатель. Ты любишь играть с чужими страхами и желаниями, потому что реальность кажется тебе скучной.',
    quote: '«Сладкие сны — лучшая реальность»',
    color: '#8E44AD',
    emoji: '🌙',
    type: 'demon',
  },
  rui: {
    id: 'rui',
    name: 'Руи',
    image: '/persons/Rui.webp',
    title: 'Бывшая Нижняя Луна Пятая',
    description:
      'Ты ищешь семью и связи, но не умеешь строить их иначе, как через контроль и насилие. Твоё одиночество маскируется под силу.',
    quote: '«Будь моей семьёй. Или умри»',
    color: '#95A5A6',
    emoji: '🕸️',
    type: 'demon',
  },
  doma: {
    id: 'doma',
    name: 'Доума',
    image: '/persons/Doma.webp',
    title: 'Верхняя Луна Вторая',
    description:
      'Ты не чувствуешь боли и не понимаешь чужих эмоций. Ты живёшь ради удовольствия и не видишь разницы между любовью и поеданием.',
    quote: '«Разве не прекрасно?»',
    color: '#1ABC9C',
    emoji: '❄️',
    type: 'demon',
  },
  muzan: {
    id: 'muzan',
    name: 'Мудзан',
    image: '/persons/Muzan%20Kibutsuji.webp',
    title: 'Прародитель демонов',
    description:
      'Ты — абсолютный эгоист и стратег, который не терпит неподчинения. Твой страх смерти превратился в жажду тотального контроля над всем вокруг. Ты одинок, но считаешь это ценой величия.',
    quote: '«Я — совершенное создание, бесконечно близкое к идеалу»',
    color: '#8B0000',
    emoji: '👑',
    type: 'demon',
  },
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'Ты видишь, как незнакомец попал в беду. Твоя первая реакция?',
    options: [
      { text: 'Броситься на помощь', scores: { tanjiro: 2, rengoku: 1, gyutaro: 1 } },
      { text: 'Оценить обстановку и найти безопасный способ', scores: { giyu: 2, shinobu: 1 } },
      { text: 'Испугаться, но всё равно сделать шаг', scores: { zenitsu: 2, tanjiro: 1 } },
      { text: 'Пройти мимо, если это не моя проблема', scores: { akaza: 2, doma: 1, daki: 1 } },
    ],
  },
  {
    id: 2,
    text: 'Что для тебя важнее всего в команде?',
    options: [
      { text: 'Абсолютное доверие и эмоциональная связь', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Чёткий план и хладнокровие', scores: { shinobu: 2, giyu: 1, enmu: 1 } },
      { text: 'Скорость и решительность', scores: { inosuke: 2, rengoku: 1 } },
      { text: 'Личная выгода и выживание', scores: { daki: 2, gyutaro: 1, akaza: 1 } },
    ],
  },
  {
    id: 3,
    text: 'Как ты обычно справляешься со страхом?',
    options: [
      { text: 'Делаю вид, что его нет, и иду напролом', scores: { inosuke: 2, zenitsu: 1 } },
      { text: 'Замыкаюсь и анализирую', scores: { giyu: 2, shinobu: 1, rui: 1 } },
      { text: 'Ищу поддержку у близких', scores: { tanjiro: 2, zenitsu: 1 } },
      { text: 'Превращаю страх в агрессию', scores: { akaza: 2, gyutaro: 2 } },
    ],
  },
  {
    id: 4,
    text: 'Твой стиль общения с людьми?',
    options: [
      { text: 'Тёплый и открытый, стараюсь понять каждого', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Сдержанный, лучше покажу делом', scores: { giyu: 2, shinobu: 1 } },
      { text: 'Громкий и прямой, без фильтров', scores: { inosuke: 2, rengoku: 1 } },
      { text: 'Могу быть очаровательным, если мне что-то нужно', scores: { doma: 2, enmu: 2, daki: 1 } },
      {
        text: 'Требую беспрекословного подчинения, иначе уничтожу',
        scores: { muzan: 3, akaza: 1 },
      },
    ],
  },
  {
    id: 5,
    text: 'Что бы ты сделал, если бы получил силу демона?',
    options: [
      { text: 'Искал бы способ использовать её для защиты', scores: { tanjiro: 2, giyu: 1 } },
      { text: 'Использовал бы её, чтобы отомстить', scores: { shinobu: 2, gyutaro: 2, akaza: 1 } },
      { text: 'Боялся бы её и старался контролировать', scores: { zenitsu: 2, tanjiro: 1 } },
      { text: 'Проверил бы её пределы на слабых', scores: { inosuke: 1, akaza: 2, rui: 1 } },
    ],
  },
  {
    id: 6,
    text: 'Какая фраза тебе ближе?',
    options: [
      { text: '«Зажги огонь в своём сердце»', scores: { rengoku: 2 } },
      { text: '«Даже у демона есть прошлое»', scores: { tanjiro: 2 } },
      { text: '«Я не боюсь, я просто осторожен»', scores: { zenitsu: 2 } },
      { text: '«Сила — это единственная правда»', scores: { akaza: 2, doma: 1 } },
      {
        text: '«Я — совершенное создание, бесконечно близкое к идеалу»',
        scores: { muzan: 3 },
      },
    ],
  },
  {
    id: 7,
    text: 'Как ты принимаешь сложные решения?',
    options: [
      { text: 'Сердцем, даже если оно болит', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Холодным расчётом, отбросив эмоции', scores: { shinobu: 2, giyu: 1, enmu: 1 } },
      { text: 'Полагаюсь на интуицию', scores: { inosuke: 2, zenitsu: 1 } },
      { text: 'Ищу выгоду для себя', scores: { daki: 2, gyutaro: 1, doma: 1 } },
    ],
  },
  {
    id: 8,
    text: 'Что для тебя счастье?',
    options: [
      { text: 'Когда близкие в безопасности', scores: { tanjiro: 2, giyu: 1 } },
      { text: 'Когда я победил сильного врага', scores: { inosuke: 2, rengoku: 1, akaza: 1 } },
      { text: 'Когда меня принимают таким, какой я есть', scores: { zenitsu: 2, tanjiro: 1 } },
      { text: 'Когда всё идёт по моему плану', scores: { shinobu: 2, enmu: 2, rui: 1 } },
    ],
  },
  {
    id: 9,
    text: 'Ты находишь старый дневник с секретами. Что сделаешь?',
    options: [
      { text: 'Прочитаю — знания сила', scores: { shinobu: 3, giyu: 1 } },
      { text: 'Верну хозяину — это не моё', scores: { tanjiro: 3, rengoku: 1 } },
      { text: 'Выброшу — нечего копаться', scores: { inosuke: 3, zenitsu: 1 } },
      {
        text: 'Спрячу и буду использовать против хозяина',
        scores: { enmu: 3, doma: 1, gyutaro: 1 },
      },
    ],
  },
  {
    id: 10,
    text: 'Как ты относишься к слабым?',
    options: [
      { text: 'Защищаю, даже ценой себя', scores: { tanjiro: 2, rengoku: 1, gyutaro: 1 } },
      { text: 'Считаю их обузой', scores: { akaza: 2, daki: 2 } },
      { text: 'Мне всё равно, если они не мешают', scores: { giyu: 1, shinobu: 1 } },
      { text: 'Использую их для своих целей', scores: { rui: 2, enmu: 1, doma: 1 } },
      {
        text: 'Слабые — мусор, который мешает моему прогрессу',
        scores: { muzan: 2, doma: 1, akaza: 1 },
      },
    ],
  },
  {
    id: 11,
    text: 'Что вызывает у тебя наибольший гнев?',
    options: [
      { text: 'Несправедливость по отношению к невинным', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Собственное бессилие', scores: { giyu: 2, zenitsu: 1 } },
      { text: 'Когда кто-то считает себя выше меня', scores: { akaza: 2, gyutaro: 1 } },
      { text: 'Когда мне мешают наслаждаться жизнью', scores: { doma: 2, daki: 1 } },
    ],
  },
  {
    id: 12,
    text: 'В чём твоя главная слабость?',
    options: [
      { text: 'Я слишком доверяю людям', scores: { tanjiro: 2, zenitsu: 1 } },
      { text: 'Я не умею прощать себя', scores: { giyu: 2, shinobu: 1 } },
      { text: 'Я зависим от чужого мнения', scores: { zenitsu: 2, daki: 1 } },
      { text: 'Я не чувствую ничего по-настоящему', scores: { doma: 3, akaza: 1 } },
    ],
  },
  {
    id: 13,
    text: 'Что ты чувствуешь, когда ситуация выходит из-под контроля?',
    options: [
      {
        text: 'Ярость — я готов уничтожить всё вокруг',
        scores: { muzan: 3, akaza: 1 },
      },
      {
        text: 'Стараюсь вернуть всё на свои места любой ценой',
        scores: { muzan: 2, enmu: 1 },
      },
      { text: 'Полагаюсь на удачу или других', scores: { tanjiro: 1, zenitsu: 1 } },
      { text: 'Мне всё равно, я просто уйду', scores: { giyu: 1, rui: 1 } },
    ],
  },
  {
    id: 14,
    text: 'Чего ты боишься больше всего?',
    options: [
      { text: 'Смерти и забвения', scores: { muzan: 3 } },
      { text: 'Одиночества', scores: { rui: 2, gyutaro: 1 } },
      { text: 'Потерять близких', scores: { tanjiro: 2, rengoku: 1 } },
      { text: 'Быть непонятым', scores: { zenitsu: 2, shinobu: 1 } },
    ],
  },
]
