import { CalendarEvent, FileItem, NoteItem, SystemMetrics, Track } from '../types/os';

export const INITIAL_USER = {
  name: 'sahil',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  greeting: 'Good afternoon!',
};

export const INITIAL_METRICS: SystemMetrics = {
  batteryPercent: 71,
  isCharging: false,
  batteryStatus: 'Discharging',
  cpuUsage: 6,
  ramUsage: 54,
  swapUsage: 68,
  diskUsage: 91,
  cDriveTotalGB: 476,
  cDriveUsedGB: 358,
  ramTotalGB: 8,
  ramUsedGB: 4,
  brightness: 93,
  volume: 75,
  nightLight: false,
  wifiConnected: true,
  bluetoothConnected: true,
};

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Maha Saptami',
    time: '12:00 AM',
    dateStr: 'Thursday Oct 10',
    colorType: 'gold',
  },
  {
    id: 'evt-2',
    title: 'Maha Ashtami',
    time: '12:00 AM',
    dateStr: 'Friday Oct 11',
    colorType: 'pink',
  },
  {
    id: 'evt-3',
    title: 'Maha Navami',
    time: '12:00 AM',
    dateStr: 'Friday Oct 11',
    colorType: 'rose',
  },
  {
    id: 'evt-4',
    title: 'Vijaya Dashami / Dussehra',
    time: '10:00 AM',
    dateStr: 'Saturday Oct 12',
    colorType: 'lavender',
  },
  {
    id: 'evt-5',
    title: 'Design Review & Sprint Demo',
    time: '3:30 PM',
    dateStr: 'Monday Oct 14',
    colorType: 'blue',
  },
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'trk-1',
    title: 'NO LOVE',
    artist: 'Shubh',
    album: 'No Love EP',
    duration: 172,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    accentColor: '#3d4d68',
  },
  {
    id: 'trk-2',
    title: 'Elevated',
    artist: 'Shubh',
    album: 'Still Rollin',
    duration: 201,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    accentColor: '#b4637a',
  },
  {
    id: 'trk-3',
    title: 'Cheques',
    artist: 'Shubh',
    album: 'Still Rollin',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    accentColor: '#286983',
  },
  {
    id: 'trk-4',
    title: 'Lofi Sunset Breeze',
    artist: 'ChilledCow / Lofi Girl',
    album: 'Peaceful Moments',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    accentColor: '#d7827e',
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Material You Design Principles',
    content:
      'Dynamic color extraction (Monet), rounded squircle surfaces (24-32px radius), scallop and floral badges, pastel tonal palettes, comfortable touch targets, fluid transitions.',
    updatedAt: 'Today at 1:45 PM',
    tag: 'Design',
    color: '#fce4e4',
  },
  {
    id: 'note-2',
    title: 'Project Roadmap 2026',
    content:
      '- Polish WebOS start menu and widget dock\n- Add interactive terminal commands\n- Enable wallpaper accent generator\n- Sync local calendar with reminders',
    updatedAt: 'Yesterday',
    tag: 'Work',
    color: '#ede4fa',
  },
  {
    id: 'note-3',
    title: 'Shopping & Groceries',
    content: 'Oat milk, avocados, green tea, fresh sourdough, dark chocolate 85%, sparkling water.',
    updatedAt: 'Oct 8',
    tag: 'Personal',
    color: '#f5e4c3',
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'Coral Wallpaper 4K.jpg',
    type: 'image',
    size: '3.4 MB',
    date: 'Oct 9, 2026',
    path: '/wallpapers/coral-flow.jpg',
  },
  {
    id: 'file-2',
    name: 'Lavender Wallpaper 4K.jpg',
    type: 'image',
    size: '2.8 MB',
    date: 'Oct 9, 2026',
    path: '/wallpapers/lavender-flow.jpg',
  },
  {
    id: 'file-3',
    name: 'Sky Blue Wallpaper 4K.jpg',
    type: 'image',
    size: '3.1 MB',
    date: 'Oct 8, 2026',
    path: '/wallpapers/sky-flow.jpg',
  },
  {
    id: 'file-4',
    name: 'System_Specifications.pdf',
    type: 'document',
    size: '420 KB',
    date: 'Oct 7, 2026',
    path: '/documents/System_Specifications.pdf',
    content: 'Material You WebOS v3.2 - Dual-core virtualized environment with dynamic Monet color extraction and 8GB unified memory.',
  },
  {
    id: 'file-5',
    name: 'No Love - Shubh.mp3',
    type: 'audio',
    size: '6.2 MB',
    date: 'Oct 6, 2026',
    path: '/music/no-love.mp3',
  },
  {
    id: 'file-6',
    name: 'Meeting_Notes_Quarterly.txt',
    type: 'document',
    size: '14 KB',
    date: 'Oct 5, 2026',
    path: '/documents/Meeting_Notes.txt',
    content: 'Reviewed Q4 targets. WebOS architecture migration complete. UI smoothness tested at 120fps.',
  },
];
