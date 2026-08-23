import React, { useState } from 'react';
import { 
  FolderTree, 
  Bot, 
  Database, 
  FileCode, 
  GitBranch, 
  Bookmark, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  Layers, 
  Sparkles,
  Key,
  Server,
  Code
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileTreeNode } from '../../services/virtualFs';
import { DatabaseType } from '../../types/database';

export const Sidebar: React.FC<{ onOpenGitHubModal: () => void }> = ({ onOpenGitHubModal }) => {
  const { 
    vfs, 
    files, 
    activeFile, 
    openFile, 
    createNewFile, 
    deleteFile, 
    activeSideDrawer, 
    setActiveSideDrawer,
    setActiveMainTab,
    databaseSchema,
    changeDatabaseType,
    loadPresetTemplate,
    triggerFullstackBuild,
    apiContract
  } = useWorkspace();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'folder_frontend': true,
    'folder_frontend/src': true,
    'folder_backend': true,
    'folder_backend/src': true,
    'folder_database': true,
    'folder_contracts': true
  });

  const [newFileInputPath, setNewFileInputPath] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileInputPath.trim()) {
      createNewFile(newFileInputPath.trim());
      setNewFileInputPath('');
      setShowNewFileInput(false);
    }
  };

  const fileTree = vfs.buildTree();

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <Code className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ts':
      case 'js':
        return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
      case 'prisma':
      case 'sql':
        return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'json':
        return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
      case 'md':
        return <File className="w-3.5 h-3.5 text-purple-400" />;
      case 'yml':
      case 'yaml':
        return <Server className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <File className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const renderTreeNodes = (nodes: FileTreeNode[]) => {
    return nodes.map(node => {
      if (node.isFolder) {
        const isExpanded = expandedFolders[node.id];
        return (
          <div key={node.id} className="select-none">
            <div
              onClick={() => toggleFolder(node.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#181e30] cursor-pointer text-xs text-slate-300 transition group"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
              <Folder className={`w-3.5 h-3.5 ${
                node.name === 'frontend' ? 'text-cyan-400' :
                node.name === 'backend' ? 'text-blue-400' :
                node.name === 'database' ? 'text-emerald-400' :
                node.name === 'contracts' ? 'text-purple-400' : 'text-amber-400'
              }`} />
              <span className="font-medium text-slate-300 font-mono text-[11px] group-hover:text-white">
                {node.name}
              </span>
            </div>
            {isExpanded && node.children && (
              <div className="pl-3 border-l border-[#20273c] ml-2 mt-0.5">
                {renderTreeNodes(node.children)}
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
          className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs transition group ${
            isActive
              ? 'bg-cyan-950/70 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:bg-[#161c2c] hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {getFileIcon(node.name)}
            <span className="font-mono text-[11px] truncate">{node.name}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFile(node.path);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition"
            title="Delete File"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    });
  };

  const templatesList = [
    { name: 'AI SaaS Dashboard', db: 'postgresql', desc: 'Next-gen AI assistant workstation with Stripe & telemetry' },
    { name: 'E-Commerce Platform', db: 'postgresql', desc: 'Product catalog, shopping cart, orders, and payment intents' },
    { name: 'Pulse Social Feed', db: 'mongodb', desc: 'Realtime posts, user profiles, tags, and engagement counts' },
    { name: 'Microservice API Engine', db: 'sqlite', desc: 'Ultra-fast lightweight API endpoints with Prisma models' }
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem-1.75rem)] select-none">
      {/* Mini Tool Rail */}
      <div className="w-12 bg-[#0a0c13] border-r border-[#1e2337] flex flex-col items-center py-3 gap-3 z-20">
        <button
          onClick={() => setActiveSideDrawer('explorer')}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'explorer'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="File Explorer (Virtual FS)"
        >
          <FolderTree className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideDrawer('agents');
            setActiveMainTab('dual-agents');
          }}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'agents'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="Dual Agent Swarm Control"
        >
          <Bot className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideDrawer('database');
            setActiveMainTab('database-studio');
          }}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'database'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="Database Studio & Models"
        >
          <Database className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveSideDrawer('contract')}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'contract'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="Shared API Contract & Endpoints"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideDrawer('github');
            onOpenGitHubModal();
          }}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'github'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="GitHub Integration"
        >
          <GitBranch className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveSideDrawer('templates')}
          className={`p-2 rounded-xl transition ${
            activeSideDrawer === 'templates'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
          }`}
          title="Fullstack Templates"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <div className="mt-auto">
          <button
            onClick={() => setActiveSideDrawer('settings')}
            className={`p-2 rounded-xl transition ${
              activeSideDrawer === 'settings'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:bg-[#151926] hover:text-slate-200'
            }`}
            title="Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Sidebar Drawer */}
      <div className="w-64 bg-[#0d101a] border-r border-[#1e2337] flex flex-col overflow-hidden">
        {/* EXPLORER DRAWER */}
        {activeSideDrawer === 'explorer' && (
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-[#1e2337] flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                EXPLORER
              </span>
              <button
                onClick={() => setShowNewFileInput(!showNewFileInput)}
                className="p-1 rounded hover:bg-[#1c2338] text-slate-400 hover:text-cyan-400 transition"
                title="Create New File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {showNewFileInput && (
              <form onSubmit={handleCreateFileSubmit} className="p-2 border-b border-[#1e2337] bg-[#141826]">
                <input
                  type="text"
                  value={newFileInputPath}
                  onChange={(e) => setNewFileInputPath(e.target.value)}
                  placeholder="e.g. frontend/src/Header.tsx"
                  className="w-full px-2 py-1 text-xs rounded bg-[#0b0e17] border border-[#242b42] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  autoFocus
                />
              </form>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {renderTreeNodes(fileTree)}
            </div>

            {/* Quick Stats at bottom of explorer */}
            <div className="p-2.5 bg-[#0a0d16] border-t border-[#1e2337] text-[10px] font-mono text-slate-500 flex justify-between">
              <span>{Object.keys(files).length} Files in Virtual FS</span>
              <span className="text-cyan-400">All Synced</span>
            </div>
          </div>
        )}

        {/* DATABASE DRAWER */}
        {activeSideDrawer === 'database' && (
          <div className="flex flex-col h-full p-3 overflow-y-auto space-y-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                DATABASE ENGINE
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(['postgresql', 'sqlite', 'mysql', 'mongodb', 'supabase', 'redis'] as DatabaseType[]).map(db => (
                  <button
                    key={db}
                    onClick={() => changeDatabaseType(db)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono capitalize transition border ${
                      databaseSchema.type === db
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 font-bold'
                        : 'bg-[#141826] text-slate-400 border-[#20273e] hover:bg-[#1c2338]'
                    }`}
                  >
                    {db}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>MODELS & TABLES</span>
                <span className="text-emerald-400 text-[10px] font-mono">{databaseSchema.models.length}</span>
              </div>
              <div className="space-y-1.5">
                {databaseSchema.models.map(model => (
                  <div key={model.id} className="p-2 rounded-lg bg-[#141826] border border-[#20273e]">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span className="font-mono text-cyan-300">{model.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{model.tableName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {model.columns.length} columns • {model.rowsCount || 0} records
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveMainTab('database-studio')}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              Open Database Studio
            </button>
          </div>
        )}

        {/* TEMPLATES DRAWER */}
        {activeSideDrawer === 'templates' && (
          <div className="flex flex-col h-full p-3 overflow-y-auto space-y-3">
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
              FULLSTACK BLUEPRINTS
            </div>
            {templatesList.map(tmpl => (
              <div
                key={tmpl.name}
                onClick={() => loadPresetTemplate(tmpl.name)}
                className="p-2.5 rounded-xl bg-[#141826] hover:bg-[#1a2136] border border-[#20273e] cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                    {tmpl.name}
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                    {tmpl.db}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {tmpl.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CONTRACT DRAWER */}
        {activeSideDrawer === 'contract' && (
          <div className="flex flex-col h-full p-3 overflow-y-auto space-y-3">
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
              SHARED API CONTRACT
            </div>
            <div className="p-2 rounded-lg bg-[#141826] border border-[#20273e] text-xs font-mono text-slate-300 space-y-1">
              <div className="text-slate-400 text-[10px]">BASE URL</div>
              <div className="text-cyan-400">{apiContract?.baseUrl || 'http://localhost:5000'}</div>
            </div>

            <div className="space-y-1.5">
              {apiContract?.endpoints.map(ep => (
                <div key={ep.id} className="p-2 rounded-lg bg-[#141826] border border-[#20273e] text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold font-mono px-1 rounded ${
                      ep.method === 'GET' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-white text-[11px] truncate">{ep.path}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{ep.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS DRAWER */}
        {activeSideDrawer === 'settings' && (
          <div className="flex flex-col h-full p-3 overflow-y-auto space-y-4">
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
              API CONFIGURATION
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1 block">
                Google Gemini / OpenAI Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... or sk-..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#0b0e17] border border-[#242b42] text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                onClick={() => setApiKeySaved(true)}
                className="mt-2 w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
              >
                {apiKeySaved ? '✓ Key Saved' : 'Save Key'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
