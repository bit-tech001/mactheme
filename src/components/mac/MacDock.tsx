import React, { useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { AppId, MacTheme, MacWindowState } from '../../types/mac';
import {
  DockFinderIcon,
  DockMusicIcon,
  DockNotesIcon,
  DockPhotosIcon,
  DockSettingsIcon,
  DockTerminalIcon,
  DockTrashIcon,
} from './MacIcons';

interface DockItemDef {
  id: AppId | 'trash';
  label: string;
  renderIcon: () => React.ReactNode;
}

const DOCK_ITEMS: DockItemDef[] = [
  { id: 'finder', label: 'Finder', renderIcon: () => <DockFinderIcon /> },
  { id: 'notes', label: 'Notes', renderIcon: () => <DockNotesIcon /> },
  { id: 'photos', label: 'Photos', renderIcon: () => <DockPhotosIcon /> },
  { id: 'terminal', label: 'Terminal', renderIcon: () => <DockTerminalIcon /> },
  { id: 'music', label: 'Music', renderIcon: () => <DockMusicIcon /> },
  { id: 'settings', label: 'System Settings', renderIcon: () => <DockSettingsIcon /> },
];

interface DockIconProps {
  item: DockItemDef;
  mouseX: MotionValue<number>;
  magnification: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  onActivate: () => void;
  theme: MacTheme;
}

function DockIconButton({
  item,
  mouseX,
  magnification,
  isOpen,
  isMinimized,
  onActivate,
  theme,
}: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return 200;
    return val - (bounds.left + bounds.width / 2);
  });

  const rawScale = useTransform(distance, [-120, 0, 120], [1, magnification ? 1.48 : 1.08, 1]);
  const rawY = useTransform(distance, [-120, 0, 120], [0, magnification ? -12 : -3, 0]);

  const scale = useSpring(rawScale, { stiffness: 420, damping: 28, mass: 0.55 });
  const y = useSpring(rawY, { stiffness: 420, damping: 28, mass: 0.55 });

  const handleClick = () => {
    setBouncing(true);
    onActivate();
    setTimeout(() => setBouncing(false), 450);
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating Tooltip */}
      {hovered && (
        <div
          className={`pointer-events-none absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shadow-lg backdrop-blur-xl border ${
            isDark
              ? 'bg-[#1E2026]/92 text-white border-white/15'
              : 'bg-white/92 text-zinc-900 border-black/10'
          }`}
        >
          {item.label}
          {isMinimized ? ' (Minimized)' : ''}
        </div>
      )}

      <motion.button
        ref={ref}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Open ${item.label}`}
        style={{
          scale,
          y: bouncing ? -16 : y,
          transformOrigin: 'bottom center',
        }}
        whileTap={{ scale: 0.92 }}
        className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-[#0A84FF] cursor-pointer"
      >
        {item.renderIcon()}
      </motion.button>

      {/* Active App Indicator Dot */}
      <span
        aria-hidden="true"
        className={`mt-1 w-1 h-1 rounded-full transition-opacity duration-200 ${
          isOpen
            ? isDark
              ? 'bg-white/90 opacity-100'
              : 'bg-zinc-900/80 opacity-100'
            : 'opacity-0'
        }`}
      />
    </div>
  );
}

interface MacDockProps {
  windows: Record<AppId, MacWindowState>;
  magnification: boolean;
  theme: MacTheme;
  onActivateApp: (appId: AppId) => void;
  onResetWindows: () => void;
}

export function MacDock({
  windows,
  magnification,
  theme,
  onActivateApp,
  onResetWindows,
}: MacDockProps) {
  const mouseX = useMotionValue(Infinity);
  const [trashHover, setTrashHover] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-50 flex justify-center px-3">
      <nav
        aria-label="macOS Dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`pointer-events-auto flex items-end gap-2 sm:gap-2.5 px-3 pt-2 pb-1.5 rounded-2xl border backdrop-blur-2xl backdrop-saturate-150 shadow-2xl ${
          isDark
            ? 'bg-black/38 border-white/16 shadow-[0_14px_40px_rgba(0,0,0,0.55)]'
            : 'bg-white/48 border-white/65 shadow-[0_14px_40px_rgba(15,23,42,0.20)]'
        }`}
      >
        {DOCK_ITEMS.map((item) => {
          const win = windows[item.id as AppId];
          return (
            <DockIconButton
              key={item.id}
              item={item}
              mouseX={mouseX}
              magnification={magnification}
              isOpen={win.isOpen}
              isMinimized={win.isMinimized}
              onActivate={() => onActivateApp(item.id as AppId)}
              theme={theme}
            />
          );
        })}

        {/* Vertical Separator */}
        <div
          aria-hidden="true"
          className={`w-px h-9 self-center mx-0.5 ${
            isDark ? 'bg-white/18' : 'bg-black/15'
          }`}
        />

        {/* Trash / Reset Workspace shortcut */}
        <div className="relative flex flex-col items-center">
          {trashHover && (
            <div
              className={`pointer-events-none absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shadow-lg backdrop-blur-xl border ${
                isDark
                  ? 'bg-[#1E2026]/92 text-white border-white/15'
                  : 'bg-white/92 text-zinc-900 border-black/10'
              }`}
            >
              Reset Desktop
            </div>
          )}
          <motion.button
            type="button"
            onClick={onResetWindows}
            onMouseEnter={() => setTrashHover(true)}
            onMouseLeave={() => setTrashHover(false)}
            whileHover={{ scale: magnification ? 1.24 : 1.06, y: magnification ? -6 : -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            aria-label="Reset desktop windows"
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-[#0A84FF] cursor-pointer"
          >
            <DockTrashIcon />
          </motion.button>
          <span className="mt-1 w-1 h-1 opacity-0" aria-hidden="true" />
        </div>
      </nav>
    </div>
  );
}
