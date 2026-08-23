import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  X, 
  Copy, 
  Check, 
  Save, 
  Code, 
  Layers, 
  Sparkles,
  Maximize2,
  Terminal
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
    databaseSchema 
  } = useWorkspace();

  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content);
      setIsModified(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0a0c13] text-slate-500 font-mono text-xs">
        <Code className="w-12 h-12 text-slate-700 mb-3" />
        <p>No file open. Select a file from the explorer on the left.</p>
      </div>
    );
  }

  const lines = content.split('\n');

  return (
    <div className="h-full flex flex-col bg-[#0a0c13] select-none" onKeyDown={handleKeyDown}>
      {/* File Tabs Bar */}
      <div className="h-10 bg-[#080a0f] border-b border-[#1b2034] flex items-center px-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {openFileIds.map(path => {
            const file = files[path];
            if (!file) return null;
            const isActive = activeFile.path === path;
            return (
              <div
                key={path}
                onClick={() => openFile(path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-mono cursor-pointer transition border-t-2 ${
                  isActive
                    ? 'bg-[#0f121d] text-cyan-300 border-cyan-400 font-semibold'
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-[#121624] hover:text-slate-200'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${file.module === 'frontend' ? 'text-cyan-400' : file.module === 'backend' ? 'text-blue-400' : 'text-emerald-400'}`} />
                <span className="truncate max-w-[140px]">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(path);
                  }}
                  className="p-0.5 rounded hover:bg-[#20273c] text-slate-500 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb & Actions Bar */}
      <div className="h-8 bg-[#0c0f18] border-b border-[#1b2034] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-slate-600">workspace</span>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{activeFile.path}</span>
          {isModified && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" title="Unsaved changes"></span>
          )}
          {activeFile.generatedBy && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 ml-2 uppercase font-semibold">
              by {activeFile.generatedBy} agent
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500">{lines.length} lines</span>
          <button
            onClick={handleSave}
            disabled={!isModified}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition ${
              isModified
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Save file (Ctrl+S)"
          >
            <Save className="w-3 h-3" />
            <span>Save</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main: Line Numbers + Textarea */}
      <div className="flex-1 flex overflow-hidden bg-[#0a0c13] font-mono text-xs leading-relaxed">
        {/* Line Numbers */}
        <div className="w-12 bg-[#08090f] border-r border-[#1b2034] text-slate-600 text-right pr-3 py-3 select-none overflow-hidden font-mono text-[11px]">
          {lines.map((_, i) => (
            <div key={i} className="h-5 leading-5">{i + 1}</div>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 relative overflow-auto p-3">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsModified(true);
            }}
            spellCheck={false}
            className="w-full h-full bg-transparent text-slate-200 resize-none focus:outline-none font-mono text-xs leading-5 border-none p-0 whitespace-pre"
          />
        </div>
      </div>
    </div>
  );
};
