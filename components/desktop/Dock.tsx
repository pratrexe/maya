import React, { useState, useEffect } from 'react';
import {
  Power,
  Search,
  LayoutGrid,
  ChevronUp,
  Volume2,
  VolumeX,
  Battery,
  BatteryCharging,
  Compass,
  Folder,
  FileText,
  Disc,
  Send,
  Camera,
  Video,
  Settings as SettingsIcon,
  Moon,
  Sun,
} from 'lucide-react';
import { AppId, SystemMetrics, ThemeConfig, WindowState } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface DockProps {
  theme: ThemeConfig;
  metrics: SystemMetrics;
  windows: WindowState[];
  isStartOpen: boolean;
  isControlCenterOpen: boolean;
  onToggleStart: () => void;
  onToggleControlCenter: () => void;
  onOpenApp: (appId: AppId) => void;
  onTogglePowerMenu: () => void;
  onToggleNightLight: () => void;
  onUpdateMetrics: (metrics: Partial<SystemMetrics>) => void;
}

export const Dock: React.FC<DockProps> = ({
  theme,
  metrics,
  windows,
  isStartOpen,
  isControlCenterOpen,
  onToggleStart,
  onToggleControlCenter,
  onOpenApp,
  onTogglePowerMenu,
  onToggleNightLight,
  onUpdateMetrics,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAppRunning = (appId: AppId) => {
    return windows.some((w) => w.appId === appId && !w.isMinimized);
  };

  const dockApps = [
    { id: 'browser' as AppId, icon: Compass, label: 'Browser', color: '#1f7cb8' },
    { id: 'files' as AppId, icon: Folder, label: 'Files', color: '#e5a024' },
    { id: 'notes' as AppId, icon: FileText, label: 'Notes', color: '#7a42b5' },
    { id: 'music' as AppId, icon: Disc, label: 'Spotify', color: '#1db954' },
    { id: 'chat' as AppId, icon: Send, label: 'Telegram / Chat', color: '#2aabee' },
    { id: 'photos' as AppId, icon: Camera, label: 'Photos / Instagram', color: '#e1306c' },
    { id: 'weather' as AppId, icon: Video, label: 'Media / Weather', color: '#ff0000' },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
      {/* 1. Left Island: Power & Quick Toggles */}
      <div
        className="pointer-events-auto flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full shadow-lg backdrop-blur-xl transition-all border"
        style={{
          backgroundColor: theme.colors.dockBg,
          borderColor: theme.colors.cardBorder,
        }}
      >
        <button
          onClick={() => {
            playUiClick();
            onTogglePowerMenu();
          }}
          title="Power Options (Shutdown, Restart, Sleep, Lock)"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer shadow-sm"
          style={{
            backgroundColor: theme.colors.dockItem,
            color: theme.colors.dockText,
          }}
        >
          <Power className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={() => {
            playUiClick();
            onToggleNightLight();
          }}
          title={metrics.nightLight ? 'Night Light On' : 'Night Light Off'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer shadow-sm"
          style={{
            backgroundColor: metrics.nightLight
              ? theme.colors.primaryContainer
              : theme.colors.dockItem,
            color: theme.colors.dockText,
          }}
        >
          {metrics.nightLight ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* 2. Center Island: App Launcher, Search Pill & App Icons */}
      <div
        className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:py-2 rounded-full shadow-xl backdrop-blur-xl transition-all border max-w-[90vw] overflow-x-auto"
        style={{
          backgroundColor: theme.colors.dockBg,
          borderColor: theme.colors.cardBorder,
        }}
      >
        {/* Launcher Button (Material 4-square grid) */}
        <button
          onClick={() => {
            playUiClick();
            onToggleStart();
          }}
          title="Start Menu"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer shadow-sm ${
            isStartOpen ? 'ring-2 ring-offset-1 ring-[#c85252]' : ''
          }`}
          style={{
            backgroundColor: isStartOpen
              ? theme.colors.primary
              : theme.colors.dockItem,
            color: isStartOpen ? theme.colors.onPrimary : theme.colors.dockText,
          }}
        >
          <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Search Pill */}
        <button
          onClick={() => {
            playUiClick();
            onToggleStart();
          }}
          title="Search PC, Apps and Files"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
          style={{
            backgroundColor: theme.colors.dockItem,
            color: theme.colors.dockText,
          }}
        >
          <Search className="w-3.5 h-3.5 opacity-70" />
          <span>Search</span>
        </button>

        {/* Separator */}
        <div
          className="h-5 w-[1px] opacity-30 mx-0.5 sm:mx-1"
          style={{ backgroundColor: theme.colors.dockText }}
        />

        {/* Pinned App Icons */}
        {dockApps.map((app) => {
          const Icon = app.icon;
          const running = isAppRunning(app.id);

          return (
            <button
              key={app.id}
              onClick={() => {
                playUiClick();
                onOpenApp(app.id);
              }}
              title={app.label}
              className="relative group w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-sm"
              style={{
                backgroundColor: theme.colors.dockItem,
                color: theme.colors.dockText,
              }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />

              {/* Running indicator dot */}
              {running && (
                <span
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}

              {/* Tooltip on hover */}
              <span
                className="absolute -top-9 px-2.5 py-0.5 rounded-full text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md backdrop-blur-md"
                style={{
                  backgroundColor: theme.colors.cardBg,
                  color: theme.colors.dockText,
                }}
              >
                {app.label}
              </span>
            </button>
          );
        })}

        {/* Settings shortcut button */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('settings');
          }}
          title="Settings"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
          style={{
            backgroundColor: theme.colors.dockItem,
            color: theme.colors.dockText,
          }}
        >
          <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 3. Right Island: Quick Settings / Status (Arrow, Volume, Battery, Time) */}
      <div className="relative pointer-events-auto">
        {/* Floating volume popup */}
        {showVolumeSlider && (
          <div
            className="absolute bottom-14 right-0 p-3 rounded-2xl shadow-xl backdrop-blur-xl border flex flex-col items-center gap-2 w-44 animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: theme.colors.dockBg,
              borderColor: theme.colors.cardBorder,
              color: theme.colors.dockText,
            }}
          >
            <div className="flex items-center justify-between w-full text-xs font-semibold px-1">
              <span>System Volume</span>
              <span>{metrics.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={metrics.volume}
              onChange={(e) =>
                onUpdateMetrics({ volume: parseInt(e.target.value) })
              }
              className="w-full accent-[#c85252] cursor-pointer"
            />
          </div>
        )}

        <div
          className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-xl transition-all border"
          style={{
            backgroundColor: theme.colors.dockBg,
            borderColor: theme.colors.cardBorder,
            color: theme.colors.dockText,
          }}
        >
          {/* Chevron expander button - toggles Screenshot 3 Control Center! */}
          <button
            onClick={() => {
              playUiClick();
              onToggleControlCenter();
            }}
            title={
              isControlCenterOpen
                ? 'Close System Widgets Tray'
                : 'Open System Widgets Tray'
            }
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
              isControlCenterOpen ? 'rotate-180 bg-white/40' : 'hover:bg-white/40'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Volume button */}
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            title="Volume"
            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            {metrics.volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Battery */}
          <button
            onClick={() => onToggleControlCenter()}
            title={`Battery: ${metrics.batteryPercent}% (${metrics.batteryStatus})`}
            className="flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
          >
            {metrics.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-600 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4" />
            )}
          </button>

          {/* Time & Date */}
          <button
            onClick={() => onToggleControlCenter()}
            className="text-xs sm:text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity cursor-pointer pl-0.5"
          >
            {timeStr || '2:31 PM'}
          </button>
        </div>
      </div>
    </div>
  );
};
