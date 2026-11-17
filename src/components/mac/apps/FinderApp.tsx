import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  LayoutGrid,
  List,
  Search,
  X,
  Monitor,
  Clock,
  Layers,
  AppWindow,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { VFS_FOLDERS, VFS_ITEMS } from '../../../data/macFilesystem';
import { MacTheme, VFileItem } from '../../../types/mac';
import { MacFileIcon } from '../MacIcons';

interface FinderAppProps {
  theme: MacTheme;
  currentFolderId: string;
  onNavigateFolder: (folderId: string) => void;
  onSetWallpaper?: (src: string) => void;
}

const SIDEBAR_LOCATIONS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'projects', label: 'Studio Projects', icon: Layers },
  { id: 'assets', label: 'Design Assets', icon: Folder },
  { id: 'archive', label: 'Brand Archive', icon: Clock },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'applications', label: 'Applications', icon: AppWindow },
];

export function FinderApp({
  theme,
  currentFolderId,
  onNavigateFolder,
  onSetWallpaper,
}: FinderAppProps) {
  const [history, setHistory] = useState<string[]>([currentFolderId]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quickLookItem, setQuickLookItem] = useState<VFileItem | null>(null);

  const isDark = theme === 'dark';

  // Sync external navigation into history
  const activeFolderId = currentFolderId;

  const navigateTo = (folderId: string) => {
    if (folderId === activeFolderId) return;
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(folderId);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setSelectedId(null);
    setQuickLookItem(null);
    onNavigateFolder(folderId);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = () => {
    if (!canGoBack) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    onNavigateFolder(history[idx]);
  };

  const goForward = () => {
    if (!canGoForward) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    onNavigateFolder(history[idx]);
  };

  const items = useMemo(() => {
    const base = query.trim()
      ? VFS_ITEMS.filter((item) =>
          item.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      : VFS_ITEMS.filter((item) => item.parentId === activeFolderId);
    return base;
  }, [activeFolderId, query]);

  const currentFolder = VFS_FOLDERS[activeFolderId] ?? { id: activeFolderId, name: 'Finder', parentId: null };

  const handleOpenItem = (item: VFileItem) => {
    if (item.kind === 'folder' && item.targetFolderId) {
      setQuery('');
      navigateTo(item.targetFolderId);
    } else {
      setQuickLookItem(item);
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Sidebar */}
      <aside
        className={`w-40 shrink-0 p-2.5 border-r flex flex-col gap-1 overflow-y-auto mac-scrollbar ${
          isDark
            ? 'bg-black/20 border-white/10 text-white/80'
            : 'bg-black/[0.03] border-black/8 text-zinc-700'
        }`}
      >
        <div
          className={`px-2 pt-1 pb-1 text-[10.5px] font-semibold tracking-tight ${
            isDark ? 'text-white/40' : 'text-zinc-400'
          }`}
        >
          Favorites
        </div>
        {SIDEBAR_LOCATIONS.map((loc) => {
          const Icon = loc.icon;
          const active = activeFolderId === loc.id && !query.trim();
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => {
                setQuery('');
                navigateTo(loc.id);
              }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left whitespace-nowrap ${
                active
                  ? isDark
                    ? 'bg-[#0A84FF]/25 text-white'
                    : 'bg-[#007AFF]/14 text-[#0062CC]'
                  : isDark
                  ? 'hover:bg-white/8 text-white/80'
                  : 'hover:bg-black/5 text-zinc-700'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  active ? 'text-[#0A84FF]' : isDark ? 'text-white/55' : 'text-zinc-500'
                }`}
              />
              <span className="truncate">{loc.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Finder Inner Toolbar */}
        <div
          className={`h-10 px-3 flex items-center justify-between gap-2 border-b shrink-0 ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/8 bg-white/40'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              aria-label="Back"
              className={`p-1 rounded-md transition-colors ${
                canGoBack
                  ? isDark
                    ? 'hover:bg-white/10 text-white/85'
                    : 'hover:bg-black/8 text-zinc-700'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goForward}
              disabled={!canGoForward}
              aria-label="Forward"
              className={`p-1 rounded-md transition-colors ${
                canGoForward
                  ? isDark
                    ? 'hover:bg-white/10 text-white/85'
                    : 'hover:bg-black/8 text-zinc-700'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-1.5 text-xs font-semibold truncate">
              {query.trim() ? `Search: "${query.trim()}"` : currentFolder.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Segmented View Toggle */}
            <div
              className={`flex items-center p-0.5 rounded-md ${
                isDark ? 'bg-white/8' : 'bg-black/6'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Icon view"
                className={`p-1 rounded-[4px] transition-colors ${
                  viewMode === 'grid'
                    ? isDark
                      ? 'bg-white/15 text-white'
                      : 'bg-white text-zinc-900 shadow-xs'
                    : isDark
                    ? 'text-white/50 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1 rounded-[4px] transition-colors ${
                  viewMode === 'list'
                    ? isDark
                      ? 'bg-white/15 text-white'
                      : 'bg-white text-zinc-900 shadow-xs'
                    : isDark
                    ? 'text-white/50 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Field */}
            <div
              className={`relative flex items-center rounded-md px-2 py-1 text-xs border ${
                isDark
                  ? 'bg-black/25 border-white/10 text-white placeholder:text-white/40'
                  : 'bg-white/70 border-black/10 text-zinc-800 placeholder:text-zinc-400'
              }`}
            >
              <Search className="w-3 h-3 opacity-50 mr-1.5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search files"
                className="w-20 focus:w-28 transition-all bg-transparent outline-none text-[11.5px]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="ml-1 opacity-60 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* File Listing */}
        <div className="flex-1 overflow-y-auto p-3 mac-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 text-xs">
              <Folder className="w-8 h-8 mb-2 opacity-40" />
              <p>No items match your filter.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {items.map((item) => {
                const selected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      handleOpenItem(item);
                    }}
                    className={`group flex flex-col items-center p-2.5 rounded-lg transition-colors text-center ${
                      selected
                        ? isDark
                          ? 'bg-[#0A84FF]/25 ring-1 ring-[#0A84FF]/50'
                          : 'bg-[#007AFF]/12 ring-1 ring-[#007AFF]/40'
                        : isDark
                        ? 'hover:bg-white/7'
                        : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="mb-1.5 transition-transform duration-150 group-hover:scale-105">
                      <MacFileIcon
                        kind={item.kind}
                        previewImage={item.previewImage}
                        className="w-12 h-11"
                      />
                    </div>
                    <span className="text-[11.5px] font-medium leading-tight line-clamp-2 break-words">
                      {item.name}
                    </span>
                    <span
                      className={`mt-0.5 text-[10px] tabular-nums ${
                        isDark ? 'text-white/45' : 'text-zinc-500'
                      }`}
                    >
                      {item.size}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    handleOpenItem(item);
                  }}
                  className={`flex items-center justify-between gap-3 px-2.5 py-2 rounded-md text-left transition-colors ${
                    isDark ? 'hover:bg-white/8' : 'hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MacFileIcon
                      kind={item.kind}
                      previewImage={item.previewImage}
                      className="w-6 h-6 shrink-0"
                    />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </div>
                  <div
                    className={`flex items-center gap-4 text-[11px] tabular-nums shrink-0 ${
                      isDark ? 'text-white/50' : 'text-zinc-500'
                    }`}
                  >
                    <span>{item.modified}</span>
                    <span className="w-14 text-right">{item.size}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Breadcrumb Status Bar */}
        <div
          className={`h-7 px-3 border-t flex items-center justify-between text-[11px] tabular-nums shrink-0 ${
            isDark
              ? 'border-white/10 text-white/50 bg-black/15'
              : 'border-black/8 text-zinc-500 bg-black/[0.02]'
          }`}
        >
          <span>{items.length} items · Click any folder or file to inspect</span>
          <span>Macintosh HD</span>
        </div>
      </div>

      {/* Quick Look Sheet */}
      <AnimatePresence>
        {quickLookItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-2 z-20 rounded-xl border backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl ${
              isDark
                ? 'bg-[#181A20]/95 border-white/15 text-white'
                : 'bg-white/95 border-black/12 text-zinc-900'
            }`}
          >
            <div
              className={`h-9 px-3 flex items-center justify-between border-b shrink-0 ${
                isDark ? 'border-white/10' : 'border-black/8'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold truncate">{quickLookItem.name}</span>
                {quickLookItem.meta && (
                  <span className="text-[11px] opacity-55 truncate hidden sm:inline">
                    · {quickLookItem.meta}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {quickLookItem.previewImage && onSetWallpaper && (
                  <button
                    type="button"
                    onClick={() => onSetWallpaper(quickLookItem.previewImage!)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#0A84FF] text-white hover:bg-[#0070E0] transition-colors whitespace-nowrap"
                  >
                    Set as Wallpaper
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setQuickLookItem(null)}
                  aria-label="Close Quick Look"
                  className={`p-1 rounded-md ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-black/8'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto mac-scrollbar flex items-center justify-center">
              {quickLookItem.previewImage ? (
                <img
                  src={quickLookItem.previewImage}
                  alt={quickLookItem.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                />
              ) : (
                <pre
                  className={`w-full h-full p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-auto ${
                    isDark ? 'bg-black/35 text-white/85' : 'bg-zinc-100 text-zinc-800'
                  }`}
                >
                  {quickLookItem.content || 'Preview unavailable for this file type.'}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
