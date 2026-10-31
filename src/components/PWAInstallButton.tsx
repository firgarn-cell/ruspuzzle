import React, { useState } from 'react';
import { Download, Monitor, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone on desktop/mobile, hide button
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" /> Установлено на ПК
      </span>
    );
  }

  // Windows / Chromium desktop installation flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
        title="Установить игру на Windows / ПК"
      >
        <Monitor className="w-4 h-4" />
        <span>Установить на ПК</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          На экран
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <h3 className="text-base font-bold text-white">Установка на экран</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                1. Нажмите кнопку <strong>Поделиться</strong> в панели Safari.<br />
                2. Прокрутите вниз и выберите <strong>«На экран Домой»</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2 text-xs font-bold text-white transition"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
