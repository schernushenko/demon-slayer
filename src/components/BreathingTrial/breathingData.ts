export type BreathingStyle = 'water' | 'flame' | 'thunder'

export interface BreathingForm {
  id: string
  style: BreathingStyle
  nameJp: string
  nameRu: string
  description: string
}

export const BREATHING_FORMS: BreathingForm[] = [
  {
    id: 'water-1',
    style: 'water',
    nameJp: '壱ノ型 水面斬り',
    nameRu: 'Первая форма: Срезающая воду',
    description: 'Горизонтальный удар.',
  },
  {
    id: 'water-2',
    style: 'water',
    nameJp: '弐ノ型 水車',
    nameRu: 'Вторая форма: Водяное колесо',
    description: 'Вертикальный вращательный удар.',
  },
  {
    id: 'water-3',
    style: 'water',
    nameJp: '参ノ型 流流舞い',
    nameRu: 'Третья форма: Танец потока',
    description: 'Плавные непрерывные удары.',
  },
  {
    id: 'water-5',
    style: 'water',
    nameJp: '伍ノ型 干天の慈雨',
    nameRu: 'Пятая форма: Милосердный дождь',
    description: 'Безболезненный удар.',
  },
  {
    id: 'water-10',
    style: 'water',
    nameJp: '拾ノ型 生生流転',
    nameRu: 'Десятая форма: Непрерывное вращение',
    description: 'Серия вращательных ударов.',
  },
  {
    id: 'flame-1',
    style: 'flame',
    nameJp: '壱ノ型 不知火',
    nameRu: 'Первая форма: Сияющий огонь',
    description: 'Стремительный выпад.',
  },
  {
    id: 'flame-2',
    style: 'flame',
    nameJp: '弐ノ型 昇り炎天',
    nameRu: 'Вторая форма: Восходящее пламя',
    description: 'Удар снизу вверх.',
  },
  {
    id: 'flame-3',
    style: 'flame',
    nameJp: '参ノ型 気炎万象',
    nameRu: 'Третья форма: Пламя души',
    description: 'Мощный горизонтальный удар.',
  },
  {
    id: 'flame-5',
    style: 'flame',
    nameJp: '伍ノ型 炎虎',
    nameRu: 'Пятая форма: Огненный тигр',
    description: 'Атака в форме тигра.',
  },
  {
    id: 'flame-9',
    style: 'flame',
    nameJp: '玖ノ型 煉獄',
    nameRu: 'Девятая форма: Чистилище',
    description: 'Финальная техника.',
  },
  {
    id: 'thunder-1',
    style: 'thunder',
    nameJp: '壱ノ型 霹靂一閃',
    nameRu: 'Первая форма: Вспышка молнии',
    description: 'Мгновенный удар.',
  },
  {
    id: 'thunder-1-6',
    style: 'thunder',
    nameJp: '壱ノ型 霹靂一閃・六連',
    nameRu: 'Первая форма: Вспышка молнии, шесть раз',
    description: 'Шесть стремительных ударов.',
  },
  {
    id: 'thunder-2',
    style: 'thunder',
    nameJp: '弐ノ型 稲魂',
    nameRu: 'Вторая форма: Дух риса',
    description: 'Удар с вращением.',
  },
  {
    id: 'thunder-3',
    style: 'thunder',
    nameJp: '参ノ型 聚蚊成雷',
    nameRu: 'Третья форма: Гром комаров',
    description: 'Серия быстрых ударов.',
  },
  {
    id: 'thunder-7',
    style: 'thunder',
    nameJp: '漆ノ型 火雷神',
    nameRu: 'Седьмая форма: Бог грома и огня',
    description: 'Мощнейший удар.',
  },
]
