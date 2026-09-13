import React from 'react';
import {
  Moon,
  Laptop,
  CloudMoon,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  X,
  Palette,
  Sun,
} from 'lucide-react';
import { SystemMetrics, ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  metrics: SystemMetrics;
  onUpdateMetrics: (newMetrics: Partial<SystemMetrics>) => void;
  onOpenApp: (appId: string) => void;
  onToggleTheme: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  theme,
  metrics,
  onUpdateMetrics,
  onOpenApp,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const isLavenderTheme = theme.id === 'lavender';
  const cardBg = isLavenderTheme ? '#f8eefc' : theme.colors.cardBg;
  const pill1Bg = isLavenderTheme ? '#eccdf8' : theme.colors.primaryContainer;
  const pill2Bg = isLavenderTheme ? '#fad7df' : theme.colors.secondaryContainer;
  const pill3Bg = isLavenderTheme ? '#fce2d0' : theme.colors.tertiaryContainer;
  const textColor = theme.colors.dockText;

  const now = new Date();
  const dateFormatted = `${now.getDate()} ${now.toLocaleDateString('en-US', {
    month: 'short',
  })}, ${now.toLocaleDateString('en-US', { weekday: 'long' })}`;

  // Mini calendar numbers for current month
  const daysInMonth = 30;
  const currentDay = now.getDate();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className="fixed bottom-16 sm:bottom-20 right-4 sm:right-8 z-50 max-w-[95vw] overflow-x-auto p-4 rounded-[36px] shadow-2xl border backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-200"
        style={{
          backgroundColor: isLavenderTheme ? 'rgba(247, 235, 252, 0.95)' : theme.colors.surface,
          borderColor: theme.colors.cardBorder,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar with Close & Theme Switcher */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider opacity-70"
              style={{ color: textColor }}
            >
              Material You Quick Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playUiClick();
                onToggleTheme();
              }}
              title="Cycle Theme (Coral, Sky Blue, Lavender, Matcha, Dark)"
              className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: pill1Bg, color: textColor }}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme: {theme.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => {
                playUiClick();
                onClose();
              }}
              className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: textColor }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 5 Widgets matching Screenshot 3 */}
        <div className="flex items-stretch gap-3">
          {/* 1. Brightness & Laptop Battery Column */}
          <div className="flex flex-col justify-between gap-3 w-32 sm:w-36">
            {/* Night light / Moon widget */}
            <button
              onClick={() => {
                playUiClick();
                onUpdateMetrics({ nightLight: !metrics.nightLight });
              }}
              title="Click to toggle Night Light"
              className="flex-1 p-3 rounded-[24px] flex items-center justify-between shadow-xs transition-transform hover:scale-102 active:scale-98 cursor-pointer"
              style={{ backgroundColor: cardBg, color: textColor }}
            >
              {metrics.nightLight ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-['DM_Serif_Display'] font-bold text-xl sm:text-2xl">
                {metrics.brightness}%
              </span>
            </button>

            {/* Laptop widget */}
            <button
              onClick={() => {
                playUiClick();
                onUpdateMetrics({ isCharging: !metrics.isCharging });
              }}
              title="Click to toggle Battery Charging"
              className="flex-1 p-3 rounded-[24px] flex items-center justify-between shadow-xs transition-transform hover:scale-102 active:scale-98 cursor-pointer"
              style={{ backgroundColor: cardBg, color: textColor }}
            >
              <Laptop className="w-5 h-5" />
              <span className="font-['DM_Serif_Display'] font-bold text-xl sm:text-2xl">
                {metrics.batteryPercent}%
              </span>
            </button>
          </div>

          {/* 2. Weather Detail Card */}
          <div
            className="w-44 sm:w-48 p-3 rounded-[28px] flex flex-col justify-between gap-2 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: cardBg, color: textColor }}
            onClick={() => {
              playUiClick();
              onOpenApp('weather');
              onClose();
            }}
          >
            {/* Top row: Cloud + Moon + Fog */}
            <div className="flex items-center gap-2 px-1">
              <CloudMoon className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-sm">Fog</span>
            </div>

            {/* Currently its 19 */}
            <div
              className="py-1.5 px-3 rounded-full text-center text-xs font-semibold shadow-xs"
              style={{ backgroundColor: pill1Bg }}
            >
              Currently its{' '}
              <span className="font-['DM_Serif_Display'] font-bold text-sm">
                19°
              </span>
            </div>

            {/* Feels Like 19 / Low Tonight 15 */}
            <div
              className="py-1.5 px-2.5 rounded-2xl text-center text-[10px] font-semibold leading-tight shadow-xs"
              style={{ backgroundColor: pill3Bg }}
            >
              Feels Like 19° <br />
              <span className="opacity-80">Low Tonight 15°</span>
            </div>
          </div>

          {/* 3. Resource Monitor Card (CPU, RAM, SWAP, Disk) */}
          <div
            className="w-64 sm:w-72 p-3.5 rounded-[28px] flex flex-col justify-between gap-2 shadow-xs"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            {/* CPU Usage */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>CPU Usage</span>
              </div>
              <div className="relative flex-1 h-5 rounded-full overflow-hidden flex items-center px-2 bg-black/5">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-purple-400/50 rounded-full transition-all duration-700"
                  style={{ width: `${metrics.cpuUsage}%` }}
                />
                <span className="relative z-10 text-[11px] font-bold ml-auto">
                  {metrics.cpuUsage}%
                </span>
              </div>
            </div>

            {/* RAM - Memory Usage */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span className="truncate">RAM - Memory</span>
              </div>
              <div className="relative flex-1 h-5 rounded-full overflow-hidden flex items-center px-2 bg-black/5">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-pink-400/50 rounded-full transition-all duration-700"
                  style={{ width: `${metrics.ramUsage}%` }}
                />
                <span className="relative z-10 text-[11px] font-bold ml-auto">
                  {metrics.ramUsage}%
                </span>
              </div>
            </div>

            {/* SWAP - Virtual memory usage */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span className="truncate">SWAP - Virtual</span>
              </div>
              <div className="relative flex-1 h-5 rounded-full overflow-hidden flex items-center px-2 bg-black/5">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-indigo-400/50 rounded-full transition-all duration-700"
                  style={{ width: `${metrics.swapUsage}%` }}
                />
                <span className="relative z-10 text-[11px] font-bold ml-auto">
                  {metrics.swapUsage}%
                </span>
              </div>
            </div>

            {/* Disk usage */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Disk usage</span>
              </div>
              <div className="relative flex-1 h-5 rounded-full overflow-hidden flex items-center px-2 bg-black/5">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-rose-400/50 rounded-full transition-all duration-700"
                  style={{ width: `${metrics.diskUsage}%` }}
                />
                <span className="relative z-10 text-[11px] font-bold ml-auto">
                  {metrics.diskUsage}%
                </span>
              </div>
            </div>
          </div>

          {/* 4. Mini Month Calendar Card */}
          <div
            className="w-52 sm:w-56 p-3 rounded-[28px] flex flex-col justify-between shadow-xs"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            {/* Header: "13 Nov, Wednesday" */}
            <div
              className="py-1 px-3 rounded-full text-center text-xs font-bold shadow-xs mb-2"
              style={{ backgroundColor: pill1Bg }}
            >
              {dateFormatted}
            </div>

            {/* Calendar grid */}
            <div
              className="p-2 rounded-2xl grid grid-cols-7 gap-1 text-center text-[10px] font-medium"
              style={{ backgroundColor: pill2Bg }}
            >
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const isSelected = day === currentDay;

                return (
                  <div
                    key={day}
                    className={`h-5 w-5 mx-auto flex items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'bg-white shadow-sm font-bold text-red-600 ring-2 ring-red-400'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Quick Drive & RAM Glance Column */}
          <div className="flex flex-col justify-between gap-3 w-32 sm:w-36">
            {/* C Drive 91% */}
            <div
              className="flex-1 p-3 rounded-[24px] flex items-center justify-between shadow-xs"
              style={{ backgroundColor: cardBg, color: textColor }}
            >
              <span className="text-xs font-bold">C Drive</span>
              <span className="font-['DM_Serif_Display'] font-bold text-xl">
                {metrics.diskUsage}%
              </span>
            </div>

            {/* RAM 54% */}
            <div
              className="flex-1 p-3 rounded-[24px] flex items-center justify-between shadow-xs"
              style={{ backgroundColor: cardBg, color: textColor }}
            >
              <span className="text-xs font-bold">RAM</span>
              <span className="font-['DM_Serif_Display'] font-bold text-xl">
                {metrics.ramUsage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
