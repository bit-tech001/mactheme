import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { VFS_FOLDERS, VFS_ITEMS } from '../../data/macFilesystem';
import { AppId, MacTheme, MacWindowState, WallpaperOption } from '../../types/mac';
import { MacDock } from './MacDock';
import { MacFileIcon } from './MacIcons';
import { MacMenuBar } from './MacMenuBar';
import { MacWindow } from './MacWindow';
import { FinderApp } from './apps/FinderApp';
import { MusicApp } from './apps/MusicApp';
import { NotesApp } from './apps/NotesApp';
import { PhotosApp } from './apps/PhotosApp';
import { SettingsApp } from './apps/SettingsApp';
import { TerminalApp } from './apps/TerminalApp';

interface MacDesktopProps {
  windows: Record<AppId, MacWindowState>;
  activeAppId: AppId;
  activeAppName: string;
  finderFolderId: string;
  setFinderFolderId: (id: string) => void;
  theme: MacTheme;
  setTheme: (theme: MacTheme) => void;
  toggleTheme: () => void;
  wallpaperId: string;
  customWallpaperUrl: string | null;
  activeWallpaper: WallpaperOption;
  selectWallpaper: (id: string) => void;
  applyCustomWallpaper: (url: string) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  dockMagnification: boolean;
  toggleDockMagnification: () => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (open: boolean) => void;
  isPlayingMusic: boolean;
  togglePlayMusic: () => void;
  trackIndex: number;
  setTrackIndex: (i: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onFocusWindow: (id: AppId) => void;
  onOpenApp: (id: AppId) => void;
  onOpenFolder: (id: string) => void;
  onCloseWindow: (id: AppId) => void;
  onMinimizeWindow: (id: AppId) => void;
  onToggleMaximizeWindow: (id: AppId) => void;
  onResetWindows: () => void;
}

const APP_LIST: Array<{ id: AppId; label: string; kind: string }> = [
  { id: 'finder', label: 'Finder', kind: 'System File Browser' },
  { id: 'notes', label: 'Notes', kind: 'Editable Studio Notes' },
  { id: 'photos', label: 'Photos', kind: 'Media & Wallpapers' },
  { id: 'terminal', label: 'Terminal', kind: 'Interactive zsh Shell' },
  { id: 'music', label: 'Music', kind: 'Audio Player' },
  { id: 'settings', label: 'System Settings', kind: 'Appearance & Display' },
];

export function MacDesktop({
  windows,
  activeAppId,
  activeAppName,
  finderFolderId,
  setFinderFolderId,
  theme,
  setTheme,
  toggleTheme,
  wallpaperId,
  customWallpaperUrl,
  activeWallpaper,
  selectWallpaper,
  applyCustomWallpaper,
  brightness,
  setBrightness,
  dockMagnification,
  toggleDockMagnification,
  isSpotlightOpen,
  setIsSpotlightOpen,
  isPlayingMusic,
  togglePlayMusic,
  trackIndex,
  setTrackIndex,
  isFullscreen,
  onToggleFullscreen,
  onFocusWindow,
  onOpenApp,
  onOpenFolder,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onResetWindows,
}: MacDesktopProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const spotlightInputRef = useRef<HTMLInputElement>(null);
  const [selectedDesktopId, setSelectedDesktopId] = useState<string | null>(null);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [wallpaperFailed, setWallpaperFailed] = useState(false);

  const desktopIcons = useMemo(
    () => VFS_ITEMS.filter((item) => item.parentId === 'desktop'),
    []
  );

  // Cmd+K / Ctrl+K Spotlight shortcut + Esc handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(!isSpotlightOpen);
      } else if (e.key === 'Escape') {
        if (isSpotlightOpen) {
          setIsSpotlightOpen(false);
        } else if (isFullscreen) {
          onToggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSpotlightOpen, setIsSpotlightOpen, isFullscreen, onToggleFullscreen]);

  useEffect(() => {
    if (isSpotlightOpen) {
      setSpotlightQuery('');
      setTimeout(() => spotlightInputRef.current?.focus(), 40);
    }
  }, [isSpotlightOpen]);

  const wallpaperSrc = customWallpaperUrl || activeWallpaper.src;

  useEffect(() => {
    setWallpaperFailed(false);
  }, [wallpaperSrc]);

  const spotlightResults = useMemo(() => {
    const q = spotlightQuery.trim().toLowerCase();
    const apps = APP_LIST.filter((a) => !q || a.label.toLowerCase().includes(q)).map((a) => ({
      key: `app-${a.id}`,
      title: a.label,
      subtitle: a.kind,
      action: () => {
        onOpenApp(a.id);
        setIsSpotlightOpen(false);
      },
    }));

    const folders = Object.values(VFS_FOLDERS)
      .filter((f) => !q || f.name.toLowerCase().includes(q))
      .map((f) => ({
        key: `folder-${f.id}`,
        title: f.name,
        subtitle: 'Folder · Finder',
        action: () => {
          onOpenFolder(f.id);
          setIsSpotlightOpen(false);
        },
      }));

    return [...apps, ...folders].slice(0, 6);
  }, [spotlightQuery, onOpenApp, onOpenFolder, setIsSpotlightOpen]);

