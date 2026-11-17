import React from 'react';
import { FileKind } from '../../types/mac';

export function MacFolderIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="macFolderBack" x1="32" y1="4" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#69C5FF" />
          <stop offset="100%" stopColor="#2889E8" />
        </linearGradient>
        <linearGradient id="macFolderFront" x1="32" y1="14" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#81D2FF" />
          <stop offset="20%" stopColor="#56B5FC" />
          <stop offset="100%" stopColor="#2E8FF2" />
        </linearGradient>
      </defs>
      {/* Back tab */}
      <path
        d="M6 10C6 6.68629 8.68629 4 12 4H22.3431C23.9344 4 25.4606 4.63214 26.5858 5.75736L29.4142 8.58579C30.5394 9.711 32.0656 10.3431 33.6569 10.3431H52C55.3137 10.3431 58 13.0294 58 16.3431V46C58 49.3137 55.3137 52 52 52H12C8.68629 52 6 49.3137 6 46V10Z"
        fill="url(#macFolderBack)"
      />
      {/* Paper sheet peek */}
      <rect x="10" y="12" width="44" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      {/* Front folder face */}
      <rect x="4" y="15" width="56" height="37" rx="5.5" fill="url(#macFolderFront)" />
      {/* Top specular highlight */}
      <path
        d="M9.5 15.5H54.5"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Subtle engraved horizontal ridge */}
      <rect x="4" y="45" width="56" height="2" fill="rgba(12, 62, 128, 0.14)" />
    </svg>
  );
}

export function MacFileIcon({
  kind,
  previewImage,
  className = 'w-11 h-12',
}: {
  kind: FileKind;
  previewImage?: string;
  className?: string;
}) {
  if (kind === 'folder') {
    return <MacFolderIcon className={className} />;
  }

  if (kind === 'image' && previewImage) {
    return (
      <div className={`${className} relative rounded-md overflow-hidden bg-white/90 p-0.5 shadow-md ring-1 ring-black/15`}>
        <img
          src={previewImage}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[4px]"
        />
      </div>
    );
  }

  const badgeLabel =
    kind === 'code' ? 'TS' : kind === 'pdf' ? 'PDF' : kind === 'video' ? 'MOV' : 'MD';
  const badgeColor =
    kind === 'code'
      ? '#0284C7'
      : kind === 'pdf'
      ? '#DC2626'
      : kind === 'video'
      ? '#7C3AED'
      : '#334155';

  return (
    <svg viewBox="0 0 48 56" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6C6 3.79086 7.79086 2 10 2H31L42 13V50C42 52.2091 40.2091 54 38 54H10C7.79086 54 6 52.2091 6 50V6Z"
        fill="#F8FAFC"
      />
      <path
        d="M31 2L42 13H34C32.3431 13 31 11.6569 31 10V2Z"
        fill="#CBD5E1"
      />
      <path
        d="M6 6C6 3.79086 7.79086 2 10 2H31L42 13V50C42 52.2091 40.2091 54 38 54H10C7.79086 54 6 52.2091 6 50V6Z"
        stroke="rgba(15,23,42,0.14)"
        strokeWidth="1"
      />
      <rect x="11" y="21" width="26" height="2" rx="1" fill="#CBD5E1" />
      <rect x="11" y="26" width="20" height="2" rx="1" fill="#CBD5E1" />
      <rect x="11" y="31" width="24" height="2" rx="1" fill="#CBD5E1" />
      <rect x="11" y="38" width="26" height="10" rx="2.5" fill={badgeColor} />
      <text
        x="24"
        y="45.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="7"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
      >
        {badgeLabel}
      </text>
    </svg>
  );
}

