import React, { useState } from 'react';
import {
  Bot,
  Database,
  Download,
  Play,
  Sparkles,
  Layers,
  Terminal as TerminalIcon,
  Cpu,
  Github,
  Zap,
  Code2,
  Tv,
  User,
  ShieldCheck
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { SupportedAIModel } from '../../types/agent';
import { AVAILABLE_AI_MODELS } from '../../config/models';

interface HeaderProps {
  onOpenGitHubModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGitHubModal, onOpenAuthModal }) => {
  const {
    selectedModel,
    setSelectedModel,
    concurrencyMode,
    setConcurrencyMode,
    isGenerating,
    exportProjectZip,
    databaseSchema,
    githubConfig,
    activeMainTab,
    setActiveMainTab,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    triggerFullstackBuild,
    user,
    credits
  } = useWorkspace();

  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const activeModelMeta = AVAILABLE_AI_MODELS.find(m => m.id === selectedModel) || AVAILABLE_AI_MODELS[1];

  return (
    <header className="h-14 bg-[#0d0f17] border-b border-[#1e2337] px-4 flex items-center justify-between select-none z-30 relative">
      {/* Left: Brand & Model Selector */}
      <div className="flex items-center gap-4">
        {/* Antigravity Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0d0f17] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                ANTIGRAVITY
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wider">
                Multi-Agent
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-[#1e2337]" />

        {/* Model Picker */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1a2030] border border-[#242b42] text-xs transition group"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="text-slate-200 font-medium">
              {activeModelMeta.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono">
              {activeModelMeta.badge}
            </span>
          </button>

          {showModelDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-80 max-h-96 overflow-y-auto rounded-xl bg-[#141824] border border-[#242b42] shadow-2xl p-1.5 z-50 animate-fade-in backdrop-blur-xl custom-scrollbar">
              <div className="px-2.5 py-1 text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Select Active AI Engine
              </div>
              {AVAILABLE_AI_MODELS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedModel(opt.id);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition ${selectedModel === opt.id
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
                    : 'text-slate-300 hover:bg-[#1b2133]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{opt.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                      {opt.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{opt.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Concurrency Pill */}
        <button
          onClick={() => setConcurrencyMode(!concurrencyMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition border ${concurrencyMode
            ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
            : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          title="Enable concurrent execution for Frontend & Backend agents"
        >
          <Sparkles className={`w-3 h-3 ${concurrencyMode ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
          <span>Dual-Agent Concurrency: </span>
          <span className="font-bold">{concurrencyMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Center: Workspace Main Views Tabs */}
      <div className="hidden lg:flex items-center bg-[#111420] p-1 rounded-xl border border-[#1e2337]">
        <button
          onClick={() => setActiveMainTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMainTab === 'editor'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Code Editor
        </button>

        <button
          onClick={() => setActiveMainTab('dual-agents')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMainTab === 'dual-agents'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Dual Agent Swarm
        </button>

        <button
          onClick={() => setActiveMainTab('database-studio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMainTab === 'database-studio'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Database className="w-3.5 h-3.5" />
          Database Studio
          <span className="text-[9px] uppercase px-1 rounded bg-emerald-950 text-emerald-400 font-mono font-bold">
            {databaseSchema.type}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('live-preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMainTab === 'live-preview'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Tv className="w-3.5 h-3.5" />
          Live App Sandbox
        </button>

        <button
          onClick={() => setActiveMainTab('api-tester')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMainTab === 'api-tester'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          API Tester
        </button>
      </div>

      {/* Right: Google Credits, GitHub, Export, Terminal Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Google ID & Credits Status Button */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-[#242b42] text-xs transition group"
          title="Google Account & AI Credits Balance"
        >
          {user ? (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-4 h-4 rounded-full border border-cyan-400/80"
              />
              <span className="text-slate-200 font-mono text-[11px] font-semibold hidden md:inline">
                {credits.standardCredits.toLocaleString()} cr
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium text-xs hidden md:inline">Google Auth</span>
              <span className="text-[10px] font-mono px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                50K
              </span>
            </>
          )}
        </button>

        {/* GitHub Sync Button */}
        <button
          onClick={onOpenGitHubModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${githubConfig.isConnected
            ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            : 'bg-[#141824] hover:bg-[#1c2233] text-slate-300 border-[#242b42]'
            }`}
          title="Connect GitHub Repository to Push/Pull"
        >
          <Github className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">
            {githubConfig.isConnected ? `${githubConfig.owner}/${githubConfig.repo}` : 'Connect GitHub'}
          </span>
          {githubConfig.isConnected && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        {/* Export ZIP */}
        <button
          onClick={exportProjectZip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1e2538] border border-[#242b42] text-xs text-slate-300 font-medium transition"
          title="Download full-stack workspace as runnable ZIP"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>

        {/* Quick Re-Run Button */}
        <button
          onClick={() => triggerFullstackBuild('Refactor and regenerate complete fullstack application')}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating...' : 'Build Fullstack'}</span>
        </button>

        {/* Terminal Toggle */}
        <button
          onClick={() => setIsBottomTerminalOpen(!isBottomTerminalOpen)}
          className={`p-2 rounded-lg border transition ${isBottomTerminalOpen
            ? 'bg-cyan-950/50 text-cyan-400 border-cyan-800/60'
            : 'bg-[#141824] text-slate-400 border-[#242b42] hover:text-slate-200'
            }`}
          title="Toggle Bottom Terminal / Telemetry"
        >
          <TerminalIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
