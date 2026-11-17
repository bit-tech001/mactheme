import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Moon,
  Pause,
  Play,
  Search,
  SlidersHorizontal,
  Sun,
  Wifi,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AppId, MacTheme } from '../../types/mac';
import { MUSIC_TRACKS, WALLPAPERS } from '../../data/macFilesystem';

interface MacMenuBarProps {
  activeAppName: string;
  theme: MacTheme;
  onToggleTheme: () => void;
  brightness: number;
  onChangeBrightness: (val: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSpotlight: () => void;
  onOpenApp: (appId: AppId) => void;
  onOpenFolder: (folderId: string) => void;
  onResetWindows: () => void;
  onSelectWallpaper: (id: string) => void;
  activeWallpaperId: string;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
  trackIndex: number;
}

export function MacMenuBar({
  activeAppName,
  theme,
  onToggleTheme,
  brightness,
  onChangeBrightness,
  isFullscreen,
  onToggleFullscreen,
  onOpenSpotlight,
  onOpenApp,
  onOpenFolder,
  onResetWindows,
  onSelectWallpaper,
  activeWallpaperId,
  isPlayingMusic,
  onTogglePlayMusic,
  trackIndex,
}: MacMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<'system' | 'file' | 'view' | 'control' | null>(null);
  const [now, setNow] = useState(() => new Date());
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  const isDark = theme === 'dark';
  const formattedTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const track = MUSIC_TRACKS[trackIndex] ?? MUSIC_TRACKS[0];

  const menuSurface = isDark
    ? 'bg-[#1D1F25]/92 border-white/15 text-white'
    : 'bg-white/92 border-black/10 text-zinc-900';

  const menuItemClass = `w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between gap-4 ${
    isDark ? 'hover:bg-[#0A84FF] hover:text-white' : 'hover:bg-[#007AFF] hover:text-white'
  }`;

  return (
    <div
      ref={barRef}
      className={`relative z-50 h-7 px-3 flex items-center justify-between text-[12px] select-none backdrop-blur-2xl border-b shrink-0 ${
        isDark
          ? 'bg-black/35 border-white/10 text-white/95'
          : 'bg-white/55 border-black/8 text-zinc-900'
      }`}
    >
      {/* Left Menu Cluster */}
      <div className="flex items-center gap-1 min-w-0">
        {/* Kanso / System Emblem */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'system' ? null : 'system')}
            aria-label="System menu"
            className={`px-2 py-0.5 rounded-[5px] flex items-center justify-center transition-colors ${
              openMenu === 'system'
                ? isDark
                  ? 'bg-white/18'
                  : 'bg-black/10'
                : isDark
                ? 'hover:bg-white/12'
                : 'hover:bg-black/8'
            }`}
          >
            <svg viewBox="0 0 18 18" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <path d="M13.6 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1-.1-2.2-.8-2.2-3.2zM11.6 3.5c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
            </svg>
          </button>

          <AnimatePresence>
            {openMenu === 'system' && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className={`absolute left-0 top-7 w-52 p-1.5 rounded-xl border backdrop-blur-2xl shadow-2xl ${menuSurface}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenApp('settings');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>System Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenApp('terminal');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Launch Terminal</span>
                </button>
                <div className={`my-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/8'}`} />
                <button
                  type="button"
                  onClick={() => {
                    onToggleTheme();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Switch to {isDark ? 'Light' : 'Dark'} Glass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetWindows();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Reset Window Layout</span>
                </button>
                <div className={`my-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/8'}`} />
                <button
                  type="button"
                  onClick={() => {
                    onToggleFullscreen();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active App Name */}
        <span className="px-2 font-bold tracking-tight truncate max-w-[120px]">
          {activeAppName}
        </span>

        {/* File Menu */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
            className={`px-2 py-0.5 rounded-[5px] font-medium transition-colors ${
              openMenu === 'file'
                ? isDark
                  ? 'bg-white/18'
                  : 'bg-black/10'
                : isDark
                ? 'hover:bg-white/12'
                : 'hover:bg-black/8'
            }`}
          >
            File
          </button>
          <AnimatePresence>
            {openMenu === 'file' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className={`absolute left-0 top-7 w-48 p-1.5 rounded-xl border backdrop-blur-2xl shadow-2xl ${menuSurface}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenFolder('projects');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Open Studio Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenFolder('assets');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Open Design Assets</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenApp('notes');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>New Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenApp('photos');
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Browse Photos</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Menu */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
            className={`px-2 py-0.5 rounded-[5px] font-medium transition-colors ${
              openMenu === 'view'
                ? isDark
                  ? 'bg-white/18'
                  : 'bg-black/10'
                : isDark
                ? 'hover:bg-white/12'
                : 'hover:bg-black/8'
            }`}
          >
            View
          </button>
          <AnimatePresence>
            {openMenu === 'view' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className={`absolute left-0 top-7 w-48 p-1.5 rounded-xl border backdrop-blur-2xl shadow-2xl ${menuSurface}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onToggleTheme();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Toggle {isDark ? 'Light' : 'Dark'} Glass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleFullscreen();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetWindows();
                    setOpenMenu(null);
                  }}
                  className={menuItemClass}
                >
                  <span>Arrange Default Windows</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Status Cluster */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenSpotlight}
          aria-label="Open Spotlight Search"
          className={`px-1.5 py-0.5 rounded-[5px] flex items-center gap-1 transition-colors ${
            isDark ? 'hover:bg-white/12' : 'hover:bg-black/8'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[10.5px] opacity-65 font-mono">⌘K</span>
        </button>

        <span className="px-1 opacity-85 hidden sm:inline-flex" aria-hidden="true">
          <Wifi className="w-3.5 h-3.5" />
        </span>

        {/* Control Center */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'control' ? null : 'control')}
            aria-label="Open Control Center"
            className={`px-1.5 py-0.5 rounded-[5px] flex items-center transition-colors ${
              openMenu === 'control'
                ? isDark
                  ? 'bg-white/18'
                  : 'bg-black/10'
                : isDark
                ? 'hover:bg-white/12'
                : 'hover:bg-black/8'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {openMenu === 'control' && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className={`absolute right-0 top-7 w-64 p-3 rounded-2xl border backdrop-blur-2xl shadow-2xl space-y-3 ${menuSurface}`}
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      isDark
                        ? 'bg-white/8 border-white/10 hover:bg-white/12'
                        : 'bg-black/5 border-black/8 hover:bg-black/8'
                    }`}
                  >
                    {isDark ? <Moon className="w-4 h-4 text-[#0A84FF]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <div>
                      <div className="text-[11px] font-semibold">Appearance</div>
                      <div className="text-[10px] opacity-65">{isDark ? 'Dark' : 'Light'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleFullscreen}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      isDark
                        ? 'bg-white/8 border-white/10 hover:bg-white/12'
                        : 'bg-black/5 border-black/8 hover:bg-black/8'
                    }`}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-[#0A84FF]" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-[#0A84FF]" />
                    )}
                    <div>
                      <div className="text-[11px] font-semibold">Display</div>
                      <div className="text-[10px] opacity-65">
                        {isFullscreen ? 'Windowed' : 'Fullscreen'}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Display Brightness */}
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-white/6 border-white/10' : 'bg-black/4 border-black/8'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                    <span>Display Brightness</span>
                    <span className="tabular-nums opacity-65">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={100}
                    value={brightness}
                    onChange={(e) => onChangeBrightness(Number(e.target.value))}
                    aria-label="Display brightness"
                    className="w-full h-1.5 accent-[#0A84FF] cursor-pointer"
                  />
                </div>

                {/* Wallpaper Quick Switch */}
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-white/6 border-white/10' : 'bg-black/4 border-black/8'
                  }`}
                >
                  <div className="text-[11px] font-medium mb-1.5">Wallpaper</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {WALLPAPERS.map((wp) => (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => onSelectWallpaper(wp.id)}
                        title={wp.name}
                        aria-label={`Set wallpaper ${wp.name}`}
                        style={{
                          backgroundImage: wp.src ? `url(${wp.src})` : wp.gradient,
                        }}
                        className={`aspect-video rounded-md bg-cover bg-center border transition-transform active:scale-95 ${
                          activeWallpaperId === wp.id
                            ? 'border-[#0A84FF] ring-2 ring-[#0A84FF]/40'
                            : 'border-white/20 opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Mini Now Playing */}
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    isDark ? 'bg-white/6 border-white/10' : 'bg-black/4 border-black/8'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold truncate">{track.title}</div>
                    <div className="text-[10px] opacity-60 truncate">{track.artist}</div>
                  </div>
                  <button
                    type="button"
                    onClick={onTogglePlayMusic}
                    aria-label={isPlayingMusic ? 'Pause music' : 'Play music'}
                    className="w-7 h-7 rounded-full bg-[#0A84FF] text-white flex items-center justify-center shrink-0 hover:bg-[#0070E0] transition-colors"
                  >
                    {isPlayingMusic ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className={`px-1.5 py-0.5 rounded-[5px] transition-colors hidden sm:inline-flex ${
            isDark ? 'hover:bg-white/12' : 'hover:bg-black/8'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Live Tabular Clock */}
        <span className="pl-1 font-medium tabular-nums whitespace-nowrap">
          <span className="hidden sm:inline">{formattedDate} </span>
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
