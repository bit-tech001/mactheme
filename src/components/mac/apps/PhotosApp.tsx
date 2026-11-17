import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MacTheme } from '../../../types/mac';

interface PhotoEntry {
  id: string;
  title: string;
  category: 'studio' | 'wallpapers';
  meta: string;
  src: string;
}

const GALLERY_PHOTOS: PhotoEntry[] = [
  {
    id: 'p-hardware',
    title: 'Anodized Workstation',
    category: 'studio',
    meta: '2400 × 1800 · Limestone Studio',
    src: '/src/assets/images/project_hardware_studio_1794937065481.jpg',
  },
  {
    id: 'p-interior',
    title: 'Oak Drafting Atelier',
    category: 'studio',
    meta: '2400 × 1800 · Leica 35mm',
    src: '/src/assets/images/project_editorial_space_1794937065530.jpg',
  },
  {
    id: 'p-aurora',
    title: 'Sonoma Dusk Silk',
    category: 'wallpapers',
    meta: '3840 × 2160 · 16:9 Wallpaper',
    src: '/src/assets/images/mac_wallpaper_aurora_1794937063891.jpg',
  },
  {
    id: 'p-alpine',
    title: 'Sierra Sunrise Ridge',
    category: 'wallpapers',
    meta: '3840 × 2160 · 16:9 Wallpaper',
    src: '/src/assets/images/mac_wallpaper_alpine_1794937064512.jpg',
  },
];

export function PhotosApp({
  theme,
  onSetWallpaper,
}: {
  theme: MacTheme;
  onSetWallpaper: (src: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'studio' | 'wallpapers'>('all');
  const [selected, setSelected] = useState<PhotoEntry | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const visiblePhotos = GALLERY_PHOTOS.filter((p) =>
    filter === 'all' ? true : p.category === filter
  );

  const handleApplyWallpaper = (photo: PhotoEntry) => {
    onSetWallpaper(photo.src);
    setAppliedId(photo.id);
    setTimeout(() => setAppliedId(null), 1800);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Toolbar */}
      <div
        className={`h-10 px-3.5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-white/10' : 'border-black/8'
        }`}
      >
        <div
          className={`flex items-center gap-1 p-0.5 rounded-lg text-xs ${
            isDark ? 'bg-white/8' : 'bg-black/6'
          }`}
        >
          {(['all', 'studio', 'wallpapers'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium capitalize transition-colors whitespace-nowrap ${
                filter === tab
                  ? isDark
                    ? 'bg-white/16 text-white'
                    : 'bg-white text-zinc-900 shadow-xs'
                  : isDark
                  ? 'text-white/55 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className={`text-[11px] tabular-nums ${isDark ? 'text-white/45' : 'text-zinc-500'}`}>
          {visiblePhotos.length} photos
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 mac-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {visiblePhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              className={`group text-left rounded-lg overflow-hidden border transition-all ${
                isDark
                  ? 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  : 'border-black/8 bg-white/60 hover:border-black/20'
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-900/20">
                <img
                  src={photo.src}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-2.5">
                <div className="text-xs font-semibold truncate">{photo.title}</div>
                <div
                  className={`text-[10.5px] mt-0.5 truncate tabular-nums ${
                    isDark ? 'text-white/50' : 'text-zinc-500'
                  }`}
                >
                  {photo.meta}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className={`absolute inset-0 z-20 flex flex-col backdrop-blur-2xl ${
              isDark ? 'bg-[#121419]/95 text-white' : 'bg-white/95 text-zinc-900'
            }`}
          >
            <div
              className={`h-10 px-3.5 border-b flex items-center justify-between shrink-0 ${
                isDark ? 'border-white/10' : 'border-black/8'
              }`}
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold">{selected.title}</span>
                <span className="text-[11px] opacity-55 ml-2 hidden sm:inline">
                  · {selected.meta}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleApplyWallpaper(selected)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#0A84FF] text-white hover:bg-[#0070E0] transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {appliedId === selected.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      Applied
                    </>
                  ) : (
                    'Use as Desktop'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close photo preview"
                  className={`p-1 rounded-md ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-black/8'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={selected.src}
                alt={selected.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full rounded-lg object-contain shadow-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
