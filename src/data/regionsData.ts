import { DistrictMeta, FederalDistrict, RegionInfo } from '../types/puzzle';

export const FEDERAL_DISTRICTS: DistrictMeta[] = [
  {
    code: 'ЦФО',
    name: 'Центральный',
    fullName: 'Центральный федеральный округ',
    color: '#38bdf8',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    count: 36,
  },
  {
    code: 'СЗФО',
    name: 'Северо-Западный',
    fullName: 'Северо-Западный федеральный округ',
    color: '#818cf8',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    count: 28,
  },
  {
    code: 'ЮФО',
    name: 'Южный',
    fullName: 'Южный федеральный округ',
    color: '#fbbf24',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    count: 24,
  },
  {
    code: 'СКФО',
    name: 'Северо-Кавказский',
    fullName: 'Северо-Кавказский федеральный округ',
    color: '#34d399',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    count: 18,
  },
  {
    code: 'ПФО',
    name: 'Приволжский',
    fullName: 'Приволжский федеральный округ',
    color: '#f472b6',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    count: 32,
  },
  {
    code: 'УФО',
    name: 'Уральский',
    fullName: 'Уральский федеральный округ',
    color: '#a78bfa',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    count: 20,
  },
  {
    code: 'СФО',
    name: 'Сибирский',
    fullName: 'Сибирский федеральный округ',
    color: '#2dd4bf',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    count: 24,
  },
  {
    code: 'ДФО',
    name: 'Дальневосточный',
    fullName: 'Дальневосточный федеральный округ',
    color: '#fb923c',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    count: 18,
  },
];

