import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, KeyRound, Unlock, X, Search, Upload, RefreshCw, 
  Trash2, Download, Check, AlertCircle, Image as ImageIcon,
  Sparkles, Layers, ShieldCheck, Link2
} from 'lucide-react';
import { CULTURAL_SYMBOLS_DATA } from '../data/culturalSymbolsData';
import { ALL_PUZZLES } from '../data/puzzlesCatalog';
import { 
  verifyAdminPassword, setAdminPassword, 
  getAllCustomImages, saveCustomImage, deleteCustomImage, 
  exportCustomImagesJSON, importCustomImagesJSON 
} from '../utils/imageStorage';

interface AdminPanelModalProps {
  theme: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  theme,
  isOpen,
  onClose,
  onImagesUpdated,
}) => {
  const isDark = theme === 'dark';

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('russia_puzzles_admin_auth') === 'true';
  });
  const [inputPass, setInputPass] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<'symbols' | 'puzzles'>('symbols');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterChangedOnly, setFilterChangedOnly] = useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Change password modal
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<string>('');
  const [changePassSuccess, setChangePassSuccess] = useState<string>('');

  // Custom Images Map
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => getAllCustomImages());

  // Direct URL input state
  const [urlInputTarget, setUrlInputTarget] = useState<string | null>(null);
  const [urlInputValue, setUrlInputValue] = useState<string>('');

  // Notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(inputPass)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('russia_puzzles_admin_auth', 'true');
      setAuthError('');
      setInputPass('');
    } else {
      setAuthError('Неверный пароль. Попробуйте "admin"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('russia_puzzles_admin_auth');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) return;
    setAdminPassword(newPass.trim());
    setChangePassSuccess('Пароль успешно обновлён!');
    setNewPass('');
    setTimeout(() => {
      setShowPasswordChange(false);
      setChangePassSuccess('');
    }, 1500);
  };

  const handleFileUpload = async (targetKey: string, file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Ошибка: выберите изображение (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const finalUrl = await saveCustomImage(targetKey, dataUrl);
      setCustomImages((prev) => ({ ...prev, [targetKey]: finalUrl }));
      onImagesUpdated();
      showToast(`Изображение для "${targetKey}" успешно обновлено!`);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (targetKey: string) => {
    if (!urlInputValue.trim()) return;
    const url = urlInputValue.trim();
    const finalUrl = await saveCustomImage(targetKey, url);
    setCustomImages((prev) => ({ ...prev, [targetKey]: finalUrl }));
    onImagesUpdated();
    setUrlInputTarget(null);
    setUrlInputValue('');
    showToast(`Ссылка на фото успешно сохранена!`);
  };

  const handleResetImage = (targetKey: string) => {
    deleteCustomImage(targetKey);
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[targetKey];
      return next;
    });
    onImagesUpdated();
    showToast(`Фото сброшено к исходному.`);
  };

  const handleExport = () => {
    const jsonStr = exportCustomImagesJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `russia_puzzles_images_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Резервная копия сохранена в файл!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (importCustomImagesJSON(content)) {
        setCustomImages(getAllCustomImages());
        onImagesUpdated();
        showToast('Все фотографии успешно импортированы!');
      } else {
        showToast('Ошибка импорта: неверный формат файла.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered Cultural Symbols
  const filteredSymbols = useMemo(() => {
    return CULTURAL_SYMBOLS_DATA.filter((sym) => {
      const isChanged = Boolean(customImages[sym.id] || customImages[`puzzle_${sym.puzzleId}`]);
      if (filterChangedOnly && !isChanged) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        sym.name.toLowerCase().includes(q) ||
        sym.regionName.toLowerCase().includes(q) ||
        sym.regionCode.includes(q) ||
        sym.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterChangedOnly, customImages]);

  // Filtered Puzzles (200)
  const filteredPuzzles = useMemo(() => {
    return ALL_PUZZLES.filter((puz) => {
      if (selectedDistrict !== 'ALL' && puz.federalDistrict !== selectedDistrict) return false;
      const isChanged = Boolean(customImages[`puzzle_${puz.id}`] || customImages[puz.id]);
      if (filterChangedOnly && !isChanged) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        puz.title.toLowerCase().includes(q) ||
        puz.subjectName.toLowerCase().includes(q) ||
        puz.regionCode.includes(q) ||
        puz.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterChangedOnly, selectedDistrict, customImages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-[70] bg-emerald-600 text-white font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm border border-emerald-400"
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-5xl h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark
              ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/50 border-slate-800'
              : 'bg-gradient-to-r from-blue-50/90 via-white to-amber-50/50 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-sky-400">
                  Управление контентом
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Защищено паролем
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-black dark:text-white">
                Админ-панель: Прикрепление и замена фотографий
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                  }`}
                  title="Сменить пароль"
                >
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span className="hidden md:inline">Пароль</span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                  }`}
                  title="Выйти из админки"
                >
                  <Unlock className="w-4 h-4 text-rose-500" />
                  <span className="hidden md:inline">Выйти</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="flex-1 flex items-center justify-center p-6">
            <div
              className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col text-center space-y-5 ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-black dark:text-white">Вход в панель управления</h3>
                <p className="text-xs text-black dark:text-slate-300 mt-1 font-bold">
                  Введите пароль администратора для прикрепления и замены фотографий
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={inputPass}
                    onChange={(e) => {
                      setInputPass(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Введите пароль..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-400 text-black'
                    }`}
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition active:scale-98"
                >
                  Войти
                </button>
              </form>

              {/* Quick default password helper */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-black dark:text-slate-300 font-bold">Пароль по умолчанию:</span>
                <button
                  onClick={() => setInputPass('admin')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-black dark:text-amber-300 border border-amber-500/40 font-mono font-black hover:bg-amber-500/30 transition"
                  title="Нажмите чтобы подставить пароль admin"
                >
                  admin (подставить)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Controls Bar: Tabs, Search & Backup */}
            <div
              className={`p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              {/* Main Tabs */}
              <div className="flex items-center gap-1.5 bg-black/10 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('symbols')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    activeTab === 'symbols'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-black dark:text-slate-300 hover:text-blue-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Культурные символы ({CULTURAL_SYMBOLS_DATA.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('puzzles')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    activeTab === 'puzzles'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-black dark:text-slate-300 hover:text-blue-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Все 200 пазлов регионов</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию или коду..."
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-400 text-black'
                  }`}
                />
              </div>

              {/* Filters & Backup */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterChangedOnly(!filterChangedOnly)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                    filterChangedOnly
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : isDark
                      ? 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-black border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {filterChangedOnly ? '✓ Только изменённые' : 'Все фото'}
                </button>

                {activeTab === 'puzzles' && (
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
                    }`}
                  >
                    <option value="ALL">Все округа</option>
                    <option value="ЦФО">ЦФО</option>
                    <option value="СЗФО">СЗФО</option>
                    <option value="ЮФО">ЮФО</option>
                    <option value="СКФО">СКФО</option>
                    <option value="ПФО">ПФО</option>
                    <option value="УФО">УФО</option>
                    <option value="СФО">СФО</option>
                    <option value="ДФО">ДФО</option>
                  </select>
                )}

                <button
                  onClick={handleExport}
                  className={`p-1.5 rounded-xl border transition ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-black border-slate-300'
                  }`}
                  title="Экспорт резервной копии фото"
                >
                  <Download className="w-4 h-4" />
                </button>

                <label
                  className={`p-1.5 rounded-xl border cursor-pointer transition ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-black border-slate-300'
                  }`}
                  title="Импорт резервной копии фото"
                >
                  <Upload className="w-4 h-4" />
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* List / Grid of items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === 'symbols' ? (
                /* Cultural symbols list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSymbols.map((sym) => {
                    const custom = customImages[sym.id] || customImages[`puzzle_${sym.puzzleId}`];
                    const activeImg = custom || sym.imageUrl;

                    return (
                      <div
                        key={sym.id}
                        className={`p-3 rounded-2xl border flex gap-3 items-center justify-between shadow-xs transition ${
                          isDark ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {/* Hidden input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRefs.current[sym.id] = el)}
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(sym.id, f);
                              handleFileUpload(`puzzle_${sym.puzzleId}`, f);
                            }
                          }}
                        />

                        {/* Thumbnail */}
                        <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-300 dark:border-slate-700 shadow-inner">
                          <img src={activeImg} alt={sym.name} className="w-full h-full object-cover" />
                          {custom && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-emerald-600 text-[8px] font-black text-white">
                              Своё
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{sym.icon}</span>
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black">
                              {sym.regionCode} RUS
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 dark:text-sky-400 truncate">
                              {sym.regionName}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-black dark:text-white truncate">
                            {sym.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            Пазл #{sym.puzzleId} • {sym.category}
                          </span>
                        </div>

                        {/* Upload & Actions */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => fileInputRefs.current[sym.id]?.click()}
                            className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
                            title="Выбрать картинку с компьютера"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Загрузить</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setUrlInputTarget(sym.id);
                                setUrlInputValue(custom || '');
                              }}
                              className={`p-1 rounded-lg border text-[10px] font-bold transition flex items-center gap-0.5 ${
                                isDark ? 'bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                              }`}
                              title="Вставить ссылку на картинку"
                            >
                              <Link2 className="w-3 h-3 text-blue-600" />
                              <span className="hidden sm:inline">URL</span>
                            </button>

                            {custom && (
                              <button
                                onClick={() => {
                                  handleResetImage(sym.id);
                                  handleResetImage(`puzzle_${sym.puzzleId}`);
                                }}
                                className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 transition text-[10px]"
                                title="Сбросить к исходному фото"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* All 200 puzzles list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPuzzles.map((puz) => {
                    const targetKey = `puzzle_${puz.id}`;
                    const custom = customImages[targetKey] || customImages[puz.id];
                    const activeImg = custom || puz.imageUrl;

                    return (
                      <div
                        key={puz.id}
                        className={`p-3 rounded-2xl border flex gap-3 items-center justify-between shadow-xs transition ${
                          isDark ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRefs.current[targetKey] = el)}
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(targetKey, f);
                          }}
                        />

                        {/* Thumbnail */}
                        <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-300 dark:border-slate-700 shadow-inner">
                          <img src={activeImg} alt={puz.title} className="w-full h-full object-cover" />
                          {custom && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-emerald-600 text-[8px] font-black text-white">
                              Своё
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black">
                              {puz.regionCode} RUS
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 dark:text-sky-400 truncate">
                              {puz.subjectName}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-black dark:text-white truncate">
                            {puz.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            Пазл #{puz.id} • {puz.federalDistrict} • {puz.category}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => fileInputRefs.current[targetKey]?.click()}
                            className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
                            title="Выбрать картинку с компьютера"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Загрузить</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setUrlInputTarget(targetKey);
                                setUrlInputValue(custom || '');
                              }}
                              className={`p-1 rounded-lg border text-[10px] font-bold transition flex items-center gap-0.5 ${
                                isDark ? 'bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                              }`}
                              title="Вставить ссылку на картинку"
                            >
                              <Link2 className="w-3 h-3 text-blue-600" />
                              <span className="hidden sm:inline">URL</span>
                            </button>

                            {custom && (
                              <button
                                onClick={() => handleResetImage(targetKey)}
                                className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 transition text-[10px]"
                                title="Сбросить к исходному фото"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* URL Input Modal */}
      <AnimatePresence>
        {urlInputTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-5 rounded-3xl border shadow-2xl space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-blue-600" /> Прямая ссылка на фото
                </h3>
                <button
                  onClick={() => setUrlInputTarget(null)}
                  className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="url"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-400 text-black'
                }`}
                autoFocus
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setUrlInputTarget(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-black'
                  }`}
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleUrlSubmit(urlInputTarget)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordChange && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm p-5 rounded-3xl border shadow-2xl space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-500" /> Смена пароля админки
                </h3>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Новый пароль..."
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-400 text-black'
                  }`}
                  autoFocus
                />

                {changePassSuccess && (
                  <p className="text-xs text-emerald-600 font-bold">{changePassSuccess}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-black'
                    }`}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
