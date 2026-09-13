import React, { useState, useEffect } from 'react';
import { getScallopPath } from '../../utils/scallopPath';
import { CalendarEvent, SystemMetrics, ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface WidgetsProps {
  theme: ThemeConfig;
  metrics: SystemMetrics;
  onUpdateMetrics: (newMetrics: Partial<SystemMetrics>) => void;
  events: CalendarEvent[];
  userName: string;
  onOpenApp: (appId: string) => void;
}

export const Widgets: React.FC<WidgetsProps> = ({
  theme,
  metrics,
  onUpdateMetrics,
  events,
  userName,
  onOpenApp,
}) => {
  // Theme-aware color adaptation
  const isCoral = theme.id === 'coral';
  const scallopFill = isCoral ? '#fce8e8' : theme.colors.primaryContainer;
  const innerCircleBg = isCoral ? '#f8bebe' : theme.colors.secondaryContainer;
  const clockSquircleBg = isCoral ? '#fcdcdc' : theme.colors.surfaceVariant;
  const cardSquircleBg = isCoral ? '#fae8e5' : theme.colors.surfaceVariant;
  const eventCardBg = isCoral ? '#f8d4d1' : theme.colors.cardBg;
  const pill1Bg = isCoral ? '#e8c98e' : theme.colors.accentPill1;
  const pill2Bg = isCoral ? '#f4abab' : theme.colors.accentPill2;
  const pill3Bg = isCoral ? '#fcd4ce' : theme.colors.accentPill3;
  const textColor = theme.colors.dockText;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dayNum = time.getDate().toString().padStart(2, '0');
  const monthName = time.toLocaleDateString('en-US', { month: 'long' });

  // Calculate day progress percentage (from 00:00 to 23:59)
  const totalSecondsInDay = 24 * 60 * 60;
  const currentSeconds =
    time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
  const dayProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentSeconds / totalSecondsInDay) * 100))
  );

  // Dynamic greeting & time of day status
  const currentHour = time.getHours();
  let greeting = 'Good morning!';
  let mealStatus = 'Breakfast time';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon!';
    mealStatus = currentHour >= 12 && currentHour < 15 ? 'Its Lunch time' : 'Afternoon tea time';
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = 'Good evening!';
    mealStatus = 'Dinner time';
  } else if (currentHour >= 21 || currentHour < 5) {
    greeting = 'Good night!';
    mealStatus = 'Rest and recharge';
  }

  // Toggle charging on battery widget click
  const handleBatteryClick = () => {
    playUiClick();
    const nextCharging = !metrics.isCharging;
    onUpdateMetrics({
      isCharging: nextCharging,
      batteryStatus: nextCharging ? 'Charging' : 'Discharging',
      batteryPercent: nextCharging ? Math.min(100, metrics.batteryPercent + 5) : metrics.batteryPercent,
    });
  };

  const scallopSvgPath = getScallopPath(12, 40, 48, 50, 50);
  const sunFlowerSvgPath = getScallopPath(10, 36, 48, 50, 50);

  return (
    <div className="flex flex-col items-center select-none max-w-4xl mx-auto pointer-events-auto drop-shadow-md">
      {/* Top Row of Widgets */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-7 mb-4 flex-wrap">
        {/* 1. Scallop Battery Widget ("71 Discharging") */}
        <button
          onClick={handleBatteryClick}
          title="Click to toggle Charging / Discharging"
          className="relative group w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center transition-transform active:scale-95 hover:scale-105 cursor-pointer focus:outline-none"
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-sm transition-transform duration-700 group-hover:rotate-6"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.06))' }}
          >
            <path d={scallopSvgPath} fill={scallopFill} />
          </svg>

          <div className="relative z-10 flex flex-col items-center -mt-1">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-inner"
              style={{ backgroundColor: innerCircleBg }}
            >
              <span
                className="font-['DM_Serif_Display'] font-bold text-xl sm:text-2xl tracking-tight"
                style={{ color: textColor }}
              >
                {metrics.batteryPercent}
              </span>
            </div>
            <div
              className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-sm tracking-wide"
              style={{ backgroundColor: pill1Bg, color: textColor }}
            >
              {metrics.batteryStatus}
            </div>
          </div>
        </button>

        {/* 2. Golden Sun / Flora Widget */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('weather');
          }}
          title="Weather Overview"
          className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-transform active:scale-95 hover:scale-105 shadow-sm cursor-pointer"
          style={{ backgroundColor: isCoral ? '#fae1a8' : theme.colors.tertiaryContainer }}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
            >
              <path d={sunFlowerSvgPath} fill={isCoral ? '#e59e19' : theme.colors.tertiary} />
            </svg>
            <div
              className="absolute w-6 h-6 rounded-full shadow-inner"
              style={{ backgroundColor: isCoral ? '#f5ad27' : theme.colors.primary }}
            />
          </div>
        </button>

        {/* 3. Squircle Big Serif Clock ("31") */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('calendar');
          }}
          title="Clock & Calendar"
          className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] sm:rounded-[32px] flex items-center justify-center transition-transform active:scale-95 hover:scale-105 shadow-sm cursor-pointer"
          style={{ backgroundColor: clockSquircleBg }}
        >
          <span
            className="font-['DM_Serif_Display'] italic font-bold text-5xl sm:text-6xl tracking-tight group-hover:scale-105 transition-transform"
            style={{ color: textColor }}
          >
            {minutes}
          </span>
        </button>

        {/* 4. Scallop Dual-line Serif Clock ("14 / 31") */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('calendar');
          }}
          title="Current Time"
          className="relative group w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center transition-transform active:scale-95 hover:scale-105 cursor-pointer"
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-sm transition-transform duration-700 group-hover:-rotate-6"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.06))' }}
          >
            <path d={scallopSvgPath} fill={scallopFill} />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center leading-none -space-y-1">
            <span
              className="font-['DM_Serif_Display'] italic font-bold text-2xl sm:text-3xl"
              style={{ color: textColor }}
            >
              {hours}
            </span>
            <span
              className="font-['DM_Serif_Display'] italic font-bold text-2xl sm:text-3xl"
              style={{ color: textColor }}
            >
              {minutes}
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Row of Widgets */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        {/* 1. Date Squircle ("09 October") */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('calendar');
          }}
          title="View Calendar"
          className="w-32 sm:w-36 h-36 sm:h-40 rounded-[28px] p-3 flex flex-col items-center justify-between transition-transform active:scale-95 hover:scale-105 shadow-sm cursor-pointer"
          style={{ backgroundColor: cardSquircleBg }}
        >
          {/* Inner pentagon/organic date badge */}
          <div
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] flex items-center justify-center shadow-inner mt-1"
            style={{ backgroundColor: innerCircleBg }}
          >
            <span
              className="font-['DM_Serif_Display'] font-bold text-3xl sm:text-4xl"
              style={{ color: textColor }}
            >
              {dayNum}
            </span>
          </div>

          <div
            className="w-full py-1.5 px-3 rounded-full text-center text-xs sm:text-sm font-semibold tracking-wide"
            style={{ backgroundColor: pill1Bg, color: textColor }}
          >
            {monthName}
          </div>
        </button>

        {/* 2. Festival / Event Schedule Pill Card */}
        <button
          onClick={() => {
            playUiClick();
            onOpenApp('calendar');
          }}
          title="View Events Schedule"
          className="w-64 sm:w-72 h-36 sm:h-40 rounded-[28px] p-3 flex flex-col justify-between transition-transform active:scale-95 hover:scale-102 shadow-sm cursor-pointer text-left"
          style={{ backgroundColor: eventCardBg }}
        >
          {events.slice(0, 3).map((evt, idx) => {
            const rowBg =
              idx === 0
                ? pill1Bg
                : idx === 1
                ? pill2Bg
                : pill3Bg;

            return (
              <div
                key={evt.id}
                className="w-full px-3.5 py-1.5 rounded-2xl transition-all hover:brightness-105 flex flex-col justify-center"
                style={{ backgroundColor: rowBg, color: textColor }}
              >
                <div className="text-xs sm:text-[13px] font-bold leading-tight">
                  {evt.title}
                </div>
                <div className="text-[10px] sm:text-[11px] opacity-80 leading-tight">
                  {evt.time} {evt.dateStr}
                </div>
              </div>
            );
          })}
        </button>

        {/* 3. Greeting & Day Spent Card */}
        <div
          className="w-56 sm:w-60 h-36 sm:h-40 rounded-[28px] p-3 flex flex-col justify-between shadow-sm"
          style={{ backgroundColor: cardSquircleBg }}
        >
          {/* Greeting Pill */}
          <div
            className="w-full py-1.5 px-3 rounded-2xl text-center flex flex-col justify-center"
            style={{ backgroundColor: pill2Bg, color: textColor }}
          >
            <span className="text-[11px] font-medium leading-tight opacity-90">
              {greeting}
            </span>
            <span className="text-sm sm:text-base font-bold leading-tight">
              {userName}
            </span>
          </div>

          {/* Meal Status Pill */}
          <div
            className="w-full py-1.5 px-3 rounded-2xl text-center text-xs sm:text-[13px] font-semibold"
            style={{ backgroundColor: pill1Bg, color: textColor }}
          >
            {mealStatus}
          </div>

          {/* Progress Pill ("60% Day Spent") */}
          <div
            className="relative w-full h-8 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: pill3Bg }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out opacity-60"
              style={{
                width: `${dayProgressPercent}%`,
                backgroundColor: theme.colors.primary,
              }}
            />
            <span
              className="relative z-10 text-xs sm:text-[13px] font-bold"
              style={{ color: textColor }}
            >
              {dayProgressPercent}% Day Spent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
