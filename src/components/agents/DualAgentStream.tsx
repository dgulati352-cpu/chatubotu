import React from 'react';
import { Cpu, Zap, Layers, Database, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AgentCard } from './AgentCard';
import { InterAgentChat } from './InterAgentChat';

export const DualAgentStream: React.FC = () => {
  const { agents, interAgentMessages, concurrencyMode, isGenerating, databaseSchema } = useWorkspace();

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto space-y-4 bg-[#090b11]">
      {/* Top Banner: Concurrency Status */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#141826] via-[#161c2e] to-[#141826] border border-[#232a42] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-sans">
                Antigravity Concurrent AI Swarm
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Parallel Execution Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Frontend & Backend agents building client components, API routes, database schemas, and shared contracts concurrently.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#0d101a] border border-[#242b42] text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Target DB: </span>
            <span className="text-emerald-400 font-bold uppercase">{databaseSchema.type}</span>
          </div>
        </div>
      </div>

      {/* Primary Dual Stream: Left Frontend Agent / Right Backend Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Frontend Agent Card */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              STREAM 01: FRONTEND AGENT
            </span>
            <span className="text-slate-400 text-[11px] font-normal">React 18 • Tailwind • UI/UX</span>
          </div>
          <AgentCard agent={agents.frontend} />
        </div>

        {/* Backend Agent Card */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400"></span>
              STREAM 02: BACKEND AGENT
            </span>
            <span className="text-slate-400 text-[11px] font-normal">Express • Prisma • REST API</span>
          </div>
          <AgentCard agent={agents.backend} />
        </div>
      </div>

      {/* Secondary Swarm: Architect, Database Agent & Inter-Agent Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Architect & QA */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            LEAD ARCHITECT
          </div>
          <AgentCard agent={agents.architect} isSecondary />
        </div>

        {/* Database Agent */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            DATABASE ARCHITECT
          </div>
          <AgentCard agent={agents.database} isSecondary />
        </div>

        {/* Inter-Agent Dialogue Stream */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            INTER-AGENT NEGOTIATION
          </div>
          <InterAgentChat messages={interAgentMessages} />
        </div>
      </div>
    </div>
  );
};
