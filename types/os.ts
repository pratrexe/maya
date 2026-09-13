export type AppId =
  | 'settings'
  | 'files'
  | 'music'
  | 'calculator'
  | 'terminal'
  | 'calendar'
  | 'notes'
  | 'photos'
  | 'browser'
  | 'chat'
  | 'weather'
  | 'mail';

export interface AppMetadata {
  id: AppId;
  name: string;
  icon: string; // Lucide icon name or custom identifier
  description: string;
  category: 'system' | 'media' | 'utility' | 'social';
  pinnedToDock?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface ThemeConfig {
  id: string;
  name: string;
  wallpaper: string;
  isDark: boolean;
  colors: {
    // Material You dynamic color tokens
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceHover: string;
    dockBg: string;
    dockItem: string;
    dockText: string;
    cardBg: string;
    cardBorder: string;
    accentPill1: string;
    accentPill2: string;
    accentPill3: string;
    highlight: string;
  };
}

export interface SystemMetrics {
  batteryPercent: number;
  isCharging: boolean;
  batteryStatus: string; // 'Discharging' | 'Charging' | 'Fully Charged'
  cpuUsage: number;
  ramUsage: number;
  swapUsage: number;
  diskUsage: number;
  cDriveTotalGB: number;
  cDriveUsedGB: number;
  ramTotalGB: number;
  ramUsedGB: number;
  brightness: number;
  volume: number;
  nightLight: boolean;
  wifiConnected: boolean;
  bluetoothConnected: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl?: string;
  accentColor?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  dateStr: string;
  colorType: 'gold' | 'pink' | 'rose' | 'lavender' | 'blue';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tag: string;
  color: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'audio' | 'document' | 'video';
  size: string;
  date: string;
  path: string;
  content?: string;
}
