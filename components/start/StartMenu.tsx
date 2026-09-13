import React, { useState } from 'react';
import {
  Search,
  Settings as SettingsIcon,
  Image,
  Calculator,
  Mail,
  Terminal,
  Calendar,
  Bot,
  MessageCircle,
  Download,
  FileText,
  Music,
  HardDrive,
  Cpu,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Power,
  RotateCw,
  Lock,
  CloudFog,
} from 'lucide-react';
import { AppId, SystemMetrics, ThemeConfig, Track } from '../../types/os';
import { playUiClick } from '../../utils/audio';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  metrics: SystemMetrics;
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onOpenApp: (appId: AppId) => void;
  onOpenFolder: (folderName: string) => void;
  onPowerAction: (action: 'shutdown' | 'restart' | 'lock') => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  theme,
  metrics,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onOpenApp,
  onOpenFolder,
  onPowerAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const leftApps = [
    { id: 'settings' as AppId, name: 'Settings', icon: SettingsIcon },
    { id: 'photos' as AppId, name: 'Photos', icon: Image },
    { id: 'calculator' as AppId, name: 'Calculator', icon: Calculator },
    { id: 'mail' as AppId, name: 'Mail', icon: Mail },
    { id: 'terminal' as AppId, name: 'Terminal', icon: Terminal },
    { id: 'calendar' as AppId, name: 'Calendar', icon: Calendar },
    { id: 'browser' as AppId, name: 'Github', icon: GithubIcon, url: 'https://github.com' },
    { id: 'chat' as AppId, name: 'ChatGPT', icon: Bot },
    { id: 'chat' as AppId, name: 'Whatsapp', icon: MessageCircle },
    { id: 'browser' as AppId, name: 'X / Twitter', icon: TwitterIcon, url: 'https://x.com' },
  ];

  const filteredApps = leftApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const storagePercent = Math.round(
    (metrics.cDriveUsedGB / metrics.cDriveTotalGB) * 100
  );
  const ramPercent = Math.round(
    (metrics.ramUsedGB / metrics.ramTotalGB) * 100
  );

  // Dynamic sky pastel tones (as seen in Screenshot 2)
  const isSkyTheme = theme.id === 'sky';
  const leftColBg = isSkyTheme ? '#9fd3fa' : theme.colors.cardBg;
  const rightColBg = isSkyTheme ? '#e0f1ff' : theme.colors.surfaceVariant;
  const pillColor1 = isSkyTheme ? '#d6ecfa' : theme.colors.primaryContainer;
  const pillColor2 = isSkyTheme ? '#f0d9ff' : theme.colors.secondaryContainer;
  const textColor = theme.colors.dockText;

  return (
    <>
      {/* Backdrop overlay for quick dismissal */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className="fixed bottom-16 sm:bottom-20 left-4 sm:left-12 z-50 w-[94vw] max-w-[560px] h-[550px] rounded-[36px] shadow-2xl overflow-hidden flex flex-col md:flex-row border backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-200"
        style={{
          borderColor: theme.colors.cardBorder,
          backgroundColor: rightColBg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT COLUMN: App List in soft pill container */}
        <div
          className="w-full md:w-[45%] h-full p-4 flex flex-col justify-between overflow-y-auto"
          style={{ backgroundColor: leftColBg }}
        >
          <div className="space-y-1.5">
            {filteredApps.map((app, index) => {
              const Icon = app.icon;
              return (
                <button
                  key={`${app.name}-${index}`}
                  onClick={() => {
                    playUiClick();
                    if (app.url) {
                      window.open(app.url, '_blank');
                    } else {
                      onOpenApp(app.id);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/40 active:scale-98 transition-all text-left group cursor-pointer"
                  style={{ color: textColor }}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform"
                    style={{ color: textColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Search, Folders, Storage, Music, Weather, Power */}
        <div className="w-full md:w-[55%] h-full p-4 flex flex-col justify-between gap-3">
          {/* Top Search Bar */}
          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-full shadow-sm bg-white/70 border border-white/50"
            style={{ color: textColor }}
          >
            <Search className="w-4 h-4 opacity-70" />
            <input
              type="text"
              placeholder="Search This PC"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none w-full placeholder:text-gray-500 placeholder:font-normal"
            />
          </div>

          {/* Quick Folders 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playUiClick();
                onOpenFolder('Downloads');
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xs transition-transform hover:scale-102 active:scale-96 cursor-pointer"
              style={{ backgroundColor: pillColor1, color: textColor }}
            >
              <Download className="w-4 h-4" />
              <span className="text-xs font-bold">Downloads</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                onOpenFolder('Documents');
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xs transition-transform hover:scale-102 active:scale-96 cursor-pointer"
              style={{ backgroundColor: pillColor2, color: textColor }}
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs font-bold">Documents</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                onOpenFolder('Pictures');
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xs transition-transform hover:scale-102 active:scale-96 cursor-pointer"
              style={{ backgroundColor: pillColor2, color: textColor }}
            >
              <Image className="w-4 h-4" />
              <span className="text-xs font-bold">Pictures</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                onOpenFolder('Music');
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xs transition-transform hover:scale-102 active:scale-96 cursor-pointer"
              style={{ backgroundColor: pillColor1, color: textColor }}
            >
              <Music className="w-4 h-4" />
              <span className="text-xs font-bold">Music</span>
            </button>
          </div>

          {/* Storage Bar ("358GB/476GB") */}
          <div className="flex items-center gap-2">
            <div
              className="relative flex-1 h-9 rounded-full overflow-hidden flex items-center px-4 shadow-xs"
              style={{ backgroundColor: pillColor1 }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-blue-300/60 rounded-full transition-all"
                style={{ width: `${storagePercent}%` }}
              />
              <span
                className="relative z-10 text-xs font-bold"
                style={{ color: textColor }}
              >
                {metrics.cDriveUsedGB}GB/{metrics.cDriveTotalGB}GB
              </span>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs"
              style={{ backgroundColor: pillColor1, color: textColor }}
            >
              <HardDrive className="w-4 h-4" />
            </div>
          </div>

          {/* RAM Bar ("4GB/8GB") */}
          <div className="flex items-center gap-2">
            <div
              className="relative flex-1 h-9 rounded-full overflow-hidden flex items-center px-4 shadow-xs"
              style={{ backgroundColor: pillColor2 }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-purple-300/60 rounded-full transition-all"
                style={{ width: `${ramPercent}%` }}
              />
              <span
                className="relative z-10 text-xs font-bold"
                style={{ color: textColor }}
              >
                {metrics.ramUsedGB}GB/{metrics.ramTotalGB}GB
              </span>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs"
              style={{ backgroundColor: pillColor2, color: textColor }}
            >
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          {/* Mini Music Card + Weather Circle Row */}
          <div className="flex items-center gap-3">
            {/* Mini Music Player Card */}
            <div
              className="flex-1 p-2.5 rounded-3xl flex flex-col justify-between shadow-xs"
              style={{ backgroundColor: pillColor1 }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-xl object-cover shadow-xs"
                />
                <div className="overflow-hidden">
                  <div
                    className="text-xs font-bold truncate leading-tight"
                    style={{ color: textColor }}
                  >
                    {currentTrack.title}
                  </div>
                  <div className="text-[10px] text-gray-600 truncate">
                    {currentTrack.artist || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={onPrevTrack}
                  className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                  style={{ color: textColor }}
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onTogglePlay}
                  className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{ color: textColor }}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={onNextTrack}
                  className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                  style={{ color: textColor }}
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weather Circle ("19 / Fog") */}
            <button
              onClick={() => {
                playUiClick();
                onOpenApp('weather');
                onClose();
              }}
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: pillColor2, color: textColor }}
            >
              <CloudFog className="w-4 h-4 opacity-70 mb-0.5" />
              <span className="font-['DM_Serif_Display'] font-bold text-2xl leading-none">
                19°
              </span>
              <span className="text-[11px] font-semibold opacity-80 mt-0.5">
                Fog
              </span>
            </button>
          </div>

          {/* Bottom Row: Battery % & Power Actions Pill */}
          <div className="flex items-center gap-2">
            {/* Battery Pill */}
            <div
              className="px-4 py-2 rounded-full text-xs font-bold shadow-xs"
              style={{ backgroundColor: pillColor2, color: textColor }}
            >
              {metrics.batteryPercent}%
            </div>

            {/* Power Pill (Off, Restart, Lock) */}
            <div
              className="flex-1 flex items-center justify-around py-1.5 px-3 rounded-full shadow-xs"
              style={{ backgroundColor: pillColor1, color: textColor }}
            >
              <button
                onClick={() => onPowerAction('shutdown')}
                title="Shut Down"
                className="p-1.5 rounded-full hover:bg-white/50 active:scale-90 transition-all cursor-pointer"
              >
                <Power className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPowerAction('restart')}
                title="Restart"
                className="p-1.5 rounded-full hover:bg-white/50 active:scale-90 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPowerAction('lock')}
                title="Lock Screen"
                className="p-1.5 rounded-full hover:bg-white/50 active:scale-90 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
