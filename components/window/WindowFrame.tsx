import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X, RefreshCw } from 'lucide-react';
import { ThemeConfig, WindowState } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface WindowFrameProps {
  window: WindowState;
  theme: ThemeConfig;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  theme,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current || win.isMaximized) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.initX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.initY + dy));
      onUpdatePosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, win.isMaximized, onUpdatePosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (win.isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: win.position.x,
      initY: win.position.y,
    };
  };

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: '12px',
        left: '12px',
        right: '12px',
        bottom: '84px',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        maxWidth: '96vw',
        maxHeight: 'calc(100vh - 100px)',
        zIndex: win.zIndex,
      };

  return (
    <div
      style={{
        ...style,
        backgroundColor: theme.colors.surface,
        borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder,
      }}
      onClick={onFocus}
      className={`rounded-[32px] shadow-2xl border backdrop-blur-2xl flex flex-col overflow-hidden transition-all duration-150 ${
        isActive ? 'ring-2 ring-black/10' : 'opacity-95'
      }`}
    >
      {/* Window Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="h-12 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b border-black/5"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          color: theme.colors.dockText,
        }}
      >
        <div className="flex items-center gap-2.5 font-bold text-sm tracking-tight">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block shadow-xs" />
          <span>{win.title}</span>
        </div>

        {/* Action Controls */}
        <div
          className="flex items-center gap-1.5"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              playUiClick();
              onMinimize();
            }}
            title="Minimize"
            className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playUiClick();
              onMaximize();
            }}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            {win.isMaximized ? (
              <RefreshCw className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>

          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            title="Close"
            className="w-7 h-7 rounded-full hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto relative">{children}</div>
    </div>
  );
};
