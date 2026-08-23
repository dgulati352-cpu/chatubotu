import React from 'react';
import {
  GitBranch,
  RotateCw,
  XCircle,
  AlertTriangle,
  Radio,
  CheckCircle,
  Cpu,
  Bot,
  Sparkles,
  Terminal as TerminalIcon
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const StatusBar: React.FC = () => {
  const {
    activeFile,
    githubConfig,
    isGenerating,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    selectedModel
  } = useWorkspace();

  const lineCount = activeFile ? activeFile.content.split('\n').length : 105;

  return (
    <footer className="h-[22px] bg-[#181818] border-t border-[#2b2b2b] px-2 flex items-center justify-between text-[11px] font-sans text-[#858585] select-none z-30">
      {/* Left items: Git Branch, Sync, Errors/Warnings, Mode, Swarm */}
      <div className="flex items-center gap-3 h-full">
        {/* Branch & Sync */}
        <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="font-medium text-[#cccccc]">{githubConfig.branch || 'main'}</span>
          <RotateCw className="w-3 h-3 text-[#858585] ml-0.5" />
        </div>

        {/* Errors & Warnings count */}
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition">
          <div className="flex items-center gap-0.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>0</span>
          </div>
        </div>

        <div className="h-3 w-[1px] bg-[#2b2b2b]" />

        {/* Editor Mode */}
        <div className="text-[#858585] font-mono text-[10px]">
          -- NORMAL --
        </div>

        <div className="h-3 w-[1px] bg-[#2b2b2b]" />

        {/* Multi-Agent Swarm Status */}
        <div className="flex items-center gap-1.5 text-cyan-400 font-sans">
          <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="text-[11px]">
            {isGenerating ? 'Swarm: Synthesizing Code...' : 'Swarm: Ready (Gemini 2.5 + Claude 3.7)'}
          </span>
        </div>
      </div>

      {/* Right items: Ln/Col, Spaces, UTF-8, LF, TypeScript, Feedback, Settings */}
      <div className="flex items-center gap-3 h-full">
        <span className="hover:text-white cursor-pointer">
          Ln {Math.min(105, lineCount)}, Col 1
        </span>

        <span className="hover:text-white cursor-pointer">
          Spaces: 2
        </span>

        <span className="hover:text-white cursor-pointer">
          UTF-8
        </span>

        <span className="hover:text-white cursor-pointer">
          LF
        </span>

        <span className="hover:text-white cursor-pointer flex items-center gap-1">
          <span className="text-[#3178c6] font-mono font-bold text-[10px]">{'{}'}</span>
          <span>{activeFile?.language === 'typescript' || activeFile?.language === 'tsx' ? 'TypeScript' : activeFile?.language || 'TypeScript'}</span>
        </span>

        <div className="h-3 w-[1px] bg-[#2b2b2b]" />

        <button
          onClick={() => setIsBottomTerminalOpen(!isBottomTerminalOpen)}
          className="flex items-center gap-1 hover:text-white transition"
          title="Toggle Terminal"
        >
          <TerminalIcon className="w-3 h-3" />
          <span>Terminal</span>
        </button>

        <span className="hover:text-white cursor-pointer text-[10px]">
          Antigravity - Settings
        </span>
      </div>
    </footer>
  );
};
