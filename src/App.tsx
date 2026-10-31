import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { PuzzleBoard } from './components/PuzzleBoard';
import { FactModal } from './components/FactModal';
import { CatalogView } from './components/CatalogView';
import { CulturalSymbolsView } from './components/CulturalSymbolsView';
import { DesktopLauncherModal } from './components/DesktopLauncherModal';
import { ALL_PUZZLES } from './data/puzzlesCatalog';
import { CULTURAL_SYMBOLS_DATA } from './data/culturalSymbolsData';
import { Difficulty, PuzzleItem, RegionInfo } from './types/puzzle';

export default function App() {
  // Theme state: defaults to 'light' per user request, toggleable between 'light' and 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('russia_puzzles_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  const [currentView, setCurrentView] = useState<'map' | 'game' | 'catalog' | 'symbols'>('map');
  const [activePuzzleId, setActivePuzzleId] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [completedPuzzleIds, setCompletedPuzzleIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('russia_puzzles_completed');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {}
    return new Set<number>();
  });

  const [showFactModal, setShowFactModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [lastGameStats, setLastGameStats] = useState({ timeSec: 0, moves: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync Tailwind HTML dark class with state
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('russia_puzzles_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  // Active puzzle object (supports custom images and authentic craft photo assets)
  const activePuzzle = useMemo(() => {
    const base = ALL_PUZZLES.find((p) => p.id === activePuzzleId) || ALL_PUZZLES[0];
    
    // Check if there is a matching cultural symbol for this puzzle id
    const craft = CULTURAL_SYMBOLS_DATA.find((c) => c.puzzleId === base.id);

    try {
      const saved = localStorage.getItem('russia_puzzles_custom_images');
      if (saved) {
        const mapping = JSON.parse(saved);
        const customUrl = mapping[`puzzle_${base.id}`] || mapping[base.id] || (craft ? mapping[craft.id] : undefined);
        if (customUrl) {
          return { 
            ...base, 
            imageUrl: customUrl,
            culturalSymbol: craft ? {
              name: craft.name,
              icon: craft.icon,
              craftType: craft.category,
              description: craft.description
            } : base.culturalSymbol
          };
        }
      }
    } catch {}

    if (craft && craft.imageUrl) {
      return { 
        ...base, 
        imageUrl: craft.imageUrl,
        culturalSymbol: {
          name: craft.name,
          icon: craft.icon,
          craftType: craft.category,
          description: craft.description
        }
      };
    }

    return base;
  }, [activePuzzleId]);

  // Save completed puzzle IDs to local storage
  const markPuzzleCompleted = (puzzleId: number, timeSec: number, moves: number) => {
    setCompletedPuzzleIds((prev) => {
      const next = new Set(prev);
      next.add(puzzleId);
      try {
        localStorage.setItem('russia_puzzles_completed', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    setLastGameStats({ timeSec, moves });
    setShowFactModal(true);
  };

  const handleSelectPuzzle = (puzzleId: number) => {
    setActivePuzzleId(puzzleId);
    setCurrentView('game');
    setShowFactModal(false);
  };

  // Pick random or shuffled uncompleted puzzle
  const handleRandomPuzzle = () => {
    setShowFactModal(false);
    const uncompleted = ALL_PUZZLES.filter((p) => !completedPuzzleIds.has(p.id) && p.id !== activePuzzleId);
    const pool = uncompleted.length > 0 ? uncompleted : ALL_PUZZLES.filter((p) => p.id !== activePuzzleId);
    const random = pool[Math.floor(Math.random() * pool.length)];
    if (random) {
      setActivePuzzleId(random.id);
    }
  };

  const handleNextPuzzle = () => {
    // If user prefers shuffled / random flow, pick next random uncompleted puzzle!
    handleRandomPuzzle();
  };

  const handleReplay = () => {
    setShowFactModal(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcut navigation for PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') {
        if (e.target instanceof HTMLInputElement) return;
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (showDesktopModal) {
          setShowDesktopModal(false);
        } else if (showFactModal) {
          setShowFactModal(false);
        } else if (currentView === 'catalog' || currentView === 'symbols') {
          setCurrentView('map');
        } else if (currentView === 'game') {
          setCurrentView('map');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDesktopModal, showFactModal, currentView]);

  return (
    <div
      className={`relative w-screen h-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        completedCount={completedPuzzleIds.size}
        totalPuzzles={ALL_PUZZLES.length}
        onOpenMap={() => setCurrentView('map')}
        onOpenSymbols={() => setCurrentView('symbols')}
        onOpenCatalog={() => setCurrentView('catalog')}
        onOpenDesktopModal={() => setShowDesktopModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {currentView === 'map' && (
          <InteractiveMap
            theme={theme}
            completedPuzzleIds={completedPuzzleIds}
            onSelectRegion={() => {}}
            onSelectPuzzle={handleSelectPuzzle}
          />
        )}

        {currentView === 'symbols' && (
          <CulturalSymbolsView
            theme={theme}
            completedPuzzleIds={completedPuzzleIds}
            onSelectPuzzle={handleSelectPuzzle}
            onClose={() => setCurrentView('map')}
          />
        )}

        {currentView === 'game' && (
          <PuzzleBoard
            theme={theme}
            puzzle={activePuzzle}
            difficulty={difficulty}
            onChangeDifficulty={setDifficulty}
            onComplete={(timeSec, moves) => markPuzzleCompleted(activePuzzle.id, timeSec, moves)}
            onBackToMap={() => setCurrentView('map')}
            onRandomPuzzle={handleRandomPuzzle}
          />
        )}
      </main>

      {/* 200 Puzzles Catalog Drawer */}
      {currentView === 'catalog' && (
        <CatalogView
          theme={theme}
          completedPuzzleIds={completedPuzzleIds}
          onSelectPuzzle={handleSelectPuzzle}
          onClose={() => setCurrentView('map')}
        />
      )}

      {/* Fact & Lore Reward Modal */}
      {showFactModal && (
        <FactModal
          theme={theme}
          puzzle={activePuzzle}
          difficulty={difficulty}
          timeSec={lastGameStats.timeSec}
          movesCount={lastGameStats.moves}
          onNextPuzzle={handleNextPuzzle}
          onRandomPuzzle={handleRandomPuzzle}
          onReplay={handleReplay}
          onBackToMenu={() => {
            setShowFactModal(false);
            setCurrentView('map');
          }}
        />
      )}

      {/* Windows WebView2 Standalone App Launcher Dialog */}
      <DesktopLauncherModal
        isOpen={showDesktopModal}
        onClose={() => setShowDesktopModal(false)}
        theme={theme}
      />
    </div>
  );
}
