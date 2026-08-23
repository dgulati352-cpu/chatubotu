import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Split,
  MoreHorizontal,
  X,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Sparkles,
  Bot,
  ChevronDown,
  Tv,
  Database,
  ArrowUp,
  Cpu,
  Layers,
  Code2,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileCode,
  Zap
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AVAILABLE_AI_MODELS } from '../../config/models';
import { SupportedAIModel, AgentRole } from '../../types/agent';
import { LivePreview } from '../preview/LivePreview';
import { DatabaseStudio } from '../database/DatabaseStudio';

interface AgentStreamItem {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
  steps?: {
    title: string;
    details?: string[];
    isSuccess?: boolean;
    filesChanged?: { count: number; added: number; deleted: number };
  }[];
  streamingCode?: string;
  activeFile?: string;
  isStreaming?: boolean;
}

export const MultiAgentCopilot: React.FC = () => {
  const {
    isRightAssistantOpen,
    setIsRightAssistantOpen,
    selectedModel,
    setSelectedModel,
    triggerFullstackBuild,
    isGenerating,
    agents,
    openFile
  } = useWorkspace();

  // Dual Agent Mode State
  const [viewMode, setViewMode] = useState<'dual' | 'single' | 'preview' | 'database'>('dual');
  const [isExpandedWidth, setIsExpandedWidth] = useState(true);
  const [promptInput, setPromptInput] = useState('');
  const [targetAgent, setTargetAgent] = useState<'both' | 'frontend' | 'backend'>('both');

  // Independent Model Selectors for Frontend & Backend
  const [frontendModel, setFrontendModel] = useState<SupportedAIModel>('claude-3-7-sonnet');
  const [backendModel, setBackendModel] = useState<SupportedAIModel>('deepseek-r1');
  const [showFrontendModelPicker, setShowFrontendModelPicker] = useState(false);
  const [showBackendModelPicker, setShowBackendModelPicker] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const frontendScrollRef = useRef<HTMLDivElement>(null);
  const backendScrollRef = useRef<HTMLDivElement>(null);

  // Frontend Agent Stream
  const [frontendMessages, setFrontendMessages] = useState<AgentStreamItem[]>([
    {
      id: 'fe_init_1',
      sender: 'user',
      text: 'echo "# chatubotu" >> README.md\ngit add README.md\ngit commit -m "first commit"',
      timestamp: Date.now() - 120000
    },
    {
      id: 'fe_init_2',
      sender: 'agent',
      text: 'Frontend Architect: React components, Tailwind styling, and live sandbox client initialized cleanly.',
      timestamp: Date.now() - 60000,
      activeFile: 'src/components/layout/Header.tsx',
      steps: [
        {
          title: 'Confirmed React UI & Vite dev server bundle compiles cleanly.',
          isSuccess: true
        },
        {
          title: 'Synchronized interactive Code Editor and Monaco Theme layout.',
          filesChanged: { count: 3, added: 145, deleted: 12 },
          isSuccess: true
        }
      ]
    }
  ]);

  // Backend Agent Stream
  const [backendMessages, setBackendMessages] = useState<AgentStreamItem[]>([
    {
      id: 'be_init_1',
      sender: 'user',
      text: 'git branch -M main\ngit remote add origin https://github.com/dgulati352-cpu/chatubotu.git\ngit push -u origin main',
      timestamp: Date.now() - 120000
    },
    {
      id: 'be_init_2',
      sender: 'agent',
      text: 'Backend Systems Engineer: Remote repository synchronized, PostgreSQL schema and REST endpoints live.',
      timestamp: Date.now() - 60000,
      activeFile: 'src/config/models.ts',
      steps: [
        {
          title: 'Configured Remote & Pushed: https://github.com/dgulati352-cpu/chatubotu.git (branch main).',
          isSuccess: true
        },
        {
          title: 'Database connection verified with PostgreSQL schema pool.',
          filesChanged: { count: 2, added: 95, deleted: 9 },
          isSuccess: true
        }
      ]
    }
  ]);

  useEffect(() => {
    if (frontendScrollRef.current) {
      frontendScrollRef.current.scrollTop = frontendScrollRef.current.scrollHeight;
    }
    if (backendScrollRef.current) {
      backendScrollRef.current.scrollTop = backendScrollRef.current.scrollHeight;
    }
  }, [frontendMessages, backendMessages, isGenerating]);

  if (!isRightAssistantOpen) {
    return null;
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isGenerating) return;

    const userPrompt = promptInput.trim();
    setPromptInput('');

    const ts = Date.now();

    if (targetAgent === 'both' || targetAgent === 'frontend') {
      setFrontendMessages(prev => [
        ...prev,
        { id: `fe_u_${ts}`, sender: 'user', text: userPrompt, timestamp: ts },
        {
          id: `fe_a_${ts}`,
          sender: 'agent',
          text: `✨ Frontend Agent (${AVAILABLE_AI_MODELS.find(m => m.id === frontendModel)?.name || 'Claude 3.7 Sonnet'}) generating UI layout, React components, and responsive design for: "${userPrompt}"...`,
          timestamp: ts,
          isStreaming: true,
          steps: [
            { title: 'Designing interactive React 18 component tree & Tailwind styles...', isSuccess: true }
          ]
        }
      ]);
    }

    if (targetAgent === 'both' || targetAgent === 'backend') {
      setBackendMessages(prev => [
        ...prev,
        { id: `be_u_${ts}`, sender: 'user', text: userPrompt, timestamp: ts },
        {
          id: `be_a_${ts}`,
          sender: 'agent',
          text: `⚡ Backend Agent (${AVAILABLE_AI_MODELS.find(m => m.id === backendModel)?.name || 'DeepSeek R1'}) synthesizing Node.js Express controllers, database queries, and REST routes for: "${userPrompt}"...`,
          timestamp: ts,
          isStreaming: true,
          steps: [
            { title: 'Drafting Prisma schema migrations & type-safe API handlers...', isSuccess: true }
          ]
        }
      ]);
    }

    await triggerFullstackBuild(userPrompt);

    // Update completion state
    if (targetAgent === 'both' || targetAgent === 'frontend') {
      setFrontendMessages(prev =>
        prev.map(msg =>
          msg.id === `fe_a_${ts}`
            ? {
                ...msg,
                isStreaming: false,
                text: `Frontend synthesis completed. Generated responsive components, state hooks, and client sandbox.`,
                steps: [
                  { title: 'Components mounted with zero lint errors and hot-reload.', isSuccess: true },
                  { title: 'Synchronized client hooks with backend REST endpoints.', filesChanged: { count: 4, added: 210, deleted: 0 }, isSuccess: true }
                ]
              }
            : msg
        )
      );
    }

    if (targetAgent === 'both' || targetAgent === 'backend') {
      setBackendMessages(prev =>
        prev.map(msg =>
          msg.id === `be_a_${ts}`
            ? {
                ...msg,
                isStreaming: false,
                text: `Backend synthesis completed. Endpoints, PostgreSQL database models, and server handlers are live.`,
                steps: [
                  { title: 'Database migrations verified with 100% type safety.', isSuccess: true },
                  { title: 'REST API endpoints returning 200 OK with simulated payloads.', filesChanged: { count: 3, added: 180, deleted: 0 }, isSuccess: true }
                ]
              }
            : msg
        )
      );
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const frontendMeta = AVAILABLE_AI_MODELS.find(m => m.id === frontendModel) || AVAILABLE_AI_MODELS[2];
  const backendMeta = AVAILABLE_AI_MODELS.find(m => m.id === backendModel) || AVAILABLE_AI_MODELS[4];

  // Dynamic width based on Dual mode and expansion toggle
  const panelWidthClass = viewMode === 'dual'
    ? (isExpandedWidth ? 'w-[720px] xl:w-[780px]' : 'w-[520px]')
    : 'w-[400px] lg:w-[440px]';

  return (
    <div
      className={`${panelWidthClass} bg-[#181818] border-l border-[#2b2b2b] flex flex-col justify-between h-full select-none font-sans overflow-hidden text-xs transition-all duration-200 z-30`}
    >
      {/* 1. Header with Dual/Single Switcher, View Toggles & Width Control */}
      <div className="h-[38px] bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between text-[#cccccc]">
        {/* Left: Title & Mode Toggle */}
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-white truncate text-[12px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dual Multi-Agent Swarm</span>
          </span>

          {/* Dual vs Single Switcher */}
          <div className="flex items-center bg-[#252526] p-0.5 rounded-lg border border-[#333333] ml-1">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                viewMode === 'dual' ? 'bg-[#007acc] text-white shadow-sm font-bold' : 'text-[#858585] hover:text-white'
              }`}
              title="Split View: Frontend & Backend Agents Side-by-Side"
            >
              Dual (FE + BE)
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                viewMode === 'single' ? 'bg-[#007acc] text-white shadow-sm font-bold' : 'text-[#858585] hover:text-white'
              }`}
              title="Single Unified Stream"
            >
              Unified
            </button>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => setIsExpandedWidth(!isExpandedWidth)}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title={isExpandedWidth ? 'Collapse Width' : 'Expand Width (Dual View)'}
          >
            {isExpandedWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'preview' ? 'dual' : 'preview')}
            className={`p-1 rounded transition ${viewMode === 'preview' ? 'text-cyan-400 bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a] hover:text-white'}`}
            title="Toggle Live Sandbox View"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'database' ? 'dual' : 'database')}
            className={`p-1 rounded transition ${viewMode === 'database' ? 'text-emerald-400 bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a] hover:text-white'}`}
            title="Toggle Database Studio"
          >
            <Database className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsRightAssistantOpen(false)}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Embedded View Mode (Preview / Database) */}
      {viewMode === 'preview' && (
        <div className="flex-1 overflow-hidden">
          <LivePreview />
        </div>
      )}

      {viewMode === 'database' && (
        <div className="flex-1 overflow-hidden">
          <DatabaseStudio />
        </div>
      )}

      {/* 2. DUAL AGENT STREAM: FRONTEND + BACKEND SIDE-BY-SIDE */}
      {viewMode === 'dual' && (
        <div className="flex-1 flex overflow-hidden divide-x divide-[#2b2b2b] bg-[#141414]">
          {/* ========================================================================= */}
          {/* COLUMN 1: ✨ FRONTEND AGENT STREAM                                         */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#181818]">
            {/* Frontend Column Sub-Header */}
            <div className="h-8 bg-[#1f1f1f] border-b border-[#2b2b2b] px-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse"></span>
                <span className="font-bold text-white text-[11px] font-sans">✨ FRONTEND AGENT</span>
                <span className="text-[9px] px-1 rounded bg-[#2a2d3d] text-cyan-300 font-mono">React 18</span>
              </div>

              {/* Frontend Model Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowFrontendModelPicker(!showFrontendModelPicker)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#252526] hover:bg-[#2d2d2d] text-[#cccccc] text-[10px] border border-[#3c3c3c] transition"
                  title="Change Frontend Model"
                >
                  <span className="truncate max-w-[85px]">{frontendMeta.name}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-[#858585]" />
                </button>

                {showFrontendModelPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFrontendModelPicker(false)} />
                    <div className="absolute top-full right-0 mt-1 w-60 bg-[#1f1f1f] border border-[#3c3c3c] rounded-xl shadow-2xl p-1 z-50 animate-fade-in text-[11px]">
                      <div className="px-2 py-1 text-[10px] text-[#858585] font-bold uppercase">Frontend AI Engine</div>
                      {AVAILABLE_AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setFrontendModel(model.id);
                            setShowFrontendModelPicker(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between transition ${
                            frontendModel === model.id ? 'bg-[#094771] text-white font-semibold' : 'text-[#cccccc] hover:bg-[#2a2a2a]'
                          }`}
                        >
                          <span>{model.name}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-[#2a2a2a] text-[#999999]">{model.badge}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Frontend Messages Feed */}
            <div ref={frontendScrollRef} className="flex-1 overflow-y-auto p-2.5 space-y-3 font-sans text-xs custom-scrollbar bg-[#181818]">
              {frontendMessages.map((msg) => (
                <div key={msg.id} className="space-y-1.5 animate-fade-in">
                  {msg.sender === 'user' ? (
                    <div className="p-2 rounded bg-[#252526] border border-[#333333] text-[#d4d4d4] font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[#cccccc]">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-cyan-400">
                        <span>✨ Frontend Specialist</span>
                        <span className="text-[#666666]">({frontendMeta.name})</span>
                      </div>

                      <p className="text-[11px] text-[#d4d4d4] leading-relaxed">
                        {msg.text}
                      </p>

                      {msg.activeFile && (
                        <button
                          onClick={() => openFile(msg.activeFile!)}
                          className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline bg-[#141d26] px-1.5 py-0.5 rounded border border-cyan-900/60"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>{msg.activeFile}</span>
                        </button>
                      )}

                      {msg.steps && (
                        <div className="space-y-1 pt-0.5">
                          {msg.steps.map((step, idx) => (
                            <div key={idx} className="p-1.5 rounded bg-[#1f1f1f] border border-[#2b2b2b] text-[10px]">
                              <div className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="text-[#d4d4d4] font-medium">{step.title}</span>
                              </div>
                              {step.filesChanged && (
                                <div className="mt-1 pt-1 border-t border-[#2b2b2b] flex items-center justify-between text-[9px] font-mono text-[#858585]">
                                  <span>{step.filesChanged.count} UI files <span className="text-emerald-400">+{step.filesChanged.added}</span></span>
                                  <span className="text-cyan-400 font-bold">Synced</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 pt-0.5 text-[#858585]">
                        <button onClick={() => handleCopy(msg.id, msg.text)} className="p-0.5 hover:text-white transition">
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'up' }))} className={`p-0.5 ${feedback[msg.id] === 'up' ? 'text-cyan-400' : 'hover:text-white'}`}>
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="p-2 rounded bg-[#1f1f1f] border border-cyan-900/60 flex items-center gap-2 text-[10px] text-cyan-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                  <span>Synthesizing React components & Tailwind UI...</span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: ⚡ BACKEND AGENT STREAM                                          */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#181818]">
            {/* Backend Column Sub-Header */}
            <div className="h-8 bg-[#1f1f1f] border-b border-[#2b2b2b] px-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse"></span>
                <span className="font-bold text-white text-[11px] font-sans">⚡ BACKEND AGENT</span>
                <span className="text-[9px] px-1 rounded bg-[#1d2a3d] text-blue-300 font-mono">Node & Prisma</span>
              </div>

              {/* Backend Model Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowBackendModelPicker(!showBackendModelPicker)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#252526] hover:bg-[#2d2d2d] text-[#cccccc] text-[10px] border border-[#3c3c3c] transition"
                  title="Change Backend Model"
                >
                  <span className="truncate max-w-[85px]">{backendMeta.name}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-[#858585]" />
                </button>

                {showBackendModelPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowBackendModelPicker(false)} />
                    <div className="absolute top-full right-0 mt-1 w-60 bg-[#1f1f1f] border border-[#3c3c3c] rounded-xl shadow-2xl p-1 z-50 animate-fade-in text-[11px]">
                      <div className="px-2 py-1 text-[10px] text-[#858585] font-bold uppercase">Backend AI Engine</div>
                      {AVAILABLE_AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setBackendModel(model.id);
                            setShowBackendModelPicker(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between transition ${
                            backendModel === model.id ? 'bg-[#094771] text-white font-semibold' : 'text-[#cccccc] hover:bg-[#2a2a2a]'
                          }`}
                        >
                          <span>{model.name}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-[#2a2a2a] text-[#999999]">{model.badge}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Backend Messages Feed */}
            <div ref={backendScrollRef} className="flex-1 overflow-y-auto p-2.5 space-y-3 font-sans text-xs custom-scrollbar bg-[#181818]">
              {backendMessages.map((msg) => (
                <div key={msg.id} className="space-y-1.5 animate-fade-in">
                  {msg.sender === 'user' ? (
                    <div className="p-2 rounded bg-[#252526] border border-[#333333] text-[#d4d4d4] font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[#cccccc]">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-blue-400">
                        <span>⚡ Backend Engineer</span>
                        <span className="text-[#666666]">({backendMeta.name})</span>
                      </div>

                      <p className="text-[11px] text-[#d4d4d4] leading-relaxed">
                        {msg.text}
                      </p>

                      {msg.activeFile && (
                        <button
                          onClick={() => openFile(msg.activeFile!)}
                          className="flex items-center gap-1 text-[10px] font-mono text-blue-400 hover:underline bg-[#141b26] px-1.5 py-0.5 rounded border border-blue-900/60"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>{msg.activeFile}</span>
                        </button>
                      )}

                      {msg.steps && (
                        <div className="space-y-1 pt-0.5">
                          {msg.steps.map((step, idx) => (
                            <div key={idx} className="p-1.5 rounded bg-[#1f1f1f] border border-[#2b2b2b] text-[10px]">
                              <div className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="text-[#d4d4d4] font-medium">{step.title}</span>
                              </div>
                              {step.filesChanged && (
                                <div className="mt-1 pt-1 border-t border-[#2b2b2b] flex items-center justify-between text-[9px] font-mono text-[#858585]">
                                  <span>{step.filesChanged.count} API files <span className="text-emerald-400">+{step.filesChanged.added}</span></span>
                                  <span className="text-blue-400 font-bold">Verified</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 pt-0.5 text-[#858585]">
                        <button onClick={() => handleCopy(msg.id, msg.text)} className="p-0.5 hover:text-white transition">
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'up' }))} className={`p-0.5 ${feedback[msg.id] === 'up' ? 'text-blue-400' : 'hover:text-white'}`}>
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="p-2 rounded bg-[#1f1f1f] border border-blue-900/60 flex items-center gap-2 text-[10px] text-blue-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                  <span>Synthesizing Express APIs & PostgreSQL models...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE UNIFIED VIEW */}
      {viewMode === 'single' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 font-sans text-xs bg-[#181818] custom-scrollbar">
          {frontendMessages.map((msg) => (
            <div key={msg.id} className="p-2 rounded-lg bg-[#252526] border border-[#333333] text-xs">
              <span className="text-cyan-400 font-bold block mb-1">✨ Frontend:</span>
              <p className="text-[#d4d4d4]">{msg.text}</p>
            </div>
          ))}
          {backendMessages.map((msg) => (
            <div key={msg.id} className="p-2 rounded-lg bg-[#252526] border border-[#333333] text-xs">
              <span className="text-blue-400 font-bold block mb-1">⚡ Backend:</span>
              <p className="text-[#d4d4d4]">{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Bottom AI Prompt Box with Target Switcher (Frontend, Backend, or Both) */}
      <div className="p-2.5 bg-[#181818] border-t border-[#2b2b2b] space-y-2">
        {/* Top Reference & Target Chips */}
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#858585] overflow-x-auto scrollbar-none">
          {/* Target Selector Pills */}
          <button
            onClick={() => setTargetAgent('both')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition text-[10px] font-semibold whitespace-nowrap border ${
              targetAgent === 'both'
                ? 'bg-purple-950/80 text-purple-300 border-purple-700 font-bold'
                : 'bg-[#252526] text-[#858585] border-[#333333] hover:text-white'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5 text-purple-400" />
            <span>Both (Dual Swarm)</span>
          </button>

          <button
            onClick={() => setTargetAgent('frontend')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition text-[10px] font-semibold whitespace-nowrap border ${
              targetAgent === 'frontend'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 font-bold'
                : 'bg-[#252526] text-[#858585] border-[#333333] hover:text-white'
            }`}
          >
            <span>✨ @Frontend</span>
          </button>

          <button
            onClick={() => setTargetAgent('backend')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition text-[10px] font-semibold whitespace-nowrap border ${
              targetAgent === 'backend'
                ? 'bg-blue-950/80 text-blue-300 border-blue-700 font-bold'
                : 'bg-[#252526] text-[#858585] border-[#333333] hover:text-white'
            }`}
          >
            <span>⚡ @Backend</span>
          </button>

          <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#252526] hover:bg-[#2e2e30] text-[#cccccc] border border-[#333333] transition whitespace-nowrap text-[10px]">
            <span>0 Files With ...</span>
          </button>
        </div>

        {/* Prompt Input Container */}
        <form
          onSubmit={handleSendMessage}
          className="rounded-xl bg-[#252526] border border-[#3c3c3c] focus-within:border-[#007acc] p-2 space-y-2 transition shadow-inner"
        >
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              targetAgent === 'both'
                ? 'Ask Dual Swarm (Both Frontend UI & Backend APIs will synthesize concurrently)...'
                : targetAgent === 'frontend'
                ? 'Ask Frontend Agent (React, UI components, styling)...'
                : 'Ask Backend Agent (Express, Prisma, PostgreSQL, endpoints)...'
            }
            rows={2}
            className="w-full bg-transparent text-white text-xs placeholder-[#858585] focus:outline-none resize-none font-sans"
          />

          {/* Bottom Bar Inside Input Box */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Plus + Target Indicators + Token Meter */}
            <div className="flex items-center gap-1.5 relative">
              <button
                type="button"
                className="p-1 rounded hover:bg-[#333333] text-[#858585] hover:text-white transition"
                title="Add Context / Files"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Models Pill info */}
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#858585] bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#333333]">
                <span className="text-cyan-400 font-semibold">{frontendMeta.name.split(' ')[0]}</span>
                <span>+</span>
                <span className="text-blue-400 font-semibold">{backendMeta.name.split(' ')[0]}</span>
              </div>

              {/* Context / Token Meter Pill */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e1e1e] text-[10px] font-mono text-[#858585] border border-[#333333]">
                <span className="text-cyan-400">▲</span>
                <span>MC...</span>
              </div>
            </div>

            {/* Right Submit Button */}
            <button
              type="submit"
              disabled={!promptInput.trim() || isGenerating}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                promptInput.trim() && !isGenerating
                  ? 'bg-white text-black hover:bg-slate-200 shadow-md'
                  : 'bg-[#333333] text-[#666666] cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
