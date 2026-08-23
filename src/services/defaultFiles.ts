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
    content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Production build outputs
dist/
dist-ssr/
build/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor / OS
.vscode/
.idea/
.DS_Store
Thumbs.db`
  },
  'index.html': {
    id: 'f_index_html',
    path: 'index.html',
    name: 'index.html',
    module: 'root',
    language: 'html',
    lastModified: Date.now(),
    generatedBy: 'frontend',
    content: `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Antigravity Multi-Agent IDE</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#08090d] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
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
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "canvas-confetti": "^1.9.4",
    "jszip": "^3.10.1",
    "lucide-react": "^0.475.0",
    "prismjs": "^1.29.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/jszip": "^3.4.1",
    "@types/node": "^22.13.4",
    "@types/prismjs": "^1.26.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
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
  }
};
