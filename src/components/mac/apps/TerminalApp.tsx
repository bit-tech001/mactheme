import React, { useEffect, useRef, useState } from 'react';
import { AppId, MacTheme } from '../../../types/mac';
import { VFS_FOLDERS, VFS_ITEMS } from '../../../data/macFilesystem';

interface TerminalAppProps {
  theme: MacTheme;
  onOpenApp: (appId: AppId) => void;
  onSetTheme: (theme: MacTheme) => void;
  onOpenFolder: (folderId: string) => void;
}

interface LogLine {
  id: number;
  type: 'input' | 'output' | 'accent';
  text: string;
}

const INITIAL_LOGS: LogLine[] = [
  { id: 1, type: 'accent', text: 'Kanso Shell — zsh 5.9 (arm64-apple-darwin)' },
  { id: 2, type: 'output', text: 'Type "help" to list available commands.' },
];

export function TerminalApp({
  theme,
  onOpenApp,
  onSetTheme,
  onOpenFolder,
}: TerminalAppProps) {
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<'desktop' | 'projects' | 'assets'>('desktop');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const appendLines = (lines: Array<{ type: LogLine['type']; text: string }>) => {
    setLogs((prev) => [
      ...prev,
      ...lines.map((l, i) => ({ ...l, id: Date.now() + i + Math.random() })),
    ]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendLines([{ type: 'input', text: `kanso@mac ~/${cwd} % ${trimmed}` }]);

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
    const arg = args.join(' ');

    switch (cmd) {
      case 'help':
        appendLines([
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  ls                 List files in current directory' },
          { type: 'output', text: '  cd <folder>        Navigate (desktop, projects, assets)' },
          { type: 'output', text: '  open <app>         Launch app (finder, notes, photos, music, settings)' },
          { type: 'output', text: '  theme <dark|light> Switch macOS glass appearance' },
          { type: 'output', text: '  neofetch           Display system profile' },
          { type: 'output', text: '  clear              Clear terminal output' },
        ]);
        break;
      case 'ls': {
        const children = VFS_ITEMS.filter((item) => item.parentId === cwd);
        appendLines(
          children.map((c) => ({
            type: c.kind === 'folder' ? 'accent' : 'output',
            text: `${c.kind === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${c.size.padEnd(9)} ${c.name}`,
          }))
        );
        break;
      }
      case 'cd': {
        if (!arg || arg === '~' || arg === 'desktop') {
          setCwd('desktop');
        } else if (arg === 'projects' || arg === 'assets') {
          setCwd(arg);
        } else {
          appendLines([{ type: 'output', text: `cd: no such directory: ${arg}` }]);
        }
        break;
      }
      case 'open': {
        const validApps: AppId[] = ['finder', 'notes', 'photos', 'terminal', 'music', 'settings'];
        if (validApps.includes(arg as AppId)) {
          onOpenApp(arg as AppId);
          appendLines([{ type: 'accent', text: `Launched ${arg}.app` }]);
        } else if (arg && VFS_FOLDERS[arg]) {
          onOpenFolder(arg);
          appendLines([{ type: 'accent', text: `Opened ${VFS_FOLDERS[arg].name} in Finder` }]);
        } else {
          appendLines([
            { type: 'output', text: `Usage: open <finder|notes|photos|music|settings|projects>` },
          ]);
        }
        break;
      }
      case 'theme':
        if (arg === 'dark' || arg === 'light') {
          onSetTheme(arg);
          appendLines([{ type: 'accent', text: `Appearance set to ${arg} mode.` }]);
        } else {
          appendLines([{ type: 'output', text: `Current theme: ${theme}. Use "theme dark" or "theme light".` }]);
        }
        break;
      case 'neofetch':
        appendLines([
          { type: 'accent', text: 'kanso@studio-display' },
          { type: 'output', text: 'OS:       Kanso Desktop (WebKit Quartz)' },
          { type: 'output', text: 'Display:  6K Studio Retina Viewport' },
          { type: 'output', text: 'Physics:  Spring 380/32 · Parabolic Dock' },
          { type: 'output', text: `Theme:    ${theme === 'dark' ? 'Obsidian Frosted Glass' : 'Alabaster Glass'}` },
        ]);
        break;
      case 'date':
        appendLines([{ type: 'output', text: new Date().toString() }]);
        break;
      case 'clear':
        setLogs([]);
        break;
      default:
        appendLines([{ type: 'output', text: `zsh: command not found: ${cmd}. Try "help".` }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full bg-[#0D0F13]/92 text-[#E4E4E7] font-mono text-[12px] leading-relaxed p-3.5 overflow-y-auto mac-scrollbar cursor-text flex flex-col"
    >
      <div className="space-y-1 flex-1">
        {logs.map((line) => (
          <div
            key={line.id}
            className={
              line.type === 'accent'
                ? 'text-[#38BDF8]'
                : line.type === 'input'
                ? 'text-white font-medium'
                : 'text-zinc-300'
            }
          >
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
          <span className="text-emerald-400 shrink-0">kanso@mac ~/{cwd} %</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Terminal command input"
            className="flex-1 bg-transparent outline-none text-white caret-emerald-400"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
