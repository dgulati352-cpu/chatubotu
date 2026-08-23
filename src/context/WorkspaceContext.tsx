import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AgentRole, AgentState, InterAgentMessage, SupportedAIModel } from '../types/agent';
import { VirtualFile, ApiContract } from '../types/project';
import { DatabaseSchema, DatabaseType } from '../types/database';
import { GitHubConfig, GitCommit } from '../types/github';
import { UserProfile, CreditAccount } from '../types/user';
import { VirtualFileSystem } from '../services/virtualFs';
import { MultiAgentOrchestrator } from '../services/orchestrator';
import { DatabaseEngine } from '../services/databaseEngine';
import { SimulationEngine } from '../services/simulationEngine';
import { GitHubService } from '../services/githubService';
import { AuthCreditService } from '../services/authCreditService';

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  text: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple';
}

export interface WorkspaceContextType {
  // Google Auth & Auto-Fetched Credits
  user: UserProfile | null;
  credits: CreditAccount;
  loginWithGoogle: (emailOverride?: string) => Promise<void>;
  logout: () => void;
  refreshCredits: () => Promise<void>;

  // Agents State
  agents: Record<AgentRole, AgentState>;
  interAgentMessages: InterAgentMessage[];
  selectedModel: SupportedAIModel;
  setSelectedModel: (model: SupportedAIModel) => void;
  isGenerating: boolean;
  concurrencyMode: boolean;
  setConcurrencyMode: (enabled: boolean) => void;

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

