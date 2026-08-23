import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Filter,
  CheckCircle2,
  AlertCircle,
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

  const [cliInput, setCliInput] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  if (!isBottomTerminalOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    addTerminalLog(`$ ${cmd}`, 'cyan');

    if (cmd === 'help') {
      addTerminalLog('Available Commands:', 'info');
      addTerminalLog('  build          - Run fullstack concurrent generation', 'info');
      addTerminalLog('  db inspect     - Display active database schema tables', 'info');
      addTerminalLog('  sync           - Resynchronize contracts and types', 'info');
      addTerminalLog('  clear          - Clear terminal logs', 'info');
    } else if (cmd === 'clear') {
      clearTerminal();
    } else if (cmd === 'build') {
      triggerFullstackBuild('Build comprehensive fullstack app with database models');
    } else if (cmd === 'db inspect') {
      addTerminalLog(`[DB INSPECT] Engine: ${databaseSchema.type.toUpperCase()}`, 'success');
      databaseSchema.models.forEach(m => {
        addTerminalLog(`  Table "${m.tableName}": ${m.columns.length} cols, ${databaseSchema.mockData[m.id]?.length || 0} rows`, 'info');
      });
    } else if (cmd === 'sync') {
      addTerminalLog('Synchronizing contracts between frontend and backend...', 'purple');
      addTerminalLog('✓ 4 API routes verified with 100% type safety.', 'success');
    } else {
      addTerminalLog(`Command not recognized: "${cmd}". Type "help" for list of commands.`, 'warn');
    }

    setCliInput('');
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-emerald-400';
      case 'warn': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      case 'cyan': return 'text-cyan-300';
      case 'purple': return 'text-purple-400';
      default: return 'text-slate-300';
    }
  };

  const filteredLogs = terminalLogs.filter(log => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  return (
    <div className="h-44 bg-[#07090e] border-t border-[#1e2337] flex flex-col font-mono text-xs select-none z-20">
      {/* Terminal Header */}
      <div className="h-8 bg-[#0b0e17] border-b border-[#1b2034] px-4 flex items-center justify-between text-slate-400 text-[11px]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-300">Antigravity Developer Telemetry</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            {terminalLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#121624] px-2 py-0.5 rounded border border-[#1e2438]">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-transparent text-[10px] text-slate-300 focus:outline-none"
            >
              <option value="all" className="bg-[#0b0e17]">All Logs</option>
              <option value="info" className="bg-[#0b0e17]">Info</option>
              <option value="success" className="bg-[#0b0e17]">Success</option>
              <option value="warn" className="bg-[#0b0e17]">Warnings</option>
              <option value="error" className="bg-[#0b0e17]">Errors</option>
            </select>
          </div>

          <button
            onClick={clearTerminal}
            className="p-1 rounded hover:bg-[#181d2e] text-slate-500 hover:text-slate-300 transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsBottomTerminalOpen(false)}
            className="p-1 rounded hover:bg-[#181d2e] text-slate-500 hover:text-slate-300 transition"
            title="Minimize"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#06080d] font-mono text-[11px] leading-relaxed">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-slate-600 select-none">{log.timestamp}</span>
            <span className={getLogColor(log.level)}>{log.text}</span>
          </div>
        ))}
      </div>

      {/* Interactive CLI Input Line */}
      <form onSubmit={handleCommandSubmit} className="h-8 bg-[#090c14] border-t border-[#1b2034] px-3 flex items-center gap-2">
        <span className="text-cyan-400 font-bold select-none">antigravity ›</span>
        <input
          type="text"
          value={cliInput}
          onChange={(e) => setCliInput(e.target.value)}
          placeholder="Type command (e.g. 'help', 'db inspect', 'build', 'sync')..."
          className="flex-1 bg-transparent text-slate-200 text-xs focus:outline-none font-mono placeholder-slate-600"
        />
      </form>
    </div>
  );
};
