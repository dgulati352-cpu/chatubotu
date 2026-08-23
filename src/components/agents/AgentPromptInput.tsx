import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Database, 
  Terminal, 
  Layers, 
  Zap, 
  ChevronDown,
  Cpu
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DatabaseType } from '../../types/database';

export const AgentPromptInput: React.FC = () => {
  const { 
    triggerFullstackBuild, 
    isGenerating, 
    databaseSchema, 
    changeDatabaseType,
    concurrencyMode,
    setConcurrencyMode
  } = useWorkspace();

  const [prompt, setPrompt] = useState('');
  const [showDbSelector, setShowDbSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    triggerFullstackBuild(prompt.trim());
    setPrompt('');
  };

  const handleSlashCommand = (cmd: string) => {
    if (cmd === '/db-schema') {
      setShowDbSelector(true);
    } else if (cmd === '/goal') {
      setPrompt('Build fullstack AI Agent SaaS platform with PostgreSQL database, Stripe billing, and telemetry dashboard');
    } else if (cmd === '/sync') {
      triggerFullstackBuild('Resync fullstack contracts, Prisma models, and TypeScript types');
    } else if (cmd === '/test') {
      triggerFullstackBuild('Run fullstack automated integration test suite across frontend and backend');
    }
  };

  const quickChips = [
    { label: '🚀 AI SaaS Platform', prompt: 'Build an AI SaaS platform with real-time analytics, user subscriptions, and Postgres database' },
    { label: '🛒 E-Commerce Store', prompt: 'Build an E-Commerce store with product catalog, cart checkout, and orders management' },
    { label: '💬 Realtime Social Feed', prompt: 'Build a social feed application with posts, likes, user profiles, and MongoDB database' },
    { label: '⚡ Crypto Telemetry', prompt: 'Build a high-speed crypto portfolio tracker with live charts and SQLite cache' }
  ];

  const dbOptions: DatabaseType[] = ['postgresql', 'sqlite', 'mysql', 'mongodb', 'supabase', 'redis'];

  return (
    <div className="p-3 bg-[#0d101a] border-t border-[#1e2337]">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 text-cyan-400" />
          Presets:
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(chip.prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#141826] hover:bg-[#1c2236] border border-[#20273e] hover:border-cyan-500/50 text-slate-300 transition shrink-0"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        {/* Database Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDbSelector(!showDbSelector)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#141826] hover:bg-[#1a2136] border border-[#242b42] text-xs font-mono text-emerald-400 font-semibold transition"
            title="Choose target database engine"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="uppercase">{databaseSchema.type}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDbSelector && (
            <div className="absolute left-0 bottom-full mb-2 w-48 rounded-xl bg-[#141824] border border-[#242b42] shadow-2xl p-1.5 z-50 animate-fade-in backdrop-blur-xl">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-semibold">
                Select Database Engine
              </div>
              {dbOptions.map((db) => (
                <button
                  key={db}
                  type="button"
                  onClick={() => {
                    changeDatabaseType(db);
                    setShowDbSelector(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono capitalize transition flex items-center justify-between ${
                    databaseSchema.type === db
                      ? 'bg-emerald-950 text-emerald-300 font-bold'
                      : 'text-slate-300 hover:bg-[#1c2338]'
                  }`}
                >
                  <span>{db}</span>
                  {databaseSchema.type === db && <span className="text-[10px] text-emerald-400">● Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Instruct Frontend & Backend Agents... (e.g. 'Build an AI assistant app with Stripe payments and database')"
            className="w-full pl-4 pr-12 py-2.5 text-xs rounded-xl bg-[#111420] border border-[#242b42] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans shadow-inner"
            disabled={isGenerating}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isGenerating ? 'Synthesizing...' : 'Run Swarm'}</span>
        </button>
      </form>

      {/* Slash Commands Helper */}
      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-500">
        <span>Slash Commands:</span>
        <button onClick={() => handleSlashCommand('/goal')} className="hover:text-cyan-400 transition">/goal</button>
        <button onClick={() => handleSlashCommand('/db-schema')} className="hover:text-emerald-400 transition">/db-schema</button>
        <button onClick={() => handleSlashCommand('/sync')} className="hover:text-purple-400 transition">/sync</button>
        <button onClick={() => handleSlashCommand('/test')} className="hover:text-blue-400 transition">/test</button>
      </div>
    </div>
  );
};