  // Navigation & UI Panels
  activeMainTab: 'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester' | 'github-sync';
  setActiveMainTab: (tab: 'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester' | 'github-sync') => void;
  activeSideDrawer: 'explorer' | 'agents' | 'database' | 'contract' | 'github' | 'templates' | 'settings';
  setActiveSideDrawer: (drawer: 'explorer' | 'agents' | 'database' | 'contract' | 'github' | 'templates' | 'settings') => void;
  isBottomTerminalOpen: boolean;
  setIsBottomTerminalOpen: (open: boolean) => void;
  terminalLogs: TerminalLogEntry[];
  addTerminalLog: (text: string, level?: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple') => void;
  clearTerminal: () => void;

  // Actions
  triggerFullstackBuild: (prompt: string, dbType?: DatabaseType) => Promise<void>;
  loadPresetTemplate: (templateName: string) => void;
}

const initialAgents: Record<AgentRole, AgentState> = {
  architect: {
    id: 'architect',
    name: 'Aether Architect',
    title: 'Lead System & Contract Architect',
    avatar: '📐',
    role: 'architect',
    status: 'idle',
    currentTask: 'Ready to draft fullstack contracts & lead multi-agent coordination',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    model: 'Gemini 2.0 Pro',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 3, linesOfCode: 120, tokensProcessed: 4200, contractSyncs: 1 }
  },
  frontend: {
    id: 'frontend',
    name: 'Nova UI',
    title: 'Frontend & UI/UX Specialist',
    avatar: '✨',
    role: 'frontend',
    status: 'idle',
    currentTask: 'Waiting for contract synchronization to generate React components',
    color: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.4)',
    model: 'Gemini 2.0 Flash',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 4, linesOfCode: 480, tokensProcessed: 8900, contractSyncs: 1 }
  },
  backend: {
    id: 'backend',
    name: 'Vortex API',
    title: 'Backend & Server Specialist',
    avatar: '⚡',
    role: 'backend',
    status: 'idle',
    currentTask: 'Standing by to mount Express/FastAPI routes & database connectors',
    color: '#4facfe',
    glowColor: 'rgba(79, 172, 254, 0.4)',
    model: 'Gemini 2.0 Flash',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 5, linesOfCode: 520, tokensProcessed: 9400, contractSyncs: 1 }
  },
  database: {
    id: 'database',
    name: 'Chronos DB',
    title: 'Database & Schema Architect',
    avatar: '🗄️',
    role: 'database',
    status: 'idle',
    currentTask: 'Ready to model Prisma schemas, SQL DDLs, and seed datasets',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    model: 'Gemini 2.0 Flash',
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
    model: 'Gemini 2.0 Flash',
    steps: [],
    progress: 0,
    metrics: { filesGenerated: 0, linesOfCode: 0, tokensProcessed: 1800, contractSyncs: 1 }
  }
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User & Google Auto-Fetched Credits State
  const [user, setUser] = useState<UserProfile | null>(() => AuthCreditService.getSavedUser());
  const [credits, setCredits] = useState<CreditAccount>(() => AuthCreditService.getSavedCredits());

  // Initialize with initial simulation bundle
  const [initialBundle] = useState(() => SimulationEngine.generateFullstackProject('AI SaaS Platform with Analytics and Stripe Billing', 'postgresql'));
  
  const [vfs] = useState(() => new VirtualFileSystem(initialBundle.files));
  const [files, setFiles] = useState<Record<string, VirtualFile>>(() => vfs.getFiles());
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(() => vfs.getFile('frontend/src/App.tsx') || null);
  const [openFileIds, setOpenFileIds] = useState<string[]>(['frontend/src/App.tsx', 'backend/src/server.ts', 'database/schema.prisma', 'contracts/api.ts']);

  const [agents, setAgents] = useState<Record<AgentRole, AgentState>>(initialAgents);
  const [interAgentMessages, setInterAgentMessages] = useState<InterAgentMessage[]>([
    {
      id: 'init_msg_1',
      from: 'architect',
      to: 'backend',
      content: 'Contract v1.0.0 shared: Please prepare /api/v1/items and /api/v1/health endpoints.',
      timestamp: Date.now() - 30000,
      type: 'contract_proposal'
    },
    {
      id: 'init_msg_2',
      from: 'backend',
      to: 'frontend',
      content: 'PostgreSQL database pool initialized. Endpoints live and responding.',
      timestamp: Date.now() - 25000,
      type: 'response'
    },
    {
      id: 'init_msg_3',
      from: 'frontend',
      to: 'architect',
      content: 'Frontend App mounted with responsive metrics dashboard and live mutation client.',
      timestamp: Date.now() - 20000,
      type: 'sync_alert'
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<SupportedAIModel>('gemini-2.5-flash');
  const [concurrencyMode, setConcurrencyMode] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [databaseSchema, setDatabaseSchema] = useState<DatabaseSchema>(initialBundle.schema);
  const [apiContract, setApiContract] = useState<ApiContract | null>(initialBundle.contract);

  const [githubService] = useState(() => new GitHubService());
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(githubService.getConfig());
  const [gitCommits, setGitCommits] = useState<GitCommit[]>([
    {
      id: 'c_init',
      sha: '7f9a2d1',
      message: 'feat: Initial fullstack architecture generated by Antigravity Swarm',
      author: 'Antigravity Multi-Agent',
      timestamp: Date.now() - 3600000,
      filesChanged: 12,
      additions: 1240,
      deletions: 0,
      branch: 'main'
    }
  ]);

  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'dual-agents' | 'database-studio' | 'live-preview' | 'api-tester' | 'github-sync'>('editor');
  const [activeSideDrawer, setActiveSideDrawer] = useState<'explorer' | 'agents' | 'database' | 'contract' | 'github' | 'templates' | 'settings'>('explorer');
  const [isBottomTerminalOpen, setIsBottomTerminalOpen] = useState<boolean>(true);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), text: 'Antigravity Multi-AI Agent IDE Workspace v2.0 initialized.', level: 'cyan' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), text: 'Google Account Auto-Connected: Dhairya Gulati (developer.antigravity@gmail.com).', level: 'success' },
    { id: '3', timestamp: new Date().toLocaleTimeString(), text: 'Auto-fetched Credits from Google ID: 8,420 Standard | 920 Premium Ultra Units.', level: 'purple' },
    { id: '4', timestamp: new Date().toLocaleTimeString(), text: 'Dual AI Concurrency: [ENABLED] (Frontend Agent & Backend Agent parallel streams active).', level: 'cyan' },
    { id: '5', timestamp: new Date().toLocaleTimeString(), text: 'Database Engine: PostgreSQL active with 3 relational models.', level: 'success' }
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

  const loginWithGoogle = useCallback(async (emailOverride?: string) => {
    const email = emailOverride || 'developer.antigravity@gmail.com';
    const name = email.split('@')[0].replace('.', ' ').toUpperCase();
    const newUser: UserProfile = {
      id: `usr_g_${Math.floor(Math.random() * 899999) + 100000}`,
      googleId: '109283746192837461928',
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      plan: 'Antigravity Ultra',
      tierLevel: 'Tier 3 (Enterprise Developer)',
      organization: 'Google AI Studio & Antigravity Swarm',
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    AuthCreditService.saveUser(newUser);

    addTerminalLog(`[AUTH] Authenticated with Google ID (${newUser.email})`, 'success');
    addTerminalLog(`[CREDITS] Auto-fetching allocated tokens & premium quota from Google Cloud...`, 'purple');

    const fetchedCredits = await AuthCreditService.fetchCreditsFromGoogleId(newUser.googleId, newUser.email);
    setCredits(fetchedCredits);

    addTerminalLog(`[CREDITS] Synced: ${fetchedCredits.standardCredits.toLocaleString()} Standard Credits | ${fetchedCredits.premiumCredits.toLocaleString()} Ultra Premium Units`, 'success');
  }, [addTerminalLog]);

  const logout = useCallback(() => {
    setUser(null);
    AuthCreditService.saveUser(null);
    addTerminalLog('[AUTH] Disconnected Google Account.', 'warn');
  }, [addTerminalLog]);

  const refreshCredits = useCallback(async () => {
    if (user) {
      addTerminalLog(`[CREDITS] Auto-refreshing quota telemetry for ${user.email}...`, 'purple');
      const latest = await AuthCreditService.fetchCreditsFromGoogleId(user.googleId, user.email);
      setCredits(latest);
      addTerminalLog(`[CREDITS] Telemetry up to date: ${latest.standardCredits} Standard | ${latest.premiumCredits} Premium`, 'success');
    }
  }, [user, addTerminalLog]);

  const openFile = useCallback((path: string) => {
    const file = vfs.getFile(path);
    if (file) {
      setActiveFile(file);
      setOpenFileIds(prev => prev.includes(path) ? prev : [...prev, path]);
    }
  }, [vfs]);

  const closeFile = useCallback((path: string) => {
    setOpenFileIds(prev => {
      const next = prev.filter(p => p !== path);
      if (activeFile?.path === path) {
        const nextActive = next.length > 0 ? vfs.getFile(next[next.length - 1]) || null : null;
        setActiveFile(nextActive);
      }
      return next;
    });
  }, [activeFile, vfs]);

  const saveFileContent = useCallback((path: string, content: string) => {
    const updated = vfs.writeFile(path, content, 'user');
    setFiles(vfs.getFiles());
    if (activeFile?.path === path) {
      setActiveFile(updated);
    }
  }, [activeFile, vfs]);

  const createNewFile = useCallback((path: string, content: string = '') => {
    const file = vfs.writeFile(path, content, 'user');
    setFiles(vfs.getFiles());
    openFile(path);
    addTerminalLog(`Created file: ${path}`, 'info');
  }, [vfs, openFile, addTerminalLog]);

  const deleteFile = useCallback((path: string) => {
    vfs.deleteFile(path);
    setFiles(vfs.getFiles());
    closeFile(path);
    addTerminalLog(`Deleted file: ${path}`, 'warn');
  }, [vfs, closeFile, addTerminalLog]);

  const changeDatabaseType = useCallback((type: DatabaseType) => {
    const updated = DatabaseEngine.createInitialSchema(type, databaseSchema.name);
    setDatabaseSchema(updated);

    // Update prisma & sql files in VFS
    const prisma = DatabaseEngine.generatePrismaSchema(updated);
    const sql = DatabaseEngine.generateSqlDdl(updated);
    vfs.writeFile('database/schema.prisma', prisma, 'database');
    vfs.writeFile('database/migrations/001_init.sql', sql, 'database');
    setFiles(vfs.getFiles());

    addTerminalLog(`Switched database engine to ${type.toUpperCase()}. Updated Prisma schema and SQL migrations.`, 'success');
  }, [databaseSchema.name, vfs, addTerminalLog]);

  const executeDatabaseQuery = useCallback((sql: string) => {
    const trimmed = sql.trim();
    const startTime = Date.now();

    // Check target table
    const matchedModel = databaseSchema.models.find(m => 
      trimmed.toLowerCase().includes(m.tableName.toLowerCase()) || trimmed.toLowerCase().includes(m.name.toLowerCase())
    );

    if (matchedModel) {
      const rows = databaseSchema.mockData[matchedModel.id] || [];
      const columns = matchedModel.columns.map(c => c.name);

      setDatabaseSchema(prev => ({
        ...prev,
        rawQueriesHistory: [
          {
            id: `q_${Date.now()}`,
            query: sql,
            executedAt: Date.now(),
            rowCount: rows.length,
            status: 'success',
            durationMs: Math.round((Date.now() - startTime + Math.random() * 5) * 10) / 10
          },
          ...prev.rawQueriesHistory
        ]
      }));

      return { columns, rows, count: rows.length };
    }

    // Default response for other queries
    return {
      columns: ['status', 'message', 'timestamp'],
      rows: [{ status: 'OK', message: 'Query executed successfully', timestamp: new Date().toISOString() }],
      count: 1
    };
  }, [databaseSchema]);

  const addNewTable = useCallback((name: string, description: string = '') => {
    const tableName = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + 's';
    const newModelId = `model_${Date.now()}`;
    const newModel = {
      id: newModelId,
      name,
      tableName,
      description,
      columns: [
        { name: 'id', type: 'UUID' as const, isPrimary: true, isNullable: false },
        { name: 'name', type: 'String' as const, isNullable: false },
        { name: 'createdAt', type: 'DateTime' as const, defaultValue: 'now()' }
      ],
      rowsCount: 1
    };

    setDatabaseSchema(prev => {
      const updated = {
        ...prev,
        models: [...prev.models, newModel],
        mockData: {
          ...prev.mockData,
          [newModelId]: [{ id: 'id_01', name: 'Sample ' + name, createdAt: new Date().toISOString() }]
        }
      };

      const prisma = DatabaseEngine.generatePrismaSchema(updated);
      vfs.writeFile('database/schema.prisma', prisma, 'database');
      setFiles(vfs.getFiles());

      return updated;
    });

    addTerminalLog(`Added new table "${tableName}" to ${databaseSchema.type.toUpperCase()} schema.`, 'success');
  }, [databaseSchema.type, vfs, addTerminalLog]);

  const pushToGitHub = useCallback(async (commitMessage: string) => {
    addTerminalLog(`[GIT] Staging ${Object.keys(files).length} files for commit...`, 'info');
    const commit = await githubService.pushFiles(files, commitMessage);
    setGitCommits(prev => [commit, ...prev]);
    addTerminalLog(`[GIT] Committed: "${commitMessage}" [${commit.sha}] to branch ${commit.branch}`, 'success');
  }, [files, githubService, addTerminalLog]);

  const exportProjectZip = useCallback(async () => {
    addTerminalLog(`[EXPORT] Bundling fullstack project into ZIP...`, 'info');
    const blob = await vfs.exportZip('antigravity-fullstack-app');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `antigravity-${databaseSchema.name}-app.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addTerminalLog(`[EXPORT] Download complete: antigravity-${databaseSchema.name}-app.zip`, 'success');
  }, [vfs, databaseSchema.name, addTerminalLog]);

  const triggerFullstackBuild = useCallback(async (prompt: string, dbType: DatabaseType = databaseSchema.type) => {
    setIsGenerating(true);
    const orchestrator = new MultiAgentOrchestrator(vfs);

    // Deduct credits for concurrent agent swarm execution
    setCredits(prev => {
      const updated = AuthCreditService.deductCredits(prev, true, 2);
      addTerminalLog(`[CREDITS] Deducted 10 Premium Credits & 4 Standard Credits for Swarm Execution. Remaining: ${updated.premiumCredits} Premium | ${updated.standardCredits} Standard`, 'purple');
      return updated;
    });

    try {
      await orchestrator.runConcurrentFullstackGeneration(prompt, dbType, {
        onAgentUpdate: (role, update) => {
          setAgents(prev => ({
            ...prev,
            [role]: { ...prev[role], ...update }
          }));
        },
        onInterAgentMessage: (msg) => {
          setInterAgentMessages(prev => [...prev, msg]);
        },
        onFileWritten: (path, content, role) => {
          setFiles(vfs.getFiles());
          const file = vfs.getFile(path);
          if (file && !activeFile) {
            setActiveFile(file);
          }
        },
        onTerminalLog: (line, level) => {
          addTerminalLog(line, level);
        },
        onContractSync: (contract) => {
          setApiContract(contract);
        },
        onDatabaseUpdate: (schema) => {
          setDatabaseSchema(schema);
        }
      });
    } catch (err: any) {
      addTerminalLog(`[ERROR] Orchestration failed: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [vfs, databaseSchema.type, activeFile, addTerminalLog]);

  const loadPresetTemplate = useCallback((templateName: string) => {
    triggerFullstackBuild(`Build ${templateName} with complete frontend, backend, database models, and API contract`);
  }, [triggerFullstackBuild]);

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        credits,
        loginWithGoogle,
        logout,
        refreshCredits,
        agents,
        interAgentMessages,
        selectedModel,
        setSelectedModel,
        isGenerating,
        concurrencyMode,
        setConcurrencyMode,
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
        activeMainTab,
        setActiveMainTab,
        activeSideDrawer,
        setActiveSideDrawer,
        isBottomTerminalOpen,
        setIsBottomTerminalOpen,
        terminalLogs,
        addTerminalLog,
        clearTerminal,
        triggerFullstackBuild,
        loadPresetTemplate
      }}
    >
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
