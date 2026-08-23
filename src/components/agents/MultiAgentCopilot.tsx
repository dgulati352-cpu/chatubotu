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
  Send,
  Sparkles,
  Bot,
  Terminal as TerminalIcon,
  ChevronDown,
  Layers,
  Tv,
  Database,
  ArrowUp,
  Cpu,
  ShieldCheck,
  Code2,
  FileCode
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AVAILABLE_AI_MODELS } from '../../config/models';
import { SupportedAIModel, AgentRole } from '../../types/agent';
import { LivePreview } from '../preview/LivePreview';
import { DatabaseStudio } from '../database/DatabaseStudio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentRole?: AgentRole;
  text: string;
  timestamp: number;
  steps?: {
    title: string;
    description?: string;
    details?: string[];
    isSuccess?: boolean;
    filesChanged?: { count: number; added: number; deleted: number };
  }[];
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
    credits,
    activeFile
  } = useWorkspace();

  const [panelView, setPanelView] = useState<'chat' | 'preview' | 'database'>('chat');
  const [promptInput, setPromptInput] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'user',
      text: `echo "# chatubotu" >> README.md\ngit init\ngit add README.md\ngit commit -m "first commit"\ngit branch -M main\ngit remote add origin https://github.com/dgulati352-cpu/chatubotu.git\ngit push -u origin main`,
      timestamp: Date.now() - 120000
    },
    {
      id: 'msg_2',
      sender: 'agent',
      agentRole: 'architect',
      text: 'All requested Git initialization and push commands have been executed successfully:',
      timestamp: Date.now() - 60000,
      steps: [
        {
          title: 'Confirmed npm run build compiles cleanly.',
          isSuccess: true
        },
        {
          title: 'Committed Codebase: Staged all project files and created the initial commit (first commit).',
          isSuccess: true
        },
        {
          title: 'Configured Remote & Pushed:',
          details: [
            'Set default branch to main',
            'Added remote origin: https://github.com/dgulati352-cpu/chatubotu.git',
            'Successfully pushed to origin/main (To https://github.com/dgulati352-cpu/chatubotu.git)'
          ],
          filesChanged: { count: 5, added: 115, deleted: 21 },
          isSuccess: true
        }
      ]
    }
  ]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  if (!isRightAssistantOpen) {
    return null;
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isGenerating) return;

    const userPrompt = promptInput.trim();
    setPromptInput('');

    const newMsgId = `usr_${Date.now()}`;
    const agentMsgId = `agt_${Date.now()}`;

    setMessages(prev => [
      ...prev,
      {
        id: newMsgId,
        sender: 'user',
        text: userPrompt,
        timestamp: Date.now()
      },
      {
        id: agentMsgId,
        sender: 'agent',
        agentRole: 'architect',
        text: `Orchestrating Multi-Agent Swarm for: "${userPrompt}"...`,
        timestamp: Date.now(),
        isStreaming: true,
        steps: [
          {
            title: '📐 Lead Architect drafting shared REST API contracts & PostgreSQL schema...',
            isSuccess: true
          },
          {
            title: '✨ Frontend & ⚡ Backend agents synthesizing concurrent modules...',
            isSuccess: true
          }
        ]
      }
    ]);

    await triggerFullstackBuild(userPrompt);

    setMessages(prev =>
      prev.map(msg =>
        msg.id === agentMsgId
          ? {
              ...msg,
              isStreaming: false,
              text: `Swarm generation completed successfully for "${userPrompt}". All virtual files, schemas, and live sandbox components are updated and ready.`,
              steps: [
                {
                  title: 'Verified type safety and build integrity with Zero errors.',
                  isSuccess: true
                },
                {
                  title: 'Synchronized shared contracts across Frontend and Backend services.',
                  filesChanged: { count: 8, added: 340, deleted: 0 },
                  isSuccess: true
                }
              ]
            }
          : msg
      )
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeModelMeta = AVAILABLE_AI_MODELS.find(m => m.id === selectedModel) || AVAILABLE_AI_MODELS[1];

  return (
    <div className="w-[380px] lg:w-[440px] bg-[#181818] border-l border-[#2b2b2b] flex flex-col justify-between h-full select-none font-sans overflow-hidden text-xs">
      {/* 1. Header of Right Panel */}
      <div className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between text-[#cccccc]">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-white truncate text-[12px]">
            Initialize And Push Reposit
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => {
              setMessages([
                {
                  id: `welcome_${Date.now()}`,
                  sender: 'agent',
                  agentRole: 'architect',
                  text: 'Ready. How can the Antigravity Multi-Agent Swarm assist you today?',
                  timestamp: Date.now()
                }
              ]);
            }}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="New Chat"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPanelView(panelView === 'chat' ? 'preview' : 'chat')}
            className={`p-1 rounded transition ${panelView === 'preview' ? 'text-cyan-400 bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a] hover:text-white'}`}
            title="Toggle Live Sandbox View"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPanelView(panelView === 'database' ? 'chat' : 'database')}
            className={`p-1 rounded transition ${panelView === 'database' ? 'text-emerald-400 bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a] hover:text-white'}`}
            title="Toggle Database Studio"
          >
            <Database className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {}}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="More Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
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

      {/* Embedded View Mode (Preview / Database / Chat) */}
      {panelView === 'preview' && (
        <div className="flex-1 overflow-hidden">
          <LivePreview />
        </div>
      )}

      {panelView === 'database' && (
        <div className="flex-1 overflow-hidden">
          <DatabaseStudio />
        </div>
      )}

      {panelView === 'chat' && (
        /* 2. Main Chat / Execution Stream */
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-4 font-sans text-xs bg-[#181818] custom-scrollbar"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2 animate-fade-in">
              {/* User Message Card */}
              {msg.sender === 'user' ? (
                <div className="p-2.5 rounded-lg bg-[#252526] border border-[#333333] text-[#d4d4d4] font-mono text-[11px] leading-relaxed shadow-sm whitespace-pre-wrap">
                  {msg.text}
                </div>
              ) : (
                /* Agent Response & Execution Steps */
                <div className="space-y-2 text-[#cccccc]">
                  {/* Agent Header / Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="font-semibold text-white">Antigravity Swarm</span>
                    <span className="text-[10px] text-[#858585] font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Text */}
                  <p className="text-[12px] text-[#cccccc] leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Execution Steps */}
                  {msg.steps && (
                    <div className="space-y-1.5 pt-1">
                      {msg.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-[#1f1f1f] border border-[#2b2b2b] space-y-1"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-400 text-xs mt-0.5 font-bold">✓</span>
                            <span className="text-[11px] font-medium text-[#d4d4d4]">
                              {step.title}
                            </span>
                          </div>

                          {step.details && (
                            <ul className="pl-5 space-y-0.5 text-[11px] text-[#999999] list-disc">
                              {step.details.map((detail, dIdx) => (
                                <li key={dIdx} className="font-mono text-[10px]">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}

                          {step.filesChanged && (
                            <div className="mt-2 pt-1 border-t border-[#2b2b2b] flex items-center justify-between text-[10px] font-mono">
                              <span className="text-[#858585]">
                                {step.filesChanged.count} files changed <span className="text-emerald-400">+{step.filesChanged.added}</span> <span className="text-rose-400">-{step.filesChanged.deleted}</span>
                              </span>
                              <button className="px-2 py-0.5 rounded bg-[#2a2a2a] hover:bg-[#333333] text-cyan-400 font-semibold transition">
                                Review
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Action Bar (Copy, Like, Dislike, Retry) */}
                  <div className="flex items-center gap-2 pt-1 text-[#858585]">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 hover:text-white transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'up' }))}
                      className={`p-1 transition ${feedback[msg.id] === 'up' ? 'text-cyan-400' : 'hover:text-white'}`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'down' }))}
                      className={`p-1 transition ${feedback[msg.id] === 'down' ? 'text-rose-400' : 'hover:text-white'}`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleSendMessage()}
                      className="p-1 hover:text-white transition ml-auto"
                      title="Retry swarm generation"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="p-3 rounded-lg bg-[#1f1f1f] border border-[#2b2b2b] flex items-center gap-3 animate-pulse text-xs text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Agents collaborating & streaming synthesis...</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Bottom AI Prompt Box (Matching Screenshot) */}
      <div className="p-2.5 bg-[#181818] border-t border-[#2b2b2b] space-y-2">
        {/* Top Reference Chips */}
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#858585] overflow-x-auto scrollbar-none">
          <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#252526] hover:bg-[#2e2e30] text-[#cccccc] border border-[#333333] transition whitespace-nowrap">
            <span>0 Files With ...</span>
          </button>

          <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#252526] hover:bg-[#2e2e30] text-[#cccccc] border border-[#333333] transition whitespace-nowrap">
            <span>Review Changes</span>
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
            placeholder="Ask anything, @ to mention, / for actions"
            rows={2}
            className="w-full bg-transparent text-white text-xs placeholder-[#858585] focus:outline-none resize-none font-sans"
          />

          {/* Bottom Bar Inside Input Box */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Plus + Model Dropdown + Context Tokens */}
            <div className="flex items-center gap-1.5 relative">
              <button
                type="button"
                className="p-1 rounded hover:bg-[#333333] text-[#858585] hover:text-white transition"
                title="Add Context / Files"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Model Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#2d2d2d] text-[#cccccc] text-[11px] font-sans border border-[#3c3c3c] transition"
                >
                  <span className="truncate max-w-[100px]">{activeModelMeta.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#858585]" />
                </button>

                {showModelPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowModelPicker(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-1 w-64 bg-[#1f1f1f] border border-[#3c3c3c] rounded-xl shadow-2xl p-1 z-50 animate-fade-in text-[11px]">
                      <div className="px-2 py-1 text-[10px] text-[#858585] font-bold uppercase">
                        Select AI Engine
                      </div>
                      {AVAILABLE_AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelPicker(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                            selectedModel === model.id
                              ? 'bg-[#094771] text-white font-semibold'
                              : 'text-[#cccccc] hover:bg-[#2a2a2a]'
                          }`}
                        >
                          <span>{model.name}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-[#2a2a2a] text-[#999999]">
                            {model.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
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
