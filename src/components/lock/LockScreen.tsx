import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Power, RotateCw } from 'lucide-react';
import { ThemeConfig, SystemMetrics } from '../../types/os';
import { getScallopPath } from '../../utils/scallopPath';
import { playUiChime } from '../../utils/audio';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  theme: ThemeConfig;
  metrics: SystemMetrics;
  userName: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  theme,
  metrics,
  userName,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLocked) return null;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dateFormatted = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const scallopSvgPath = getScallopPath(12, 40, 48, 50, 50);

  const handleUnlock = () => {
    playUiChime();
    onUnlock();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between items-center p-8 select-none bg-cover bg-center transition-all duration-500 animate-in fade-in"
      style={{
        backgroundImage: `url(${theme.wallpaper})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Top status */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl text-white/90 text-xs font-semibold px-4">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Material You WebOS Locked</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{metrics.batteryPercent}%</span>
          <span>19°C Fog</span>
        </div>
      </div>

      {/* Center Clocks & Info */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto space-y-6">
        {/* Scalloped Dual-digit Clock */}
        <div className="relative w-36 h-36 flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-xl animate-spin-slow"
          >
            <path d={scallopSvgPath} fill="rgba(255, 240, 240, 0.9)" />
          </svg>
          <div className="relative z-10 flex flex-col items-center justify-center leading-none -space-y-1">
            <span className="font-['DM_Serif_Display'] italic font-bold text-3xl sm:text-4xl text-[#3b1212]">
              {hours}
            </span>
            <span className="font-['DM_Serif_Display'] italic font-bold text-3xl sm:text-4xl text-[#3b1212]">
              {minutes}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {dateFormatted}
          </h2>
          <p className="text-xs text-white/80 mt-1">Festive Autumn • {userName}'s Workspace</p>
        </div>

        {/* User Card & Unlock Button */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="w-16 h-16 rounded-full bg-[#f8bebe] flex items-center justify-center font-['DM_Serif_Display'] font-bold text-2xl text-[#3b1212] shadow-xl ring-4 ring-white/40">
            {userName[0]?.toUpperCase() || 'S'}
          </div>

          <div className="text-white font-bold text-base drop-shadow-sm">
            {userName}
          </div>

          <button
            onClick={handleUnlock}
            className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 hover:bg-white text-gray-900 font-bold text-xs shadow-xl active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <Unlock className="w-4 h-4 text-rose-500" />
            <span>Click to Unlock WebOS</span>
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="relative z-10 flex items-center gap-4 text-white/80 text-xs">
        <button
          onClick={handleUnlock}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Switch Session</span>
        </button>
        <span>•</span>
        <button
          onClick={handleUnlock}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Sleep Mode</span>
        </button>
      </div>
    </div>
  );
};
