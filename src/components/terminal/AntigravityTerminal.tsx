import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  X,
  Maximize2,
  ChevronDown,
  Plus,
  Play,
  Sparkles
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const AntigravityTerminal: React.FC = () => {
  const {
    terminalLogs,
    clearTerminal,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    addTerminalLog,
    triggerFullstackBuild,
    databaseSchema
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'debug' | 'problems' | 'telemetry'>('terminal');
  const [cmdInput, setCmdInput] = useState('');

  if (!isBottomTerminalOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cmdInput.trim();
    if (!command) return;

    addTerminalLog(`$ ${command}`, 'cyan');

    if (command === 'clear') {
      clearTerminal();
    } else if (command === 'help') {
      addTerminalLog('Available CLI commands:', 'info');
      addTerminalLog('  npm run dev      - Start local Vite development server', 'info');
      addTerminalLog('  npm run build    - Build production bundles & typecheck', 'info');
      addTerminalLog('  git status       - Check working tree status', 'info');
      addTerminalLog('  git push         - Push commits to GitHub repository', 'info');
      addTerminalLog('  swarm generate   - Run multi-agent fullstack synthesis', 'info');
      addTerminalLog('  clear            - Clear terminal output', 'info');
    } else if (command.includes('build')) {
      addTerminalLog('> tsc && vite build', 'info');
      addTerminalLog('✓ 1614 modules transformed.', 'success');
      addTerminalLog('✓ built in 2.63s with 0 errors.', 'success');
    } else if (command.includes('dev')) {
      addTerminalLog('  VITE v6.1.0  ready in 240 ms', 'success');
      addTerminalLog('  ➜  Local:   http://localhost:5173/', 'cyan');
    } else if (command.includes('git status')) {
      addTerminalLog('On branch main. Your branch is up to date with origin/main.', 'success');
      addTerminalLog('nothing to commit, working tree clean', 'info');
    } else if (command.includes('swarm') || command.includes('generate')) {
      triggerFullstackBuild('Generate fullstack SaaS app with database relations');
    } else {
      addTerminalLog(`antigravity: command executed: "${command}"`, 'info');
    }

    setCmdInput('');
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-emerald-400';
      case 'warn': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      default: return 'text-[#cccccc]';
    }
  };

  return (
    <div className="h-44 bg-[#181818] border-t border-[#2b2b2b] flex flex-col font-mono text-xs select-none z-30">
      {/* Terminal Tab Bar */}
      <div className="h-8 bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between text-[#858585] text-[11px] font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('problems')}
            className={`hover:text-white transition uppercase font-semibold ${
              activeTab === 'problems' ? 'text-white border-b-2 border-white pb-1' : ''
            }`}
          >
            Problems <span className="text-[10px] px-1 rounded bg-[#2a2a2a] text-slate-400">0</span>
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`hover:text-white transition uppercase font-semibold ${
              activeTab === 'output' ? 'text-white border-b-2 border-white pb-1' : ''
            }`}
          >
            Output
          </button>

          <button
            onClick={() => setActiveTab('debug')}
            className={`hover:text-white transition uppercase font-semibold ${
              activeTab === 'debug' ? 'text-white border-b-2 border-white pb-1' : ''
            }`}
          >
            Debug Console
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`hover:text-white transition uppercase font-semibold ${
              activeTab === 'terminal' ? 'text-white border-b-2 border-white pb-1' : ''
            }`}
          >
            Terminal
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`hover:text-white transition uppercase font-semibold ${
              activeTab === 'telemetry' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : ''
            }`}
          >
            AI Swarm Telemetry
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsBottomTerminalOpen(false)}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#181818] font-mono text-[11px] leading-relaxed custom-scrollbar">
        {terminalLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-[#555555] select-none text-[10px]">{log.timestamp}</span>
            <span className={getLogColor(log.level)}>{log.text}</span>
          </div>
        ))}
      </div>

      {/* Interactive Command Line */}
      <form onSubmit={handleCommand} className="h-7 bg-[#141414] border-t border-[#2b2b2b] px-3 flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-xs select-none">d:\New folder (2)&gt;</span>
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder="npm run dev, git status, swarm generate, help..."
          className="flex-1 bg-transparent text-[#d4d4d4] text-xs focus:outline-none font-mono placeholder-[#555555]"
        />
      </form>
    </div>
  );
};
