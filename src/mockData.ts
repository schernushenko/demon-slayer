export type Character = {
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

const apiCharacterImage = (id: number) =>
  `https://www.demonslayer-api.com/api/v1/characters/images/${id}.webp`

export const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Tanjiro Kamado',
    age: 15,
    gender: 'Male',
    race: 'Human',
    description:
      'Старший сын семьи Камадо, который наследует силу и сострадание, чтобы защищать близких и идти к свету даже в самые тёмные моменты.',
    img: apiCharacterImage(1),
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
      'Пугающийся воин с удивительной скоростью и громовым дыханием, который раскрывает свой талант лишь в моменты настоящей опасности.',
    img: apiCharacterImage(4),
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
    img: apiCharacterImage(5),
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
    img: apiCharacterImage(2),
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
    img: apiCharacterImage(7),
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
    img: apiCharacterImage(9),
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
    img: apiCharacterImage(3),
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
    img: apiCharacterImage(10),
    affiliation_id: 2,
    arc_id: 7,
    quote: 'Память и воля — это всё, что остаётся после боли.',
  },
]
