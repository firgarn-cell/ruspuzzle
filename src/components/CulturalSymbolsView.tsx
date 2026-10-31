import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Play, CheckCircle2, 
  MapPin, BookOpen, X, Award
} from 'lucide-react';
import { CULTURAL_SYMBOLS_DATA, DetailedCulturalSymbol } from '../data/culturalSymbolsData';

interface CulturalSymbolsViewProps {
  theme: 'light' | 'dark';
  completedPuzzleIds: Set<number>;
  onSelectPuzzle: (puzzleId: number) => void;
  onClose: () => void;
}

export const CulturalSymbolsView: React.FC<CulturalSymbolsViewProps> = ({
  theme,
  completedPuzzleIds,
  onSelectPuzzle,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSymbolModal, setSelectedSymbolModal] = useState<DetailedCulturalSymbol | null>(null);

  // Custom user uploaded craft images stored in localStorage (if any were uploaded)
  const [customImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('russia_puzzles_custom_images');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const isDark = theme === 'dark';

  const categories = [
    { id: 'ALL', label: 'Все символы', icon: '🇷🇺' },
    { id: 'Народный промысел', label: 'Народные промыслы', icon: '🎨' },
    { id: 'Музыкальный инструмент', label: 'Музыкальные инструменты', icon: '🪕' },
    { id: 'Святыня и реликвия', label: 'Святыни и реликвии', icon: '👑' },
    { id: 'Фольклорный символ', label: 'Фольклор и традиции', icon: '🪆' },
    { id: 'Природное сокровище', label: 'Природные сокровища', icon: '💎' },
  ];

  const filteredSymbols = useMemo(() => {
    return CULTURAL_SYMBOLS_DATA.filter((item) => {
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.regionName.toLowerCase().includes(q) ||
        item.regionCode.includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const solvedCount = useMemo(() => {
    return CULTURAL_SYMBOLS_DATA.filter((s) => completedPuzzleIds.has(s.puzzleId)).length;
  }, [completedPuzzleIds]);

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'
      }`}
    >
      {/* Top Header Banner */}
      <div
        className={`p-4 sm:p-6 border-b flex flex-wrap items-center justify-between gap-4 shadow-sm z-20 ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-slate-800'
            : 'bg-gradient-to-r from-blue-50/80 via-white to-amber-50/60 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl">
            🪆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-700 dark:text-sky-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Сокровищница культуры
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-black dark:text-amber-400 border border-amber-500/40">
                {CULTURAL_SYMBOLS_DATA.length} символов
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-black dark:text-white flex items-center gap-2">
              Культурные символы и промыслы России
            </h2>
          </div>
        </div>

        {/* Progress & Close */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300 text-black'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-black dark:text-slate-300">Собрано символов:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-black font-mono">
              {solvedCount}/{CULTURAL_SYMBOLS_DATA.length}
            </strong>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition border flex items-center gap-1.5 text-xs font-bold ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                : 'bg-white hover:bg-slate-100 text-black border-slate-300'
            }`}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">К карте</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-300'
        }`}
      >
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск символа, промысла, региона..."
            className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                : 'bg-slate-50 border-slate-400 text-black placeholder-slate-600'
            }`}
          />
        </div>
      </div>

      {/* Grid of Cultural Symbols */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSymbols.map((item) => {
            const isSolved = completedPuzzleIds.has(item.puzzleId);
            const customImg = customImages[item.id] || customImages[`puzzle_${item.puzzleId}`];
            const displayImg = customImg || item.imageUrl;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                className={`flex flex-col rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-300 hover:border-blue-400'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={displayImg}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Category Pill Top Left */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-black text-white border border-white/20 flex items-center gap-1">
                      <span>{item.icon}</span> {item.category}
                    </span>
                  </div>

                  {/* Official Region Plate Top Right */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <div className="flex items-center border border-black bg-white text-black rounded px-1.5 py-0.5 shadow-sm font-mono font-black text-xs">
                      <span>{item.regionCode}</span>
                      <span className="ml-1 pl-1 border-l border-black text-[8px] font-sans font-black text-black">
                        RUS
                      </span>
                    </div>
                  </div>

                  {/* Solved Badge */}
                  {isSolved && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" /> Собрано
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-2.5 left-3 right-16">
                    <h3 className="text-white font-black text-sm drop-shadow-md leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    {/* Region and Era */}
                    <div className="flex items-center justify-between text-[11px] text-black dark:text-slate-300">
                      <span className="flex items-center gap-1 font-black truncate text-blue-800 dark:text-sky-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {item.regionName}
                      </span>
                      <span className="shrink-0 text-[10px] font-mono font-bold">{item.originEra}</span>
                    </div>

                    <p className="text-xs text-black dark:text-slate-200 mt-2 line-clamp-2 leading-relaxed font-bold">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSymbolModal(item)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-black border border-slate-300'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" /> История
                    </button>

                    <button
                      onClick={() => onSelectPuzzle(item.puzzleId)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Пазл
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal for Cultural Symbol */}
      <AnimatePresence>
        {selectedSymbolModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
              }`}
            >
              {/* Modal Image Header */}
              <div className="relative h-60 bg-slate-950">
                <img
                  src={customImages[selectedSymbolModal.id] || customImages[`puzzle_${selectedSymbolModal.puzzleId}`] || selectedSymbolModal.imageUrl}
                  alt={selectedSymbolModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSymbolModal(null)}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{selectedSymbolModal.icon}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-600">
                      {selectedSymbolModal.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {selectedSymbolModal.originEra}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black drop-shadow-md">
                    {selectedSymbolModal.name}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Region Code Tag */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs">
                  <span className="font-black text-black dark:text-sky-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-700" /> {selectedSymbolModal.regionName} ({selectedSymbolModal.federalDistrict})
                  </span>
                  <div className="flex items-center border border-black bg-white text-black rounded px-2 py-0.5 font-mono font-black">
                    <span>{selectedSymbolModal.regionCode}</span>
                    <span className="ml-1 pl-1 border-l border-black text-[9px] font-sans font-black text-black">RUS</span>
                  </div>
                </div>

                {/* History Section */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" /> История и истоки
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-black dark:text-slate-100 font-medium">
                    {selectedSymbolModal.history}
                  </p>
                </div>

                {/* Craft Secret */}
                <div
                  className={`p-3.5 rounded-2xl border space-y-1.5 ${
                    isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50/80 border-amber-300'
                  }`}
                >
                  <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Секрет мастерства и технология
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-black dark:text-slate-100 font-medium">
                    {selectedSymbolModal.craftSecret}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`p-4 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <button
                  onClick={() => setSelectedSymbolModal(null)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-black border border-slate-300'
                  }`}
                >
                  Закрыть
                </button>

                <button
                  onClick={() => {
                    const pid = selectedSymbolModal.puzzleId;
                    setSelectedSymbolModal(null);
                    onSelectPuzzle(pid);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/30 transition flex items-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" /> Собрать пазл символа
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
