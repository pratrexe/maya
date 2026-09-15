import React, { useState } from 'react';
import {
  Palette,
  Monitor,
  User,
  Info,
  Check,
  Volume2,
  Sun,
  Shield,
  Laptop,
} from 'lucide-react';
import { SystemMetrics, ThemeConfig } from '../../types/os';
import { THEMES } from '../../constants/themes';
import { playUiClick } from '../../utils/audio';

interface SettingsAppProps {
  theme: ThemeConfig;
  onSelectTheme: (themeId: string) => void;
  metrics: SystemMetrics;
  onUpdateMetrics: (metrics: Partial<SystemMetrics>) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  theme,
  onSelectTheme,
  metrics,
  onUpdateMetrics,
  userName,
  onUpdateUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'personalization' | 'display' | 'profile' | 'about'>('personalization');
  const [tempName, setTempName] = useState(userName);

  const wallpapers = [
    { id: 'coral', name: 'Coral Blossom', path: '/wallpapers/coral-flow.jpg', themeKey: 'coral' },
    { id: 'sky', name: 'Pastel Sky', path: '/wallpapers/sky-flow.jpg', themeKey: 'sky' },
    { id: 'lavender', name: 'Lavender Mist', path: '/wallpapers/lavender-flow.jpg', themeKey: 'lavender' },
  ];

  return (
    <div className="flex h-full flex-col md:flex-row text-sm">
      {/* Sidebar */}
      <div
        className="w-full md:w-56 p-4 border-r border-black/5 flex flex-col gap-2"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
          Settings
        </div>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('personalization');
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold transition-all cursor-pointer ${
            activeTab === 'personalization'
              ? 'bg-white shadow-xs text-black'
              : 'hover:bg-black/5 opacity-80'
          }`}
        >
          <Palette className="w-4 h-4 text-rose-500" />
          <span>Personalization</span>
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('display');
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold transition-all cursor-pointer ${
            activeTab === 'display'
              ? 'bg-white shadow-xs text-black'
              : 'hover:bg-black/5 opacity-80'
          }`}
        >
          <Monitor className="w-4 h-4 text-blue-500" />
          <span>Display & Sound</span>
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('profile');
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white shadow-xs text-black'
              : 'hover:bg-black/5 opacity-80'
          }`}
        >
          <User className="w-4 h-4 text-purple-500" />
          <span>User Profile</span>
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('about');
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-white shadow-xs text-black'
              : 'hover:bg-black/5 opacity-80'
          }`}
        >
          <Info className="w-4 h-4 text-emerald-500" />
          <span>About WebOS</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'personalization' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Personalization</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Dynamic Material You theme extraction adapts system colors to your wallpaper.
              </p>
            </div>

            {/* Wallpapers */}
            <div>
              <h3 className="font-bold mb-3 text-sm">Desktop Wallpapers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {wallpapers.map((wp) => {
                  const isSelected = theme.wallpaper === wp.path;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        playUiClick();
                        onSelectTheme(wp.themeKey);
                      }}
                      className={`relative rounded-3xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-102 shadow-sm ${
                        isSelected
                          ? 'border-red-500 ring-2 ring-red-400 ring-offset-2'
                          : 'border-transparent hover:border-black/20'
                      }`}
                    >
                      <img
                        src={wp.path}
                        alt={wp.name}
                        className="w-full h-28 object-cover"
                      />
                      <div className="p-2.5 bg-white/90 backdrop-blur-md flex items-center justify-between">
                        <span className="font-bold text-xs">{wp.name}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Schemes */}
            <div>
              <h3 className="font-bold mb-3 text-sm">Material You Color Palettes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.values(THEMES).map((thm) => {
                  const isCurrent = theme.id === thm.id;
                  return (
                    <button
                      key={thm.id}
                      onClick={() => {
                        playUiClick();
                        onSelectTheme(thm.id);
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-black shadow-md bg-white'
                          : 'bg-white/60 hover:bg-white border-black/5'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: thm.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: thm.colors.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: thm.colors.tertiary }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-center line-clamp-1">
                        {thm.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Display & Sound</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Adjust screen brightness, night light, and audio volume.
              </p>
            </div>

            {/* Brightness */}
            <div className="p-4 rounded-3xl bg-white/70 border border-black/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Brightness</span>
                </div>
                <span className="font-bold text-sm">{metrics.brightness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={metrics.brightness}
                onChange={(e) =>
                  onUpdateMetrics({ brightness: parseInt(e.target.value) })
                }
                className="w-full accent-[#c85252] cursor-pointer"
              />
            </div>

            {/* Night Light Toggle */}
            <div className="p-4 rounded-3xl bg-white/70 border border-black/5 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Night Light</div>
                <div className="text-xs opacity-70">
                  Reduces blue light with warmer tones for night comfort
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdateMetrics({ nightLight: !metrics.nightLight })
                }
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  metrics.nightLight ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    metrics.nightLight ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume */}
            <div className="p-4 rounded-3xl bg-white/70 border border-black/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span>Master Volume</span>
                </div>
                <span className="font-bold text-sm">{metrics.volume}%</span>
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
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">User Profile</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Customize your system username shown on widgets and start menu.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/70 border border-black/5 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#f8bebe] flex items-center justify-center font-['DM_Serif_Display'] font-bold text-3xl text-[#3b1212] shadow-md">
                {userName[0]?.toUpperCase() || 'S'}
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Name (Greeting Widget)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="e.g. sahil"
                      className="flex-1 px-4 py-2 rounded-2xl bg-white border border-gray-200 font-semibold outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      onClick={() => {
                        playUiClick();
                        onUpdateUserName(tempName);
                      }}
                      className="px-4 py-2 rounded-2xl bg-[#c85252] text-white font-bold hover:bg-[#b04242] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Current greeting displays: <strong>Good afternoon! {userName}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">About Material You WebOS</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Version 3.2 (Build 2026.10) - Inspired by Android & ChromeOS Material You design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/70 border border-black/5 flex items-center gap-3">
                <Laptop className="w-8 h-8 text-rose-500" />
                <div>
                  <div className="font-bold text-sm">System Engine</div>
                  <div className="text-xs text-gray-600">Material You Monet Dynamic Theme</div>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-white/70 border border-black/5 flex items-center gap-3">
                <Shield className="w-8 h-8 text-emerald-500" />
                <div>
                  <div className="font-bold text-sm">Security & Sandbox</div>
                  <div className="text-xs text-gray-600">Isolated Web Workers & LocalStorage</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 border border-black/5 text-xs text-gray-700 leading-relaxed">
              Material You WebOS brings the organic beauty of Google Material Design 3 to the browser desktop, featuring dynamic tonal extraction, scalloped flower widgets, interactive floating docks, dual-column start menus, and real audio synthesis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
