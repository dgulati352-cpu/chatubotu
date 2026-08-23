import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Copy,
  Check,
  Split,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Save,
  FileCode,
  Code
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const CodeEditor: React.FC = () => {
  const {
    activeFile,
    openFileIds,
    files,
    openFile,
    closeFile,
    saveFileContent,
    setIsRightAssistantOpen
  } = useWorkspace();

  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [cursorLine, setCursorLine] = useState(105);
  const [cursorCol, setCursorCol] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content);
      setIsModified(false);
      const lineCount = activeFile.content.split('\n').length;
      setCursorLine(Math.min(105, lineCount));
    }
  }, [activeFile]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (activeFile) {
      saveFileContent(activeFile.path, content);
      setIsModified(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      setIsRightAssistantOpen(true);
    }
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const pos = target.selectionStart;
    const textBefore = target.value.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorLine(lines.length);
    setCursorCol((lines[lines.length - 1]?.length || 0) + 1);
  };

  const getFileBadge = (fileName: string) => {
    if (fileName === '.gitignore') return <span className="text-[#e34c26] text-[10px] font-bold">●</span>;
    if (fileName === 'README.md') return <span className="text-[#519aba] text-[9px] font-mono font-bold px-0.5 bg-[#1e2a38] rounded">MD</span>;
    if (fileName.endsWith('.json')) return <span className="text-[#cbcb41] text-[9px] font-mono font-bold">{'{}'}</span>;
    if (fileName.endsWith('.css')) return <span className="text-[#42a5f5] text-[10px] font-mono">()</span>;
    if (fileName.endsWith('.html')) return <span className="text-[#e44d26] text-[10px] font-mono">{'</>'}</span>;
    return <span className="text-[#3178c6] text-[9px] font-mono font-bold px-0.5 bg-[#1a2d48] rounded">TS</span>;
  };

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-[#858585] font-mono text-xs select-none">
        <Code className="w-12 h-12 text-[#333333] mb-3" />
        <p className="text-sm text-[#cccccc] font-sans mb-1">No Open File</p>
        <p className="text-xs text-[#858585]">Press <span className="text-cyan-400 font-mono">Ctrl+P</span> to quick open any file.</p>
      </div>
    );
  }

  const lines = content.split('\n');
  const pathParts = activeFile.path.split('/');

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] select-none overflow-hidden font-sans">
      {/* 1. File Tabs Bar */}
      <div className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between px-0 overflow-x-auto scrollbar-none select-none">
        <div className="flex items-center h-full">
          {openFileIds.map(path => {
            const file = files[path];
            if (!file) return null;
            const isActive = activeFile.path === path;
            return (
              <div
                key={path}
                onClick={() => openFile(path)}
                className={`flex items-center gap-1.5 px-3 h-full border-r border-[#2b2b2b] cursor-pointer text-xs font-sans transition group relative ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-t border-t-[#007acc] font-medium'
                    : 'bg-[#181818] text-[#969696] hover:bg-[#1f1f1f] hover:text-[#cccccc]'
                }`}
              >
                {getFileBadge(file.name)}
                <span className="truncate max-w-[130px] text-[12px]">{file.name}</span>
                {file.isModified && (
                  <span className="w-2 h-2 rounded-full bg-white ml-0.5"></span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(path);
                  }}
                  className={`p-0.5 rounded ml-1 transition ${
                    isActive ? 'text-[#858585] hover:text-white' : 'opacity-0 group-hover:opacity-100 text-[#858585] hover:text-white'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Editor Tab Actions */}
        <div className="flex items-center gap-1 px-2 text-[#858585]">
          <button
            onClick={() => setIsRightAssistantOpen(true)}
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="Split Editor Right"
          >
            <Split className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
            title="More Actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Breadcrumbs Bar */}
      <div className="h-[22px] bg-[#1e1e1e] border-b border-[#2b2b2b] px-3 flex items-center text-[11px] text-[#858585] font-sans select-none">
        <div className="flex items-center gap-1">
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-[#666666]" />}
              <span className={`hover:text-[#cccccc] cursor-pointer ${
                index === pathParts.length - 1 ? 'text-[#cccccc] font-medium flex items-center gap-1' : ''
              }`}>
                {index === pathParts.length - 1 && getFileBadge(part)}
                <span>{part}</span>
              </span>
            </React.Fragment>
          ))}
          <ChevronRight className="w-3 h-3 text-[#666666]" />
          <span className="text-[#666666]">...</span>
        </div>
      </div>

      {/* 3. Code Editor Main Area + Minimap */}
      <div className="flex-1 flex overflow-hidden relative bg-[#1e1e1e]">
        {/* Line Numbers Gutter */}
        <div className="w-[50px] bg-[#1e1e1e] border-r border-[#2b2b2b] py-2 text-right pr-3 select-none overflow-hidden font-mono text-[12px] leading-5 text-[#858585]">
          {lines.map((_, idx) => (
            <div
              key={idx}
              className={`h-5 leading-5 ${
                idx + 1 === cursorLine ? 'text-[#c6c6c6] font-bold' : ''
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Editor Code Area */}
        <div className="flex-1 relative overflow-auto p-0 font-mono text-[13px] leading-5">
          {/* Subtle Watermark Hint */}
          <div className="absolute top-2 left-3 pointer-events-none text-[12px] text-[#4a4a4a] font-mono select-none flex items-center gap-2">
            <span>Ctrl+I for Agent</span>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsModified(true);
            }}
            onKeyDown={handleKeyDown}
            onSelect={handleTextareaSelect}
            onClick={handleTextareaSelect}
            onKeyUp={handleTextareaSelect}
            spellCheck={false}
            className="w-full h-full bg-transparent text-[#d4d4d4] resize-none focus:outline-none font-mono text-[13px] leading-5 border-none p-2 pl-3 whitespace-pre custom-scrollbar"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* 4. Code Minimap (Right Edge) */}
        <div className="w-[64px] bg-[#1e1e1e] border-l border-[#2b2b2b] p-1 select-none overflow-hidden hidden md:block opacity-70 hover:opacity-100 transition">
          <div className="space-y-[2px] pointer-events-none scale-[0.6] origin-top-left">
            {lines.slice(0, 120).map((line, i) => {
              const trimmed = line.trim();
              const widthPct = Math.min(100, Math.max(10, trimmed.length * 3));
              const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*');
              const isKeyword = trimmed.startsWith('import') || trimmed.startsWith('export') || trimmed.startsWith('const') || trimmed.startsWith('type');
              return (
                <div
                  key={i}
                  className={`h-[2px] rounded-sm ${
                    i + 1 === cursorLine
                      ? 'bg-cyan-400 w-full shadow-sm'
                      : isComment
                      ? 'bg-emerald-700/60'
                      : isKeyword
                      ? 'bg-purple-500/60'
                      : 'bg-slate-500/40'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
