import React from 'react';
import { Map, Grid, Trophy, Volume2, VolumeX, Maximize2, Minimize2, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentView: 'map' | 'game' | 'catalog' | 'symbols';
  completedCount: number;
  totalPuzzles: number;
  onOpenMap: () => void;
  onOpenSymbols: () => void;
  onOpenCatalog: () => void;
  onOpenDesktopModal: () => void;
  onOpenAdmin: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  currentView,
  completedCount,
  totalPuzzles,
  onOpenMap,
  onOpenSymbols,
  onOpenCatalog,
  onOpenDesktopModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.isMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`z-30 px-3 sm:px-6 py-2.5 border-b backdrop-blur-md flex items-center justify-between gap-3 shadow-sm select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}
    >
      {/* Brand Logo & Name with Crystal-Clear Black Contrast in Light Theme */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenMap}>
        <div className="relative w-9 h-9 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center bg-blue-600/10 border border-blue-500/20 shrink-0">
          <img src="/icon.svg" alt="Собери Россию" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-none">
              <span
                style={{ color: isDark ? '#ffffff' : '#000000' }}
                className="font-black tracking-wider text-black dark:text-white"
              >
                СОБЕРИ РОССИЮ
              </span>
            </h1>
            <span
              style={{
                color: isDark ? '#93c5fd' : '#000000',
                backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#e2e8f0',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : '#cbd5e1',
              }}
              className="text-[10px] font-black px-2 py-0.5 rounded-md border"
            >
              Пазлы 200
            </span>
          </div>
          <p
            style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}
            className="text-[10px] hidden xs:block font-bold leading-tight mt-0.5"
          >
            Регионы и символы • 3 сложности • Сенсор & ПК
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div
        className={`flex items-center p-1 rounded-2xl border text-xs sm:text-sm font-bold transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}
      >
        <button
          onClick={onOpenMap}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-bold ${
            currentView === 'map'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-700 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="hidden sm:inline">Карта регионов</span>
          <span className="sm:hidden">Карта</span>
        </button>

        <button
          onClick={onOpenSymbols}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-bold ${
            currentView === 'symbols'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-700 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <span className="text-xs">🪆</span>
          <span className="hidden sm:inline">Символы России</span>
          <span className="sm:hidden">Символы</span>
        </button>

        <button
          onClick={onOpenCatalog}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-bold ${
            currentView === 'catalog'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-700 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">200 картин</span>
          <span className="sm:hidden">200 пазлов</span>
        </button>
      </div>

      {/* Right Controls & Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Progress Counter Pill */}
        <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-300 text-black'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-black dark:text-slate-300">Собрано:</span>
          <strong className="text-black dark:text-emerald-400 font-black font-mono">
            {completedCount}/{totalPuzzles}
          </strong>
        </div>

        {/* Windows WebView2 Standalone App Launcher Button */}
        <button
          onClick={onOpenDesktopModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
          title="Запустить как приложение Windows без браузера (WebView2)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Окно ПК (WebView2)</span>
          <span className="sm:hidden">На ПК</span>
        </button>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl transition border ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
          }`}
          title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-black" />}
        </button>

        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          className={`p-2 rounded-xl transition border ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
          }`}
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-black dark:text-white" /> : <Volume2 className="w-4 h-4 text-black dark:text-white" />}
        </button>

        {/* Fullscreen toggle for PC */}
        <button
          onClick={onToggleFullscreen}
          className={`p-2 rounded-xl transition border hidden sm:flex ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
          }`}
          title="На весь экран (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-black dark:text-white" /> : <Maximize2 className="w-4 h-4 text-black dark:text-white" />}
        </button>
      </div>
    </header>
  );
};
