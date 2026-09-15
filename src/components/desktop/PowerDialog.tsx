import React from 'react';
import { Power, RotateCw, Lock, Moon, X } from 'lucide-react';
import { ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface PowerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onAction: (action: 'shutdown' | 'restart' | 'lock' | 'sleep') => void;
}

export const PowerDialog: React.FC<PowerDialogProps> = ({
  isOpen,
  onClose,
  theme,
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[36px] p-6 shadow-2xl border backdrop-blur-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.cardBorder,
          color: theme.colors.dockText,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">
            Power Actions
          </span>
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => {
              playUiClick();
              onAction('shutdown');
            }}
            className="p-4 rounded-3xl bg-rose-100 hover:bg-rose-200 text-rose-900 flex flex-col items-center gap-2 font-bold text-xs transition-transform hover:scale-103 active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
              <Power className="w-5 h-5 text-rose-600" />
            </div>
            <span>Shut Down</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onAction('restart');
            }}
            className="p-4 rounded-3xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex flex-col items-center gap-2 font-bold text-xs transition-transform hover:scale-103 active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
              <RotateCw className="w-5 h-5 text-amber-700" />
            </div>
            <span>Restart</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onAction('lock');
            }}
            className="p-4 rounded-3xl bg-purple-100 hover:bg-purple-200 text-purple-900 flex flex-col items-center gap-2 font-bold text-xs transition-transform hover:scale-103 active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-700" />
            </div>
            <span>Lock Screen</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onAction('sleep');
            }}
            className="p-4 rounded-3xl bg-blue-100 hover:bg-blue-200 text-blue-900 flex flex-col items-center gap-2 font-bold text-xs transition-transform hover:scale-103 active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
              <Moon className="w-5 h-5 text-blue-700" />
            </div>
            <span>Sleep</span>
          </button>
        </div>
      </div>
    </div>
  );
};
