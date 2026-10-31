import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Trophy, Clock, Move, ArrowRight, RotateCcw, Map, Sparkles, Building2, MapPin, Dices } from 'lucide-react';
import { PuzzleItem, Difficulty } from '../types/puzzle';
import { REGIONS_DATA } from '../data/regionsData';
import { soundManager } from '../utils/audio';

interface FactModalProps {
  theme: 'light' | 'dark';
  puzzle: PuzzleItem;
  difficulty: Difficulty;
  timeSec: number;
  movesCount: number;
  onNextPuzzle: () => void;
  onRandomPuzzle?: () => void;
  onReplay: () => void;
  onBackToMenu: () => void;
}

export const FactModal: React.FC<FactModalProps> = ({
  theme,
  puzzle,
  difficulty,
  timeSec,
  movesCount,
  onNextPuzzle,
  onRandomPuzzle,
  onReplay,
  onBackToMenu,
}) => {
  const isDark = theme === 'dark';

  useEffect(() => {
    soundManager.playVictory();

    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white'
            : 'bg-white border-slate-300 text-black'
        }`}
      >
        {/* Top Header Banner with Official Region Plate */}
        <div
          className={`p-5 sm:p-6 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark
              ? 'bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-950/40 border-slate-800'
              : 'bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Пазл успешно собран!
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black leading-tight text-black dark:text-white">
                {puzzle.subjectName}
              </h2>
            </div>
          </div>

          {/* Official Automotive Region Plate Badge */}
          <div className="flex items-center border-2 border-black bg-slate-50 text-black rounded-lg px-3 py-1 shadow-md font-mono font-black text-xl tracking-tight select-none">
            <span>{puzzle.regionCode}</span>
            <div className="ml-2 pl-2 border-l border-black text-[10px] flex flex-col leading-tight font-sans font-black text-black">
              <span>RUS</span>
              <span className="text-xs">🇷🇺</span>
            </div>
          </div>
        </div>

        {/* Assembled Picture & Stats */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-300 dark:border-slate-700/80 group">
            <img
              src={puzzle.imageUrl}
              alt={puzzle.title}
              className="w-full h-52 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
              <div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-sm">
                  {puzzle.category} • {puzzle.era}
                </span>
                <h3 className="text-base sm:text-xl font-bold mt-1 drop-shadow-md">
                  {puzzle.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Score & Stats Pill */}
          <div
            className={`grid grid-cols-3 gap-2.5 p-3 rounded-2xl border text-center ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/60'
                : 'bg-slate-50 border-slate-300 text-black'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-black dark:text-slate-300 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" /> Время
              </span>
              <strong className="text-sm sm:text-base font-black font-mono mt-0.5 text-black dark:text-white">
                {formatTime(timeSec)}
              </strong>
            </div>

            <div className="flex flex-col items-center border-x border-slate-300 dark:border-slate-700">
              <span className="text-[11px] text-black dark:text-slate-300 font-bold flex items-center gap-1">
                <Move className="w-3.5 h-3.5 text-amber-600" /> Ходы
              </span>
              <strong className="text-sm sm:text-base font-black font-mono mt-0.5 text-black dark:text-white">
                {movesCount}
              </strong>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-black dark:text-slate-300 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-emerald-600" /> Оценка
              </span>
              <div className="flex items-center gap-0.5 mt-0.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
          </div>

          {/* Historical Facts & Lore Section */}
          <div
            className={`p-4 rounded-2xl border space-y-2.5 ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/60'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-blue-700 dark:text-sky-400">
              <Building2 className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-sky-300">Исторические факты</h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm leading-relaxed text-black dark:text-slate-100 font-medium">
              {puzzle.facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 mt-1.5 shrink-0" />
                  <span className="text-black dark:text-slate-100">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Attractions & Trivia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-black dark:text-emerald-400 font-black mb-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Достопримечательности:
              </div>
              <ul className="space-y-1.5 text-black dark:text-slate-200 font-bold">
                {puzzle.sights.map((sight, idx) => (
                  <li key={idx} className="truncate">• {sight}</li>
                ))}
              </ul>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-black dark:text-amber-400 font-black mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Интересный факт:
                </div>
                <p className="text-black dark:text-slate-200 text-xs leading-relaxed font-bold">{puzzle.trivia}</p>
              </div>

              {/* Region Code Tagline */}
              <div className="mt-2.5 pt-2 border-t border-slate-300 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-black dark:text-slate-300 font-bold">
                <span>Код субъекта РФ:</span>
                <span className="font-mono font-black px-2 py-0.5 rounded bg-black text-white dark:bg-slate-700 dark:text-white">
                  {puzzle.regionCode} RUS
                </span>
              </div>
            </div>
          </div>

          {/* Cultural Symbol Card in FactModal */}
          {(() => {
            const regionInfo = REGIONS_DATA.find((r) => r.code === puzzle.regionCode);
            const symbol = puzzle.culturalSymbol || regionInfo?.culturalSymbol;
            if (!symbol) return null;

            return (
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-950/20 via-slate-800/50 to-amber-950/10 border-amber-500/30'
                    : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border-amber-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                  {symbol.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black dark:text-amber-400">
                      Культурный символ региона • {symbol.craftType}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-black dark:text-white mt-0.5">
                    {symbol.name}
                  </h4>
                  <p className="text-xs text-black dark:text-slate-200 mt-1 leading-relaxed font-bold">
                    {symbol.description}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 sm:p-5 border-t flex flex-wrap gap-2.5 items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}
        >
          <button
            onClick={onBackToMenu}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-black border border-slate-300'
            }`}
          >
            <Map className="w-4 h-4" /> К карте регионов
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onReplay}
              className={`p-2.5 rounded-xl transition flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-black border border-slate-300'
              }`}
              title="Собрать заново"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onRandomPuzzle && (
              <button
                onClick={onRandomPuzzle}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300'
                    : 'bg-white hover:bg-slate-100 text-black border-2 border-slate-400'
                }`}
                title="Случайный следующий пазл"
              >
                <Dices className="w-4 h-4" /> Случайный
              </button>
            )}

            <button
              onClick={onNextPuzzle}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              Следующий пазл <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
