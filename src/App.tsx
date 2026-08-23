import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { CodeEditor } from './components/editor/CodeEditor';
import { DualAgentStream } from './components/agents/DualAgentStream';
import { AgentPromptInput } from './components/agents/AgentPromptInput';
import { DatabaseStudio } from './components/database/DatabaseStudio';
import { LivePreview } from './components/preview/LivePreview';
import { ApiTester } from './components/preview/ApiTester';
import { AntigravityTerminal } from './components/terminal/AntigravityTerminal';
import { GitHubModal } from './components/github/GitHubModal';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';

const WorkspaceMain: React.FC = () => {
  const { activeMainTab } = useWorkspace();
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#08090d] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Navigation with Google ID & Credits */}
      <Header 
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Antigravity Tool Rail & Drawer */}
        <Sidebar onOpenGitHubModal={() => setIsGitHubModalOpen(true)} />

        {/* Center Main Stage */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#090b11]">
          {/* Main Stage Content */}
          <div className="flex-1 overflow-hidden relative">
            {activeMainTab === 'editor' && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-2 divide-x divide-[#1e2337]">
                <CodeEditor />
                <div className="h-full flex flex-col">
                  <LivePreview />
                </div>
              </div>
            )}

            {activeMainTab === 'dual-agents' && <DualAgentStream />}
            {activeMainTab === 'database-studio' && <DatabaseStudio />}
            {activeMainTab === 'live-preview' && <LivePreview />}
            {activeMainTab === 'api-tester' && <ApiTester />}
          </div>

          {/* Prompt Bar */}
          <AgentPromptInput />

          {/* Antigravity Developer Terminal */}
          <AntigravityTerminal />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* GitHub Sync Modal */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Google ID Auth & Credit Modal */}
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
      <WorkspaceMain />
    </WorkspaceProvider>
  );
}
