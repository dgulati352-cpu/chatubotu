import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AgentRole, AgentState, InterAgentMessage, SupportedAIModel } from '../types/agent';
import { VirtualFile, ApiContract } from '../types/project';
import { DatabaseSchema, DatabaseType } from '../types/database';
import { GitHubConfig, GitCommit } from '../types/github';
import { UserProfile, CreditAccount } from '../types/user';
import { VirtualFileSystem } from '../services/virtualFs';
import { MultiAgentOrchestrator, OrchestrationCallbacks } from '../services/orchestrator';
import { DatabaseEngine } from '../services/databaseEngine';
import { SimulationEngine } from '../services/simulationEngine';
import { GitHubService } from '../services/githubService';
import { AuthCreditService } from '../services/authCreditService';
import { INITIAL_WORKSPACE_FILES } from '../services/defaultFiles';

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  text: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple';
}

export type ActivityTab = 'explorer' | 'search' | 'source-control' | 'debug' | 'extensions' | 'swarm';

export interface WorkspaceContextType {
  // Layout Panel Toggles
  isLeftSidebarOpen: boolean;
  setIsLeftSidebarOpen: (open: boolean) => void;
  isRightAssistantOpen: boolean;
  setIsRightAssistantOpen: (open: boolean) => void;
  isBottomTerminalOpen: boolean;
  setIsBottomTerminalOpen: (open: boolean) => void;

  // Active Navigation
  activeActivityTab: ActivityTab;
  setActiveActivityTab: (tab: ActivityTab) => void;
  activeMainTab: 'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester';
  setActiveMainTab: (tab: 'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester') => void;

  // Google Auth & Credits
  user: UserProfile | null;
  credits: CreditAccount;
  loginWithGoogle: (emailOverride?: string) => Promise<void>;
  logout: () => void;
  refreshCredits: () => Promise<void>;

  // AI & Swarm
  selectedModel: SupportedAIModel;
  setSelectedModel: (model: SupportedAIModel) => void;
  concurrencyMode: boolean;
  setConcurrencyMode: (enabled: boolean) => void;
  isGenerating: boolean;
  agents: Record<AgentRole, AgentState>;
  interAgentMessages: InterAgentMessage[];

  // Virtual Filesystem & Editor
  vfs: VirtualFileSystem;
  files: Record<string, VirtualFile>;
  activeFile: VirtualFile | null;
  openFileIds: string[];
  setActiveFile: (file: VirtualFile | null) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  saveFileContent: (path: string, content: string) => void;
  createNewFile: (path: string, content?: string) => void;
  deleteFile: (path: string) => void;
  exportProjectZip: () => Promise<void>;

  // Database Studio
  databaseSchema: DatabaseSchema;
  setDatabaseSchema: React.Dispatch<React.SetStateAction<DatabaseSchema>>;
  changeDatabaseType: (type: DatabaseType) => void;
  executeDatabaseQuery: (sql: string) => { columns: string[]; rows: any[]; count: number; error?: string };
  addNewTable: (name: string, description?: string) => void;

  // Contracts & APIs
  apiContract: ApiContract | null;

  // GitHub Integration
  githubConfig: GitHubConfig;
  setGithubConfig: React.Dispatch<React.SetStateAction<GitHubConfig>>;
  gitCommits: GitCommit[];
  pushToGitHub: (message: string) => Promise<void>;

