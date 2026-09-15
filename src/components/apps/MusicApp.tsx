import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
} from 'lucide-react';
import { ThemeConfig, Track } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface MusicAppProps {
  theme: ThemeConfig;
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  theme,
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            onNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration, onNextTrack]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  return (
    <div className="flex h-full flex-col md:flex-row text-sm">
      {/* Left: Player & Now Playing */}
      <div
        className="w-full md:w-[55%] p-6 flex flex-col justify-between items-center text-center border-r border-black/5"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="w-full flex items-center justify-between text-xs font-bold opacity-60">
          <span>NOW PLAYING</span>
          <div className="flex items-center gap-1 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WebOS High-Fi</span>
          </div>
        </div>

        {/* Album Artwork with animated rotation when playing */}
        <div className="relative group my-4">
          <div
            className={`w-44 h-44 sm:w-52 sm:h-52 rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/60 transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Equalizer overlay */}
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-3 flex items-end justify-center gap-1.5 h-8 px-4 bg-black/40 backdrop-blur-xs rounded-2xl mx-6 py-1">
              {[40, 75, 90, 50, 85, 60, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white rounded-full animate-bounce"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="w-full">
          <div className="flex items-center justify-between px-2">
            <div className="text-left">
              <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">
                {currentTrack.title}
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {currentTrack.artist} • {currentTrack.album}
              </p>
            </div>
            <button
              onClick={() => {
                playUiClick();
                setIsLiked(!isLiked);
              }}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 px-2">
            <input
              type="range"
              min="0"
              max={currentTrack.duration}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full accent-[#c85252] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1 font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              title="Shuffle"
              className="p-2 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playUiClick();
                onPrevTrack();
                setProgress(0);
              }}
              className="p-2 text-gray-700 hover:text-black transition-transform hover:scale-115 active:scale-90 cursor-pointer"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                playUiClick();
                onTogglePlay();
              }}
              className="w-13 h-13 rounded-full bg-[#c85252] text-white flex items-center justify-center shadow-lg hover:scale-108 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => {
                playUiClick();
                onNextTrack();
                setProgress(0);
              }}
              className="p-2 text-gray-700 hover:text-black transition-transform hover:scale-115 active:scale-90 cursor-pointer"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              title="Repeat"
              className="p-2 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Playlist Queue */}
      <div className="w-full md:w-[45%] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              Featured Playlist
            </span>
            <span className="text-xs font-bold text-gray-500">
              {tracks.length} Songs
            </span>
          </div>

          <div className="space-y-2">
            {tracks.map((track) => {
              const isSelected = track.id === currentTrack.id;

              return (
                <button
                  key={track.id}
                  onClick={() => {
                    playUiClick();
                    onSelectTrack(track);
                    setProgress(0);
                  }}
                  className={`w-full p-2.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-rose-50 border border-rose-200 shadow-xs'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-xl object-cover shadow-xs"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div
                      className={`text-xs font-bold truncate ${
                        isSelected ? 'text-rose-600' : 'text-gray-900'
                      }`}
                    >
                      {track.title}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {track.artist}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formatTime(track.duration)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume & Audio Synth Note */}
        <div className="p-3 rounded-2xl bg-black/5 flex items-center justify-between gap-3 mt-4">
          <button
            onClick={() => setVolume(volume === 0 ? 80 : 0)}
            className="text-gray-600 hover:text-black cursor-pointer"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full accent-[#c85252] cursor-pointer"
          />
          <span className="text-xs font-bold w-8 text-right font-mono">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
};
