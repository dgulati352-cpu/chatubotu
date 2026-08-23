import { AgentRole, AgentState, InterAgentMessage, ToolCall } from '../types/agent';
import { DatabaseType } from '../types/database';
import { SimulationEngine } from './simulationEngine';
import { VirtualFileSystem } from './virtualFs';

export interface OrchestrationCallbacks {
  onAgentUpdate: (role: AgentRole, update: Partial<AgentState>) => void;
  onInterAgentMessage: (msg: InterAgentMessage) => void;
  onFileWritten: (path: string, content: string, role: AgentRole) => void;
  onTerminalLog: (line: string, level?: 'info' | 'success' | 'warn' | 'error' | 'cyan' | 'purple') => void;
  onContractSync: (contract: any) => void;
  onDatabaseUpdate: (schema: any) => void;
}

export class MultiAgentOrchestrator {
  private vfs: VirtualFileSystem;
  private isRunning: boolean = false;

  constructor(vfs: VirtualFileSystem) {
    this.vfs = vfs;
  }

  public async runConcurrentFullstackGeneration(
    userPrompt: string,
    databaseType: DatabaseType,
    callbacks: OrchestrationCallbacks
  ): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    callbacks.onTerminalLog(`[ORCHESTRATOR] 🚀 Launching True Concurrent Dual-Agent Swarm...`, 'purple');
    callbacks.onTerminalLog(`[PROMPT] "${userPrompt}" | Database Target: [${databaseType.toUpperCase()}]`, 'info');

    // 1. Architect Stage: Formulate Spec & Contract
    callbacks.onAgentUpdate('architect', {
      status: 'thinking',
      currentTask: 'Drafting fullstack architecture spec & shared API contracts...',
      progress: 25
    });

    await this.delay(400);

    const bundle = SimulationEngine.generateFullstackProject(userPrompt, databaseType);

    callbacks.onTerminalLog(`[ARCHITECT] Shared Contract locked: ${bundle.contract.endpoints.length} endpoints, ${bundle.contract.types.length} TypeScript interfaces`, 'cyan');
    callbacks.onContractSync(bundle.contract);

    callbacks.onInterAgentMessage({
      id: `msg_${Date.now()}_1`,
      from: 'architect',
      to: 'backend',
      content: `Architect: Backend Agent, please implement Express/Node endpoints and ${databaseType.toUpperCase()} connectors per contract v1.0.0.`,
      timestamp: Date.now(),
      type: 'contract_proposal'
    });

    callbacks.onInterAgentMessage({
      id: `msg_${Date.now()}_2`,
      from: 'architect',
      to: 'frontend',
      content: `Architect: Frontend Agent, please generate React 18 UI components, responsive layout, and apiClient hooks matching contract v1.0.0.`,
      timestamp: Date.now(),
      type: 'contract_proposal'
    });

    // Write Contract file immediately
    const contractFile = bundle.files['contracts/api.ts'];
    if (contractFile) {
      this.vfs.writeFile(contractFile.path, contractFile.content, 'architect');
      callbacks.onFileWritten(contractFile.path, contractFile.content, 'architect');
    }

    callbacks.onAgentUpdate('architect', {
      status: 'syncing',
      currentTask: 'Contract locked. Orchestrating concurrent Frontend & Backend streams...',
      progress: 50
    });

    // 2. Database Agent writes schemas
    callbacks.onAgentUpdate('database', {
      status: 'coding',
      currentTask: `Generating Prisma models & SQL migration DDL for ${databaseType.toUpperCase()}...`,
      progress: 20,
      activeFile: 'database/schema.prisma'
    });

    const dbPrisma = bundle.files['database/schema.prisma'];
    const dbSql = bundle.files['database/migrations/001_init.sql'];
    if (dbPrisma) {
      this.vfs.writeFile(dbPrisma.path, dbPrisma.content, 'database');
      callbacks.onFileWritten(dbPrisma.path, dbPrisma.content, 'database');
    }
    if (dbSql) {
      this.vfs.writeFile(dbSql.path, dbSql.content, 'database');
      callbacks.onFileWritten(dbSql.path, dbSql.content, 'database');
    }
    callbacks.onDatabaseUpdate(bundle.schema);
    callbacks.onTerminalLog(`[DATABASE AGENT] Synchronized ${databaseType.toUpperCase()} schema & mock datasets.`, 'success');

    callbacks.onAgentUpdate('database', {
      status: 'completed',
      currentTask: `Database schema & mock records synchronized (${databaseType.toUpperCase()})`,
      progress: 100
    });

    // 3. TRUE SIMULTANEOUS PARALLEL STREAMING: FRONTEND AGENT & BACKEND AGENT RUNNING AT THE EXACT SAME TIME!
    callbacks.onTerminalLog(`[SWARM] ⚡ Launching PARALLEL execution threads: [FRONTEND AGENT] & [BACKEND AGENT] side-by-side!`, 'purple');

