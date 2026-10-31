import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Eye, EyeOff, Volume2, VolumeX, 
  RotateCcw, Sparkles, Filter, Maximize2, Minimize2, Check,
  Clock, Move, Shuffle, Dices
} from 'lucide-react';
import { Difficulty, PuzzleItem, PuzzlePiece } from '../types/puzzle';
import { REGIONS_DATA } from '../data/regionsData';
import { DIFFICULTY_CONFIGS, generatePieces, checkSnap, shuffleArray } from '../utils/puzzleEngine';
import { soundManager } from '../utils/audio';

interface PuzzleBoardProps {
  theme: 'light' | 'dark';
  puzzle: PuzzleItem;
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
  onComplete: (timeSec: number, moves: number) => void;
  onBackToMap: () => void;
  onRandomPuzzle?: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  theme,
  puzzle,
  difficulty,
  onChangeDifficulty,
  onComplete,
  onBackToMap,
  onRandomPuzzle,
}) => {
  const BOARD_WIDTH = 640;
  const BOARD_HEIGHT = 480;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  // Store randomized piece IDs order for the tray so pieces are not displayed sequentially
  const [trayOrder, setTrayOrder] = useState<number[]>([]);
  const [activePieceId, setActivePieceId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGhost, setShowGhost] = useState(false);
  const [edgeOnlyFilter, setEdgeOnlyFilter] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [timeSec, setTimeSec] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const boardAreaRef = useRef<HTMLDivElement>(null);
  const highestZIndex = useRef<number>(10);

  const isDark = theme === 'dark';

  // Initialize or reset puzzle pieces with true random shuffling
  const initPuzzle = () => {
    const newPieces = generatePieces(BOARD_WIDTH, BOARD_HEIGHT, difficulty);
    setPieces(newPieces);
    // Shuffle piece order in tray so they never appear in order (user request: "чтобы пазлы перемешивались а не попорядку шли")
    const pieceIds = newPieces.map((p) => p.id);
    setTrayOrder(shuffleArray(pieceIds));
    setTimeSec(0);
    setMovesCount(0);
    setIsCompleted(false);
    highestZIndex.current = 10;
  };

  useEffect(() => {
    initPuzzle();
  }, [puzzle.id, difficulty]);

  // Game timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeSec((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Fullscreen tracking
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Check victory condition
  useEffect(() => {
    if (pieces.length > 0 && !isCompleted) {
      const allSnapped = pieces.every((p) => p.isSnapped);
      if (allSnapped) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete(timeSec, movesCount);
        }, 600);
      }
    }
  }, [pieces, isCompleted, timeSec, movesCount, onComplete]);

  // Drag & Drop Pointer Events
  const handlePointerDown = (pieceId: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isSnapped) return;

    soundManager.playPick();
    highestZIndex.current += 1;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setActivePieceId(pieceId);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, zIndex: highestZIndex.current } : p))
    );
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePieceId === null || !boardAreaRef.current) return;

    const boardRect = boardAreaRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - dragOffset.x;
    const newY = e.clientY - boardRect.top - dragOffset.y;

    setPieces((prev) =>
      prev.map((p) => (p.id === activePieceId ? { ...p, currentX: newX, currentY: newY } : p))
    );
  };

  const handlePointerUp = (pieceId: number, e: React.PointerEvent) => {
    if (activePieceId !== pieceId) return;

    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isSnapped) {
      setActivePieceId(null);
      return;
    }

    setMovesCount((m) => m + 1);

    // Magnetic snap detection
    const snapped = checkSnap(piece, 0, 0, 48);

    if (snapped) {
      soundManager.playSnap();
      setPieces((prev) =>
        prev.map((p) =>
          p.id === pieceId
            ? { ...p, currentX: p.targetX, currentY: p.targetY, isSnapped: true, zIndex: 2 }
            : p
        )
      );
    } else {
      soundManager.playDrop();
    }

    setActivePieceId(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Re-shuffle tray pieces
  const handleShuffleTray = () => {
    soundManager.playPick();
    setTrayOrder(shuffleArray(trayOrder));
  };

  // Hint
  const handleHint = () => {
    const unsnapped = pieces.filter((p) => !p.isSnapped);
    if (unsnapped.length === 0) return;

    soundManager.playHint();
    const randomPiece = unsnapped[Math.floor(Math.random() * unsnapped.length)];

    setPieces((prev) =>
      prev.map((p) =>
        p.id === randomPiece.id
          ? { ...p, currentX: p.targetX, currentY: p.targetY, isSnapped: true, zIndex: 2 }
          : p
      )
    );
    setMovesCount((m) => m + 1);
  };

  // Get tray pieces according to randomized trayOrder
  const unsnappedPieces = useMemo(() => {
    const pieceMap = new Map(pieces.map((p) => [p.id, p]));
    const ordered: PuzzlePiece[] = [];

    trayOrder.forEach((id) => {
      const p = pieceMap.get(id);
      if (p && !p.isSnapped && (!edgeOnlyFilter || p.isEdge)) {
        ordered.push(p);
      }
    });

    // In case any piece was not in trayOrder
    pieces.forEach((p) => {
      if (!p.isSnapped && (!edgeOnlyFilter || p.isEdge) && !ordered.some((o) => o.id === p.id)) {
        ordered.push(p);
      }
    });

    return ordered;
  }, [pieces, trayOrder, edgeOnlyFilter]);

  const snappedCount = pieces.filter((p) => p.isSnapped).length;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col select-none overflow-hidden touch-canvas transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
      onPointerMove={handlePointerMove}
    >
      {/* Top Bar with Navigation & Tools */}
      <header
        className={`z-20 px-3 sm:px-6 py-2.5 border-b backdrop-blur-md flex items-center justify-between shadow-sm transition-colors ${
          isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBackToMap}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-bold ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-black border border-slate-300'
            }`}
            title="Вернуться к карте"
          >
            <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
            <span className="hidden sm:inline">Карта</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Automotive plate */}
            <div className="hidden xs:flex items-center border border-slate-900 bg-slate-50 text-black rounded px-1.5 py-0.5 font-mono font-black text-xs shadow-xs">
              <span>{puzzle.regionCode}</span>
              <span className="ml-1 pl-1 border-l border-slate-400 text-[8px] font-sans font-black">RUS</span>
            </div>

            <div>
              {(() => {
                const regionInfo = REGIONS_DATA.find((r) => r.code === puzzle.regionCode);
                const symbol = puzzle.culturalSymbol || regionInfo?.culturalSymbol;

                return (
                  <>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xs sm:text-sm font-black truncate max-w-[180px] sm:max-w-md text-black dark:text-white">
                        {puzzle.title}
                      </h2>
                      {symbol && (
                        <span className="text-xs hidden md:inline" title={`${symbol.craftType}: ${symbol.name}`}>
                          {symbol.icon}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-black dark:text-slate-300 truncate font-bold">
                      {puzzle.subjectName} ({puzzle.federalDistrict})
                      {symbol && ` • ${symbol.name}`}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Difficulty Selector Tabs */}
        <div
          className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => onChangeDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                difficulty === diff
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-black hover:text-blue-700 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {diff === 'easy' ? 'Новичок' : diff === 'medium' ? 'Знаток' : 'Мастер'}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Random Puzzle button */}
          {onRandomPuzzle && (
            <button
              onClick={onRandomPuzzle}
              className={`p-2 rounded-xl transition border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
              }`}
              title="Случайный следующий пазл"
            >
              <Dices className="w-4 h-4 text-black dark:text-white" />
            </button>
          )}

          {/* Shuffle Tray Pieces */}
          <button
            onClick={handleShuffleTray}
            className={`p-2 rounded-xl transition border ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
            }`}
            title="Перемешать кусочки в лотке"
          >
            <Shuffle className="w-4 h-4 text-black dark:text-white" />
          </button>

          {/* Ghost image toggle */}
          <button
            onClick={() => setShowGhost(!showGhost)}
            className={`p-2 rounded-xl transition border ${
              showGhost
                ? 'bg-sky-500/20 text-blue-700 dark:text-sky-400 border-sky-500'
                : isDark
                ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                : 'bg-slate-100 text-black hover:bg-slate-200 border-slate-300'
            }`}
            title="Полупрозрачная подложка"
          >
            {showGhost ? <Eye className="w-4 h-4 text-black dark:text-sky-400" /> : <EyeOff className="w-4 h-4 text-black dark:text-slate-400" />}
          </button>

          {/* Edge filter */}
          <button
            onClick={() => setEdgeOnlyFilter(!edgeOnlyFilter)}
            className={`p-2 rounded-xl transition border ${
              edgeOnlyFilter
                ? 'bg-amber-500/20 text-black border-amber-500 font-bold'
                : isDark
                ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                : 'bg-slate-100 text-black hover:bg-slate-200 border-slate-300'
            }`}
            title="Показать только рамку"
          >
            <Filter className="w-4 h-4 text-black dark:text-white" />
          </button>

          {/* Hint */}
          <button
            onClick={handleHint}
            className={`p-2 rounded-xl transition border ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' : 'bg-amber-100 hover:bg-amber-200 text-black border-amber-300'
            }`}
            title="Подсказать кусочек"
          >
            <Sparkles className="w-4 h-4 text-black dark:text-amber-400" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setIsMuted(soundManager.toggleMute())}
            className={`p-2 rounded-xl transition border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
            }`}
            title="Звук"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-black dark:text-white" /> : <Volume2 className="w-4 h-4 text-black dark:text-white" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition border hidden sm:flex ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
            }`}
            title="Полноэкранный режим"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-black dark:text-white" /> : <Maximize2 className="w-4 h-4 text-black dark:text-white" />}
          </button>

          {/* Restart */}
          <button
            onClick={initPuzzle}
            className={`p-2 rounded-xl transition border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
            }`}
            title="Собрать заново"
          >
            <RotateCcw className="w-4 h-4 text-black dark:text-white" />
          </button>
        </div>
      </header>

      {/* Main Play Area */}
      <div className="relative flex-1 flex flex-col md:flex-row items-center justify-center p-2 sm:p-4 gap-4 overflow-hidden">
        {/* Puzzle Board Workspace */}
        <div className="relative flex items-center justify-center">
          <div
            ref={boardAreaRef}
            className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${
              isDark
                ? 'border-slate-800 bg-slate-900/90'
                : 'border-white bg-slate-200/60 shadow-slate-300/60'
            }`}
            style={{
              width: `${BOARD_WIDTH}px`,
              height: `${BOARD_HEIGHT}px`,
              maxWidth: '92vw',
              maxHeight: '62vh',
              aspectRatio: '4 / 3',
            }}
          >
            {/* Grid Pattern Guide */}
            <div
              className={`absolute inset-0 pointer-events-none [background-size:20px_20px] ${
                isDark
                  ? 'opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)]'
                  : 'opacity-25 bg-[radial-gradient(#64748b_1px,transparent_1px)]'
              }`}
            />

            {/* Ghost Preview Image */}
            <img
              src={puzzle.imageUrl}
              alt={puzzle.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                showGhost ? 'opacity-40' : 'opacity-0'
              }`}
            />

            {/* Target outline slots */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
            >
              {pieces.map((p) => (
                <rect
                  key={p.id}
                  x={p.targetX}
                  y={p.targetY}
                  width={p.width}
                  height={p.height}
                  fill="none"
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Snapped Pieces Rendered on Board */}
            {pieces
              .filter((p) => p.isSnapped)
              .map((piece) => (
                <div
                  key={piece.id}
                  className="absolute pointer-events-none transition-all duration-300"
                  style={{
                    left: `${piece.targetX}px`,
                    top: `${piece.targetY}px`,
                    width: `${piece.width}px`,
                    height: `${piece.height}px`,
                    zIndex: piece.zIndex,
                  }}
                >
                  <svg
                    width={piece.width}
                    height={piece.height}
                    viewBox={`0 0 ${piece.width} ${piece.height}`}
                    className="overflow-visible filter drop-shadow-sm"
                  >
                    <defs>
                      <clipPath id={`clip-snapped-${piece.id}`}>
                        <path d={piece.pathD} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#clip-snapped-${piece.id})`}>
                      <image
                        href={puzzle.imageUrl}
                        x={-piece.targetX}
                        y={-piece.targetY}
                        width={BOARD_WIDTH}
                        height={BOARD_HEIGHT}
                        preserveAspectRatio="none"
                      />
                    </g>
                    {/* Interlocking contour outline */}
                    <path
                      d={piece.pathD}
                      fill="none"
                      stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)'}
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              ))}

            {/* Floating / Dragged pieces inside board area */}
            {pieces
              .filter((p) => !p.isSnapped && activePieceId === p.id)
              .map((piece) => (
                <div
                  key={piece.id}
                  className="absolute cursor-grabbing select-none"
                  style={{
                    left: `${piece.currentX}px`,
                    top: `${piece.currentY}px`,
                    width: `${piece.width}px`,
                    height: `${piece.height}px`,
                    zIndex: piece.zIndex + 100,
                  }}
                  onPointerUp={(e) => handlePointerUp(piece.id, e)}
                >
                  <svg
                    width={piece.width}
                    height={piece.height}
                    viewBox={`0 0 ${piece.width} ${piece.height}`}
                    className="overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] scale-105 transition-transform"
                  >
                    <defs>
                      <clipPath id={`clip-active-${piece.id}`}>
                        <path d={piece.pathD} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#clip-active-${piece.id})`}>
                      <image
                        href={puzzle.imageUrl}
                        x={-piece.targetX}
                        y={-piece.targetY}
                        width={BOARD_WIDTH}
                        height={BOARD_HEIGHT}
                        preserveAspectRatio="none"
                      />
                    </g>
                    <path
                      d={piece.pathD}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              ))}
          </div>
        </div>

        {/* Piece Tray / Carousel for unsnapped pieces */}
        <div
          className={`w-full md:w-64 max-h-48 md:max-h-[520px] rounded-3xl p-3 flex flex-col shadow-xl border ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-black dark:text-slate-300 flex items-center gap-1.5">
              <span>В лотке:</span> <strong className="text-blue-700 dark:text-blue-400 font-black">{unsnappedPieces.length}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShuffleTray}
                className={`p-1.5 rounded-lg text-xs font-bold transition ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-black border border-slate-300'
                }`}
                title="Перемешать порядок"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              {edgeOnlyFilter && (
                <span className="text-[10px] bg-amber-500/20 text-black dark:text-amber-300 px-2 py-0.5 rounded-full font-black border border-amber-400">
                  Рамка
                </span>
              )}
            </div>
          </div>

          {/* Tray Grid of Unsnapped Pieces (Shuffled) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-3 no-scrollbar">
            {unsnappedPieces.map((piece) => (
              <div
                key={piece.id}
                className={`relative aspect-square rounded-2xl border flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition p-1 group shadow-sm ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-700/80 hover:border-blue-500'
                    : 'bg-slate-50 border-slate-300 hover:border-blue-500 hover:bg-blue-50/30'
                }`}
                onPointerDown={(e) => handlePointerDown(piece.id, e)}
              >
                <svg
                  width={piece.width * 0.75}
                  height={piece.height * 0.75}
                  viewBox={`0 0 ${piece.width} ${piece.height}`}
                  className="overflow-visible"
                >
                  <defs>
                    <clipPath id={`clip-tray-${piece.id}`}>
                      <path d={piece.pathD} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#clip-tray-${piece.id})`}>
                    <image
                      href={puzzle.imageUrl}
                      x={-piece.targetX}
                      y={-piece.targetY}
                      width={BOARD_WIDTH}
                      height={BOARD_HEIGHT}
                      preserveAspectRatio="none"
                    />
                  </g>
                  <path
                    d={piece.pathD}
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            ))}

            {unsnappedPieces.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-black dark:text-slate-300 font-bold flex flex-col items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600 mb-2" />
                Все кусочки собраны!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar with Region Plate & Metrics */}
      <footer
        className={`z-20 px-3 sm:px-6 py-2.5 border-t flex flex-wrap items-center justify-between gap-3 shadow-inner transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
        }`}
      >
        {/* Russian Automotive Region Plate Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border-2 border-black bg-slate-50 text-black rounded-md px-2.5 py-0.5 shadow-sm font-mono font-black text-lg">
            <span>{puzzle.regionCode}</span>
            <div className="ml-1.5 pl-1.5 border-l border-black text-[8px] flex flex-col leading-none font-black font-sans text-black">
              <span>RUS</span>
              <span>🇷🇺</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-black leading-tight text-black dark:text-white">
              {puzzle.subjectName}
            </span>
            <span className="text-[10px] text-black font-bold dark:text-slate-300">
              Код субъекта РФ • {puzzle.federalDistrict}
            </span>
          </div>
        </div>

        {/* Progress & Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-black font-black dark:text-slate-200">
            <Clock className="w-3.5 h-3.5 text-sky-600 font-bold" />
            <span>{formatTimer(timeSec)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-black font-black dark:text-slate-200">
            <Move className="w-3.5 h-3.5 text-amber-600 font-bold" />
            <span>{movesCount} ходов</span>
          </div>

          <div className="flex items-center gap-2 font-bold">
            <span className="text-black dark:text-slate-300">Собрано:</span>
            <div className="w-24 sm:w-32 bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-400 dark:border-slate-700">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(snappedCount / pieces.length) * 100 || 0}%` }}
              />
            </div>
            <strong className="text-black dark:text-emerald-400 font-black">
              {snappedCount}/{pieces.length}
            </strong>
          </div>
        </div>
      </footer>
    </div>
  );
};
