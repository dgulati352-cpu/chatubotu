import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { CodeEditor } from './components/editor/CodeEditor';
import { MultiAgentCopilot } from './components/agents/MultiAgentCopilot';
import { DualAgentStream } from './components/agents/DualAgentStream';
import { DatabaseStudio } from './components/database/DatabaseStudio';
import { LivePreview } from './components/preview/LivePreview';
import { ApiTester } from './components/preview/ApiTester';
import { AntigravityTerminal } from './components/terminal/AntigravityTerminal';
import { GitHubModal } from './components/github/GitHubModal';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';

const AntigravityIDELayout: React.FC = () => {
  const { activeMainTab } = useWorkspace();
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#181818] text-[#cccccc] overflow-hidden font-sans select-none">
      {/* 1. Top Window Menu Bar & Title */}
      <Header
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Activity Bar + Primary Sidebar (Explorer, Search, Git, Swarm) */}
        <Sidebar
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Center: Editor & Main Stage */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0">
          <div className="flex-1 overflow-hidden relative">
            {activeMainTab === 'editor' && <CodeEditor />}
            {activeMainTab === 'dual-agents' && <DualAgentStream />}
            {activeMainTab === 'database-studio' && <DatabaseStudio />}
            {activeMainTab === 'live-preview' && <LivePreview />}
            {activeMainTab === 'api-tester' && <ApiTester />}
          </div>

          {/* Bottom Integrated Terminal Panel */}
          <AntigravityTerminal />
        </div>

        {/* Right: Antigravity Multi-Agent Copilot & AI Assistant */}
        <MultiAgentCopilot />
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar />

      {/* Modals */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AntigravityIDELayout />
    </WorkspaceProvider>
  );
}
