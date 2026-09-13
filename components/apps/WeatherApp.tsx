import React from 'react';
import {
  CloudFog,
  Wind,
  Droplets,
  Eye,
  Sun,
  CloudSun,
} from 'lucide-react';
import { ThemeConfig } from '../../types/os';

interface WeatherAppProps {
  theme: ThemeConfig;
}

export const WeatherApp: React.FC<WeatherAppProps> = ({ theme }) => {
  const hourly = [
    { time: 'Now', temp: '19°', icon: CloudFog },
    { time: '14:00', temp: '20°', icon: CloudFog },
    { time: '16:00', temp: '21°', icon: CloudSun },
    { time: '18:00', temp: '18°', icon: CloudSun },
    { time: '20:00', temp: '16°', icon: CloudFog },
    { time: '22:00', temp: '15°', icon: CloudFog },
  ];

  const forecast = [
    { day: 'Today', condition: 'Dense Fog & Mist', high: '21°', low: '15°' },
    { day: 'Thursday', condition: 'Morning Fog, Sunny Afternoon', high: '23°', low: '14°' },
    { day: 'Friday', condition: 'Partly Cloudy', high: '24°', low: '16°' },
    { day: 'Saturday', condition: 'Clear Sky', high: '25°', low: '15°' },
    { day: 'Sunday', condition: 'Mild Autumn Breeze', high: '22°', low: '13°' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfafb] text-gray-800 text-sm overflow-y-auto">
      {/* Current Conditions Card */}
      <div
        className="p-6 border-b border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/70 shadow-sm flex items-center justify-center">
            <CloudFog className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              New Delhi / NCR • Autumn
            </div>
            <div className="font-['DM_Serif_Display'] text-5xl font-bold tracking-tight text-gray-900 mt-1">
              19°C
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Dense Fog & Gentle Mist
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 text-right">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/80 shadow-xs text-xs font-bold">
            Feels Like 19°
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#fedbd9] text-[#421414] shadow-xs text-xs font-bold">
            Low Tonight 15°
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Hourly Slider */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Hourly Forecast
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {hourly.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white border border-black/5 shadow-xs flex flex-col items-center gap-1.5"
                >
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {h.time}
                  </span>
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm">{h.temp}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atmospheric Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-[11px] text-gray-500">Humidity</div>
              <div className="font-bold text-sm">86%</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
            <Wind className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-[11px] text-gray-500">Wind</div>
              <div className="font-bold text-sm">4 km/h ENE</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-[11px] text-gray-500">UV Index</div>
              <div className="font-bold text-sm">2 (Low)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
            <Eye className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-[11px] text-gray-500">Visibility</div>
              <div className="font-bold text-sm">4.2 km</div>
            </div>
          </div>
        </div>

        {/* 5-Day Outlook */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            5-Day Outlook
          </h3>
          <div className="space-y-2">
            {forecast.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white border border-black/5 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="w-24 font-bold">{f.day}</div>
                <div className="flex-1 text-gray-600 font-medium">{f.condition}</div>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="text-gray-900">{f.high}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-400">{f.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