export function DockFinderIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="finderLeft" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#63C7FF" />
          <stop offset="100%" stopColor="#1E79E8" />
        </linearGradient>
        <linearGradient id="finderRight" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#DBE4F0" />
        </linearGradient>
        <clipPath id="squircleFinder">
          <rect x="2" y="2" width="60" height="60" rx="14" />
        </clipPath>
      </defs>
      <g clipPath="url(#squircleFinder)">
        <rect x="2" y="2" width="60" height="60" fill="url(#finderRight)" />
        <path d="M2 2H34C29 22 29 42 35 62H2V2Z" fill="url(#finderLeft)" />
        {/* Eyes */}
        <rect x="18" y="21" width="3.5" height="9" rx="1.75" fill="#172554" />
        <rect x="42.5" y="21" width="3.5" height="9" rx="1.75" fill="#172554" />
        {/* Nose divider */}
        <path d="M33.5 18C30 28 30 35 35 37.5H29.5" stroke="#172554" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Smile */}
        <path d="M18 42C24 49 40 49 46 42" stroke="#172554" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
      <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DockNotesIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="notesHeader" x1="0" y1="2" x2="0" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
        <clipPath id="squircleNotes">
          <rect x="2" y="2" width="60" height="60" rx="14" />
        </clipPath>
      </defs>
      <g clipPath="url(#squircleNotes)">
        <rect x="2" y="2" width="60" height="60" fill="#FEFDFB" />
        <rect x="2" y="2" width="60" height="17" fill="url(#notesHeader)" />
        <line x1="2" y1="19" x2="62" y2="19" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="2" y1="30" x2="62" y2="30" stroke="#E5E7EB" strokeWidth="1.2" />
        <line x1="2" y1="41" x2="62" y2="41" stroke="#E5E7EB" strokeWidth="1.2" />
        <line x1="2" y1="52" x2="62" y2="52" stroke="#E5E7EB" strokeWidth="1.2" />
      </g>
      <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DockPhotosIcon() {
  const petals = [
    { rot: 0, color: '#F97316' },
    { rot: 45, color: '#FACC15' },
    { rot: 90, color: '#84CC16' },
    { rot: 135, color: '#10B981' },
    { rot: 180, color: '#06B6D4' },
    { rot: 225, color: '#3B82F6' },
    { rot: 270, color: '#8B5CF6' },
    { rot: 315, color: '#EC4899' },
  ];
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#FFFFFF" />
      <g transform="translate(32, 32)">
        {petals.map((p) => (
          <rect
            key={p.rot}
            x="-5.5"
            y="-21"
            width="11"
            height="17"
            rx="5.5"
            fill={p.color}
            opacity="0.88"
            transform={`rotate(${p.rot})`}
          />
        ))}
      </g>
      <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DockTerminalIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="termBg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#termBg)" />
      <rect x="4" y="4" width="56" height="56" rx="12" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
      <path d="M16 21L26 28.5L16 36" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="29" y="34" width="13" height="3.2" rx="1.6" fill="#F8FAFC" />
    </svg>
  );
}

export function DockMusicIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="musicBg" x1="0" y1="2" x2="64" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="55%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#musicBg)" />
      <path
        d="M25 41.5V20.5C25 19.3 25.8 18.2 27 17.9L43.5 14C45.1 13.6 46.5 14.8 46.5 16.4V37.5"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20.5" cy="43.5" r="5" fill="#FFFFFF" />
      <circle cx="41.5" cy="39.5" r="5" fill="#FFFFFF" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DockSettingsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="settingsBg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4D4D8" />
          <stop offset="100%" stopColor="#71717A" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#settingsBg)" />
      <circle cx="32" cy="32" r="18" fill="#3F3F46" stroke="#E4E4E7" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="11" fill="none" stroke="#A1A1AA" strokeWidth="4" strokeDasharray="4 4" />
      <circle cx="32" cy="32" r="5.5" fill="#E4E4E7" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DockTrashIcon({ hasItems = false }: { hasItems?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="trashBody" x1="32" y1="14" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </linearGradient>
      </defs>
      <path d="M15 16L18.5 53C18.8 55.2 20.6 57 22.8 57H41.2C43.4 57 45.2 55.2 45.5 53L49 16H15Z" fill="url(#trashBody)" />
      <ellipse cx="32" cy="16" rx="17" ry="4.5" fill="#F4F4F5" stroke="#D4D4D8" strokeWidth="1.2" />
      <ellipse cx="32" cy="16" rx="14" ry="2.8" fill={hasItems ? '#CBD5E1' : '#71717A'} opacity="0.65" />
      <line x1="24" y1="24" x2="25" y2="50" stroke="#71717A" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      <line x1="32" y1="24" x2="32" y2="50" stroke="#71717A" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      <line x1="40" y1="24" x2="39" y2="50" stroke="#71717A" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}