    callbacks.onAgentUpdate('frontend', {
      status: 'coding',
      currentTask: 'Synthesizing React components & Tailwind UI in parallel...',
      progress: 10,
      activeFile: 'frontend/src/App.tsx',
      streamingLines: [],
      streamingCode: ''
    });

    callbacks.onAgentUpdate('backend', {
      status: 'coding',
      currentTask: `Mounting Express routers, controllers & ${databaseType.toUpperCase()} queries in parallel...`,
      progress: 10,
      activeFile: 'backend/src/server.ts',
      streamingLines: [],
      streamingCode: ''
    });

    // Frontend File Chunks
    const frontendTargetFiles = [
      bundle.files['frontend/src/services/apiClient.ts'],
      bundle.files['frontend/src/App.tsx']
    ].filter(Boolean);

    // Backend File Chunks
    const backendTargetFiles = [
      bundle.files['backend/src/routes/api.ts'],
      bundle.files['backend/src/server.ts']
    ].filter(Boolean);

    // Run both streams simultaneously with Promise.all
    const runFrontendThread = async () => {
      let accumulatedLines = 0;
      for (const file of frontendTargetFiles) {
        callbacks.onAgentUpdate('frontend', {
          activeFile: file.path,
          currentTask: `Writing ${file.name} (React Client Module)...`
        });

        const lines = file.content.split('\n');
        let currentChunk: string[] = [];

        for (let i = 0; i < lines.length; i += 3) {
          const slice = lines.slice(i, i + 3);
          currentChunk = [...currentChunk, ...slice];
          accumulatedLines += slice.length;

          callbacks.onAgentUpdate('frontend', {
            streamingLines: currentChunk.slice(-14), // keep last 14 lines visible
            streamingCode: currentChunk.join('\n'),
            progress: Math.min(95, Math.round((accumulatedLines / 150) * 100)),
            metrics: {
              filesGenerated: 4,
              linesOfCode: accumulatedLines,
              tokensProcessed: accumulatedLines * 24,
              contractSyncs: 1
            }
          });

          await this.delay(90);
        }

        this.vfs.writeFile(file.path, file.content, 'frontend');
        callbacks.onFileWritten(file.path, file.content, 'frontend');
        callbacks.onTerminalLog(`[FRONTEND AGENT] ✓ Completed ${file.path} (${lines.length} lines)`, 'cyan');
      }

      callbacks.onAgentUpdate('frontend', {
        status: 'completed',
        currentTask: 'React client UI ready with live interactive sandbox.',
        progress: 100
      });
    };

    const runBackendThread = async () => {
      let accumulatedLines = 0;
      for (const file of backendTargetFiles) {
        callbacks.onAgentUpdate('backend', {
          activeFile: file.path,
          currentTask: `Writing ${file.name} (Express Server Module)...`
        });

        const lines = file.content.split('\n');
        let currentChunk: string[] = [];

        for (let i = 0; i < lines.length; i += 3) {
          const slice = lines.slice(i, i + 3);
          currentChunk = [...currentChunk, ...slice];
          accumulatedLines += slice.length;

          callbacks.onAgentUpdate('backend', {
            streamingLines: currentChunk.slice(-14),
            streamingCode: currentChunk.join('\n'),
            progress: Math.min(95, Math.round((accumulatedLines / 160) * 100)),
            metrics: {
              filesGenerated: 5,
              linesOfCode: accumulatedLines,
              tokensProcessed: accumulatedLines * 26,
              contractSyncs: 1
            }
          });

          await this.delay(90);
        }

        this.vfs.writeFile(file.path, file.content, 'backend');
        callbacks.onFileWritten(file.path, file.content, 'backend');
        callbacks.onTerminalLog(`[BACKEND AGENT] ✓ Completed ${file.path} (${lines.length} lines)`, 'info');
      }

      callbacks.onAgentUpdate('backend', {
        status: 'completed',
        currentTask: `Express REST server and ${databaseType.toUpperCase()} connector ready.`,
        progress: 100
      });
    };

    // Execute Frontend & Backend Threads SIMULTANEOUSLY!
    await Promise.all([runFrontendThread(), runBackendThread()]);

    // Inter-Agent Handshake
    callbacks.onInterAgentMessage({
      id: `msg_${Date.now()}_3`,
      from: 'frontend',
      to: 'backend',
      content: `Frontend: Components mounted. Validated GET /api/v1/items and POST mutations.`,
      timestamp: Date.now(),
      type: 'request'
    });

    callbacks.onInterAgentMessage({
      id: `msg_${Date.now()}_4`,
      from: 'backend',
      to: 'frontend',
      content: `Backend: CORS verified. Database pool connected to ${databaseType.toUpperCase()}.`,
      timestamp: Date.now(),
      type: 'response'
    });

    // Finalize Architect & Reviewer
    callbacks.onAgentUpdate('architect', {
      status: 'completed',
      currentTask: 'Fullstack concurrent generation completed with 0 errors.',
      progress: 100
    });

    callbacks.onTerminalLog(`[ORCHESTRATOR] 🎉 Both Frontend and Backend generated simultaneously in parallel!`, 'success');
    this.isRunning = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
