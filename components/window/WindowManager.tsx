import React from 'react';
import { WindowState, ThemeConfig, SystemMetrics, Track, CalendarEvent, NoteItem, FileItem } from '../../types/os';
import { WindowFrame } from './WindowFrame';
import { SettingsApp } from '../apps/SettingsApp';
import { FileExplorer } from '../apps/FileExplorer';
import { MusicApp } from '../apps/MusicApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { TerminalApp } from '../apps/TerminalApp';
import { NotesApp } from '../apps/NotesApp';
import { CalendarApp } from '../apps/CalendarApp';
import { BrowserApp } from '../apps/BrowserApp';
import { ChatApp } from '../apps/ChatApp';
import { PhotosApp } from '../apps/PhotosApp';
import { WeatherApp } from '../apps/WeatherApp';

interface WindowManagerProps {
  windows: WindowState[];
  activeWindowId: string | null;
  theme: ThemeConfig;
  metrics: SystemMetrics;
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  events: CalendarEvent[];
  notes: NoteItem[];
  files: FileItem[];
  userName: string;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onSelectTheme: (themeId: string) => void;
  onUpdateMetrics: (metrics: Partial<SystemMetrics>) => void;
  onUpdateUserName: (name: string) => void;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onAddFile: (file: FileItem) => void;
  onDeleteFile: (id: string) => void;
  onSetWallpaper: (url: string) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  theme,
  metrics,
  tracks,
  currentTrack,
  isPlaying,
  events,
  notes,
  files,
  userName,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onUpdatePosition,
  onSelectTheme,
  onUpdateMetrics,
  onUpdateUserName,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onAddEvent,
  onDeleteEvent,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddFile,
  onDeleteFile,
  onSetWallpaper,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {windows.map((win) => {
        const isActive = activeWindowId === win.id;

        const renderAppContent = () => {
          switch (win.appId) {
            case 'settings':
              return (
                <SettingsApp
                  theme={theme}
                  onSelectTheme={onSelectTheme}
                  metrics={metrics}
                  onUpdateMetrics={onUpdateMetrics}
                  userName={userName}
                  onUpdateUserName={onUpdateUserName}
                />
              );
            case 'files':
              return (
                <FileExplorer
                  theme={theme}
                  metrics={metrics}
                  files={files}
                  onAddFile={onAddFile}
                  onDeleteFile={onDeleteFile}
                  onSetWallpaper={onSetWallpaper}
                />
              );
            case 'music':
              return (
                <MusicApp
                  theme={theme}
                  tracks={tracks}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onSelectTrack={onSelectTrack}
                  onTogglePlay={onTogglePlay}
                  onNextTrack={onNextTrack}
                  onPrevTrack={onPrevTrack}
                />
              );
            case 'calculator':
              return <CalculatorApp theme={theme} />;
            case 'terminal':
              return (
                <TerminalApp
                  theme={theme}
                  metrics={metrics}
                  userName={userName}
                  onSelectTheme={onSelectTheme}
                />
              );
            case 'notes':
              return (
                <NotesApp
                  theme={theme}
                  notes={notes}
                  onAddNote={onAddNote}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={onDeleteNote}
                />
              );
            case 'calendar':
              return (
                <CalendarApp
                  theme={theme}
                  events={events}
                  onAddEvent={onAddEvent}
                  onDeleteEvent={onDeleteEvent}
                />
              );
            case 'browser':
              return <BrowserApp theme={theme} />;
            case 'chat':
              return <ChatApp theme={theme} userName={userName} />;
            case 'photos':
              return <PhotosApp theme={theme} onSetWallpaper={onSetWallpaper} />;
            case 'weather':
              return <WeatherApp theme={theme} />;
            case 'mail':
              return (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl">
                    ✉️
                  </div>
                  <h3 className="text-base font-bold">WebOS Mailbox</h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    You have 2 unread system notifications and 0 pending invites.
                  </p>
                </div>
              );
            default:
              return (
                <div className="p-6 text-center text-xs text-gray-500">
                  App loaded successfully.
                </div>
              );
          }
        };

        return (
          <div key={win.id} className="pointer-events-auto">
            <WindowFrame
              window={win}
              theme={theme}
              isActive={isActive}
              onFocus={() => onFocusWindow(win.id)}
              onClose={() => onCloseWindow(win.id)}
              onMinimize={() => onMinimizeWindow(win.id)}
              onMaximize={() => onMaximizeWindow(win.id)}
              onUpdatePosition={(x, y) => onUpdatePosition(win.id, x, y)}
            >
              {renderAppContent()}
            </WindowFrame>
          </div>
        );
      })}
    </div>
  );
};
