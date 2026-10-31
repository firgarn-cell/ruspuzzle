import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Download, Check, X, Sparkles, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DesktopLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const DesktopLauncherModal: React.FC<DesktopLauncherModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  // Generate and download a Windows Desktop URL shortcut that launches in standalone app window
  const downloadWindowsShortcut = () => {
    const appUrl = window.location.href;
    const shortcutContent = `[InternetShortcut]\nURL=${appUrl}\nIconIndex=0\nIconFile=${window.location.origin}/icon.svg\n`;
    const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Собери Россию.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate a Windows batch launcher that forces --app= mode (WebView2/Edge window without browser chrome)
  const downloadBatchLauncher = () => {
    const appUrl = window.location.href;
    const batchContent = `@echo off\r\nstart msedge --app="${appUrl}"\r\nexit\r\n`;
    const blob = new Blob([batchContent], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Запуск Собери Россию (Окно).bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-lg rounded-3xl shadow-2xl border p-5 sm:p-6 flex flex-col ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-300 text-black'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-300 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-black dark:text-white leading-tight">
                Запуск на ПК без браузера (WebView2)
              </h3>
              <p className="text-xs text-black dark:text-slate-300 font-bold">
                Запуск игры в отдельном окне Windows без рамок и вкладок
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-black hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content options */}
        <div className="py-4 space-y-4 text-xs sm:text-sm">
          {/* Method 1: 1-Click PWA / WebView2 Window */}
          <div
            className={`p-4 rounded-2xl border transition ${
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700'
                : 'bg-slate-50 border-slate-300 text-black'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Способ 1 • Рекомендуемый
                </span>
                <h4 className="font-black text-black dark:text-white text-sm mt-0.5">
                  Установка как приложение Windows
                </h4>
                <p className="text-xs text-black dark:text-slate-200 mt-1 leading-relaxed font-bold">
                  Использует движок Microsoft Edge / WebView2. Игра добавляется в меню «Пуск», на панель задач и запускается в собственном окне.
                </p>
              </div>
            </div>

            <div className="mt-3">
              {isInstalled ? (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs py-1.5">
                  <Check className="w-4 h-4" /> Игра уже установлена в Windows!
                </div>
              ) : isInstallable ? (
                <button
                  onClick={async () => {
                    await install();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Установить в Windows сейчас
                </button>
              ) : (
                <div className="text-xs text-black dark:text-slate-200 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-300 dark:border-blue-900/60 font-bold">
                  💡 Нажмите в адресной строке значок <strong>«Установить приложение»</strong> (справа вверху) в Edge или Chrome.
                </div>
              )}
            </div>
          </div>

          {/* Method 2: Download Desktop Launcher (.url / .bat) */}
          <div
            className={`p-4 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700'
                : 'bg-slate-50 border-slate-300 text-black'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Способ 2 • Ярлык на Рабочий стол
            </span>
            <h4 className="font-black text-black dark:text-white text-sm mt-0.5">
              Скачать ярлык окна Windows
            </h4>
            <p className="text-xs text-black dark:text-slate-200 mt-1 leading-relaxed font-bold">
              Скачайте готовый ярлык или .bat файл для открытия игры в режиме отдельного автономного окна:
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={downloadWindowsShortcut}
                className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-white hover:bg-slate-100 border-slate-400 text-black'
                }`}
              >
                <Download className="w-3.5 h-3.5" /> Ярлык (.url)
              </button>
              <button
                onClick={downloadBatchLauncher}
                className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-white hover:bg-slate-100 border-slate-400 text-black'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Файл запуска (.bat)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-300 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-black text-black dark:text-slate-200 border border-slate-300 transition"
          >
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  );
};
