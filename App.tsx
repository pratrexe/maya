import React, { useState, useEffect, useCallback } from 'react';
import { THEMES } from './constants/themes';
import { SYSTEM_APPS } from './constants/apps';
import {
  INITIAL_USER,
  INITIAL_METRICS,
  INITIAL_EVENTS,
  INITIAL_TRACKS,
  INITIAL_NOTES,
  INITIAL_FILES,
} from './constants/initialData';
import {
  AppId,
  CalendarEvent,
  FileItem,
  NoteItem,
  SystemMetrics,
  ThemeConfig,
  Track,
  WindowState,
} from './types/os';
import { Widgets } from './components/desktop/Widgets';
import { Dock } from './components/desktop/Dock';
import { StartMenu } from './components/start/StartMenu';
import { ControlCenter } from './components/controlCenter/ControlCenter';
import { WindowManager } from './components/window/WindowManager';
import { LockScreen } from './components/lock/LockScreen';
import { PowerDialog } from './components/desktop/PowerDialog';
import {
  playUiClick,
  playUiChime,
  startAmbientMusic,
  stopAmbientMusic,
} from './utils/audio';
import { Power, Sparkles, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Theme & Appearance
  const [currentThemeId, setCurrentThemeId] = useState<string>('coral');
  const [theme, setTheme] = useState<ThemeConfig>(THEMES.coral);

  // System status
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [userName, setUserName] = useState<string>(INITIAL_USER.name);

  // UI Panels
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isPowerDialogOpen, setIsPowerDialogOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [widgetsVisible, setWidgetsVisible] = useState(true);

  // Windows
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  // Apps Data
  const [tracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  // Dynamic Theme Switching
  const handleSelectTheme = (themeId: string) => {
    if (THEMES[themeId]) {
      setCurrentThemeId(themeId);
      setTheme(THEMES[themeId]);
    }
  };

  const handleCycleTheme = () => {
    const keys = Object.keys(THEMES);
    const currIdx = keys.indexOf(currentThemeId);
    const nextKey = keys[(currIdx + 1) % keys.length];
    handleSelectTheme(nextKey);
  };

  const handleSetWallpaper = (url: string) => {
    setTheme((prev) => ({
      ...prev,
      wallpaper: url,
    }));
  };

  const handleUpdateMetrics = (partial: Partial<SystemMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...partial }));
  };

  // Music controls
  const currentTrack = tracks[currentTrackIndex];

  const handleTogglePlay = () => {
    playUiClick();
    if (!isPlaying) {
      setIsPlaying(true);
      startAmbientMusic(metrics.volume);
    } else {
      setIsPlaying(false);
      stopAmbientMusic();
    }
  };

  const handleNextTrack = () => {
    playUiClick();
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    playUiClick();
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSelectTrack = (track: Track) => {
    playUiClick();
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      if (!isPlaying) {
        setIsPlaying(true);
        startAmbientMusic(metrics.volume);
      }
    }
  };

  // Window Management
  const handleOpenApp = (appId: AppId | string) => {
    const appMeta = SYSTEM_APPS.find((a) => a.id === appId);
    if (!appMeta) return;

    // Check if window exists
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 }
            : w
        )
      );
      setActiveWindowId(existing.id);
      setZIndexCounter((z) => z + 1);
      return;
    }

    // Otherwise create new window
    const newZ = zIndexCounter + 1;
    setZIndexCounter(newZ);

    const defaultW = appMeta.defaultWidth || 700;
    const defaultH = appMeta.defaultHeight || 500;
    const offset = (windows.length % 5) * 28;
    const startX = Math.max(30, Math.min(window.innerWidth - defaultW - 30, 80 + offset));
    const startY = Math.max(30, Math.min(window.innerHeight - defaultH - 90, 60 + offset));

    const newWin: WindowState = {
      id: `win-${Date.now()}-${appId}`,
      appId: appMeta.id,
      title: appMeta.name,
      icon: appMeta.icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: { x: startX, y: startY },
      size: { width: defaultW, height: defaultH },
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  const handleFocusWindow = (id: string) => {
    const newZ = zIndexCounter + 1;
    setZIndexCounter(newZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
    );
    setActiveWindowId(id);
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const handleUpdatePosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w))
      );
    },
    []
  );

  // Power actions
  const handlePowerAction = (
    action: 'shutdown' | 'restart' | 'lock' | 'sleep'
  ) => {
    setIsPowerDialogOpen(false);
    setIsStartOpen(false);

    if (action === 'lock') {
      setIsLocked(true);
    } else if (action === 'shutdown') {
      stopAmbientMusic();
      setIsPlaying(false);
      setIsShutDown(true);
    } else if (action === 'restart') {
      stopAmbientMusic();
      setIsPlaying(false);
      setIsBooting(true);
      setTimeout(() => {
        setIsBooting(false);
        playUiChime();
      }, 1600);
    } else if (action === 'sleep') {
      setIsLocked(true);
    }
  };

  // Handle right click on desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 200),
      visible: true,
    });
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        e.preventDefault();
        setIsStartOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsStartOpen(false);
        setIsControlCenterOpen(false);
        setIsPowerDialogOpen(false);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // System boot sequence simulation
  if (isShutDown) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white select-none">
        <button
          onClick={() => {
            setIsShutDown(false);
            setIsBooting(true);
            setTimeout(() => {
              setIsBooting(false);
              playUiChime();
            }, 1800);
          }}
          className="group flex flex-col items-center gap-4 cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-red-400 group-hover:bg-red-500/20 shadow-2xl">
            <Power className="w-8 h-8 text-white group-hover:text-red-400 transition-colors" />
          </div>
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold group-hover:text-white transition-colors">
            Power On WebOS
          </span>
        </button>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#160d13] flex flex-col items-center justify-center text-white select-none">
        <div className="relative w-24 h-24 mb-6 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 blur-lg opacity-70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-xl font-bold font-['DM_Serif_Display'] tracking-wide">
          Material You WebOS
        </h2>
        <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden mt-4">
          <div className="h-full bg-rose-400 rounded-full animate-pulse w-3/4" />
        </div>
        <span className="text-[11px] text-white/50 mt-2 font-mono">
          Loading Monet dynamic color engine...
        </span>
      </div>
    );
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu?.visible) setContextMenu(null);
      }}
      className="relative w-screen h-screen overflow-hidden select-none bg-cover bg-center transition-all duration-700 ease-out"
      style={{
        backgroundImage: `url(${theme.wallpaper})`,
      }}
    >
      {/* Night Light amber overlay if enabled */}
      {metrics.nightLight && (
        <div className="fixed inset-0 bg-amber-500/10 pointer-events-none z-50 mix-blend-multiply" />
      )}

      {/* Desktop Main Content Area */}
      <div className="relative z-10 w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 overflow-y-auto pt-6 pb-2">
        {/* Material You Homescreen Widgets (Screenshot 1) */}
        {widgetsVisible && (
          <Widgets
            theme={theme}
            metrics={metrics}
            onUpdateMetrics={handleUpdateMetrics}
            events={events}
            userName={userName}
            onOpenApp={handleOpenApp}
          />
        )}
      </div>

      {/* Floating Bottom Taskbar / Dock (Screenshot 1) */}
      <Dock
        theme={theme}
        metrics={metrics}
        windows={windows}
        isStartOpen={isStartOpen}
        isControlCenterOpen={isControlCenterOpen}
        onToggleStart={() => {
          setIsStartOpen(!isStartOpen);
          setIsControlCenterOpen(false);
        }}
        onToggleControlCenter={() => {
          setIsControlCenterOpen(!isControlCenterOpen);
          setIsStartOpen(false);
        }}
        onOpenApp={handleOpenApp}
        onTogglePowerMenu={() => setIsPowerDialogOpen(true)}
        onToggleNightLight={() =>
          handleUpdateMetrics({ nightLight: !metrics.nightLight })
        }
        onUpdateMetrics={handleUpdateMetrics}
      />

      {/* Material You Start Menu (Screenshot 2) */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        theme={theme}
        metrics={metrics}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onOpenApp={(id) => {
          handleOpenApp(id);
          setIsStartOpen(false);
        }}
        onOpenFolder={(_folder) => {
          handleOpenApp('files');
          setIsStartOpen(false);
        }}
        onPowerAction={handlePowerAction}
      />

      {/* Material You Control Center / System Status Tray (Screenshot 3) */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        theme={theme}
        metrics={metrics}
        onUpdateMetrics={handleUpdateMetrics}
        onOpenApp={(id) => {
          handleOpenApp(id);
          setIsControlCenterOpen(false);
        }}
        onToggleTheme={handleCycleTheme}
      />

      {/* Window Manager (Active draggable app windows) */}
      <WindowManager
        windows={windows}
        activeWindowId={activeWindowId}
        theme={theme}
        metrics={metrics}
        tracks={tracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        events={events}
        notes={notes}
        files={files}
        userName={userName}
        onFocusWindow={handleFocusWindow}
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={handleMinimizeWindow}
        onMaximizeWindow={handleMaximizeWindow}
        onUpdatePosition={handleUpdatePosition}
        onSelectTheme={handleSelectTheme}
        onUpdateMetrics={handleUpdateMetrics}
        onUpdateUserName={(name) => setUserName(name)}
        onSelectTrack={handleSelectTrack}
        onTogglePlay={handleTogglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onAddEvent={(evt) => setEvents((prev) => [evt, ...prev])}
        onDeleteEvent={(id) =>
          setEvents((prev) => prev.filter((e) => e.id !== id))
        }
        onAddNote={(note) => setNotes((prev) => [note, ...prev])}
        onUpdateNote={(note) =>
          setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)))
        }
        onDeleteNote={(id) =>
          setNotes((prev) => prev.filter((n) => n.id !== id))
        }
        onAddFile={(file) => setFiles((prev) => [file, ...prev])}
        onDeleteFile={(id) =>
          setFiles((prev) => prev.filter((f) => f.id !== id))
        }
        onSetWallpaper={handleSetWallpaper}
      />

      {/* Power Dialog Modal */}
      <PowerDialog
        isOpen={isPowerDialogOpen}
        onClose={() => setIsPowerDialogOpen(false)}
        theme={theme}
        onAction={handlePowerAction}
      />

      {/* Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        theme={theme}
        metrics={metrics}
        userName={userName}
      />

      {/* Desktop Right-Click Context Menu */}
      {contextMenu?.visible && (
        <div
          className="fixed z-50 py-1.5 w-48 rounded-2xl shadow-xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 text-xs font-semibold"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.cardBorder,
            color: theme.colors.dockText,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              playUiClick();
              handleOpenApp('photos');
              setContextMenu(null);
            }}
            className="w-full px-3.5 py-2 text-left hover:bg-black/5 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Change Wallpaper</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              handleCycleTheme();
              setContextMenu(null);
            }}
            className="w-full px-3.5 py-2 text-left hover:bg-black/5 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            <span>Cycle Theme Colors</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              setWidgetsVisible(!widgetsVisible);
              setContextMenu(null);
            }}
            className="w-full px-3.5 py-2 text-left hover:bg-black/5 flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>{widgetsVisible ? 'Hide Widgets' : 'Show Widgets'}</span>
          </button>

          <div className="h-[1px] bg-black/10 my-1" />

          <button
            onClick={() => {
              playUiClick();
              handleOpenApp('settings');
              setContextMenu(null);
            }}
            className="w-full px-3.5 py-2 text-left hover:bg-black/5 flex items-center gap-2 cursor-pointer"
          >
            <span>Personalize...</span>
          </button>
        </div>
      )}
    </div>
  );
}
