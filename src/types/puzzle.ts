export type Difficulty = 'easy' | 'medium' | 'hard';

export type FederalDistrict = 
  | 'ЦФО' 
  | 'СЗФО' 
  | 'ЮФО' 
  | 'СКФО' 
  | 'ПФО' 
  | 'УФО' 
  | 'СФО' 
  | 'ДФО';

export interface DistrictMeta {
  code: FederalDistrict;
  name: string;
  fullName: string;
  color: string;
  badgeBg: string;
  count: number;
}

export interface CulturalSymbol {
  name: string;
  icon: string;
  craftType: 'Народный промысел' | 'Святыня и реликвия' | 'Фольклорный символ' | 'Музыкальный инструмент' | 'Гастрономический символ' | 'Природный символ' | 'Природное сокровище';
  description: string;
  originEra?: string;
}

export interface RegionInfo {
  code: string; // e.g. "77", "78", "16", "23"
  name: string; // "Москва", "Республика Татарстан", "Краснодарский край"
  shortName: string;
  capital: string;
  district: FederalDistrict;
  mapX: number; // percentage on Russia interactive map
  mapY: number; // percentage on Russia interactive map
  puzzlesCount?: number;
  emblemEmoji?: string;
  culturalSymbol?: CulturalSymbol;
}

export interface PuzzleItem {
  id: number;
  regionCode: string;
  subjectName: string;
  federalDistrict: FederalDistrict;
  title: string;
  category: 'Культурные символы' | 'Народные промыслы' | 'Архитектура' | 'Природа' | 'История' | 'Крепости' | 'Святыни' | 'Инженерия';
  imageUrl: string;
  era: string;
  facts: string[];
  sights: string[];
  trivia: string;
  accentColor?: string;
  culturalSymbol?: CulturalSymbol;
}

export interface PuzzlePiece {
  id: number;
  gridX: number;
  gridY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  width: number;
  height: number;
  tabs: {
    top: number;    // 0: flat edge, 1: outward tab, -1: inward blank
    right: number;
    bottom: number;
    left: number;
  };
  pathD: string;
  viewBox: string;
  isSnapped: boolean;
  isEdge: boolean;
  zIndex: number;
  rotation?: number;
}

export interface PuzzleSaveRecord {
  completedAt: string;
  bestTimeSec: number;
  moves: number;
  stars: number;
  difficulty: Difficulty;
}

export interface UserStats {
  completedCount: number;
  totalTimeSec: number;
  hintsUsed: number;
  favorites: number[];
}
