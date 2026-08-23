import React from 'react';
import { Bot, CheckCircle2, RefreshCw, AlertCircle, Code, Terminal, Layers, ArrowRight } from 'lucide-react';
import { AgentState } from '../../types/agent';

interface AgentCardProps {
  agent: AgentState;
  isSecondary?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isSecondary = false }) => {
  const getStatusBadge = () => {
    switch (agent.status) {
      case 'thinking':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800 animate-pulse">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            Thinking & Planning
          </span>
        );
      case 'coding':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 animate-pulse">
            <Code className="w-2.5 h-2.5 animate-bounce" />
            Writing Code...
          </span>
        );
      case 'syncing':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800">
            <Layers className="w-2.5 h-2.5 animate-spin" />
            Contract Sync
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Idle
          </span>
        );
    }
  };

  return (
    <div 
      className="rounded-xl bg-[#0f121d] border border-[#1e2438] p-4 flex flex-col justify-between transition relative overflow-hidden"
      style={{
        boxShadow: agent.status === 'coding' || agent.status === 'thinking' ? `0 0 25px ${agent.glowColor}` : 'none'
      }}
    >
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md"
              style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}50` }}
            >
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{agent.name}</span>
                <span className="text-[9px] uppercase font-mono px-1 rounded bg-[#1a2034] text-slate-400">
                  {agent.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{agent.title}</p>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* Current Task Description */}
        <div className="p-2.5 rounded-lg bg-[#141826] border border-[#20273e] mb-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            Active Instruction:
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {agent.currentTask}
          </p>
          {agent.activeFile && (
            <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/60 truncate">
              › file: {agent.activeFile}
            </div>
          )}
        </div>
      </div>

      {/* Progress & Metrics */}
      <div>
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Generation Progress</span>
            <span className="text-cyan-400 font-bold">{agent.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#181e30] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${agent.progress}%`,
                backgroundColor: agent.color
              }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-2 border-t border-[#1e2438]">
          <div className="bg-[#141826] p-1.5 rounded">
            <div className="text-slate-500">FILES</div>
            <div className="font-bold text-white">{agent.metrics.filesGenerated}</div>
          </div>
          <div className="bg-[#141826] p-1.5 rounded">
            <div className="text-slate-500">LINES</div>
            <div className="font-bold text-cyan-400">{agent.metrics.linesOfCode}</div>
          </div>
          <div className="bg-[#141826] p-1.5 rounded">
            <div className="text-slate-500">TOKENS</div>
            <div className="font-bold text-purple-400">{(agent.metrics.tokensProcessed / 1000).toFixed(1)}k</div>
          </div>
        </div>
      </div>
    </div>
  );
};
