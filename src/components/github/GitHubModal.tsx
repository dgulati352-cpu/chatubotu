import React, { useState } from 'react';
import { 
  Github, 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  GitPullRequest, 
  Check, 
  ExternalLink, 
  UploadCloud, 
  Lock, 
  X,
  Sparkles
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GitHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    githubConfig, 
    setGithubConfig, 
    gitCommits, 
    pushToGitHub, 
    files,
    addTerminalLog 
  } = useWorkspace();

  const [tokenInput, setTokenInput] = useState(githubConfig.token);
  const [ownerInput, setOwnerInput] = useState(githubConfig.owner);
  const [repoInput, setRepoInput] = useState(githubConfig.repo);
  const [branchInput, setBranchInput] = useState(githubConfig.branch);
  const [commitMessage, setCommitMessage] = useState('feat: concurrent fullstack modules synced with PostgreSQL schema');
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubConfig(prev => ({
      ...prev,
      token: tokenInput,
      owner: ownerInput,
      repo: repoInput,
      branch: branchInput,
      isConnected: true
    }));
    addTerminalLog(`[GIT] Connected to GitHub repository: ${ownerInput}/${repoInput}@${branchInput}`, 'success');
  };

  const handlePush = async () => {
    setIsPushing(true);
    await pushToGitHub(commitMessage);
    setIsPushing(false);
    setPushSuccess(true);
    setTimeout(() => setPushSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f121e] border border-[#222942] rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f253d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">GitHub Repository Synchronization</h2>
              <p className="text-xs text-slate-400">Push fullstack files, database schemas, and contracts directly to GitHub</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1a2034] text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Config Form */}
        <form onSubmit={handleSaveConfig} className="grid grid-cols-2 gap-3 bg-[#0a0d16] p-4 rounded-xl border border-[#1f253d]">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">GitHub Owner / Organization</label>
            <input
              type="text"
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
              placeholder="e.g. your-username"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0e121e] border border-[#222942] text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Repository Name</label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. fullstack-saas-agent"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0e121e] border border-[#222942] text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Branch</label>
            <input
              type="text"
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              placeholder="main"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0e121e] border border-[#222942] text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Personal Access Token (PAT)</label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxx"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0e121e] border border-[#222942] text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Save Configuration
            </button>
          </div>
        </form>

        {/* Commit & Push Section */}
        <div className="p-4 rounded-xl bg-[#0a0d16] border border-[#1f253d] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              Stage & Commit {Object.keys(files).length} Files to GitHub
            </span>
            <span className="text-emerald-400 font-semibold">{ownerInput}/{repoInput}@{branchInput}</span>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 mb-1 block">Commit Message</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#0e121e] border border-[#222942] text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-mono">
              Includes: frontend/, backend/, database/schema.prisma, contracts/api.ts
            </span>

            <button
              onClick={handlePush}
              disabled={isPushing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {pushSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Pushed Successfully!</span>
                </>
              ) : (
                <>
                  <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
                  <span>{isPushing ? 'Pushing Commits...' : 'Push to GitHub'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Commit Log History */}
        <div>
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Recent Git Commits ({gitCommits.length})
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 font-mono text-xs">
            {gitCommits.map((c) => (
              <div key={c.id} className="p-2.5 rounded-lg bg-[#0a0d16] border border-[#1f253d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-800">
                    {c.sha}
                  </span>
                  <span className="text-white font-medium truncate max-w-sm">{c.message}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(c.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
