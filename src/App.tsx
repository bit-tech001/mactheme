import React, { useState } from 'react';
import { ArrowUpRight, Command, FolderOpen, Maximize2, Minimize2, Sparkles, Terminal } from 'lucide-react';
import { MacDesktop } from './components/mac/MacDesktop';
import { useMacOS } from './hooks/useMacOS';
import { AppId } from './types/mac';

const APP_SHOWCASE: Array<{
  id: AppId;
  name: string;
  category: string;
  summary: string;
  span: string;
}> = [
  {
    id: 'finder',
    name: 'Finder & Quick Look',
    category: 'File System · Nested Folders',
    summary:
      'Navigate nested Studio Projects, Design Assets, and Brand Archive folders with grid or list views, instant filtering, and inline Quick Look sheets.',
    span: 'md:col-span-2',
  },
  {
    id: 'notes',
    name: 'Notes Studio',
    category: 'Rich Editor · Live Word Count',
    summary:
      'Write, filter, and create notes directly inside a translucent glass window without leaving the desktop canvas.',
    span: 'md:col-span-1',
  },
  {
    id: 'photos',
    name: 'Photos & Wallpapers',
    category: 'Media Library · Display P3',
    summary:
      'Inspect studio photography in a responsive lightbox and apply any frame directly as your active desktop wallpaper.',
    span: 'md:col-span-1',
  },
  {
    id: 'terminal',
    name: 'Interactive Shell',
    category: 'zsh · Live Desktop Control',
    summary:
      'Run commands like ls, cd projects, open photos, or theme light to control windows and appearance directly from the terminal.',
    span: 'md:col-span-2',
  },
];

const ARCHITECTURE_PILLARS = [
  {
    index: '01.',
    title: 'Critically Damped Window Springs',
    detail:
      'Every window enters, minimizes, and restores on a 380 / 32 spring curve so motion feels weighted and natural without bouncy overshoot.',
    spec: '380 stiffness · 32 damping',
  },
  {
    index: '02.',
    title: 'Parabolic Dock Magnification',
    detail:
      'Cursor proximity continuously drives compositor-only scale and vertical lift across dock icons inside a 120px cosine falloff radius.',
    spec: '1.48x peak · GPU transform',
  },
  {
    index: '03.',
    title: 'True Z-Index Stacking & Traffic Lights',
    detail:
      'Click any window to promote its layer, drag by the titlebar within display bounds, minimize to the dock, or double-click to zoom.',
    spec: 'Multi-window · Drag bounded',
  },
  {
    index: '04.',
    title: 'Spotlight & Control Center',
    detail:
      'Press Cmd+K to jump straight to any folder or app, or open Control Center to tune screen brightness, glass theme, and playback.',
    spec: 'Cmd+K · Live Control Center',
  },
];

