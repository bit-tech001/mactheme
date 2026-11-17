import React, { useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { MacTheme, MacWindowState } from '../../types/mac';

interface MacWindowProps {
  win: MacWindowState;
  isActive: boolean;
  theme: MacTheme;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  entranceDelay?: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  headerExtras?: React.ReactNode;
  children: React.ReactNode;
}

export function MacWindow({
  win,
  isActive,
  theme,
  constraintsRef,
  entranceDelay = 0,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  headerExtras,
  children,
}: MacWindowProps) {
  const dragControls = useDragControls();
  const [hoverLights, setHoverLights] = useState(false);

  const isDark = theme === 'dark';

  const surfaceClasses = isDark
    ? 'bg-[#1D1F24]/82 text-[#F5F5F7] border-white/15'
    : 'bg-[#F6F7FA]/86 text-[#18181B] border-white/75';

  const titlebarClasses = isDark
    ? 'bg-white/[0.03] border-b border-white/10'
    : 'bg-black/[0.02] border-b border-black/8';

  const shadowStyle = isActive
    ? isDark
      ? '0 26px 65px -12px rgba(0,0,0,0.68), 0 0 0 1px rgba(255,255,255,0.08)'
      : '0 26px 65px -12px rgba(15,23,42,0.34), 0 0 0 1px rgba(0,0,0,0.08)'
    : isDark
    ? '0 14px 36px -10px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.05)'
    : '0 14px 36px -10px rgba(15,23,42,0.20), 0 0 0 1px rgba(0,0,0,0.05)';

  return (
    <motion.div
      drag={!win.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={constraintsRef}
      dragElastic={0.04}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        win.isMinimized
          ? { opacity: 0, scale: 0.25, y: 260, pointerEvents: 'none' as const }
          : win.isMaximized
          ? { opacity: 1, scale: 1, x: 0, y: 0, pointerEvents: 'auto' as const }
          : { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' as const }
      }
      exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.16 } }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 32,
        mass: 0.85,
        delay: win.isMinimized ? 0 : entranceDelay,
      }}
      onPointerDown={onFocus}
      style={{
        zIndex: win.zIndex,
        boxShadow: shadowStyle,
        ...(win.isMaximized
          ? {
              left: 10,
              top: 10,
              width: 'calc(100% - 20px)',
              height: 'calc(100% - 88px)',
            }
          : {
              left: `clamp(8px, ${win.defaultPos.x}px, calc(100% - 290px))`,
              top: `clamp(8px, ${win.defaultPos.y}px, calc(100% - 220px))`,
              width: `min(${win.defaultSize.width}px, calc(100% - 16px))`,
              height: `min(${win.defaultSize.height}px, calc(100% - 92px))`,
            }),
      }}
      className={`absolute flex flex-col rounded-xl border backdrop-blur-2xl backdrop-saturate-150 overflow-hidden select-none ${surfaceClasses}`}
      role="dialog"
      aria-label={win.title}
    >
      {/* Titlebar (Drag Handle) */}
      <div
        onPointerDown={(e) => {
          onFocus();
          if (!win.isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={onToggleMaximize}
        className={`h-10 px-3.5 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing ${titlebarClasses}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* macOS Traffic Lights */}
          <div
            className="flex items-center gap-2 shrink-0"
            onMouseEnter={() => setHoverLights(true)}
            onMouseLeave={() => setHoverLights(false)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${win.title}`}
              className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/15 flex items-center justify-center text-[8px] font-bold text-black/70 transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-[#0A84FF]"
            >
              {hoverLights ? '×' : ''}
            </button>
            <button
              type="button"
              onClick={onMinimize}
              aria-label={`Minimize ${win.title}`}
              className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/15 flex items-center justify-center text-[9px] font-bold text-black/70 transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-[#0A84FF]"
            >
              {hoverLights ? '−' : ''}
            </button>
            <button
              type="button"
              onClick={onToggleMaximize}
              aria-label={`Zoom ${win.title}`}
              className="w-3 h-3 rounded-full bg-[#28C840] border border-black/15 flex items-center justify-center text-[8px] font-bold text-black/70 transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-[#0A84FF]"
            >
              {hoverLights ? '+' : ''}
            </button>
          </div>

          <span
            className={`text-[12.5px] font-semibold tracking-tight truncate ${
              isDark ? 'text-white/90' : 'text-zinc-900/90'
            }`}
          >
            {win.title}
          </span>
        </div>

        {headerExtras && (
          <div
            className="flex items-center gap-2 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {headerExtras}
          </div>
        )}
      </div>

      {/* App Content Body */}
      <div className="flex-1 min-h-0 overflow-hidden select-text">{children}</div>
    </motion.div>
  );
}