  // Terminal & Logs
  terminalLogs: TerminalLogEntry[];
  addTerminalLog: (text: string, level?: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple') => void;
  clearTerminal: () => void;

  // Swarm Actions
  triggerFullstackBuild: (prompt: string, dbType?: DatabaseType) => Promise<void>;
  loadPresetTemplate: (templateName: string) => void;
}

const initialAgents: Record<AgentRole, AgentState> = {
  architect: {
    id: 'architect',
    name: 'Aether Architect',
    title: 'Lead System Architect',
    avatar: '📐',
    role: 'architect',
    status: 'idle',
    currentTask: 'Drafting shared TypeScript contracts & PostgreSQL schema',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    model: 'Gemini 2.5 Pro',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 3, linesOfCode: 140, tokensProcessed: 4200, contractSyncs: 1 }
  },
  frontend: {
    id: 'frontend',
    name: 'Nova UI',
    title: 'Frontend UI/UX Specialist',
    avatar: '✨',
    role: 'frontend',
    status: 'idle',
    currentTask: 'Generating React & Tailwind layout components',
    color: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.4)',
    model: 'Claude 3.7 Sonnet',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 4, linesOfCode: 480, tokensProcessed: 6800, contractSyncs: 1 }
  },
  backend: {
    id: 'backend',
    name: 'Vortex API',
    title: 'Backend Systems Engineer',
    avatar: '⚡',
    role: 'backend',
    status: 'idle',
    currentTask: 'Synthesizing Node.js Express controllers and Prisma CRUD logic',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    model: 'DeepSeek R1',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 3, linesOfCode: 320, tokensProcessed: 5400, contractSyncs: 1 }
  },
  database: {
    id: 'database',
    name: 'Prisma DBA',
    title: 'Database Architect',
    avatar: '🗄️',
    role: 'database',
    status: 'idle',
    currentTask: 'Managing PostgreSQL migrations and relation integrity',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    model: 'DeepSeek V3',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 2, linesOfCode: 190, tokensProcessed: 3200, contractSyncs: 1 }
  },
  reviewer: {
    id: 'reviewer',
    name: 'Sentinel QA',
    title: 'Contract & Lint Validator',
    avatar: '🛡️',
    role: 'reviewer',
    status: 'idle',
    currentTask: 'Monitoring type parity and runtime validation',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    model: 'Gemini 2.5 Flash',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 0, linesOfCode: 0, tokensProcessed: 1800, contractSyncs: 1 }
  }
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Panel Toggles
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightAssistantOpen, setIsRightAssistantOpen] = useState(true);
  const [isBottomTerminalOpen, setIsBottomTerminalOpen] = useState(false);

  // Navigation
  const [activeActivityTab, setActiveActivityTab] = useState<ActivityTab>('explorer');
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester'>('editor');

  // Google Auth & Credits
  const [user, setUser] = useState<UserProfile | null>(() => AuthCreditService.getSavedUser());
  const [credits, setCredits] = useState<CreditAccount>(() => AuthCreditService.getSavedCredits());

  // Filesystem initialization with INITIAL_WORKSPACE_FILES
  const [vfs] = useState(() => new VirtualFileSystem(INITIAL_WORKSPACE_FILES));
  const [files, setFiles] = useState<Record<string, VirtualFile>>(() => vfs.getFiles());

  // Default active tab & file matches the screenshot
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(() => vfs.getFile('src/config/models.ts') || null);
  const [openFileIds, setOpenFileIds] = useState<string[]>([
    'src/components/auth/GoogleAuthModal.tsx',
    'src/types/agent.ts',
    'src/config/models.ts',
    'README.md',
    '.gitignore',
    'index.html'
  ]);

  // AI & Swarm State
  const [selectedModel, setSelectedModel] = useState<SupportedAIModel>('gemini-2.5-flash');
  const [concurrencyMode, setConcurrencyMode] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [agents, setAgents] = useState<Record<AgentRole, AgentState>>(initialAgents);
  const [interAgentMessages, setInterAgentMessages] = useState<InterAgentMessage[]>([
    {
      id: 'init_msg_1',
      from: 'architect',
      to: 'backend',
      content: 'Contract v1.0.0 shared: Please prepare /api/v1/health and database schema.',
      timestamp: Date.now() - 30000,
      type: 'contract_proposal'
    },
    {
      id: 'init_msg_2',
      from: 'backend',
      to: 'frontend',
      content: 'PostgreSQL connection initialized. REST endpoints responding cleanly.',
      timestamp: Date.now() - 25000,
      type: 'response'
    }
  ]);

  // Database & Contracts
  const [databaseSchema, setDatabaseSchema] = useState<DatabaseSchema>(() => DatabaseEngine.createInitialSchema('postgresql', 'SaaS Platform'));
  const [apiContract, setApiContract] = useState<ApiContract | null>(null);

  // GitHub Integration
  const [githubService] = useState(() => new GitHubService());
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(githubService.getConfig());
  const [gitCommits, setGitCommits] = useState<GitCommit[]>([
    {
      id: 'c_first',
      sha: '0505770',
      message: 'first commit',
      author: 'dgulati352-cpu',
      timestamp: Date.now() - 360000,
      filesChanged: 40,
      additions: 9230,
      deletions: 0,
      branch: 'main'
    }
  ]);

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), text: 'Antigravity IDE Multi-Agent Workspace initialized.', level: 'cyan' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), text: 'git commit -m "first commit" (0505770)', level: 'success' },
    { id: '3', timestamp: new Date().toLocaleTimeString(), text: 'git push -u origin main -> https://github.com/dgulati352-cpu/chatubotu.git', level: 'success' }
  ]);

  const addTerminalLog = useCallback((text: string, level: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple' = 'info') => {
    setTerminalLogs(prev => [
      ...prev,
      {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        text,
        level
      }
    ]);
  }, []);

  const clearTerminal = useCallback(() => {
    setTerminalLogs([]);
  }, []);

  const openFile = useCallback((path: string) => {
    const file = vfs.getFile(path);
    if (file) {
      setActiveFile(file);
      if (!openFileIds.includes(path)) {
        setOpenFileIds(prev => [...prev, path]);
      }
    }
  }, [vfs, openFileIds]);

  const closeFile = useCallback((path: string) => {
    setOpenFileIds(prev => {
      const next = prev.filter(id => id !== path);
      if (activeFile?.path === path) {
        if (next.length > 0) {
          const nextFile = vfs.getFile(next[next.length - 1]);
          setActiveFile(nextFile || null);
        } else {
          setActiveFile(null);
        }
      }
      return next;
    });
  }, [vfs, activeFile]);

  const saveFileContent = useCallback((path: string, content: string) => {
    const updated = vfs.writeFile(path, content, 'user');
    setFiles(vfs.getFiles());
    if (activeFile?.path === path) {
      setActiveFile(updated);
    }
    addTerminalLog(`Saved ${path}`, 'info');
  }, [vfs, activeFile, addTerminalLog]);

  const createNewFile = useCallback((path: string, content = '// New file') => {
    const newFile = vfs.writeFile(path, content, 'user');
    setFiles(vfs.getFiles());
    setActiveFile(newFile);
    if (!openFileIds.includes(path)) {
      setOpenFileIds(prev => [...prev, path]);
    }
    addTerminalLog(`Created file ${path}`, 'success');
  }, [vfs, openFileIds, addTerminalLog]);

  const deleteFile = useCallback((path: string) => {
    vfs.deleteFile(path);
    setFiles(vfs.getFiles());
    closeFile(path);
    addTerminalLog(`Deleted file ${path}`, 'warn');
  }, [vfs, closeFile, addTerminalLog]);

  const exportProjectZip = useCallback(async () => {
    const blob = await vfs.exportZip('antigravity-fullstack-app');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatubotu-workspace-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    addTerminalLog('Workspace exported as ZIP.', 'success');
  }, [vfs, addTerminalLog]);

  const loginWithGoogle = useCallback(async (emailOverride?: string) => {
    const loggedUser = await AuthCreditService.simulateGoogleLogin(emailOverride);
    const userCredits = AuthCreditService.getSavedCredits();
    setUser(loggedUser);
    setCredits(userCredits);
    addTerminalLog(`Google Account Connected: ${loggedUser.name} (${loggedUser.email})`, 'success');
  }, [addTerminalLog]);

  const logout = useCallback(() => {
    AuthCreditService.logout();
    setUser(null);
    setCredits(AuthCreditService.getSavedCredits());
    addTerminalLog('Signed out of Google account.', 'info');
  }, [addTerminalLog]);

  const refreshCredits = useCallback(async () => {
    const updated = await AuthCreditService.refreshCredits();
    setCredits(updated);
    addTerminalLog(`Credits balance refreshed: ${updated.standardCredits} standard / ${updated.premiumCredits} premium.`, 'info');
  }, [addTerminalLog]);

  const changeDatabaseType = useCallback((type: DatabaseType) => {
    const newSchema = DatabaseEngine.createInitialSchema(type, 'SaaS Platform');
    setDatabaseSchema(newSchema);
    addTerminalLog(`Database engine switched to: ${type.toUpperCase()}`, 'success');
  }, [addTerminalLog]);

  const executeDatabaseQuery = useCallback((sql: string) => {
    return DatabaseEngine.executeQuery(databaseSchema, sql);
  }, [databaseSchema]);

  const addNewTable = useCallback((name: string, description?: string) => {
    const updated = DatabaseEngine.addModelToSchema(databaseSchema, name, description);
    setDatabaseSchema(updated);
    addTerminalLog(`Table "${name}" created in ${databaseSchema.type.toUpperCase()}`, 'success');
  }, [databaseSchema, addTerminalLog]);

  const pushToGitHub = useCallback(async (message: string) => {
    const commit = await githubService.commitAndPush(message, Object.keys(files));
    setGitCommits(prev => [commit, ...prev]);
    addTerminalLog(`Git commit: "${message}" [${commit.sha}] pushed to origin/${githubConfig.branch}`, 'success');
  }, [githubService, files, githubConfig, addTerminalLog]);

  const loadPresetTemplate = useCallback((templateName: string) => {
    const bundle = SimulationEngine.generateFullstackProject(templateName, 'postgresql');
    Object.values(bundle.files).forEach(f => vfs.writeFile(f.path, f.content, f.generatedBy));
    setFiles(vfs.getFiles());
    setDatabaseSchema(bundle.schema);
    setApiContract(bundle.contract);
    openFile('src/config/models.ts');
    addTerminalLog(`Loaded template: "${templateName}"`, 'success');
  }, [vfs, openFile, addTerminalLog]);

  const triggerFullstackBuild = useCallback(async (prompt: string, dbType: DatabaseType = 'postgresql') => {
    setIsGenerating(true);
    addTerminalLog(`Swarm activated for task: "${prompt}"`, 'cyan');

    const orchestrator = new MultiAgentOrchestrator(vfs);

    const callbacks: OrchestrationCallbacks = {
      onAgentUpdate: (role: AgentRole, update: Partial<AgentState>) => {
        setAgents(prev => ({
          ...prev,
          [role]: { ...prev[role], ...update }
        }));
      },
      onInterAgentMessage: (msg: InterAgentMessage) => {
        setInterAgentMessages(prev => [...prev, msg]);
      },
      onFileWritten: (path: string, content: string, role: AgentRole) => {
        const written = vfs.writeFile(path, content, role);
        setFiles(vfs.getFiles());
        if (path === 'src/config/models.ts') {
          setActiveFile(written);
        }
      },
      onTerminalLog: (log: string, level?: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple') => {
        addTerminalLog(log, level);
      },
      onContractSync: (contract: any) => {
        setApiContract(contract);
      },
      onDatabaseUpdate: (schema: any) => {
        setDatabaseSchema(schema);
      }
    };

    try {
      await orchestrator.runConcurrentFullstackGeneration(prompt, dbType, callbacks);
      addTerminalLog('Multi-Agent Swarm execution finished with Zero errors.', 'success');
    } catch (err: any) {
      addTerminalLog(`Swarm error: ${err?.message || err}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [vfs, addTerminalLog]);

  const value: WorkspaceContextType = {
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isRightAssistantOpen,
    setIsRightAssistantOpen,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    activeActivityTab,
    setActiveActivityTab,
    activeMainTab,
    setActiveMainTab,
    user,
    credits,
    loginWithGoogle,
    logout,
    refreshCredits,
    selectedModel,
    setSelectedModel,
    concurrencyMode,
    setConcurrencyMode,
    isGenerating,
    agents,
    interAgentMessages,
    vfs,
    files,
    activeFile,
    openFileIds,
    setActiveFile,
    openFile,
    closeFile,
    saveFileContent,
    createNewFile,
    deleteFile,
    exportProjectZip,
    databaseSchema,
    setDatabaseSchema,
    changeDatabaseType,
    executeDatabaseQuery,
    addNewTable,
    apiContract,
    githubConfig,
    setGithubConfig,
    gitCommits,
    pushToGitHub,
    terminalLogs,
    addTerminalLog,
    clearTerminal,
    triggerFullstackBuild,
    loadPresetTemplate
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