export default function App() {
  const mac = useMacOS();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const launchAndScrollToScreen = (action: () => void) => {
    action();
    if (!isFullscreen) {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-[#F5F5F7] flex flex-col">
      {/* Top Bar Contract: 3 zones, gap-8, single-line controls */}
      <header className="sticky top-0 z-40 bg-[#0B0C0F]/82 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-[1200px] mx-auto h-16 px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#workspace"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Kanso
          </a>

          {/* Zone 2: 4 Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            <a
              href="#workspace"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Workspace
            </a>
            <a
              href="#applications"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Applications
            </a>
            <a
              href="#architecture"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Architecture
            </a>
            <a
              href="#shortcuts"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Shortcuts
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#F5F5F7] text-[#0B0C0F] hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Enter Fullscreen
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Live Animated Mac Screen */}
        <section id="workspace" className="pt-10 pb-20 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Editorial Hero Copy */}
            <div className="max-w-2xl mx-auto text-center mb-8">
              <p className="text-xs font-medium tracking-wide text-zinc-400 mb-3">
                Interactive Desktop Hero · Frosted Glass · Spring Window Physics
              </p>
              <h1
                className="font-display font-bold tracking-tight text-white leading-[1.08] [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                A living Mac desktop, crafted for the browser.
              </h1>
              <p className="mt-4 text-[15px] sm:text-base text-zinc-400 leading-relaxed [text-wrap:balance]">
                Drag frosted glass windows, inspect nested project folders, run shell commands, and glide across a spring-animated dock right inside the display.
              </p>

              {/* Quick Interactive Triggers */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => mac.openFolder('projects')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0A84FF] text-white hover:bg-[#0070E0] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Open Studio Folder
                </button>
                <button
                  type="button"
                  onClick={() => mac.openApp('terminal')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white/7 text-zinc-200 border border-white/10 hover:bg-white/12 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Launch Terminal
                </button>
                <button
                  type="button"
                  onClick={() => mac.setIsSpotlightOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white/7 text-zinc-200 border border-white/10 hover:bg-white/12 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Command className="w-3.5 h-3.5" />
                  Spotlight (⌘K)
                </button>
                <button
                  type="button"
                  onClick={mac.toggleTheme}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white/7 text-zinc-200 border border-white/10 hover:bg-white/12 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {mac.theme === 'dark' ? 'Switch to Light Glass' : 'Switch to Dark Glass'}
                </button>
              </div>
            </div>

            {/* Live Mac Display Screen */}
            <MacDesktop
              windows={mac.windows}
              activeAppId={mac.activeAppId}
              activeAppName={mac.activeAppName}
              finderFolderId={mac.finderFolderId}
              setFinderFolderId={mac.setFinderFolderId}
              theme={mac.theme}
              setTheme={mac.setTheme}
              toggleTheme={mac.toggleTheme}
              wallpaperId={mac.wallpaperId}
              customWallpaperUrl={mac.customWallpaperUrl}
              activeWallpaper={mac.activeWallpaper}
              selectWallpaper={mac.selectWallpaper}
              applyCustomWallpaper={mac.applyCustomWallpaper}
              brightness={mac.brightness}
              setBrightness={mac.setBrightness}
              dockMagnification={mac.dockMagnification}
              toggleDockMagnification={mac.toggleDockMagnification}
              isSpotlightOpen={mac.isSpotlightOpen}
              setIsSpotlightOpen={mac.setIsSpotlightOpen}
              isPlayingMusic={mac.isPlayingMusic}
              togglePlayMusic={mac.togglePlayMusic}
              trackIndex={mac.trackIndex}
              setTrackIndex={mac.setTrackIndex}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              onFocusWindow={mac.focusWindow}
              onOpenApp={mac.openApp}
              onOpenFolder={mac.openFolder}
              onCloseWindow={mac.closeWindow}
              onMinimizeWindow={mac.minimizeWindow}
              onToggleMaximizeWindow={mac.toggleMaximizeWindow}
              onResetWindows={mac.resetWindows}
            />
          </div>
        </section>

        {/* Applications Bento Section */}
        <section id="applications" className="py-20 px-6 border-t border-white/8">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-xl mb-10">
              <p className="text-xs font-medium text-zinc-400 mb-2">Built-in Applications</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
                Every icon in the dock opens a working workspace.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {APP_SHOWCASE.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => launchAndScrollToScreen(() => mac.openApp(item.id))}
                  className={`${item.span} group text-left p-6 rounded-xl bg-[#12141A] border border-white/10 hover:border-white/25 transition-colors flex flex-col justify-between gap-6 cursor-pointer`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-zinc-400">{item.category}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#0A84FF] group-hover:underline underline-offset-4">
                    Open {item.name.split(' ')[0]} in Display
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture & Smooth Mac Feel Specs */}
        <section id="architecture" className="py-20 px-6 border-t border-white/8">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-xl mb-12">
              <p className="text-xs font-medium text-zinc-400 mb-2">Interaction Craft</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
                Engineered around tactile macOS physics.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {ARCHITECTURE_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="pt-5 border-t border-white/10 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg font-semibold text-white">
                        {pillar.index} {pillar.title}
                      </h3>
                      <span className="font-mono text-[11px] text-zinc-400 tabular-nums whitespace-nowrap">
                        {pillar.spec}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shortcuts & Fullscreen Conversion Section */}
        <section id="shortcuts" className="py-20 px-6 border-t border-white/8">
          <div className="max-w-[1200px] mx-auto rounded-2xl bg-[#12141A] border border-white/10 p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                Experience the desktop edge to edge.
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Press <span className="font-mono text-zinc-200">Cmd + K</span> to open Spotlight anywhere, double-click any window titlebar to zoom, or expand into fullscreen display mode.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#F5F5F7] text-[#0B0C0F] hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Launch Fullscreen Desktop
              </button>
              <button
                type="button"
                onClick={() => launchAndScrollToScreen(mac.resetWindows)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-white/7 text-zinc-200 border border-white/10 hover:bg-white/12 transition-colors whitespace-nowrap cursor-pointer"
              >
                Reset Window Layout
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span className="font-display font-semibold text-zinc-300">Kanso Desktop</span>
          <span>Drag titlebars · Click folders · Cmd+K Spotlight</span>
          <span>© 2026 Kanso Studio</span>
        </div>
      </footer>
    </div>
  );
}
