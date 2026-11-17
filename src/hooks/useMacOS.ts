import { useCallback, useMemo, useState } from 'react';
import { INITIAL_WINDOWS, WALLPAPERS } from '../data/macFilesystem';
import { AppId, MacTheme, MacWindowState } from '../types/mac';

export function useMacOS() {
  const [windows, setWindows] = useState<Record<AppId, MacWindowState>>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(40);
  const [activeAppId, setActiveAppId] = useState<AppId>('finder');
  const [finderFolderId, setFinderFolderId] = useState<string>('projects');
  const [theme, setTheme] = useState<MacTheme>('dark');
  const [wallpaperId, setWallpaperId] = useState<string>('aurora');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [dockMagnification, setDockMagnification] = useState<boolean>(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [trackIndex, setTrackIndex] = useState<number>(0);

  const focusWindow = useCallback(
    (appId: AppId) => {
      setTopZ((z) => {
        const nextZ = z + 1;
        setWindows((prev) => ({
          ...prev,
          [appId]: {
            ...prev[appId],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        }));
        return nextZ;
      });
      setActiveAppId(appId);
    },
    []
  );

  const openApp = useCallback(
    (appId: AppId) => {
      focusWindow(appId);
    },
    [focusWindow]
  );

  const openFolder = useCallback(
    (folderId: string) => {
      setFinderFolderId(folderId);
      focusWindow('finder');
    },
    [focusWindow]
  );

  const closeWindow = useCallback((appId: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      },
    }));
  }, []);

  const minimizeWindow = useCallback((appId: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMinimized: true,
      },
    }));
  }, []);

  const toggleMaximizeWindow = useCallback(
    (appId: AppId) => {
      setTopZ((z) => {
        const nextZ = z + 1;
        setWindows((prev) => ({
          ...prev,
          [appId]: {
            ...prev[appId],
            isMaximized: !prev[appId].isMaximized,
            zIndex: nextZ,
          },
        }));
        return nextZ;
      });
      setActiveAppId(appId);
    },
    []
  );

  const resetWindows = useCallback(() => {
    setWindows(INITIAL_WINDOWS);
    setTopZ(40);
    setActiveAppId('finder');
    setFinderFolderId('projects');
  }, []);

  const selectWallpaper = useCallback((id: string) => {
    setCustomWallpaperUrl(null);
    setWallpaperId(id);
  }, []);

  const applyCustomWallpaper = useCallback((url: string) => {
    setCustomWallpaperUrl(url);
  }, []);

  const activeWallpaper = useMemo(
    () => WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0],
    [wallpaperId]
  );

  const activeAppName = useMemo(() => {
    return windows[activeAppId]?.title ?? 'Finder';
  }, [windows, activeAppId]);

  return {
    windows,
    activeAppId,
    activeAppName,
    finderFolderId,
    setFinderFolderId,
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    wallpaperId,
    customWallpaperUrl,
    activeWallpaper,
    selectWallpaper,
    applyCustomWallpaper,
    brightness,
    setBrightness,
    dockMagnification,
    setDockMagnification,
    toggleDockMagnification: () => setDockMagnification((m) => !m),
    isSpotlightOpen,
    setIsSpotlightOpen,
    isPlayingMusic,
    togglePlayMusic: () => setIsPlayingMusic((p) => !p),
    trackIndex,
    setTrackIndex,
    focusWindow,
    openApp,
    openFolder,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    resetWindows,
  };
}
