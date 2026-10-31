import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Trophy, ArrowRight, X, Dices, Shuffle } from 'lucide-react';
import { ALL_PUZZLES } from '../data/puzzlesCatalog';
import { FEDERAL_DISTRICTS } from '../data/regionsData';
import { FederalDistrict, PuzzleItem } from '../types/puzzle';

interface CatalogViewProps {
  theme: 'light' | 'dark';
  completedPuzzleIds: Set<number>;
  onSelectPuzzle: (puzzleId: number) => void;
  onClose: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  theme,
  completedPuzzleIds,
  onSelectPuzzle,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState<FederalDistrict | 'ALL'>('ALL');
  const [filterDone, setFilterDone] = useState<'ALL' | 'DONE' | 'TODO'>('ALL');
  const [isShuffled, setIsShuffled] = useState(true);

  const isDark = theme === 'dark';

  const filteredPuzzles = useMemo(() => {
    let list = ALL_PUZZLES.filter((p) => {
      const matchDistrict = district === 'ALL' || p.federalDistrict === district;
      const isDone = completedPuzzleIds.has(p.id);
      const matchStatus =
        filterDone === 'ALL' ||
        (filterDone === 'DONE' && isDone) ||
        (filterDone === 'TODO' && !isDone);

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subjectName.toLowerCase().includes(q) ||
        p.regionCode.includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchDistrict && matchStatus && matchSearch;
    });

    if (isShuffled && !search) {
      // Deterministic but shuffled mix across regions
      list = [...list].sort((a, b) => ((a.id * 37) % 200) - ((b.id * 37) % 200));
    }

    return list;
  }, [district, filterDone, search, completedPuzzleIds, isShuffled]);

  const handlePickRandom = () => {
    const uncompleted = ALL_PUZZLES.filter((p) => !completedPuzzleIds.has(p.id));
    const pool = uncompleted.length > 0 ? uncompleted : ALL_PUZZLES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    onSelectPuzzle(random.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-5xl h-[90vh] border rounded-3xl shadow-2xl flex flex-col overflow-hidden ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white'
            : 'bg-white border-slate-300 text-black'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black dark:text-white">
                Каталог 200 пазлов России
              </h2>
              <p className="text-xs text-black dark:text-slate-300 font-bold">
                Собрано: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{completedPuzzleIds.size}</strong> из 200 достопримечательностей
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePickRandom}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition"
              title="Выбрать случайный пазл"
            >
              <Dices className="w-4 h-4" /> Случайный пазл
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition font-bold ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-black border border-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div
          className={`p-3 sm:p-4 border-b flex flex-wrap gap-2.5 items-center justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          {/* Federal District Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-full">
            <button
              onClick={() => setDistrict('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition ${
                district === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Все округа
            </button>
            {FEDERAL_DISTRICTS.map((d) => (
              <button
                key={d.code}
                onClick={() => setDistrict(d.code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  district === d.code
                    ? isDark
                      ? 'bg-white text-slate-900 font-black shadow'
                      : 'bg-blue-600 text-white font-black shadow'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-black hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Search & Completion status toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-black absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск или код (77, 16...)"
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-50 border-slate-400 text-black placeholder-slate-600'
                }`}
              />
            </div>

            <div
              className={`flex items-center p-0.5 rounded-xl border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                onClick={() => setFilterDone('ALL')}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  filterDone === 'ALL'
                    ? isDark
                      ? 'bg-slate-700 text-white font-black'
                      : 'bg-white text-black font-black shadow-sm'
                    : 'text-black dark:text-slate-300'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterDone('DONE')}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  filterDone === 'DONE' ? 'bg-emerald-600 text-white font-black' : 'text-black dark:text-slate-300'
                }`}
              >
                Собрано
              </button>
              <button
                onClick={() => setFilterDone('TODO')}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  filterDone === 'TODO' ? 'bg-blue-600 text-white font-black' : 'text-black dark:text-slate-300'
                }`}
              >
                Новые
              </button>
            </div>
          </div>
        </div>

        {/* Puzzle Cards Grid */}
        <div
          className={`flex-1 p-3 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 ${
            isDark ? 'bg-slate-900' : 'bg-slate-50/50'
          }`}
        >
          {filteredPuzzles.map((puzzle) => {
            const isDone = completedPuzzleIds.has(puzzle.id);
            return (
              <div
                key={puzzle.id}
                onClick={() => {
                  onSelectPuzzle(puzzle.id);
                  onClose();
                }}
                className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 hover:border-blue-500'
                    : 'bg-white hover:bg-blue-50/30 border-slate-300 hover:border-blue-500'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative h-36 bg-slate-950 overflow-hidden">
                  <img
                    src={puzzle.imageUrl}
                    alt={puzzle.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Russian Plate Badge on top right */}
                  <div className="absolute top-2 right-2 flex items-center border border-black bg-slate-50 text-black rounded px-1.5 py-0.5 shadow font-mono font-black text-xs">
                    <span>{puzzle.regionCode}</span>
                    <span className="ml-1 pl-1 border-l border-black text-[8px] font-sans font-black">RUS</span>
                  </div>

                  {/* Level Number & District */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono font-bold text-sky-400 border border-slate-700">
                      #{puzzle.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-300">
                      {puzzle.federalDistrict}
                    </span>
                  </div>

                  {/* Completed overlay stamp */}
                  {isDone && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                      ✓ Собрано
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                      {puzzle.subjectName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 mt-0.5 leading-snug">
                      {puzzle.title}
                    </h4>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-black dark:text-slate-300 font-bold">
                    <span>{puzzle.category}</span>
                    <span className="text-blue-800 dark:text-blue-400 font-black group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                      Собрать <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
