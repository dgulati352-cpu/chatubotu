import React from 'react';
import { 
  Bot, 
  GitBranch, 
  Database, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Terminal as TerminalIcon,
  Wifi
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const StatusBar: React.FC = () => {
  const { 
    agents, 
    databaseSchema, 
    githubConfig, 
    apiContract, 
    concurrencyMode, 
    isGenerating,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen
  } = useWorkspace();

  const activeAgentsCount = Object.values(agents).filter(a => a.status === 'coding' || a.status === 'thinking' || a.status === 'syncing').length;

  return (
    <div className="h-7 bg-[#08090f] border-t border-[#1e2337] px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-30">
      {/* Left: Git Branch & Agents Status */}
      <div className="flex items-center gap-4">
        {/* GitHub Branch */}
        <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">{githubConfig.branch}</span>
          {githubConfig.isConnected && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          )}
        </div>

        <div className="h-3.5 w-[1px] bg-[#1e2337]" />

        {/* Agent Swarm Active */}
        <div className="flex items-center gap-1.5">
          <Bot className={`w-3.5 h-3.5 ${isGenerating ? 'text-cyan-400 animate-spin' : 'text-purple-400'}`} />
          <span>Swarm: </span>
          <span className={isGenerating ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
            {isGenerating ? `${activeAgentsCount || 2} Agents Generating...` : '4 Agents Synchronized'}
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-[#1e2337]" />

        {/* Concurrency Indicator */}
        <div className="flex items-center gap-1 text-[10px]">
          <span className={`w-2 h-2 rounded-full ${concurrencyMode ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'}`}></span>
          <span className="text-slate-400">Dual-Stream: </span>
          <span className="text-emerald-400 font-bold">{concurrencyMode ? 'Parallel' : 'Sequential'}</span>
        </div>
      </div>

      {/* Right: Database, Contract, Latency, Terminal Toggle */}
      <div className="flex items-center gap-4">
        {/* Database Active */}
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase text-emerald-400 font-bold">{databaseSchema.type}</span>
          <span className="text-slate-500">({databaseSchema.models.length} tables)</span>
        </div>

        <div className="h-3.5 w-[1px] bg-[#1e2337]" />

        {/* Contract Status */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Contract: </span>
          <span className="text-blue-400 font-semibold">{apiContract?.endpoints.length || 4} Routes</span>
        </div>

        <div className="h-3.5 w-[1px] bg-[#1e2337]" />

        {/* Telemetry Status */}
        <button
          onClick={() => setIsBottomTerminalOpen(!isBottomTerminalOpen)}
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition"
        >
          <TerminalIcon className="w-3 h-3" />
          <span>Terminal</span>
        </button>
      </div>
    </div>
  );
};
