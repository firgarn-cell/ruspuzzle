import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';
import { FEDERAL_DISTRICTS, REGIONS_DATA } from '../data/regionsData';
import { ALL_PUZZLES } from '../data/puzzlesCatalog';
import { FederalDistrict, RegionInfo } from '../types/puzzle';

interface InteractiveMapProps {
  theme: 'light' | 'dark';
  onSelectRegion: (region: RegionInfo) => void;
  onSelectPuzzle: (puzzleId: number) => void;
  completedPuzzleIds: Set<number>;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  theme,
  onSelectRegion,
  onSelectPuzzle,
  completedPuzzleIds,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<FederalDistrict | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRegion, setHoveredRegion] = useState<RegionInfo | null>(null);
  const [activeModalRegion, setActiveModalRegion] = useState<RegionInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const isDark = theme === 'dark';

  // Map of region code to puzzle count & completed count
  const regionStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; puzzles: typeof ALL_PUZZLES }> = {};
    REGIONS_DATA.forEach((r) => {
      stats[r.code] = { total: 0, completed: 0, puzzles: [] };
    });

    ALL_PUZZLES.forEach((p) => {
      if (!stats[p.regionCode]) {
        stats[p.regionCode] = { total: 0, completed: 0, puzzles: [] };
      }
      stats[p.regionCode].total += 1;
      stats[p.regionCode].puzzles.push(p);
      if (completedPuzzleIds.has(p.id)) {
        stats[p.regionCode].completed += 1;
      }
    });

    return stats;
  }, [completedPuzzleIds]);

  // Filter regions based on district and search
  const filteredRegions = useMemo(() => {
    return REGIONS_DATA.filter((region) => {
      const matchDistrict = selectedDistrict === 'ALL' || region.district === selectedDistrict;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        region.name.toLowerCase().includes(q) ||
        region.shortName.toLowerCase().includes(q) ||
        region.capital.toLowerCase().includes(q) ||
        region.code.includes(q);
      return matchDistrict && matchSearch;
    });
  }, [selectedDistrict, searchQuery]);

  // Touch & Mouse pan handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.map-marker')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handlePointerUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const [showCulturalBadges, setShowCulturalBadges] = useState(false);

  return (
    <div
      className={`relative w-full h-full flex flex-col select-none overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Filter & Search Bar */}
      <div
        className={`z-20 p-2.5 sm:p-3.5 border-b flex flex-wrap gap-2 items-center justify-between shadow-sm transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md'
            : 'bg-white/95 border-slate-300 backdrop-blur-md'
        }`}
      >
        {/* District Filter Chips & Cultural Symbols Toggle */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          <button
            onClick={() => setSelectedDistrict('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedDistrict === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-black hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Вся Россия (89)
          </button>

          {/* Toggle for Cultural Crafts on Map */}
          <button
            onClick={() => setShowCulturalBadges(!showCulturalBadges)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap flex items-center gap-1.5 border ${
              showCulturalBadges
                ? 'bg-amber-500 text-black border-amber-600 shadow-md font-black'
                : isDark
                ? 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                : 'bg-amber-100 text-black border-amber-400 hover:bg-amber-200'
            }`}
            title="Отобразить культурные символы и промыслы прямо на карте"
          >
            <span>🪆</span>
            <span>Символы регионов</span>
          </button>

          {FEDERAL_DISTRICTS.map((dist) => (
            <button
              key={dist.code}
              onClick={() => setSelectedDistrict(dist.code)}
              className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
                selectedDistrict === dist.code
                  ? isDark
                    ? 'bg-white text-slate-900 shadow font-black'
                    : 'bg-blue-600 text-white shadow font-black border-blue-600'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-transparent'
                  : 'bg-slate-100 text-black hover:bg-slate-200 border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dist.color }} />
              {dist.name}
            </button>
          ))}
        </div>

        {/* Search input with region code search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-black dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск региона, символа или код (77, 16...)"
            className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-white border-slate-300 text-black placeholder-slate-600'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-canvas flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Prominent High-Contrast Map Title Badge: Guarantees "Собери Россию" is crystal clear on light theme */}
        <div
          className={`absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-white'
              : 'bg-white/95 border-slate-300 text-black shadow-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-lg shrink-0">
            🇷🇺
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
              <span style={{ color: isDark ? '#ffffff' : '#000000' }} className="text-black dark:text-white">
                СОБЕРИ РОССИЮ
              </span>
              <span
                style={{
                  color: isDark ? '#93c5fd' : '#000000',
                  backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#e2e8f0',
                }}
                className="text-[9px] font-black px-1.5 py-0.2 rounded border border-slate-300 dark:border-blue-500/30"
              >
                Карта
              </span>
            </h3>
            <p
              style={{ color: isDark ? '#cbd5e1' : '#334155' }}
              className="text-[10px] font-bold"
            >
              89 субъектов • Нажмите на точку региона
            </p>
          </div>
        </div>

        {/* Coordinate dot pattern */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            isDark
              ? 'opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]'
              : 'opacity-30 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:28px_28px]'
          }`}
        />

        {/* Floating Zoom / Reset Tools */}
        <div
          className={`absolute top-4 right-4 z-20 flex flex-col gap-1.5 rounded-2xl p-1.5 shadow-xl border backdrop-blur-md ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-300'
          }`}
        >
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.8, z + 0.3))}
            className={`p-2 rounded-xl transition ${
              isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100'
            }`}
            title="Приблизить карту"
          >
            <ZoomIn className="w-4 h-4 text-black dark:text-white" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.3))}
            className={`p-2 rounded-xl transition ${
              isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100'
            }`}
            title="Отдалить карту"
          >
            <ZoomOut className="w-4 h-4 text-black dark:text-white" />
          </button>
          <button
            onClick={resetView}
            className={`p-2 rounded-xl transition ${
              isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100'
            }`}
            title="Сбросить масштаб и положение"
          >
            <RotateCcw className="w-4 h-4 text-black dark:text-white" />
          </button>
        </div>

        {/* Map Container with Pan & Zoom Transform */}
        <div
          className="transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Strict container matching image dimensions (740 x 654) */}
          <div
            className={`relative select-none rounded-2xl p-1 transition-all ${
              isDark
                ? 'bg-transparent'
                : 'border border-blue-100/80 bg-white/60 shadow-md shadow-blue-500/5'
            }`}
            style={{
              width: '840px',
              maxWidth: '96vw',
              aspectRatio: '740 / 654',
            }}
          >
            {/* The exact map image provided by user */}
            <img
              src="/assets/aistudio/image_3c1b1af7.png"
              alt="Карта России"
              className={`w-full h-full block pointer-events-none select-none transition-all duration-300 rounded-xl ${
                isDark
                  ? 'brightness-95 contrast-110 drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
                  : 'drop-shadow-[0_10px_25px_rgba(0,0,0,0.06)]'
              }`}
              style={{ objectFit: 'fill' }}
            />

            {/* Region Interactive Markers positioned with 100% precision on this exact image */}
            <div className="absolute inset-0 pointer-events-none">
              {filteredRegions.map((region) => {
                const stats = regionStats[region.code] || { total: 0, completed: 0, puzzles: [] };
                const isCompleted = stats.total > 0 && stats.completed === stats.total;
                const hasProgress = stats.completed > 0;
                const isHovered = hoveredRegion?.code === region.code;
                const isSelectedInDistrict = selectedDistrict !== 'ALL' && region.district === selectedDistrict;

                return (
                  <div
                    key={region.code}
                    className={`map-marker absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group ${
                      isHovered ? 'z-40' : isSelectedInDistrict ? 'z-30' : 'z-20'
                    }`}
                    style={{
                      left: `${region.mapX}%`,
                      top: `${region.mapY}%`,
                    }}
                    onClick={() => {
                      setActiveModalRegion(region);
                      onSelectRegion(region);
                    }}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {/* Glowing Pin Badge */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-200 group-hover:scale-130 shadow-md ${
                        showCulturalBadges && region.culturalSymbol
                          ? 'w-6 h-6 rounded-full bg-amber-400 text-slate-900 border-2 border-white shadow-amber-500/50'
                          : isCompleted
                          ? 'w-6 h-6 rounded-full bg-emerald-500 text-white font-bold ring-2 ring-emerald-300 shadow-emerald-500/50'
                          : hasProgress
                          ? 'w-5 h-5 rounded-full bg-blue-600 text-white font-bold ring-2 ring-sky-300 shadow-blue-500/40'
                          : isDark
                          ? 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-900/90 text-white border border-slate-500 hover:border-blue-400 hover:bg-blue-600'
                          : 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-slate-900 border-2 border-slate-800 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {showCulturalBadges && region.culturalSymbol ? (
                        <span className="text-xs">{region.culturalSymbol.icon}</span>
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <span className="text-[9px] font-mono font-black tracking-tighter leading-none">
                          {region.code}
                        </span>
                      )}

                      {/* Ping animation if completed */}
                      {isCompleted && (
                        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-35" />
                      )}
                    </div>

                    {/* Compact Label on map when hovered */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0.5 transition-all duration-150 whitespace-nowrap pointer-events-none ${
                        isHovered || isSelectedInDistrict
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded shadow-md border ${
                          isDark
                            ? 'bg-slate-900/95 text-slate-100 border-slate-700'
                            : 'bg-white text-black border-slate-900 shadow-slate-300'
                        }`}
                      >
                        {showCulturalBadges && region.culturalSymbol ? `${region.culturalSymbol.icon} ${region.shortName}` : region.shortName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hover Floating Card preview on map */}
        <AnimatePresence>
          {hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`absolute bottom-6 left-6 z-30 pointer-events-none max-w-sm w-80 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                isDark
                  ? 'bg-slate-900/95 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-300 text-black shadow-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{hoveredRegion.emblemEmoji || '🇷🇺'}</span>
                    <h4 className="font-black text-sm leading-tight text-black dark:text-white">{hoveredRegion.name}</h4>
                  </div>
                  <p className="text-xs text-black dark:text-slate-300 font-bold mt-0.5">Столица: {hoveredRegion.capital}</p>
                  {hoveredRegion.culturalSymbol && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-black dark:text-amber-300 font-black bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-500/20">
                      <span>{hoveredRegion.culturalSymbol.icon}</span>
                      <span className="truncate">{hoveredRegion.culturalSymbol.name}</span>
                    </div>
                  )}
                </div>

                {/* Automotive Plate Badge */}
                <div className="flex items-center border-2 border-slate-950 bg-slate-50 rounded text-black px-2 py-0.5 shadow-sm font-mono font-black text-sm">
                  <span>{hoveredRegion.code}</span>
                  <div className="ml-1 pl-1 border-l border-slate-400 text-[8px] flex flex-col leading-none font-black font-sans text-black">
                    <span>RUS</span>
                    <span>🇷🇺</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-black dark:text-slate-300">
                <span>
                  Пазлов доступно: <strong className="text-black dark:text-sky-400 font-black">{regionStats[hoveredRegion.code]?.total || 0}</strong>
                </span>
                <span className="text-black dark:text-emerald-400 font-black">
                  Собрано: {regionStats[hoveredRegion.code]?.completed || 0}/{regionStats[hoveredRegion.code]?.total || 0}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Region Puzzles Drawer / Modal */}
      <AnimatePresence>
        {activeModalRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModalRegion(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className={`w-full sm:max-w-xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-black'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with official plate */}
              <div
                className={`p-4 sm:p-6 border-b flex items-center justify-between ${
                  isDark
                    ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-slate-800'
                    : 'bg-gradient-to-r from-blue-50/50 via-white to-slate-50 border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-2xl shadow-inner">
                    {activeModalRegion.emblemEmoji || '🇷🇺'}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-black dark:text-white">{activeModalRegion.name}</h3>
                    <p className="text-xs text-black dark:text-slate-300 font-bold">
                      {FEDERAL_DISTRICTS.find((d) => d.code === activeModalRegion.district)?.fullName}
                    </p>
                  </div>
                </div>

                {/* Automotive Plate Badge */}
                <div className="flex items-center border-2 border-slate-950 bg-slate-50 text-slate-950 rounded-md px-2.5 py-1 shadow-md font-mono font-black text-lg">
                  <span>{activeModalRegion.code}</span>
                  <div className="ml-1.5 pl-1.5 border-l border-slate-400 text-[9px] flex flex-col leading-none font-black font-sans text-black">
                    <span>RUS</span>
                    <span>🇷🇺</span>
                  </div>
                </div>
              </div>

              {/* Cultural Symbol Section in Region Modal */}
              {activeModalRegion.culturalSymbol && (
                <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/25 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-500/20 border border-amber-400 dark:border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                    {activeModalRegion.culturalSymbol.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-black text-black dark:text-amber-400">
                        {activeModalRegion.culturalSymbol.craftType}
                      </span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-black text-black dark:text-white">
                      {activeModalRegion.culturalSymbol.name}
                    </h5>
                    <p className="text-xs text-black dark:text-slate-200 mt-0.5 leading-snug font-medium">
                      {activeModalRegion.culturalSymbol.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Puzzles List for this Region */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
                <h4 className="text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider">
                  Достопримечательности и пазлы региона ({regionStats[activeModalRegion.code]?.puzzles.length || 0})
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {regionStats[activeModalRegion.code]?.puzzles.map((puzzle) => {
                    const isDone = completedPuzzleIds.has(puzzle.id);
                    return (
                      <div
                        key={puzzle.id}
                        onClick={() => {
                          setActiveModalRegion(null);
                          onSelectPuzzle(puzzle.id);
                        }}
                        className={`group flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer shadow-sm ${
                          isDark
                            ? 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 hover:border-blue-500'
                            : 'bg-white hover:bg-blue-50/50 border-slate-300 hover:border-blue-500'
                        }`}
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-300 dark:border-slate-700">
                          <img
                            src={puzzle.imageUrl}
                            alt={puzzle.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          {isDone && (
                            <div className="absolute inset-0 bg-emerald-500/40 backdrop-blur-xs flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-black'
                              }`}
                            >
                              {puzzle.category}
                            </span>
                            <span className="text-[11px] text-black dark:text-slate-400 font-mono font-bold">{puzzle.era}</span>
                          </div>
                          <h5 className="font-bold text-sm text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate mt-0.5">
                            {puzzle.title}
                          </h5>
                          <p className="text-xs text-black dark:text-slate-300 truncate mt-0.5 font-medium">{puzzle.facts[0]}</p>
                        </div>

                        <button className="shrink-0 p-2 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white shadow-md transition">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Close Footer */}
              <div
                className={`p-3 border-t flex justify-end ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                }`}
              >
                <button
                  onClick={() => setActiveModalRegion(null)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-black border border-slate-300'
                  }`}
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
