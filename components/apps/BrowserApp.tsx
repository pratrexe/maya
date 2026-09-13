import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Globe,
  Star,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface BrowserAppProps {
  theme: ThemeConfig;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ theme }) => {
  const [url, setUrl] = useState('https://material.io/design');

  const bookmarks = [
    { title: 'Google', url: 'https://google.com', icon: '🔍' },
    { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { title: 'Material Design', url: 'https://m3.material.io', icon: '🎨' },
    { title: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
    { title: 'Reddit', url: 'https://reddit.com', icon: '💬' },
  ];

  const handleNavigate = (newUrl: string) => {
    playUiClick();
    setUrl(newUrl);
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfafb] text-gray-800 text-sm">
      {/* Tab bar */}
      <div
        className="flex items-center px-3 pt-2 gap-2 border-b border-black/5"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-t-2xl bg-[#fdfafb] font-bold text-xs shadow-xs border-t border-x border-black/5">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Material You Design 3</span>
        </div>
      </div>

      {/* Address & Navigation bar */}
      <div
        className="flex items-center gap-2 p-2 px-4 border-b border-black/5"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <button
          className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
          title="Forward"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => playUiClick()}
          className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
          title="Reload"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Omnibox / URL Bar */}
        <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-black/5">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs font-medium outline-none"
          />
          <Star className="w-3.5 h-3.5 text-amber-400 cursor-pointer hover:scale-110" />
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-black/5 text-xs overflow-x-auto">
        {bookmarks.map((bm) => (
          <button
            key={bm.title}
            onClick={() => handleNavigate(bm.url)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full hover:bg-white/80 transition-all font-semibold cursor-pointer"
          >
            <span>{bm.icon}</span>
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* Web Page View */}
      <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col items-center">
        <div className="max-w-2xl w-full space-y-6">
          {/* Hero Banner */}
          <div className="p-8 rounded-[36px] bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 border border-rose-200/60 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#f8bebe] flex items-center justify-center mb-3 shadow-inner">
              <Compass className="w-8 h-8 text-[#3b1212]" />
            </div>
            <h1 className="text-2xl font-bold font-['DM_Serif_Display'] text-gray-900 mb-2">
              Explore Material Design 3
            </h1>
            <p className="text-xs text-gray-600 max-w-md leading-relaxed">
              Material You makes design personal and adaptive. The system extracts colors from wallpapers to create dynamic tonal palettes across every UI component.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.open('https://m3.material.io', '_blank')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c85252] text-white font-bold text-xs hover:bg-[#b04242] transition-colors cursor-pointer shadow-xs"
              >
                <span>Read Official Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Featured Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                Color Science
              </span>
              <h3 className="font-bold text-sm">Monet Algorithmic Tones</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                How algorithmic seed extraction generates accessible tertiary, container, and on-surface hues dynamically.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                Typography
              </span>
              <h3 className="font-bold text-sm">Expressive Serif Clocks</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Blending playful high-contrast serifs with ultra-clean sans-serif touch points for friendly modern computing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
