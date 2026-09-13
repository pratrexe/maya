import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, SystemMetrics } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface TerminalAppProps {
  theme: ThemeConfig;
  metrics: SystemMetrics;
  userName: string;
  onSelectTheme: (themeId: string) => void;
}

interface CommandHistory {
  id: string;
  command: string;
  output: string | React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  theme,
  metrics,
  userName,
  onSelectTheme,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      id: 'init-1',
      command: 'welcome',
      output: (
        <div className="space-y-1 text-emerald-400">
          <div>Material You WebOS Terminal v3.2.0 [x86_64]</div>
          <div>Type <span className="text-amber-300 font-bold">'help'</span> to see available commands or <span className="text-amber-300 font-bold">'neofetch'</span> for system overview.</div>
        </div>
      ),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const renderNeofetch = () => (
    <div className="flex flex-col sm:flex-row gap-6 my-2 text-xs">
      <div className="font-mono text-rose-400 select-none leading-tight font-bold">
        {`
       .-''''-.
     .'          '.
    /   O      O   \\
   :                :
   |    .----.      |
   :   /      \\     :
    \\  '.____.'    /
     '.          .'
       '-......-'
   MATERIAL YOU OS
`}
      </div>

      <div className="space-y-1 font-mono">
        <div className="font-bold text-amber-300">
          {userName}@webos-material-you
        </div>
        <div className="text-gray-400">------------------------------</div>
        <div>
          <span className="text-rose-400 font-bold">OS:</span> Material You WebOS 3.2.0 (Monet 64-bit)
        </div>
        <div>
          <span className="text-rose-400 font-bold">Host:</span> WebAssembly Virtual Hypervisor
        </div>
        <div>
          <span className="text-rose-400 font-bold">Kernel:</span> 6.8.0-material-generic
        </div>
        <div>
          <span className="text-rose-400 font-bold">Uptime:</span> 4 hours, 28 mins
        </div>
        <div>
          <span className="text-rose-400 font-bold">Shell:</span> web-sh 5.2
        </div>
        <div>
          <span className="text-rose-400 font-bold">Theme:</span> {theme.name}
        </div>
        <div>
          <span className="text-rose-400 font-bold">CPU:</span> Virtualized Core @ {metrics.cpuUsage}% load
        </div>
        <div>
          <span className="text-rose-400 font-bold">Memory:</span> {metrics.ramUsedGB}GB / {metrics.ramTotalGB}GB ({metrics.ramUsage}%)
        </div>
        <div>
          <span className="text-rose-400 font-bold">Disk:</span> {metrics.cDriveUsedGB}GB / {metrics.cDriveTotalGB}GB ({metrics.diskUsage}%)
        </div>

        {/* Color Palette blocks */}
        <div className="flex gap-1 pt-2">
          {['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-sky-400', 'bg-purple-400'].map(
            (c, i) => (
              <span key={i} className={`inline-block w-4 h-3 rounded-xs ${c}`} />
            )
          )}
        </div>
      </div>
    </div>
  );

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    playUiClick();
    const parts = cmd.split(' ');
    const primary = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    let output: string | React.ReactNode = '';

    switch (primary) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs text-gray-300">
            <div className="text-amber-300 font-bold mb-1">Available Commands:</div>
            <div><span className="text-emerald-400 font-bold">neofetch</span> - Display system specifications & specs logo</div>
            <div><span className="text-emerald-400 font-bold">theme [name]</span> - Change active theme (coral, sky, lavender, matcha, dark)</div>
            <div><span className="text-emerald-400 font-bold">ls</span> - List files in current directory</div>
            <div><span className="text-emerald-400 font-bold">cat [file]</span> - Display file content</div>
            <div><span className="text-emerald-400 font-bold">date</span> - Display current date and time</div>
            <div><span className="text-emerald-400 font-bold">weather</span> - Atmospheric report</div>
            <div><span className="text-emerald-400 font-bold">whoami</span> - Print current logged-in user</div>
            <div><span className="text-emerald-400 font-bold">clear</span> - Clear terminal output</div>
            <div><span className="text-emerald-400 font-bold">echo [text]</span> - Repeat text</div>
          </div>
        );
        break;

      case 'neofetch':
        output = renderNeofetch();
        break;

      case 'theme':
        if (['coral', 'sky', 'lavender', 'matcha', 'dark'].includes(arg)) {
          onSelectTheme(arg);
          output = `Switched theme to ${arg}! System colors dynamically updated.`;
        } else {
          output = 'Usage: theme <coral | sky | lavender | matcha | dark>';
        }
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'date':
        output = new Date().toString();
        break;

      case 'whoami':
        output = `${userName} (Administrator / UID: 1000)`;
        break;

      case 'weather':
        output = 'Condition: 19°C (Foggy) • Wind: 4 km/h • Humidity: 86% • Air Quality: Excellent';
        break;

      case 'ls':
        output = 'Desktop   Downloads   Documents   Pictures   Music   wallpapers.json';
        break;

      case 'cat':
        if (arg === 'wallpapers.json') {
          output = JSON.stringify({ current: theme.wallpaper, theme: theme.name }, null, 2);
        } else {
          output = `cat: ${arg || 'file'}: No such file or directory`;
        }
        break;

      case 'echo':
        output = parts.slice(1).join(' ');
        break;

      default:
        output = `command not found: ${primary}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: cmd,
        output,
      },
    ]);
    setInput('');
  };

  return (
    <div className="h-full bg-[#181216] text-[#f7e8ef] p-4 font-mono text-xs overflow-y-auto flex flex-col justify-between">
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-rose-400">
              <span className="text-emerald-400 font-bold">{userName}@webos:~$</span>
              <span className="text-white font-semibold">{item.command}</span>
            </div>
            <div className="pl-2 border-l border-white/10 text-gray-300">
              {item.output}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 mt-auto">
        <span className="text-emerald-400 font-bold">{userName}@webos:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
          placeholder="type a command... (e.g. neofetch)"
        />
      </form>
    </div>
  );
};
