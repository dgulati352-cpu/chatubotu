import React from 'react';
import { MessageSquare, ArrowRight, Layers, Bot, Zap, CheckCircle2 } from 'lucide-react';
import { InterAgentMessage, AgentRole } from '../../types/agent';

interface InterAgentChatProps {
  messages: InterAgentMessage[];
}

export const InterAgentChat: React.FC<InterAgentChatProps> = ({ messages }) => {
  const getAgentBadge = (role: AgentRole) => {
    switch (role) {
      case 'architect':
        return <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] font-bold border border-purple-800">📐 ARCHITECT</span>;
      case 'frontend':
        return <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-800">✨ FRONTEND</span>;
      case 'backend':
        return <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px] font-bold border border-blue-800">⚡ BACKEND</span>;
      case 'database':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">🗄️ DATABASE</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">🤖 QA</span>;
    }
  };

  return (
    <div className="rounded-xl bg-[#0f121d] border border-[#1e2438] p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2438] mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Inter-Agent Communication Bus
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Live Handshake Stream
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px]">
        {messages.map((msg) => (
          <div key={msg.id} className="p-3 rounded-lg bg-[#141826] border border-[#20273e] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                {getAgentBadge(msg.from)}
                <ArrowRight className="w-3 h-3 text-slate-500" />
                {getAgentBadge(msg.to)}
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed pl-1 border-l-2 border-[#2b334d]">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