  const isDark = theme === 'dark';

  const screenContent = (
    <div
      ref={desktopRef}
      onClick={() => setSelectedDesktopId(null)}
      className={`relative w-full overflow-hidden flex flex-col ${
        isFullscreen ? 'h-full rounded-none' : 'h-[560px] sm:h-[620px] lg:h-[660px] rounded-[14px]'
      }`}
      style={{
        background: activeWallpaper.gradient,
      }}
    >
      {/* Wallpaper Image Layer */}
      {wallpaperSrc && !wallpaperFailed && (
        <img
          src={wallpaperSrc}
          alt={activeWallpaper.name}
          referrerPolicy="no-referrer"
          onError={() => setWallpaperFailed(true)}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500"
        />
      )}

      {/* Subtle Ambient Vignette + Brightness Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${((100 - brightness) / 100) * 0.72 + (isDark ? 0.14 : 0.03)})`,
        }}
      />

      {/* macOS Menu Bar */}
      <MacMenuBar
        activeAppName={activeAppName}
        theme={theme}
        onToggleTheme={toggleTheme}
        brightness={brightness}
        onChangeBrightness={setBrightness}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onOpenApp={onOpenApp}
        onOpenFolder={onOpenFolder}
        onResetWindows={onResetWindows}
        onSelectWallpaper={selectWallpaper}
        activeWallpaperId={wallpaperId}
        isPlayingMusic={isPlayingMusic}
        onTogglePlayMusic={togglePlayMusic}
        trackIndex={trackIndex}
      />

      {/* Desktop Canvas: Right-Aligned macOS Folders & Files + Window Layer */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Desktop Icons Column (Classic macOS Right Edge) */}
        <div
          aria-label="Desktop folders and files"
          className="absolute top-4 right-4 z-10 flex flex-col items-end gap-3"
        >
          {desktopIcons.map((item, idx) => {
            const selected = selectedDesktopId === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDesktopId(item.id);
                  if (item.kind === 'folder' && item.targetFolderId) {
                    onOpenFolder(item.targetFolderId);
                  } else if (item.kind === 'image') {
                    onOpenApp('photos');
                  } else {
                    onOpenApp('notes');
                  }
                }}
                className={`group w-20 flex flex-col items-center p-1.5 rounded-lg transition-colors cursor-pointer ${
                  selected
                    ? 'bg-white/20 ring-1 ring-white/40 backdrop-blur-md'
                    : 'hover:bg-white/12'
                }`}
              >
                <div className="transition-transform duration-150 group-hover:scale-105 group-active:scale-95 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
                  <MacFileIcon
                    kind={item.kind}
                    previewImage={item.previewImage}
                    className="w-12 h-11"
                  />
                </div>
                <span className="mt-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-white text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2">
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Open Windows */}
        <AnimatePresence>
          {windows.finder.isOpen && (
            <MacWindow
              key="finder"
              win={windows.finder}
              isActive={activeAppId === 'finder'}
              theme={theme}
              constraintsRef={desktopRef}
              entranceDelay={0.12}
              onFocus={() => onFocusWindow('finder')}
              onClose={() => onCloseWindow('finder')}
              onMinimize={() => onMinimizeWindow('finder')}
              onToggleMaximize={() => onToggleMaximizeWindow('finder')}
            >
              <FinderApp
                theme={theme}
                currentFolderId={finderFolderId}
                onNavigateFolder={setFinderFolderId}
                onSetWallpaper={applyCustomWallpaper}
              />
            </MacWindow>
          )}

          {windows.notes.isOpen && (
            <MacWindow
              key="notes"
              win={windows.notes}
              isActive={activeAppId === 'notes'}
              theme={theme}
              constraintsRef={desktopRef}
              entranceDelay={0.22}
              onFocus={() => onFocusWindow('notes')}
              onClose={() => onCloseWindow('notes')}
              onMinimize={() => onMinimizeWindow('notes')}
              onToggleMaximize={() => onToggleMaximizeWindow('notes')}
            >
              <NotesApp theme={theme} />
            </MacWindow>
          )}

          {windows.music.isOpen && (
            <MacWindow
              key="music"
              win={windows.music}
              isActive={activeAppId === 'music'}
              theme={theme}
              constraintsRef={desktopRef}
              entranceDelay={0.32}
              onFocus={() => onFocusWindow('music')}
              onClose={() => onCloseWindow('music')}
              onMinimize={() => onMinimizeWindow('music')}
              onToggleMaximize={() => onToggleMaximizeWindow('music')}
            >
              <MusicApp
                theme={theme}
                isPlaying={isPlayingMusic}
                onTogglePlay={togglePlayMusic}
                trackIndex={trackIndex}
                onChangeTrack={setTrackIndex}
              />
            </MacWindow>
          )}

          {windows.photos.isOpen && (
            <MacWindow
              key="photos"
              win={windows.photos}
              isActive={activeAppId === 'photos'}
              theme={theme}
              constraintsRef={desktopRef}
              onFocus={() => onFocusWindow('photos')}
              onClose={() => onCloseWindow('photos')}
              onMinimize={() => onMinimizeWindow('photos')}
              onToggleMaximize={() => onToggleMaximizeWindow('photos')}
            >
              <PhotosApp theme={theme} onSetWallpaper={applyCustomWallpaper} />
            </MacWindow>
          )}

          {windows.terminal.isOpen && (
            <MacWindow
              key="terminal"
              win={windows.terminal}
              isActive={activeAppId === 'terminal'}
              theme={theme}
              constraintsRef={desktopRef}
              onFocus={() => onFocusWindow('terminal')}
              onClose={() => onCloseWindow('terminal')}
              onMinimize={() => onMinimizeWindow('terminal')}
              onToggleMaximize={() => onToggleMaximizeWindow('terminal')}
            >
              <TerminalApp
                theme={theme}
                onOpenApp={onOpenApp}
                onSetTheme={setTheme}
                onOpenFolder={onOpenFolder}
              />
            </MacWindow>
          )}

          {windows.settings.isOpen && (
            <MacWindow
              key="settings"
              win={windows.settings}
              isActive={activeAppId === 'settings'}
              theme={theme}
              constraintsRef={desktopRef}
              onFocus={() => onFocusWindow('settings')}
              onClose={() => onCloseWindow('settings')}
              onMinimize={() => onMinimizeWindow('settings')}
              onToggleMaximize={() => onToggleMaximizeWindow('settings')}
            >
              <SettingsApp
                theme={theme}
                onSetTheme={setTheme}
                activeWallpaperUrl={customWallpaperUrl}
                activeWallpaperId={wallpaperId}
                onSelectWallpaper={selectWallpaper}
                dockMagnification={dockMagnification}
                onToggleMagnification={toggleDockMagnification}
                onResetWindows={onResetWindows}
              />
            </MacWindow>
          )}
        </AnimatePresence>

        {/* Spotlight Search Overlay */}
        <AnimatePresence>
          {isSpotlightOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              onClick={() => setIsSpotlightOpen(false)}
              className="absolute inset-0 z-50 bg-black/25 backdrop-blur-[2px] flex items-start justify-center pt-16 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden ${
                  isDark
                    ? 'bg-[#1D1F25]/92 border-white/18 text-white'
                    : 'bg-white/92 border-black/12 text-zinc-900'
                }`}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 border-b ${
                    isDark ? 'border-white/10' : 'border-black/8'
                  }`}
                >
                  <Search className="w-4 h-4 opacity-55 shrink-0" />
                  <input
                    ref={spotlightInputRef}
                    type="text"
                    value={spotlightQuery}
                    onChange={(e) => setSpotlightQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && spotlightResults[0]) {
                        spotlightResults[0].action();
                      }
                    }}
                    placeholder="Spotlight Search — apps, folders, files"
                    aria-label="Spotlight Search"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSpotlightOpen(false)}
                    aria-label="Close Spotlight"
                    className="p-1 rounded-md opacity-60 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-1.5 max-h-64 overflow-y-auto mac-scrollbar">
                  {spotlightResults.length === 0 ? (
                    <div className="py-6 text-center text-xs opacity-55">
                      No matching apps or folders.
                    </div>
                  ) : (
                    spotlightResults.map((res, idx) => (
                      <button
                        key={res.key}
                        type="button"
                        onClick={res.action}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          idx === 0
                            ? isDark
                              ? 'bg-[#0A84FF]/25 text-white'
                              : 'bg-[#007AFF]/12 text-[#005BBF]'
                            : isDark
                            ? 'hover:bg-white/8'
                            : 'hover:bg-black/5'
                        }`}
                      >
                        <span className="text-xs font-semibold">{res.title}</span>
                        <span className="text-[11px] opacity-60">{res.subtitle}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* macOS Parabolic Dock */}
        <MacDock
          windows={windows}
          magnification={dockMagnification}
          theme={theme}
          onActivateApp={onOpenApp}
          onResetWindows={onResetWindows}
        />
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {screenContent}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1160px] mx-auto">
      {/* Studio Display Aluminum & Obsidian Chassis */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[24px] p-[10px] sm:p-[13px] bg-gradient-to-b from-[#2A2D35] via-[#17191E] to-[#101216] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)]"
      >
        {/* Top Camera Dot */}
        <div
          aria-hidden="true"
          className="absolute top-[5px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0A0C10] ring-1 ring-white/15"
        />
        {screenContent}
      </motion.div>

      {/* Minimalist Anodized Display Stand Silhouette */}
      <div aria-hidden="true" className="hidden sm:flex flex-col items-center">
        <div className="w-28 h-10 bg-gradient-to-b from-[#3A3E47] via-[#272A31] to-[#1D1F25] border-x border-white/10" />
        <div className="w-52 h-2.5 rounded-b-md bg-gradient-to-r from-[#23262D] via-[#4B505C] to-[#23262D] shadow-lg ring-1 ring-white/10" />
      </div>
    </div>
  );
}
