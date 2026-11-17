import React from 'react';
import { Monitor, Moon, RotateCcw, Sun } from 'lucide-react';
import { WALLPAPERS } from '../../../data/macFilesystem';
import { MacTheme } from '../../../types/mac';

interface SettingsAppProps {
  theme: MacTheme;
  onSetTheme: (theme: MacTheme) => void;
  activeWallpaperUrl: string | null;
  activeWallpaperId: string;
  onSelectWallpaper: (id: string) => void;
  dockMagnification: boolean;
  onToggleMagnification: () => void;
  onResetWindows: () => void;
}

export function SettingsApp({
  theme,
  onSetTheme,
  activeWallpaperUrl,
  activeWallpaperId,
  onSelectWallpaper,
  dockMagnification,
  onToggleMagnification,
  onResetWindows,
}: SettingsAppProps) {
  const isDark = theme === 'dark';

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5 mac-scrollbar">
      {/* Appearance */}
      <section>
        <h3 className="text-xs font-semibold mb-2">Appearance</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSetTheme('dark')}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              isDark
                ? 'border-[#0A84FF] bg-[#0A84FF]/15'
                : 'border-black/10 hover:border-black/25 bg-white/50'
            }`}
          >
            <Moon className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-xs font-semibold">Dark Glass</div>
              <div className="text-[10.5px] opacity-60">Obsidian frosted vibrancy</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSetTheme('light')}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              !isDark
                ? 'border-[#007AFF] bg-[#007AFF]/12'
                : 'border-white/10 hover:border-white/25 bg-white/[0.04]'
            }`}
          >
            <Sun className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-xs font-semibold">Light Glass</div>
              <div className="text-[10.5px] opacity-60">Alabaster daylight blur</div>
            </div>
          </button>
        </div>
      </section>

      {/* Wallpapers */}
      <section>
        <h3 className="text-xs font-semibold mb-2">Desktop Wallpaper</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {WALLPAPERS.map((wp) => {
            const isSelected = !activeWallpaperUrl && activeWallpaperId === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => onSelectWallpaper(wp.id)}
                className={`text-left rounded-lg overflow-hidden border transition-all ${
                  isSelected
                    ? 'border-[#0A84FF] ring-2 ring-[#0A84FF]/30'
                    : isDark
                    ? 'border-white/12 hover:border-white/30'
                    : 'border-black/10 hover:border-black/25'
                }`}
              >
                <div
                  className="aspect-video w-full bg-cover bg-center"
                  style={{
                    backgroundImage: wp.src ? `url(${wp.src})` : wp.gradient,
                  }}
                />
                <div className="p-2">
                  <div className="text-[11.5px] font-semibold truncate">{wp.name}</div>
                  <div className="text-[10px] opacity-55 truncate">{wp.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dock & Layout */}
      <section
        className={`pt-3 border-t flex items-center justify-between gap-4 ${
          isDark ? 'border-white/10' : 'border-black/8'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 opacity-60" />
          <div>
            <div className="text-xs font-semibold">Dock Magnification</div>
            <div className="text-[10.5px] opacity-60">Parabolic cursor scaling</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleMagnification}
          aria-pressed={dockMagnification}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            dockMagnification
              ? 'bg-[#0A84FF] text-white'
              : isDark
              ? 'bg-white/10 text-white/75'
              : 'bg-black/8 text-zinc-700'
          }`}
        >
          {dockMagnification ? 'Enabled' : 'Disabled'}
        </button>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onResetWindows}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDark
              ? 'border-white/15 hover:bg-white/8 text-white/85'
              : 'border-black/12 hover:bg-black/5 text-zinc-800'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Window Arrangement
        </button>
      </div>
    </div>
  );
}