// Regions with verified coordinates and rich cultural symbols
export const REGIONS_DATA: RegionInfo[] = [
  // ЦФО (Центральная Россия)
  {
    code: '77',
    name: 'Москва',
    shortName: 'Москва',
    capital: 'Москва',
    district: 'ЦФО',
    mapX: 21.7,
    mapY: 51.5,
    emblemEmoji: '🏰',
    culturalSymbol: {
      name: 'Шапка Мономаха и Спасские куранты',
      icon: '👑',
      craftType: 'Святыня и реликвия',
      description: 'Главные государственные реликвии и символы верховной власти Руси с XIV века.',
      originEra: 'XIV–XVII вв.'
    }
  },
  {
    code: '50',
    name: 'Московская область',
    shortName: 'Подмосковье',
    capital: 'Красногорск',
    district: 'ЦФО',
    mapX: 22.8,
    mapY: 51.8,
    emblemEmoji: '🌲',
    culturalSymbol: {
      name: 'Гжельская роспись и Жостовские подносы',
      icon: '🏺',
      craftType: 'Народный промысел',
      description: 'Всемирно известная сине-белая кобальтовая керамика Гжели и расписные цветочные подносы Жостово.',
      originEra: 'XVIII–XIX вв.'
    }
  },
  {
    code: '71',
    name: 'Тульская область',
    shortName: 'Тула',
    capital: 'Тула',
    district: 'ЦФО',
    mapX: 21.0,
    mapY: 52.8,
    emblemEmoji: '🗡️',
    culturalSymbol: {
      name: 'Тульский самовар и печатный пряник',
      icon: '🫖',
      craftType: 'Народный промысел',
      description: 'Символ русского гостеприимства, уютного чаепития и вековых традиций тульских мастеров-оружейников.',
      originEra: 'XVII–XVIII вв.'
    }
  },
  {
    code: '76',
    name: 'Ярославская область',
    shortName: 'Ярославль',
    capital: 'Ярославль',
    district: 'ЦФО',
    mapX: 23.6,
    mapY: 46.8,
    emblemEmoji: '🐻',
    culturalSymbol: {
      name: 'Ростовская финифть и майолика',
      icon: '🎨',
      craftType: 'Народный промысел',
      description: 'Филигранная миниатюрная живопись по горячей эмали ростовских мастеров, сияющая вечными красками.',
      originEra: 'Середина XVIII в.'
    }
  },
  {
    code: '33',
    name: 'Владимирская область',
    shortName: 'Владимир',
    capital: 'Владимир',
    district: 'ЦФО',
    mapX: 24.2,
    mapY: 49.5,
    emblemEmoji: '🦁',
    culturalSymbol: {
      name: 'Белокаменная резьба и Мстёрская миниатюра',
      icon: '🦁',
      craftType: 'Народный промысел',
      description: 'Тончайшая резьба по белому камню владимиро-суздальских соборов и лаковая темперная живопись Мстёры.',
      originEra: 'XII–XIX вв.'
    }
  },
  {
    code: '69',
    name: 'Тверская область',
    shortName: 'Тверь',
    capital: 'Тверь',
    district: 'ЦФО',
    mapX: 20.2,
    mapY: 46.5,
    emblemEmoji: '👑',
    culturalSymbol: {
      name: 'Торжокское золотное шитьё',
      icon: '🧵',
      craftType: 'Народный промысел',
      description: 'Древнейшее искусство вышивки золотыми и серебряными нитями по бархату и шелку, прославившее Торжок.',
      originEra: 'XII в.'
    }
  },
  {
    code: '37',
    name: 'Ивановская область',
    shortName: 'Иваново',
    capital: 'Иваново',
    district: 'ЦФО',
    mapX: 25.2,
    mapY: 48.0,
    emblemEmoji: '🧵',
    culturalSymbol: {
      name: 'Палехская и Холуйская лаковая миниатюра',
      icon: '✨',
      craftType: 'Народный промысел',
      description: 'Сказочные сюжеты пушкинских сказок и былин, написанные золотом по чёрному лаку шкатулок.',
      originEra: '1920-е гг. (на основе иконописи XVII в.)'
    }
  },
  {
    code: '44',
    name: 'Костромская область',
    shortName: 'Кострома',
    capital: 'Кострома',
    district: 'ЦФО',
    mapX: 26.5,
    mapY: 45.0,
    emblemEmoji: '⛵',
    culturalSymbol: {
      name: 'Красносельская скань (филигрань) и костромской лён',
      icon: '💍',
      craftType: 'Народный промысел',
      description: 'Ювелирная ажурная паутинка из тончайшей серебряной проволоки и экологичный русский северный лён.',
      originEra: 'X–XVI вв.'
    }
  },
  {
    code: '62',
    name: 'Рязанская область',
    shortName: 'Рязань',
    capital: 'Рязань',
    district: 'ЦФО',
    mapX: 23.5,
    mapY: 53.5,
    emblemEmoji: '🌾',
    culturalSymbol: {
      name: 'Скопинская керамика и Михайловское кружево',
      icon: '🏺',
      craftType: 'Народный промысел',
      description: 'Фигурная глазурованная керамика в виде сказочных птиц скоп и единственное в мире цветное кружево.',
      originEra: 'XVII в.'
    }
  },
  {
    code: '67',
    name: 'Смоленская область',
    shortName: 'Смоленск',
    capital: 'Смоленск',
    district: 'ЦФО',
    mapX: 17.5,
    mapY: 49.5,
    emblemEmoji: '🛡️',
    culturalSymbol: {
      name: 'Смоленский рожок и художественные вышивки Флёнова',
      icon: '🪈',
      craftType: 'Фольклорный символ',
      description: 'Народные музыкальные наигрыши на смоленском двойном рожке и этнографическое возрождение ремесел Тенишевой.',
      originEra: 'XIX в.'
    }
  },
  {
    code: '40',
    name: 'Калужская область',
    shortName: 'Калуга',
    capital: 'Калуга',
    district: 'ЦФО',
    mapX: 19.5,
    mapY: 52.0,
    emblemEmoji: '🚀',
    culturalSymbol: {
      name: 'Калужское цветное кружево (перевить) и калужское тесто',
      icon: '🥨',
      craftType: 'Гастрономический символ',
      description: 'Старинное медовое лакомство по рецепту XVI века и уникальная калужская вышивка перевитью.',
      originEra: 'XVI в.'
    }
  },
  {
    code: '57',
    name: 'Орловская область',
    shortName: 'Орёл',
    capital: 'Орёл',
    district: 'ЦФО',
    mapX: 19.0,
    mapY: 54.5,
    emblemEmoji: '🦅',
    culturalSymbol: {
      name: 'Орловский спис и ливенская гармошка',
      icon: '🪗',
      craftType: 'Музыкальный инструмент',
      description: 'Самобытная народная гармонь с необычайно длинными мехами и архаичная языческая вышивка «спис».',
      originEra: 'XIX в.'
    }
  },
  {
    code: '32',
    name: 'Брянская область',
    shortName: 'Брянск',
    capital: 'Брянск',
    district: 'ЦФО',
    mapX: 17.0,
    mapY: 53.5,
    emblemEmoji: '🌲',
    culturalSymbol: {
      name: 'Дятьковский хрусталь',
      icon: '💎',
      craftType: 'Народный промысел',
      description: 'Легендарный звонкий русский гранёный хрусталь, украшавший парадные залы Зимнего дворца.',
      originEra: '1790 г.'
    }
  },
  {
    code: '46',
    name: 'Курская область',
    shortName: 'Курск',
    capital: 'Курск',
    district: 'ЦФО',
    mapX: 18.2,
    mapY: 56.5,
    emblemEmoji: '🪖',
    culturalSymbol: {
      name: 'Кожлянская глиняная свистулька и курский соловей',
      icon: '🐦',
      craftType: 'Фольклорный символ',
      description: 'Знаменитый курский певчий соловей — природный символ русского мелодичного пения.',
      originEra: 'XVII в.'
    }
  },
  {
    code: '31',
    name: 'Белгородская область',
    shortName: 'Белгород',
    capital: 'Белгород',
    district: 'ЦФО',
    mapX: 18.5,
    mapY: 57.5,
    emblemEmoji: '⛰️',
    culturalSymbol: {
      name: 'Белгородский белый мел и старооскольская глиняная игрушка',
      icon: '🧸',
      craftType: 'Народный промысел',
      description: 'Светлые меловые горы и фигурки из местной пластичной глины.',
      originEra: 'XV в.'
    }
  },
  {
    code: '36',
    name: 'Воронежская область',
    shortName: 'Воронеж',
    capital: 'Воронеж',
    district: 'ЦФО',
    mapX: 21.0,
    mapY: 57.5,
    emblemEmoji: '🚢',
    culturalSymbol: {
      name: 'Воронежский традиционный народный костюм с понёвой',
      icon: '👗',
      craftType: 'Фольклорный символ',
      description: 'Один из самых ярких южнорусских нарядов с богатейшей вышивкой черной и алой шерстью.',
      originEra: 'XVI–XIX вв.'
    }
  },
  {
    code: '48',
    name: 'Липецкая область',
    shortName: 'Липецк',
    capital: 'Липецк',
    district: 'ЦФО',
    mapX: 21.8,
    mapY: 55.0,
    emblemEmoji: '🌳',
    culturalSymbol: {
      name: 'Елецкое кружево и романовская игрушка',
      icon: '❄️',
      craftType: 'Народный промысел',
      description: 'Невесомое коклюшечное кружево, завоевавшее гран-при Всемирных выставок в Париже и Брюсселе.',
      originEra: '1801 г.'
    }
  },
  {
    code: '68',
    name: 'Тамбовская область',
    shortName: 'Тамбов',
    capital: 'Тамбов',
    district: 'ЦФО',
    mapX: 23.6,
    mapY: 56.5,
    emblemEmoji: '🐺',
    culturalSymbol: {
      name: 'Фёдоровская гончарная керамика и тамбовский волк',
      icon: '🐺',
      craftType: 'Фольклорный символ',
      description: 'Образ благородного защитника лесов и старинный крестьянский гончарный промысел.',
      originEra: 'XVIII в.'
    }
  },

  // СЗФО (Северо-Запад)
  {
    code: '78',
    name: 'Санкт-Петербург',
    shortName: 'Санкт-Петербург',
    capital: 'Санкт-Петербург',
    district: 'СЗФО',
    mapX: 20.1,
    mapY: 42.0,
    emblemEmoji: '⚓',
    culturalSymbol: {
      name: 'Императорский фарфор «Кобальтовая сетка» и Медный всадник',
      icon: '☕',
      craftType: 'Народный промысел',
      description: 'Легендарный узор петербургского фарфора, созданный Дмитрием Виноградовым по указу Елизаветы Петровны.',
      originEra: '1744 г.'
    }
  },
  {
    code: '47',
    name: 'Ленинградская область',
    shortName: 'Ленобласть',
    capital: 'Гатчина',
    district: 'СЗФО',
    mapX: 19.0,
    mapY: 41.5,
    emblemEmoji: '🏰',
    culturalSymbol: {
      name: 'Волховская роспись по дереву и балтийская корюшка',
      icon: '🐟',
      craftType: 'Народный промысел',
      description: 'Традиционная золотистая роспись с зооморфными птицами сирин и весенний праздник корюшки.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '35',
    name: 'Вологодская область',
    shortName: 'Вологда',
    capital: 'Вологда',
    district: 'СЗФО',
    mapX: 24.4,
    mapY: 44.5,
    emblemEmoji: '🧈',
    culturalSymbol: {
      name: 'Вологодское коклюшечное кружево и вологодское масло',
      icon: '🧣',
      craftType: 'Народный промысел',
      description: 'Воздушные кружевные морозные узоры на коклюшках и ореховый вкус знаменитого сливочного масла Верещагина.',
      originEra: '1820 г.'
    }
  },
  {
    code: '10',
    name: 'Республика Карелия',
    shortName: 'Карелия',
    capital: 'Петрозаводск',
    district: 'СЗФО',
    mapX: 24.7,
    mapY: 38.6,
    emblemEmoji: '🌲',
    culturalSymbol: {
      name: 'Карельское кантеле, калитки и карельская берёза',
      icon: '🪕',
      craftType: 'Музыкальный инструмент',
      description: 'Старинный струнный щипковый инструмент рунопевцев Калевалы и перламутровый узор ценнейшей древесины.',
      originEra: 'Эпос «Калевала»'
    }
  },
  {
    code: '51',
    name: 'Мурманская область',
    shortName: 'Мурманск',
    capital: 'Мурманск',
    district: 'СЗФО',
    mapX: 29.0,
    mapY: 35.7,
    emblemEmoji: '✨',
    culturalSymbol: {
      name: 'Саамское бисерное шитьё по оленьему меху и пимы',
      icon: '❄️',
      craftType: 'Народный промысел',
      description: 'Традиционная одежда кольских саамов с яркой геометрической вышивкой бисером по замше.',
      originEra: 'Древность'
    }
  },
  {
    code: '29',
    name: 'Архангельская область',
    shortName: 'Архангельск',
    capital: 'Архангельск',
    district: 'СЗФО',
    mapX: 28.1,
    mapY: 42.7,
    emblemEmoji: '❄️',
    culturalSymbol: {
      name: 'Холмогорская резная кость, мезенская роспись и птица счастья',
      icon: '🕊️',
      craftType: 'Народный промысел',
      description: 'Тончайшая сквозная гравировка по моржовой и мамонтовой кости и деревянная щепная поморская птица счастья.',
      originEra: 'XVII в.'
    }
  },
  {
    code: '11',
    name: 'Республика Коми',
    shortName: 'Коми',
    capital: 'Сыктывкар',
    district: 'СЗФО',
    mapX: 33.0,
    mapY: 46.0,
    emblemEmoji: '🦌',
    culturalSymbol: {
      name: 'Пимы из оленьего камуса и узорное вязание коми',
      icon: '👢',
      craftType: 'Народный промысел',
      description: 'Тёплая национальная обувь северян с орнаментами «рога оленя» и «солнце».',
      originEra: 'Древность'
    }
  },
  {
    code: '53',
    name: 'Новгородская область',
    shortName: 'Великий Новгород',
    capital: 'Великий Новгород',
    district: 'СЗФО',
    mapX: 18.5,
    mapY: 44.5,
    emblemEmoji: '🔔',
    culturalSymbol: {
      name: 'Берестяные грамоты и новгородские звончатые гусли',
      icon: '📜',
      craftType: 'Музыкальный инструмент',
      description: 'Свидетельства поголовной грамотности древних новгородцев и пятиструнные гусли гусляра Садко.',
      originEra: 'XI–XII вв.'
    }
  },
  {
    code: '60',
    name: 'Псковская область',
    shortName: 'Псков',
    capital: 'Псков',
    district: 'СЗФО',
    mapX: 16.5,
    mapY: 46.0,
    emblemEmoji: '🛡️',
    culturalSymbol: {
      name: 'Псковский гончарный промысел и снетковый улов',
      icon: '🏺',
      craftType: 'Народный промысел',
      description: 'Чернолощёная псковская керамика с лощением кремнем и псковский золотой снеток.',
      originEra: 'XIV в.'
    }
  },
  {
    code: '39',
    name: 'Калининградская область',
    shortName: 'Калининград',
    capital: 'Калининград',
    district: 'СЗФО',
    mapX: 11.0,
    mapY: 55.5,
    emblemEmoji: '🌊',
    culturalSymbol: {
      name: 'Балтийский янтарь («Солнечный камень»)',
      icon: '✨',
      craftType: 'Народный промысел',
      description: 'Окаменевшая смола древних реликтовых сосен возрастом 50 миллионов лет, символ Балтики.',
      originEra: '50 млн лет'
    }
  },
  {
    code: '83',
    name: 'Ненецкий автономный округ',
    shortName: 'НАО',
    capital: 'Нарьян-Мар',
    district: 'СЗФО',
    mapX: 35.6,
    mapY: 42.3,
    emblemEmoji: '🦭',
    culturalSymbol: {
      name: 'Ненецкая малица и пояс с клыками моржа',
      icon: '🧥',
      craftType: 'Фольклорный символ',
      description: 'Традиционная глухая одежда из оленьих шкур с капюшоном и рукавицами, выдерживающая мороз до -60°C.',
      originEra: 'Древность'
    }
  },

  // ПФО (Поволжье)
  {
    code: '52',
    name: 'Нижегородская область',
    shortName: 'Нижний Новгород',
    capital: 'Нижний Новгород',
    district: 'ПФО',
    mapX: 27.4,
    mapY: 49.9,
    emblemEmoji: '🦌',
    culturalSymbol: {
      name: 'Золотая Хохлома и Семёновская матрёшка',
      icon: '🪆',
      craftType: 'Народный промысел',
      description: 'Огненная золотая роспись деревянной посуды без единой крупицы настоящего золота и классическая русская матрешка.',
      originEra: 'XVII в.'
    }
  },
  {
    code: '16',
    name: 'Республика Татарстан',
    shortName: 'Татарстан',
    capital: 'Казань',
    district: 'ПФО',
    mapX: 30.5,
    mapY: 51.9,
    emblemEmoji: '🐅',
    culturalSymbol: {
      name: 'Казанская кожаная мозаика (ичиги), тюбетейка и чак-чак',
      icon: '🍯',
      craftType: 'Народный промысел',
      description: 'Узорная кожаная обувь из разноцветного сафьяна со швом встык и национальное медовое угощение Сабантуя.',
      originEra: 'XVIII–XIX вв.'
    }
  },
  {
    code: '02',
    name: 'Республика Башкортостан',
    shortName: 'Башкортостан',
    capital: 'Уфа',
    district: 'ПФО',
    mapX: 32.8,
    mapY: 54.4,
    emblemEmoji: '🍯',
    culturalSymbol: {
      name: 'Башкирский курай и бортевой мёд диких пчёл',
      icon: '🪈',
      craftType: 'Музыкальный инструмент',
      description: 'Продольная флейта из стебля уральского реброплодника и чистейший целебный липовый мед.',
      originEra: 'Древнейший инструмент тюрок'
    }
  },
  {
    code: '56',
    name: 'Оренбургская область',
    shortName: 'Оренбург',
    capital: 'Оренбург',
    district: 'ПФО',
    mapX: 32.9,
    mapY: 58.9,
    emblemEmoji: '🧣',
    culturalSymbol: {
      name: 'Оренбургский пуховый платок («Паутинка»)',
      icon: '🧣',
      craftType: 'Народный промысел',
      description: 'Вязаный ажурный платок из тончайшего пуха местных коз, который свободно проходит сквозь обручальное кольцо.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '43',
    name: 'Кировская область',
    shortName: 'Киров (Вятка)',
    capital: 'Киров',
    district: 'ПФО',
    mapX: 29.0,
    mapY: 46.5,
    emblemEmoji: '🎨',
    culturalSymbol: {
      name: 'Дымковская расписная глиняная игрушка',
      icon: '🐎',
      craftType: 'Народный промысел',
      description: 'Яркие нарядные глиняные фигурки индюков, барышень и коней с росписью по мелу и листочками сусального золота.',
      originEra: 'XV–XVI вв.'
    }
  },
  {
    code: '63',
    name: 'Самарская область',
    shortName: 'Самара',
    capital: 'Самара',
    district: 'ПФО',
    mapX: 28.5,
    mapY: 56.5,
    emblemEmoji: '🚀',
    culturalSymbol: {
      name: 'Сызранский помидор и жигулёвские волжские сказания',
      icon: '🍅',
      craftType: 'Фольклорный символ',
      description: 'Знаменитый сладкий сорт томатов и легенды атамана Степана Разина о Жигулевских утесах.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '59',
    name: 'Пермский край',
    shortName: 'Пермь',
    capital: 'Пермь',
    district: 'ПФО',
    mapX: 33.5,
    mapY: 48.0,
    emblemEmoji: '🐻',
    culturalSymbol: {
      name: 'Пермский звериный стиль и пермская деревянная скульптура',
      icon: '🐻',
      craftType: 'Святыня и реликвия',
      description: 'Бронзовые амулеты человеко-лосей и шаманов эпохи раннего железа и «Пермские деревянные боги».',
      originEra: 'VII в. до н.э. / XVII в.'
    }
  },
  {
    code: '64',
    name: 'Саратовская область',
    shortName: 'Саратов',
    capital: 'Саратов',
    district: 'ПФО',
    mapX: 27.7,
    mapY: 57.1,
    emblemEmoji: '🌉',
    culturalSymbol: {
      name: 'Саратовская гармоника с колокольчиками',
      icon: '🪗',
      craftType: 'Музыкальный инструмент',
      description: 'Особый тембр со встроенными серебряными колокольчиками, звучащий на всю Волгу.',
      originEra: '1860-е гг.'
    }
  },
  {
    code: '18',
    name: 'Удмуртская Республика',
    shortName: 'Удмуртия',
    capital: 'Ижевск',
    district: 'ПФО',
    mapX: 31.8,
    mapY: 50.5,
    emblemEmoji: '⚙️',
    culturalSymbol: {
      name: 'Удмуртские перепечи и оберег Мудор',
      icon: '🥟',
      craftType: 'Гастрономический символ',
      description: 'Хрустящие открытые ржаные ватрушки из печи с сочной начинкой и солярный восьмиконечный знак счастья.',
      originEra: 'Древность'
    }
  },
  {
    code: '21',
    name: 'Чувашская Республика',
    shortName: 'Чувашия',
    capital: 'Чебоксары',
    district: 'ПФО',
    mapX: 27.5,
    mapY: 51.0,
    emblemEmoji: '🌞',
    culturalSymbol: {
      name: 'Чувашская счётная вышивка и головной убор тухья',
      icon: '👑',
      craftType: 'Народный промысел',
      description: 'Двусторонняя ювелирная геометрическая вышивка шелком и девичий шлемовидный убор с серебряными монетами.',
      originEra: 'Древность'
    }
  },
  {
    code: '12',
    name: 'Республика Марий Эл',
    shortName: 'Марий Эл',
    capital: 'Йошкар-Ола',
    district: 'ПФО',
    mapX: 28.0,
    mapY: 48.8,
    emblemEmoji: '🏰',
    culturalSymbol: {
      name: 'Марийские гусли (кюсле) и вышивка тамбуром',
      icon: '🪕',
      craftType: 'Музыкальный инструмент',
      description: 'Крыловидные священные гусли, под звуки которых в священных рощах проводились древние моления.',
      originEra: 'Древность'
    }
  },
  {
    code: '13',
    name: 'Республика Мордовия',
    shortName: 'Мордовия',
    capital: 'Саранск',
    district: 'ПФО',
    mapX: 25.5,
    mapY: 53.0,
    emblemEmoji: '🦊',
    culturalSymbol: {
      name: 'Тавлинская резная деревянная игрушка',
      icon: '🐴',
      craftType: 'Народный промысел',
      description: 'Колоритные скульптурные фигурки из липы с добрым народным юмором эрзянских и мокшанских мастеров.',
      originEra: '1970-е гг.'
    }
  },

  // УФО (Урал)
  {
    code: '66',
    name: 'Свердловская область',
    shortName: 'Екатеринбург',
    capital: 'Екатеринбург',
    district: 'УФО',
    mapX: 37.5,
    mapY: 49.5,
    emblemEmoji: '💎',
    culturalSymbol: {
      name: 'Уральский малахит и сказы Бажова о Хозяйке Медной горы',
      icon: '💎',
      craftType: 'Фольклорный символ',
      description: 'Изумрудно-зеленый узорчатый камень, воплощенный в Малахитовой шкатулке и Каменном цветке.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '74',
    name: 'Челябинская область',
    shortName: 'Челябинск',
    capital: 'Челябинск',
    district: 'УФО',
    mapX: 36.3,
    mapY: 57.5,
    emblemEmoji: '🐪',
    culturalSymbol: {
      name: 'Каслинское чугунное литьё и Златоустовская гравюра на стали',
      icon: '🗡️',
      craftType: 'Народный промысел',
      description: 'Бархатистый чёрный чугун тончайшей отливки и филигранная золочёная гравюра на клинках.',
      originEra: '1815 г.'
    }
  },
  {
    code: '72',
    name: 'Тюменская область',
    shortName: 'Тюмень',
    capital: 'Тюмень',
    district: 'УФО',
    mapX: 38.8,
    mapY: 52.7,
    emblemEmoji: '♨️',
    culturalSymbol: {
      name: 'Тобольская резная кость и сибирский ковёр',
      icon: '🦌',
      craftType: 'Народный промысел',
      description: 'Скульптурная миниатюра из бивня мамонта и шерстяные сибирские ковры с яркими розами на черном фоне.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '86',
    name: 'Ханты-Мансийский АО — Югра',
    shortName: 'Югра',
    capital: 'Ханты-Мансийск',
    district: 'УФО',
    mapX: 42.7,
    mapY: 47.8,
    emblemEmoji: '🛢️',
    culturalSymbol: {
      name: 'Орнамент «Заячьи ушки» и берестяная посуда хантов',
      icon: '🪵',
      craftType: 'Народный промысел',
      description: 'Тиснение по бересте соком лиственницы и священные амулеты медвежьего праздника.',
      originEra: 'Древность'
    }
  },
  {
    code: '89',
    name: 'Ямало-Ненецкий АО',
    shortName: 'Ямал',
    capital: 'Салехард',
    district: 'УФО',
    mapX: 42.0,
    mapY: 43.5,
    emblemEmoji: '🦌',
    culturalSymbol: {
      name: 'Олений нарты, ягушка и костяной нож северян',
      icon: '🛷',
      craftType: 'Фольклорный символ',
      description: 'Легкие и прочные нарты для тундры без металлических гвоздей и женская распашная шуба из пыжика.',
      originEra: 'Древность'
    }
  },

  // ЮФО & СКФО (Юг и Кавказ)
  {
    code: '23',
    name: 'Краснодарский край',
    shortName: 'Кубань',
    capital: 'Краснодар',
    district: 'ЮФО',
    mapX: 14.0,
    mapY: 59.7,
    emblemEmoji: '🏖️',
    culturalSymbol: {
      name: 'Кубанская казачья черкеска с газырями и кубанский борщ',
      icon: '🐎',
      craftType: 'Фольклорный символ',
      description: 'Символ вольного доблестного казачества, степных песен и южного хлебосольства.',
      originEra: 'XVIII в.'
    }
  },
  {
    code: '82',
    name: 'Республика Крым',
    shortName: 'Крым',
    capital: 'Симферополь',
    district: 'ЮФО',
    mapX: 12.0,
    mapY: 56.8,
    emblemEmoji: '🏰',
    culturalSymbol: {
      name: 'Крымская филигрань и можжевеловые сувениры',
      icon: '🌿',
      craftType: 'Народный промысел',
      description: 'Ароматные изделия из реликтового крымского можжевельника и ювелирная скань.',
      originEra: 'Древность'
    }
  },
  {
    code: '05',
    name: 'Республика Дагестан',
    shortName: 'Дагестан',
    capital: 'Махачкала',
    district: 'СКФО',
    mapX: 18.1,
    mapY: 61.9,
    emblemEmoji: '🦅',
    culturalSymbol: {
      name: 'Кубачинское чеканное серебро, балхарская керамика и табасаранские ковры',
      icon: '🗡️',
      craftType: 'Народный промысел',
      description: 'Знаменитые кинжалы с чернью и гравировкой и шерстяные узелковые ковры, сохраняющие краски 300 лет.',
      originEra: 'Средневековье'
    }
  },
  {
    code: '08',
    name: 'Республика Калмыкия',
    shortName: 'Калмыкия',
    capital: 'Элиста',
    district: 'ЮФО',
    mapX: 24.5,
    mapY: 60.2,
    emblemEmoji: '🪷',
    culturalSymbol: {
      name: 'Калмыцкий домбр, лотос и чай джомба',
      icon: '🪷',
      craftType: 'Музыкальный инструмент',
      description: 'Двухструнный инструмент джангарчи и традиционный степной чай с молоком, солью и маслом.',
      originEra: 'Эпос «Джангар»'
    }
  },
  {
    code: '20',
    name: 'Чеченская Республика',
    shortName: 'Чечня',
    capital: 'Грозный',
    district: 'СКФО',
    mapX: 17.6,
    mapY: 61.9,
    emblemEmoji: '🕌',
    culturalSymbol: {
      name: 'Вайнахский войлочный ковёр истаннг и боевая башня',
      icon: '🏰',
      craftType: 'Народный промысел',
      description: 'Узорный цветной войлок с солярными орнаментами и родовые башенные твердыни в горах.',
      originEra: 'Средневековье'
    }
  },
  {
    code: '07',
    name: 'Кабардино-Балкария',
    shortName: 'КБР',
    capital: 'Нальчик',
    district: 'СКФО',
    mapX: 15.5,
    mapY: 61.9,
    emblemEmoji: '🏔️',
    culturalSymbol: {
      name: 'Нартские сказания и золотое шитьё адыгов',
      icon: '👑',
      craftType: 'Фольклорный символ',
      description: 'Богатырский нартский эпос и старинное искусство украшения праздничных платьев сае.',
      originEra: 'Древность'
    }
  },
  {
    code: '15',
    name: 'Северная Осетия — Алания',
    shortName: 'Алания',
    capital: 'Владикавказ',
    district: 'СКФО',
    mapX: 15.9,
    mapY: 62.2,
    emblemEmoji: '🐆',
    culturalSymbol: {
      name: 'Три осетинских пирога и осетинское пиво',
      icon: '🥧',
      craftType: 'Гастрономический символ',
      description: 'Сакральное триединство Солнца, Земли и Воды в традиционной ритуальной выпечке с осетинским сыром.',
      originEra: 'Скифо-сарматские истоки'
    }
  },

  // СФО (Сибирь)
  {
    code: '38',
    name: 'Иркутская область',
    shortName: 'Приангарье / Байкал',
    capital: 'Иркутск',
    district: 'СФО',
    mapX: 57.7,
    mapY: 61.8,
    emblemEmoji: '🌊',
    culturalSymbol: {
      name: 'Байкальская нерпа, омуль и кедровый орех',
      icon: '🦭',
      craftType: 'Природный символ',
      description: 'Единственный в мире пресноводный тюлень и таёжные кедровые шишки — символы сибирского здоровья.',
      originEra: 'Природа Байкала'
    }
  },
  {
    code: '04',
    name: 'Республика Алтай',
    shortName: 'Горный Алтай',
    capital: 'Горно-Алтайск',
    district: 'СФО',
    mapX: 42.8,
    mapY: 66.4,
    emblemEmoji: '🏔️',
    culturalSymbol: {
      name: 'Алтайский топшуур, комус и кедровый амулет',
      icon: '🪕',
      craftType: 'Музыкальный инструмент',
      description: 'Двухструнный щипковый инструмент кайчи (сказителей) и священный кедр горного Алтая.',
      originEra: 'Древность'
    }
  },
  {
    code: '24',
    name: 'Красноярский край',
    shortName: 'Красноярье',
    capital: 'Красноярск',
    district: 'СФО',
    mapX: 51.7,
    mapY: 50.6,
    emblemEmoji: '⛰️',
    culturalSymbol: {
      name: 'Таймырская кость мамонта и сибирский кедр',
      icon: '🌲',
      craftType: 'Народный промысел',
      description: 'Резьба по ископаемому бивню мамонта из вечной мерзлоты и сибирская кедровая посуда.',
      originEra: 'Древность'
    }
  },
  {
    code: '17',
    name: 'Республика Тыва',
    shortName: 'Тыва',
    capital: 'Кызыл',
    district: 'СФО',
    mapX: 50.8,
    mapY: 68.9,
    emblemEmoji: '🏕️',
    culturalSymbol: {
      name: 'Тувинский хоомей (горловое пение), игил и резьба по агальматолиту',
      icon: '🎤',
      craftType: 'Фольклорный символ',
      description: 'Феноменальное двухголосое пение человека и миниатюрные фигурки животных из мягкого камня чонгурак.',
      originEra: 'Древность'
    }
  },
  {
    code: '03',
    name: 'Республика Бурятия',
    shortName: 'Бурятия',
    capital: 'Улан-Удэ',
    district: 'ДФО',
    mapX: 60.5,
    mapY: 65.4,
    emblemEmoji: '🪷',
    culturalSymbol: {
      name: 'Бурятские буузы (позы), морин хуур и войлочная юрта',
      icon: '🥟',
      craftType: 'Музыкальный инструмент',
      description: 'Смычковый инструмент с резной головой коня, сочные позы с 33 защипами и традиционное кочевое жилище.',
      originEra: 'Древность'
    }
  },

  // ДФО (Дальний Восток)
  {
    code: '14',
    name: 'Республика Саха (Якутия)',
    shortName: 'Якутия',
    capital: 'Якутск',
    district: 'ДФО',
    mapX: 66.7,
    mapY: 46.8,
    emblemEmoji: '💎',
    culturalSymbol: {
      name: 'Якутский хомус (варган), чорон и серебряный илин кэбиhэр',
      icon: '🎵',
      craftType: 'Музыкальный инструмент',
      description: 'Металлический варган с космическим звучанием, резной кубок чорон для кумыса и нагрудные обереги невест.',
      originEra: 'Эпос «Олонхо»'
    }
  },
  {
    code: '41',
    name: 'Камчатский край',
    shortName: 'Камчатка',
    capital: 'Петропавловск-Камчатский',
    district: 'ДФО',
    mapX: 84.9,
    mapY: 41.3,
    emblemEmoji: '🌋',
    culturalSymbol: {
      name: 'Пеликен (талисман счастья), ворон Кутх и камчатский краб',
      icon: '🦀',
      craftType: 'Фольклорный символ',
      description: 'Пузатый улыбающийся божок из оленьего рога, приносящий удачу, и легендарный ворон-создатель Камчатки.',
      originEra: 'Фольклор ительменов и коряков'
    }
  },
  {
    code: '87',
    name: 'Чукотский автономный округ',
    shortName: 'Чукотка',
    capital: 'Анадырь',
    district: 'ДФО',
    mapX: 80.4,
    mapY: 30.5,
    emblemEmoji: '🐋',
    culturalSymbol: {
      name: 'Чукотская резная кость по клыку моржа и кухлянка',
      icon: '🐋',
      craftType: 'Народный промысел',
      description: 'Гравированные сцены охоты на китов по моржовому клыку уэленских мастеров и теплая меховая рубаха.',
      originEra: 'Древность'
    }
  },
  {
    code: '25',
    name: 'Приморский край',
    shortName: 'Владивосток',
    capital: 'Владивосток',
    district: 'ДФО',
    mapX: 80.8,
    mapY: 68.1,
    emblemEmoji: '🐯',
    culturalSymbol: {
      name: 'Амурский тигр и корень женьшеня («Корень жизни»)',
      icon: '🐯',
      craftType: 'Природный символ',
      description: 'Царственный полосатый владыка тайги и реликтовый женьшень уссурийских сопок.',
      originEra: 'Природа Дальнего Востока'
    }
  },
  {
    code: '65',
    name: 'Сахалинская область',
    shortName: 'Сахалин и Курилы',
    capital: 'Южно-Сахалинск',
    district: 'ДФО',
    mapX: 77.3,
    mapY: 65.3,
    emblemEmoji: '🦀',
    culturalSymbol: {
      name: 'Нивхские орнаменты по рыбьей коже и бересте',
      icon: '🐟',
      craftType: 'Народный промысел',
      description: 'Уникальное мастерство выделки и шитья одежды из кожи кеты и тайменя коренных народов Амура и Сахалина.',
      originEra: 'Древность'
    }
  },
];

export const REGIONS_BY_CODE = new Map<string, RegionInfo>(
  REGIONS_DATA.map((r) => [r.code, r])
);
