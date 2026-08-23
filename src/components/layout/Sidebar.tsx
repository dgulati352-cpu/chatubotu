import React, { useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Grid,
  Bot,
  User,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  FilePlus,
  FolderPlus,
  RotateCw,
  MinusSquare,
  Sparkles,
  Database,
  Code,
  FileText,
  Trash2,
  FolderOpen,
  UploadCloud,
  Layers
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileTreeNode } from '../../services/virtualFs';

interface SidebarProps {
  onOpenGitHubModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenGitHubModal, onOpenAuthModal }) => {
  const {
    workspaceName,
    openLocalFolder,
    openLocalFile,
    vfs,
    files,
    activeFile,
    openFile,
    createNewFile,
    deleteFile,
    activeActivityTab,
    setActiveActivityTab,
    githubConfig,
    isLeftSidebarOpen,
    gitCommits,
    pushToGitHub,
    selectedModel,
    setSelectedModel,
    concurrencyMode,
    setConcurrencyMode
  } = useWorkspace();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'root_workspace': true,
    'folder_dist': false,
    'folder_node_modules': false,
    'folder_src': true,
    'folder_src/components': true,
    'folder_src/components/agents': false,
    'folder_src/components/layout': false,
    'folder_src/components/editor': false,
    'folder_src/config': true,
    'folder_src/context': false,
    'folder_src/services': false,
    'folder_src/types': false
  });

  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  if (!isLeftSidebarOpen) {
    return null;
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFilePath.trim()) {
      createNewFile(newFilePath.trim());
      setNewFilePath('');
      setShowNewFileInput(false);
    }
  };

  const handleGitCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    setIsCommitting(true);
    await pushToGitHub(commitMessage.trim());
    setCommitMessage('');
    setIsCommitting(false);
  };

  const fileTree = vfs.buildTree();

  const renderFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (fileName === '.gitignore') {
      return <span className="text-[#e34c26] text-[11px] font-bold">●</span>;
    }
    if (fileName === 'README.md') {
      return <span className="text-[#519aba] text-[10px] font-mono font-bold px-0.5 rounded bg-[#1e2a38]">MD</span>;
    }
    if (fileName.endsWith('.json')) {
      return <span className="text-[#cbcb41] text-[10px] font-mono font-bold">{'{}'}</span>;
    }
    if (fileName.endsWith('.css')) {
      return <span className="text-[#42a5f5] text-[11px] font-mono">()</span>;
    }
    if (fileName.endsWith('.html')) {
      return <span className="text-[#e44d26] text-[11px] font-mono">{'</>'}</span>;
    }
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
      return <span className="text-[#3178c6] text-[10px] font-mono font-bold px-0.5 rounded bg-[#1a2d48]">TS</span>;
    }
    if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
      return <span className="text-[#3178c6] text-[10px] font-mono font-bold px-0.5 rounded bg-[#1a2d48]">TS</span>;
    }
    if (fileName.endsWith('.prisma') || fileName.endsWith('.sql')) {
      return <Database className="w-3.5 h-3.5 text-[#50e3c2]" />;
    }
    return <FileText className="w-3.5 h-3.5 text-[#858585]" />;
  };

  const renderTree = (nodes: FileTreeNode[], depth = 0) => {
    return nodes.map(node => {
      if (node.isFolder) {
        const isExpanded = !!expandedFolders[node.id];
        return (
          <div key={node.id} className="select-none">
            <div
              onClick={() => toggleFolder(node.id)}
              className="flex items-center gap-1 px-1.5 py-[2px] rounded hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc] text-[12px] group transition"
              style={{ paddingLeft: `${depth * 12 + 6}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-[#c5c5c5]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#c5c5c5]" />
              )}
              <span className="text-[#dcb67a] text-[12px]">📁</span>
              <span className="truncate font-sans text-[12px] text-[#cccccc] group-hover:text-white">
                {node.name}
              </span>
              {node.name === 'node_modules' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto mr-1 opacity-70"></span>
              )}
            </div>

            {isExpanded && node.children && (
              <div>
                {renderTree(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      }

      const isActive = activeFile?.path === node.path;
      return (
        <div
          key={node.id}
          onClick={() => openFile(node.path)}
          className={`flex items-center justify-between py-[2px] pr-2 rounded cursor-pointer text-[12px] group transition ${
            isActive
              ? 'bg-[#094771] text-white font-medium'
              : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 12 + 18}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {renderFileIcon(node.name)}
            <span className="truncate font-sans text-[12px]">{node.name}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFile(node.path);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 transition"
            title="Delete File"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full select-none">
      {/* 1. Left Activity Bar (Thin Vertical Rail) */}
      <div className="w-[48px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-2 justify-between z-30">
        {/* Top Icons */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* Explorer */}
          <button
            onClick={() => setActiveActivityTab('explorer')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'explorer'
                ? 'text-white'
                : 'text-[#858585] hover:text-white'
            }`}
            title="Explorer (Ctrl+Shift+E)"
          >
            {activeActivityTab === 'explorer' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-white"></span>
            )}
            <Files className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Search */}
          <button
            onClick={() => setActiveActivityTab('search')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'search'
                ? 'text-white'
                : 'text-[#858585] hover:text-white'
            }`}
            title="Search (Ctrl+Shift+F)"
          >
            {activeActivityTab === 'search' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-white"></span>
            )}
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Source Control */}
          <button
            onClick={() => setActiveActivityTab('source-control')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'source-control'
                ? 'text-white'
                : 'text-[#858585] hover:text-white'
            }`}
            title="Source Control (Ctrl+Shift+G)"
          >
            {activeActivityTab === 'source-control' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-white"></span>
            )}
            <div className="relative">
              <GitBranch className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute -top-1 -right-1.5 px-1 py-[1px] bg-[#007acc] text-white text-[9px] font-bold rounded-full leading-none">
                5
              </span>
            </div>
          </button>

          {/* Run and Debug */}
          <button
            onClick={() => setActiveActivityTab('debug')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'debug'
                ? 'text-white'
                : 'text-[#858585] hover:text-white'
            }`}
            title="Run and Debug (Ctrl+Shift+D)"
          >
            {activeActivityTab === 'debug' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-white"></span>
            )}
            <Play className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Extensions */}
          <button
            onClick={() => setActiveActivityTab('extensions')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'extensions'
                ? 'text-white'
                : 'text-[#858585] hover:text-white'
            }`}
            title="Extensions (Ctrl+Shift+X)"
          >
            {activeActivityTab === 'extensions' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-white"></span>
            )}
            <Grid className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Antigravity Multi-Agent Swarm */}
          <button
            onClick={() => setActiveActivityTab('swarm')}
            className={`w-full py-2 flex items-center justify-center relative transition ${
              activeActivityTab === 'swarm'
                ? 'text-cyan-400'
                : 'text-[#858585] hover:text-cyan-300'
            }`}
            title="Antigravity Swarm Orchestration"
          >
            {activeActivityTab === 'swarm' && (
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-cyan-400"></span>
            )}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#181818] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
          </button>
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal()}
            className="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition"
            title="Accounts"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>

          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal()}
            className="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition"
            title="Manage Settings"
          >
            <Settings className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* 2. Primary Side Bar Drawer */}
      <div className="w-[230px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between overflow-hidden">
        {/* EXPLORER TAB */}
        {activeActivityTab === 'explorer' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Explorer Header */}
            <div className="h-9 px-3 flex items-center justify-between text-[#bbbbbb] font-sans text-[11px] font-bold tracking-wide">
              <span>EXPLORER</span>
              <div className="flex items-center gap-1 text-[#858585]">
                {/* Open Local Folder Button */}
                <button
                  onClick={openLocalFolder}
                  className="p-1 hover:bg-[#2a2a2a] text-cyan-400 hover:text-cyan-300 rounded transition"
                  title="Open Local Folder from Computer (Ctrl+K Ctrl+O)"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                </button>

                {/* Open Local File Button */}
                <button
                  onClick={openLocalFile}
                  className="p-1 hover:bg-[#2a2a2a] text-emerald-400 hover:text-emerald-300 rounded transition"
                  title="Open Local File from Computer (Ctrl+O)"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowNewFileInput(!showNewFileInput)}
                  className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
                  title="New File"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowNewFileInput(!showNewFileInput)}
                  className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
                  title="New Folder"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
                  title="Refresh Explorer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setExpandedFolders({ 'root_workspace': true });
                  }}
                  className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition"
                  title="Collapse All Folders"
                >
                  <MinusSquare className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:bg-[#2a2a2a] hover:text-white rounded transition">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inline New File Form */}
            {showNewFileInput && (
              <form onSubmit={handleCreateFile} className="px-2 py-1 bg-[#1f1f1f] border-b border-[#2b2b2b]">
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="filename.ts"
                  className="w-full px-2 py-0.5 text-xs bg-[#2d2d2d] border border-[#007acc] text-white focus:outline-none font-mono"
                  autoFocus
                />
              </form>
            )}

            {/* Root Folder & Tree View */}
            <div className="flex-1 overflow-y-auto px-1 py-1 font-sans text-xs custom-scrollbar">
              {/* Root Workspace Folder Item */}
              <div
                onClick={() => toggleFolder('root_workspace')}
                className="flex items-center justify-between px-1.5 py-[2px] font-bold text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer rounded text-[12px] group"
              >
                <div className="flex items-center gap-1 truncate">
                  {expandedFolders['root_workspace'] ? (
                    <ChevronDown className="w-3 h-3 text-[#c5c5c5]" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-[#c5c5c5]" />
                  )}
                  <span className="font-semibold text-white truncate">{workspaceName}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLocalFolder();
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-cyan-400 hover:text-white transition"
                  title="Switch to another local folder"
                >
                  <FolderOpen className="w-3 h-3" />
                </button>
              </div>

              {expandedFolders['root_workspace'] && (
                <div className="mt-0.5">
                  {renderTree(fileTree, 1)}
                </div>
              )}
            </div>

            {/* Accordions: Outline & Timeline */}
            <div className="border-t border-[#2b2b2b] text-[11px] font-sans font-bold text-[#bbbbbb]">
              {/* Outline */}
              <div
                onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                className="px-3 py-1 flex items-center gap-1 hover:bg-[#2a2a2a] cursor-pointer"
              >
                {isOutlineOpen ? (
                  <ChevronDown className="w-3 h-3 text-[#c5c5c5]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#c5c5c5]" />
                )}
                <span className="uppercase text-[11px]">Outline</span>
              </div>
              {isOutlineOpen && (
                <div className="px-5 py-1 text-[11px] font-normal text-[#858585]">
                  No symbols in active document.
                </div>
              )}

              {/* Timeline */}
              <div
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="px-3 py-1 flex items-center gap-1 hover:bg-[#2a2a2a] cursor-pointer border-t border-[#2b2b2b]"
              >
                {isTimelineOpen ? (
                  <ChevronDown className="w-3 h-3 text-[#c5c5c5]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#c5c5c5]" />
                )}
                <span className="uppercase text-[11px]">Timeline</span>
              </div>
              {isTimelineOpen && (
                <div className="px-5 py-1 text-[11px] font-normal text-[#858585]">
                  Git commit: first commit (main)
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeActivityTab === 'search' && (
          <div className="flex flex-col h-full p-3 space-y-3">
            <div className="text-[11px] font-bold text-[#bbbbbb] uppercase">SEARCH</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in files..."
              className="w-full px-2.5 py-1 text-xs bg-[#2d2d2d] border border-[#3c3c3c] text-white focus:border-[#007acc] outline-none rounded"
            />
            <div className="text-[11px] text-[#858585]">
              {searchQuery ? `0 matches found for "${searchQuery}"` : 'Type to search workspace'}
            </div>
          </div>
        )}

        {/* SOURCE CONTROL TAB */}
        {activeActivityTab === 'source-control' && (
          <div className="flex flex-col h-full p-3 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#bbbbbb] uppercase">
              <span>SOURCE CONTROL: GIT</span>
              <span className="text-[#007acc]">{githubConfig.branch}</span>
            </div>
            <form onSubmit={handleGitCommit} className="space-y-2">
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Message (Ctrl+Enter to commit)"
                rows={3}
                className="w-full px-2 py-1.5 text-xs bg-[#2d2d2d] border border-[#3c3c3c] text-white focus:border-[#007acc] outline-none rounded resize-none"
              />
              <button
                type="submit"
                disabled={isCommitting || !commitMessage.trim()}
                className="w-full py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-semibold rounded transition disabled:opacity-50"
              >
                {isCommitting ? 'Committing...' : 'Commit & Push'}
              </button>
            </form>
            <div className="space-y-1 pt-2 border-t border-[#2b2b2b]">
              <div className="text-[11px] font-semibold text-[#cccccc]">Recent Commits:</div>
              {gitCommits.map(c => (
                <div key={c.id} className="p-1.5 bg-[#202020] rounded border border-[#2b2b2b] text-[11px]">
                  <div className="font-semibold text-cyan-400 truncate">{c.message}</div>
                  <div className="text-[10px] text-[#858585]">{c.sha} • {c.author}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MULTI-AGENT SWARM TAB */}
        {activeActivityTab === 'swarm' && (
          <div className="flex flex-col h-full p-3 space-y-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Swarm</span>
            </div>

            {/* Model Selection */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#858585]">Primary Orchestrator Engine</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="w-full px-2 py-1 text-xs bg-[#2d2d2d] border border-[#3c3c3c] text-white rounded outline-none"
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Reasoning)</option>
                <option value="gemini-2.5-flash">Gemini 3.7 / 2.5 Flash</option>
                <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                <option value="deepseek-r1">DeepSeek R1</option>
                <option value="gpt-4-5">OpenAI GPT-4.5 Orion</option>
                <option value="antigravity-quantum-v3">Antigravity Swarm v3</option>
              </select>
            </div>

            {/* Concurrency Toggle */}
            <div className="p-2 bg-[#202020] border border-[#2b2b2b] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cccccc] font-medium">Parallel Agent Execution</span>
                <input
                  type="checkbox"
                  checked={concurrencyMode}
                  onChange={(e) => setConcurrencyMode(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-[#858585]">Frontend Architect & Backend Engineer generate simultaneously.</p>
            </div>

            {/* Agent Roles List */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-[#858585] uppercase">Active Neural Roles:</div>
              <div className="p-2 bg-[#1f1f1f] rounded border border-[#2b2b2b] text-[11px] space-y-0.5">
                <div className="font-bold text-purple-300">📐 Lead System Architect</div>
                <div className="text-[10px] text-[#858585]">Gemini 2.5 Pro • Rest Contracts & DB</div>
              </div>
              <div className="p-2 bg-[#1f1f1f] rounded border border-[#2b2b2b] text-[11px] space-y-0.5">
                <div className="font-bold text-cyan-300">✨ Frontend UI Specialist</div>
                <div className="text-[10px] text-[#858585]">Claude 3.7 Sonnet • React & Tailwind</div>
              </div>
              <div className="p-2 bg-[#1f1f1f] rounded border border-[#2b2b2b] text-[11px] space-y-0.5">
                <div className="font-bold text-blue-300">⚡ Backend Systems Engineer</div>
                <div className="text-[10px] text-[#858585]">DeepSeek R1 • Node.js & Prisma APIs</div>
              </div>
              <div className="p-2 bg-[#1f1f1f] rounded border border-[#2b2b2b] text-[11px] space-y-0.5">
                <div className="font-bold text-amber-300">🛡️ Sentinel QA Reviewer</div>
                <div className="text-[10px] text-[#858585]">Gemini 2.5 Flash • Linting & Validation</div>
              </div>
            </div>
          </div>
        )}

        {/* EXTENSIONS / PLUGINS TAB */}
        {activeActivityTab === 'extensions' && (
          <div className="flex flex-col h-full p-3 space-y-3">
            <div className="text-[11px] font-bold text-[#bbbbbb] uppercase">INSTALLED EXTENSIONS</div>
            <div className="space-y-2">
              <div className="p-2 bg-[#202020] rounded border border-[#2b2b2b] text-xs">
                <div className="font-bold text-white">Antigravity AI Agent Engine</div>
                <div className="text-[10px] text-cyan-400">v2.5.0 • Google DeepMind</div>
              </div>
              <div className="p-2 bg-[#202020] rounded border border-[#2b2b2b] text-xs">
                <div className="font-bold text-white">TypeScript & React Intelligence</div>
                <div className="text-[10px] text-slate-400">v5.7.3 • Official</div>
              </div>
              <div className="p-2 bg-[#202020] rounded border border-[#2b2b2b] text-xs">
                <div className="font-bold text-white">Tailwind CSS IntelliSense</div>
                <div className="text-[10px] text-slate-400">v3.4.0 • Active</div>
              </div>
            </div>
          </div>
        )}

        {/* DEBUG / SANDBOX TAB */}
        {activeActivityTab === 'debug' && (
          <div className="flex flex-col h-full p-3 space-y-3">
            <div className="text-[11px] font-bold text-[#bbbbbb] uppercase">RUN & DEBUG</div>
            <p className="text-xs text-[#858585]">
              Vite Development Sandbox is running at <span className="text-cyan-400 font-mono">http://localhost:3000</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
