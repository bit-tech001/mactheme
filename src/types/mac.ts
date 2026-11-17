export type AppId = 'finder' | 'notes' | 'photos' | 'terminal' | 'music' | 'settings';

export type MacTheme = 'dark' | 'light';

export interface MacWindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  defaultPos: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

export type FileKind = 'folder' | 'image' | 'markdown' | 'code' | 'video' | 'pdf';

export interface VFileItem {
  id: string;
  name: string;
  kind: FileKind;
  parentId: string;
  size: string;
  modified: string;
  previewImage?: string;
  content?: string;
  targetFolderId?: string;
  meta?: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  subtitle: string;
  src?: string;
  gradient: string;
}

export interface NoteItem {
  id: string;
  title: string;
  updatedAt: string;
  folder: string;
  body: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSec: number;
  coverGradient: string;
}
