import { VirtualFile } from '../types/project';

export const INITIAL_WORKSPACE_FILES: Record<string, VirtualFile> = {
  'src/config/models.ts': {
    id: 'f_models_ts',
    path: 'src/config/models.ts',
    name: 'models.ts',
    module: 'config',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `import { ModelMetadata } from '../types/agent';

export const AVAILABLE_AI_MODELS: ModelMetadata[] = [
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    badge: 'State-of-the-Art',
    description: 'Deep multimodal reasoning, 2M context, next-gen coding powerhouse',
    creditMultiplier: 5,
    isReasoning: true,
    contextWindow: '2,000,000 tokens'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    badge: 'Ultra-Fast',
    description: 'Sub-second real-time streaming, high concurrency code generation',
    creditMultiplier: 1,
    isReasoning: false,
    contextWindow: '1,000,000 tokens'
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'Hybrid Thinking',
    description: 'Dynamic reasoning effort, unmatched frontend architecture & styling',
    creditMultiplier: 8,
    isReasoning: true,
    contextWindow: '200,000 tokens'
  },
  {
    id: 'claude-3-5-sonnet-v2',
    name: 'Claude 3.5 Sonnet v2',
    provider: 'Anthropic',
    badge: 'Precision Coder',
    description: 'Exceptional TypeScript, React component design, and API consistency',
    creditMultiplier: 4,
    isReasoning: false,
    contextWindow: '200,000 tokens'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    badge: 'Math & Logic Beast',
    description: 'Open reasoning frontier, backend optimization & complex SQL relations',
    creditMultiplier: 3,
    isReasoning: true,
    contextWindow: '128,000 tokens'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: 'High Throughput',
    description: 'Fast 671B MoE architecture for concurrent backend controllers',
    creditMultiplier: 1.5,
    isReasoning: false,
    contextWindow: '128,000 tokens'
  },
  {
    id: 'gpt-4-5',
    name: 'OpenAI GPT-4.5 Orion',
    provider: 'OpenAI',
    badge: 'Flagship Supermodel',
    description: 'Broadest world knowledge, complex fullstack systemic reasoning',
    creditMultiplier: 10,
    isReasoning: false,
    contextWindow: '128,000 tokens'
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'OpenAI',
    badge: 'STEM Reasoning',
    description: 'Fast mathematical & low-latency algorithmic code synthesis',
    creditMultiplier: 4,
    isReasoning: true,
    contextWindow: '200,000 tokens'
  },
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama 3.3 70B',
    provider: 'Meta',
    badge: 'Open Weights',
    description: 'State of the art open source fullstack engineer',
    creditMultiplier: 1,
    isReasoning: false,
    contextWindow: '128,000 tokens'
  },
  {
    id: 'antigravity-quantum-v3',
    name: 'Antigravity Quantum Neural Swarm (v3.0)',
    provider: 'Antigravity',
    badge: 'Swarm Orchestrator',
    description: 'Zero-latency neural synthesis for concurrent frontend & backend',
    creditMultiplier: 0.5,
    isReasoning: true,
    contextWindow: 'Unlimited'
  }
];`
  },
  'src/types/agent.ts': {
    id: 'f_agent_ts',
    path: 'src/types/agent.ts',
    name: 'agent.ts',
    module: 'shared',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `export type AgentRole = 'architect' | 'frontend' | 'backend' | 'database' | 'reviewer';

export type AgentStatus = 'idle' | 'thinking' | 'coding' | 'reviewing' | 'syncing' | 'completed' | 'error';

export interface ToolCall {
  id: string;
  toolName: 'create_file' | 'update_file' | 'delete_file' | 'define_endpoint' | 'create_schema' | 'run_command' | 'sync_contract' | 'test_route';
  args: Record<string, any>;
  result?: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  timestamp: number;
}

export interface AgentThoughtStep {
  id: string;
  timestamp: number;
  text: string;
  type: 'thought' | 'action' | 'observation' | 'dialogue' | 'contract';
  targetAgent?: AgentRole;
  toolCall?: ToolCall;
}

export interface AgentState {
  id: AgentRole;
  name: string;
  title: string;
  avatar: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask: string;
  color: string;
  glowColor: string;
  model: string;
  steps: AgentThoughtStep[];
  activeFile?: string;
  streamingCode?: string;
  streamingLines?: string[];
  progress: number;
  metrics: {
    filesGenerated: number;
    linesOfCode: number;
    tokensProcessed: number;
    contractSyncs: number;
  };
}

export interface InterAgentMessage {
  id: string;
  from: AgentRole;
  to: AgentRole;
  content: string;
  timestamp: number;
  type: 'request' | 'response' | 'contract_proposal' | 'contract_ack' | 'sync_alert';
  payload?: any;
}

export type SupportedAIModel = 
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'claude-3-7-sonnet'
  | 'claude-3-5-sonnet-v2'
  | 'gpt-4-5'
  | 'o3-mini'
  | 'deepseek-r1'
  | 'deepseek-v3'
  | 'llama-3-3-70b'
  | 'antigravity-quantum-v3';

export interface ModelMetadata {
  id: SupportedAIModel;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'DeepSeek' | 'Meta' | 'Antigravity';
  badge: string;
  description: string;
  creditMultiplier: number;
  isReasoning: boolean;
  contextWindow: string;
}`
  },
  'src/components/layout/Header.tsx': {
    id: 'f_header_tsx',
    path: 'src/components/layout/Header.tsx',
    name: 'Header.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Antigravity IDE Titlebar & Menu Header`
  },
  'src/components/layout/Sidebar.tsx': {
    id: 'f_sidebar_tsx',
    path: 'src/components/layout/Sidebar.tsx',
    name: 'Sidebar.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Antigravity IDE Activity Bar & Explorer Sidebar`
  },
  'src/components/layout/StatusBar.tsx': {
    id: 'f_status_tsx',
    path: 'src/components/layout/StatusBar.tsx',
    name: 'StatusBar.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Antigravity IDE Bottom Status Bar`
  },
  'src/components/editor/CodeEditor.tsx': {
    id: 'f_editor_tsx',
    path: 'src/components/editor/CodeEditor.tsx',
    name: 'CodeEditor.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Monaco / VS Code Styled Code Editor with Minimap`
  },
  'src/components/agents/MultiAgentCopilot.tsx': {
    id: 'f_copilot_tsx',
    path: 'src/components/agents/MultiAgentCopilot.tsx',
    name: 'MultiAgentCopilot.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Dual Frontend & Backend Split Swarm Copilot Panel`
  },
  'src/components/agents/DualAgentStream.tsx': {
    id: 'f_dual_stream_tsx',
    path: 'src/components/agents/DualAgentStream.tsx',
    name: 'DualAgentStream.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Concurrent Dual Agent Stream Workspace`
  },
  'src/components/agents/AgentCard.tsx': {
    id: 'f_agent_card_tsx',
    path: 'src/components/agents/AgentCard.tsx',
    name: 'AgentCard.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Swarm Agent Status Card with Progress and Metrics`
  },
  'src/components/agents/InterAgentChat.tsx': {
    id: 'f_inter_agent_chat_tsx',
    path: 'src/components/agents/InterAgentChat.tsx',
    name: 'InterAgentChat.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Inter-Agent Handshake and Contract Negotiation Stream`
  },
  'src/components/database/DatabaseStudio.tsx': {
    id: 'f_db_studio_tsx',
    path: 'src/components/database/DatabaseStudio.tsx',
    name: 'DatabaseStudio.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Database Studio with Schema Inspector and SQL Query Sandbox`
  },
  'src/components/preview/LivePreview.tsx': {
    id: 'f_preview_tsx',
    path: 'src/components/preview/LivePreview.tsx',
    name: 'LivePreview.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Live Interactive Fullstack Sandbox and Web App Preview`
  },
  'src/components/preview/ApiTester.tsx': {
    id: 'f_api_tester_tsx',
    path: 'src/components/preview/ApiTester.tsx',
    name: 'ApiTester.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Postman-like Interactive REST API Client`
  },
  'src/components/terminal/AntigravityTerminal.tsx': {
    id: 'f_terminal_tsx',
    path: 'src/components/terminal/AntigravityTerminal.tsx',
    name: 'AntigravityTerminal.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// Integrated Developer Terminal and Swarm Telemetry Dock`
  },
  'src/components/auth/GoogleAuthModal.tsx': {
    id: 'f_auth_modal_tsx',
    path: 'src/components/auth/GoogleAuthModal.tsx',
    name: 'GoogleAuthModal.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `import React, { useState } from 'react';
import { X, Sparkles, Zap, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GoogleAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, credits, loginWithGoogle, logout, refreshCredits } = useWorkspace();
  const [customEmail, setCustomEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (emailOverride?: string) => {
    setIsSigningIn(true);
    await loginWithGoogle(emailOverride);
    setIsSigningIn(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0d101b] border border-[#222942] rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f253d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
              <span className="font-bold text-blue-600 text-lg">G</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Google Account & Credits
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Antigravity Auth
                </span>
              </h2>
              <p className="text-xs text-slate-400">Auto-sync standard tokens & premium reasoning credits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1a2034] text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#131726] border border-[#20273e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-cyan-400/60 shadow-lg object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">{user.plan}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    Google ID: {user.googleId.substr(0, 10)}... (Verified)
                  </div>
                </div>
              </div>
              <button onClick={logout} className="p-2 rounded-lg bg-[#1a2034] hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <button onClick={() => handleGoogleSignIn()} disabled={isSigningIn} className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-sans font-semibold text-sm flex items-center justify-center gap-3 transition">
              <span>{isSigningIn ? 'Connecting to Google ID...' : 'Continue with Google'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};`
  },
  'src/components/github/GitHubModal.tsx': {
    id: 'f_github_modal_tsx',
    path: 'src/components/github/GitHubModal.tsx',
    name: 'GitHubModal.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `// GitHub Connection & Remote Synchronization Modal`
  },
  'src/context/WorkspaceContext.tsx': {
    id: 'f_context_tsx',
    path: 'src/context/WorkspaceContext.tsx',
    name: 'WorkspaceContext.tsx',
    module: 'shared',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// Antigravity Workspace State Context Provider`
  },
  'src/services/aiService.ts': {
    id: 'f_ai_service_ts',
    path: 'src/services/aiService.ts',
    name: 'aiService.ts',
    module: 'backend',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'backend',
    content: `// AI API Connector & Multi-Model Switcher`
  },
  'src/services/authCreditService.ts': {
    id: 'f_auth_service_ts',
    path: 'src/services/authCreditService.ts',
    name: 'authCreditService.ts',
    module: 'backend',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'backend',
    content: `// Google Auth & Live AI Credits Balances`
  },
  'src/services/databaseEngine.ts': {
    id: 'f_db_engine_ts',
    path: 'src/services/databaseEngine.ts',
    name: 'databaseEngine.ts',
    module: 'database',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'database',
    content: `// Relational Schema Generator, Prisma Synthesizer, & SQL Engine`
  },
  'src/services/githubService.ts': {
    id: 'f_github_service_ts',
    path: 'src/services/githubService.ts',
    name: 'githubService.ts',
    module: 'backend',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'backend',
    content: `// GitHub Remote Repository Sync & Push Service`
  },
  'src/services/orchestrator.ts': {
    id: 'f_orchestrator_ts',
    path: 'src/services/orchestrator.ts',
    name: 'orchestrator.ts',
    module: 'backend',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// Multi-Agent Concurrent Swarm Orchestration Engine`
  },
  'src/services/simulationEngine.ts': {
    id: 'f_sim_engine_ts',
    path: 'src/services/simulationEngine.ts',
    name: 'simulationEngine.ts',
    module: 'backend',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// Fullstack Project Blueprint Synthesis Engine`
  },
  'src/services/virtualFs.ts': {
    id: 'f_virtual_fs_ts',
    path: 'src/services/virtualFs.ts',
    name: 'virtualFs.ts',
    module: 'shared',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// Virtual In-Memory File System & ZIP Exporter`
  },
  'src/types/database.ts': {
    id: 'f_db_ts',
    path: 'src/types/database.ts',
    name: 'database.ts',
    module: 'database',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'database',
    content: `export type DatabaseType = 'postgresql' | 'sqlite' | 'mysql' | 'mongodb' | 'supabase' | 'redis';

export interface ColumnDefinition {
  id: string;
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  relationTo?: string;
}

export interface ModelDefinition {
  id: string;
  name: string;
  tableName: string;
  columns: ColumnDefinition[];
  rowsCount?: number;
}

export interface DatabaseSchema {
  type: DatabaseType;
  models: ModelDefinition[];
  mockData: Record<string, any[]>;
  version: number;
}`
  },
  'src/types/github.ts': {
    id: 'f_github_types_ts',
    path: 'src/types/github.ts',
    name: 'github.ts',
    module: 'shared',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// GitHub Integration Types`
  },
  'src/types/project.ts': {
    id: 'f_project_types_ts',
    path: 'src/types/project.ts',
    name: 'project.ts',
    module: 'shared',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `// Fullstack Project & Virtual File Types`
  },
  'src/types/user.ts': {
    id: 'f_user_ts',
    path: 'src/types/user.ts',
    name: 'user.ts',
    module: 'shared',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `export interface UserProfile {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'Free Swarm' | 'Pro Architect' | 'Enterprise Neural Team';
  organization?: string;
  createdAt: number;
}

export interface CreditAccount {
  standardCredits: number;
  maxStandardCredits: number;
  premiumCredits: number;
  maxPremiumCredits: number;
  renewalDate: string;
  concurrentAgentSlots: number;
}`
  },
  'src/App.tsx': {
    id: 'f_app_tsx',
    path: 'src/App.tsx',
    name: 'App.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { AntigravityIDE } from './components/AntigravityIDE';

export default function App() {
  return (
    <WorkspaceProvider>
      <AntigravityIDE />
    </WorkspaceProvider>
  );
}`
  },
  'src/index.css': {
    id: 'f_index_css',
    path: 'src/index.css',
    name: 'index.css',
    module: 'frontend',
    language: 'css',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root { color-scheme: dark; }`
  },
  'src/main.tsx': {
    id: 'f_main_tsx',
    path: 'src/main.tsx',
    name: 'main.tsx',
    module: 'frontend',
    language: 'tsx',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);`
  },
  'README.md': {
    id: 'f_readme_md',
    path: 'README.md',
    name: 'README.md',
    module: 'root',
    language: 'markdown',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `# chatubotu

🚀 **Chatubotu (Antigravity Multi-Agent IDE)**

An advanced multi-agent collaborative IDE powered by AI swarm models (Gemini 2.5, Claude 3.7, DeepSeek R1/V3, OpenAI GPT-4.5, etc.) with real-time code synthesis, live dual-agent streaming, interactive database studio, virtual terminal, and instant deployment.

## Features

- 🤖 **Dual-Agent Autonomous Collaboration**: Simultaneous Frontend Architect & Backend Systems Engineer agent execution.
- ⚡ **Multi-Model Swarm Engine**: Toggle dynamically between Gemini, Claude, DeepSeek, OpenAI, Meta Llama, and Quantum Swarm models.
- 💻 **Monaco Code Editor & Live Preview**: Real-time hot-reloading sandbox with simulated APIs.
- 🗄️ **Integrated Database Studio**: Interactive schema viewer, table editor, and visual SQL query engine.
- 🖥️ **Antigravity Terminal**: Simulated terminal with custom command execution and full output logs.
- 🐙 **GitHub Integration**: Direct repository export, commit syncing, and project sharing.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\``
  },
  '.gitignore': {
    id: 'f_gitignore',
    path: '.gitignore',
    name: '.gitignore',
    module: 'root',
    language: 'env',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `# Dependencies\nnode_modules/\n.pnp\n.pnp.js\n\n# Production build outputs\ndist/\nbuild/\n\n# Environment files\n.env\n.env.local`
  },
  'index.html': {
    id: 'f_index_html',
    path: 'index.html',
    name: 'index.html',
    module: 'root',
    language: 'html',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `<!DOCTYPE html>\n<html lang="en" class="dark">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Antigravity Multi-Agent IDE</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>`
  },
  'package.json': {
    id: 'f_package_json',
    path: 'package.json',
    name: 'package.json',
    module: 'root',
    language: 'json',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `{
  "name": "antigravity-multi-agent-ide",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}`
  },
  'tailwind.config.js': {
    id: 'f_tailwind_config_js',
    path: 'tailwind.config.js',
    name: 'tailwind.config.js',
    module: 'root',
    language: 'javascript',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  darkMode: 'class',\n  theme: { extend: {} },\n  plugins: []\n};`
  },
  'tsconfig.json': {
    id: 'f_tsconfig_json',
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    module: 'root',
    language: 'json',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"]\n}`
  },
  'vite.config.ts': {
    id: 'f_vite_config_ts',
    path: 'vite.config.ts',
    name: 'vite.config.ts',
    module: 'root',
    language: 'typescript',
    lastModified: Date.now(),
    generatedBy: 'architect',
    content: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000 }\n});`
  }
};
