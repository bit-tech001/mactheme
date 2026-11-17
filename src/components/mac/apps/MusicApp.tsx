import React, { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { MUSIC_TRACKS } from '../../../data/macFilesystem';
import { MacTheme } from '../../../types/mac';

interface MusicAppProps {
  theme: MacTheme;
  isPlaying: boolean;
  onTogglePlay: () => void;
  trackIndex: number;
  onChangeTrack: (index: number) => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicApp({
  theme,
  isPlaying,
  onTogglePlay,
  trackIndex,
  onChangeTrack,
}: MusicAppProps) {
  const track = MUSIC_TRACKS[trackIndex] ?? MUSIC_TRACKS[0];
  const [progress, setProgress] = useState(42);
  const isDark = theme === 'dark';

  useEffect(() => {
    setProgress(12);
  }, [trackIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + 1 >= track.durationSec) {
          onChangeTrack((trackIndex + 1) % MUSIC_TRACKS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, track.durationSec, trackIndex, onChangeTrack]);

  const pct = Math.min(100, (progress / track.durationSec) * 100);

  return (
    <div className="h-full p-3.5 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        {/* Album Cover */}
        <div
          style={{ background: track.coverGradient }}
          className="w-14 h-14 rounded-lg shadow-md shrink-0 flex items-end justify-center p-1.5 gap-0.5 ring-1 ring-white/15"
        >
          {[0.45, 0.85, 0.6, 0.95].map((h, idx) => (
            <span
              key={idx}
              style={{
                height: isPlaying ? `${Math.round(h * 18)}px` : '4px',
                transition: `height ${180 + idx * 70}ms ease`,
              }}
              className="w-1 rounded-full bg-white/85"
            />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold truncate">{track.title}</div>
          <div
            className={`text-[11.5px] truncate ${
              isDark ? 'text-white/60' : 'text-zinc-600'
            }`}
          >
            {track.artist}
          </div>
          <div
            className={`text-[10.5px] truncate mt-0.5 ${
              isDark ? 'text-white/40' : 'text-zinc-400'
            }`}
          >
            {track.album}
          </div>
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="space-y-2">
        <div>
          <input
            type="range"
            min={0}
            max={track.durationSec}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="Track progress"
            className="w-full h-1 accent-[#F43F5E] cursor-pointer"
          />
          <div
            className={`flex justify-between text-[10px] tabular-nums mt-0.5 ${
              isDark ? 'text-white/45' : 'text-zinc-500'
            }`}
          >
            <span>{formatTime(progress)}</span>
            <span>-{formatTime(Math.max(0, track.durationSec - progress))}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              onChangeTrack((trackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length)
            }
            aria-label="Previous track"
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-black/8 text-zinc-700'
            }`}
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
              isDark
                ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeTrack((trackIndex + 1) % MUSIC_TRACKS.length)}
            aria-label="Next track"
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-black/8 text-zinc-700'
            }`}
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
        <div className="sr-only">Track progress {Math.round(pct)}%</div>
      </div>
    </div>
  );
}
