import { VirtualFile } from '../types/project';
import { ApiContract, EndpointSpec, TypeDefinition } from '../types/project';
import { DatabaseSchema, DatabaseType } from '../types/database';
import { DatabaseEngine } from './databaseEngine';

export interface FullstackBundle {
  name: string;
  description: string;
  database: DatabaseType;
  schema: DatabaseSchema;
  contract: ApiContract;
  files: Record<string, VirtualFile>;
}

export class SimulationEngine {
  public static generateFullstackProject(prompt: string, dbType: DatabaseType = 'postgresql'): FullstackBundle {
    const isEcommerce = prompt.toLowerCase().includes('shop') || prompt.toLowerCase().includes('store') || prompt.toLowerCase().includes('commerce') || prompt.toLowerCase().includes('cart');
    const isSocial = prompt.toLowerCase().includes('social') || prompt.toLowerCase().includes('chat') || prompt.toLowerCase().includes('feed') || prompt.toLowerCase().includes('post');
    const isAiApp = prompt.toLowerCase().includes('ai') || prompt.toLowerCase().includes('agent') || prompt.toLowerCase().includes('bot') || prompt.toLowerCase().includes('llm');

    let projectName = 'Antigravity Fullstack App';
    let appTopic = 'SaaS Platform';

    if (isEcommerce) {
      projectName = 'Apex Storefront & Inventory Platform';
      appTopic = 'E-Commerce Store';
    } else if (isSocial) {
      projectName = 'Pulse Social Community & Realtime Stream';
      appTopic = 'Social Network';
    } else if (isAiApp) {
      projectName = 'Cognition AI Agent Workstation & Neural Pipeline';
      appTopic = 'AI SaaS Workstation';
    }

    const schema = DatabaseEngine.createInitialSchema(dbType, appTopic);
    const prismaContent = DatabaseEngine.generatePrismaSchema(schema);
    const sqlContent = DatabaseEngine.generateSqlDdl(schema);

    // Build Contract
    const endpoints: EndpointSpec[] = [
      {
        id: 'ep_1',
        method: 'GET',
        path: '/api/v1/health',
        description: 'System health check and DB latency telemetry',
        responseSchema: '{ status: "ok", uptime: number, dbLatency: string }',
        frontendCaller: 'apiClient.getHealth()',
        backendHandler: 'healthController.check',
        status: 'tested',
        sampleResponse: { status: 'healthy', uptime: 38291, dbLatency: '2.4ms', timestamp: new Date().toISOString() }
      },
      {
        id: 'ep_2',
        method: 'GET',
        path: '/api/v1/items',
        description: `Fetch all primary ${schema.models[1]?.name || 'Data'} records with pagination and filters`,
        responseSchema: `{ data: ${schema.models[1]?.name || 'Item'}[], total: number, page: number }`,
        frontendCaller: 'apiClient.getItems()',
        backendHandler: 'resourceController.getAll',
        status: 'synced',
        sampleResponse: {
          data: schema.mockData[schema.models[1]?.id || ''] || [],
          total: schema.mockData[schema.models[1]?.id || '']?.length || 0,
          page: 1
        }
      },
      {
        id: 'ep_3',
        method: 'POST',
        path: '/api/v1/items',
        description: `Create a new ${schema.models[1]?.name || 'Item'} entry with validation`,
        requestSchema: `Create${schema.models[1]?.name || 'Item'}Dto`,
        responseSchema: `{ success: boolean, item: ${schema.models[1]?.name || 'Item'} }`,
        frontendCaller: 'apiClient.createItem(payload)',
        backendHandler: 'resourceController.create',
        status: 'synced',
        sampleResponse: { success: true, message: 'Record created in database' }
      },
      {
        id: 'ep_4',
        method: 'GET',
        path: '/api/v1/stats',
        description: 'Real-time telemetry and dashboard aggregated metrics',
        responseSchema: '{ activeUsers: number, throughput: number, errorRate: number }',
        frontendCaller: 'apiClient.getStats()',
        backendHandler: 'metricsController.getDashboardMetrics',
        status: 'tested',
        sampleResponse: { activeUsers: 1420, throughput: '3.8k req/s', errorRate: '0.01%', databaseStatus: 'CONNECTED' }
      }
    ];

    const types: TypeDefinition[] = [
      {
        name: schema.models[0]?.name || 'User',
        typescriptDef: `export interface ${schema.models[0]?.name || 'User'} {\n  id: string;\n  email: string;\n  fullName: string;\n  role: string;\n  createdAt: string;\n}`,
        usedInFrontend: true,
        usedInBackend: true
      },
      {
        name: schema.models[1]?.name || 'Item',
        typescriptDef: `export interface ${schema.models[1]?.name || 'Item'} {\n  id: string;\n  title: string;\n  description?: string;\n  price?: number;\n  status?: string;\n  createdAt: string;\n}`,
        usedInFrontend: true,
        usedInBackend: true
      },
      {
        name: 'ApiResponse<T>',
        typescriptDef: 'export interface ApiResponse<T> {\n  success: boolean;\n  data: T;\n  error?: string;\n  meta?: { page: number; total: number };\n}',
        usedInFrontend: true,
        usedInBackend: true
      }
    ];

    const contract: ApiContract = {
      version: '1.0.0',
      title: `${projectName} Contract`,
      baseUrl: 'http://localhost:5000',
      endpoints,
      types,
      lastSyncedAt: Date.now()
    };

    // Shared Contract file
    const contractTsContent = `/**
 * SHARED API CONTRACT (Synced between Frontend Agent & Backend Agent)
 * Antigravity Lead Architect Automated Synchronizer
 */

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'maintenance';
  uptime: number;
  dbLatency: string;
  timestamp: string;
}

${types.map(t => t.typescriptDef).join('\n\n')}

export interface DashboardMetrics {
  activeUsers: number;
  throughput: string;
  errorRate: string;
  databaseStatus: 'CONNECTED' | 'DISCONNECTED';
}

export type ApiEndpoints = {
  'GET /api/v1/health': { response: SystemHealth };
  'GET /api/v1/items': { response: { data: ${schema.models[1]?.name || 'Item'}[]; total: number } };
  'POST /api/v1/items': { request: Partial<${schema.models[1]?.name || 'Item'}>; response: { success: boolean; item: ${schema.models[1]?.name || 'Item'} } };
  'GET /api/v1/stats': { response: DashboardMetrics };
};
`;

    // Frontend App.tsx
    const frontendAppTsx = `import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Layers, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Terminal,
  Zap,
  Server
} from 'lucide-react';
import { apiClient } from './services/apiClient';
import type { ${schema.models[1]?.name || 'Item'}, DashboardMetrics, SystemHealth } from '../../contracts/api';

export default function App() {
  const [items, setItems] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'api-live'>('dashboard');
  const [actionLog, setActionLog] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hRes, mRes, iRes] = await Promise.all([
        apiClient.getHealth(),
        apiClient.getStats(),
        apiClient.getItems()
      ]);
      setHealth(hRes);
      setMetrics(mRes);
      setItems(iRes.data || []);
      logAction('Fullstack state synced from backend (${dbType.toUpperCase()} + Express API)');
    } catch (err: any) {
      logAction('Error connecting to backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const logAction = (msg: string) => {
    setActionLog(prev => [ \`[\${new Date().toLocaleTimeString()}] \${msg}\`, ...prev.slice(0, 15) ]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const created = await apiClient.createItem({
        title: newItemTitle,
        description: 'Created via Antigravity Live Frontend client',
        price: Math.floor(Math.random() * 200) + 49
      });
      setItems(prev => [created.item, ...prev]);
      setNewItemTitle('');
      logAction(\`Created new record: "\${newItemTitle}" (Saved to ${dbType.toUpperCase()})\`);
    } catch (err: any) {
      logAction('Failed to create item: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans p-6">
      {/* Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ${projectName}
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                v1.0.0 Fullstack
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Frontend Agent + Backend Agent (${dbType.toUpperCase()} Engine)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>API: </span>
            <span className="text-emerald-400 font-semibold">{health?.status || 'Online'}</span>
          </div>

          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm active:scale-95"
          >
            <RefreshCw className={\`w-3.5 h-3.5 \${loading ? 'animate-spin' : ''}\`} />
            Sync State
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800/80 mb-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={\`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 \${
            activeTab === 'dashboard'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }\`}
        >
          <Layers className="w-3.5 h-3.5" />
          Overview & Metrics
        </button>
        <button 
          onClick={() => setActiveTab('records')}
          className={\`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 \${
            activeTab === 'records'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }\`}
        >
          <Database className="w-3.5 h-3.5" />
          ${schema.models[1]?.name || 'Items'} Collection ({items.length})
        </button>
        <button 
          onClick={() => setActiveTab('api-live')}
          className={\`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 \${
            activeTab === 'api-live'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }\`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Live Event Bus ({actionLog.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Users</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {metrics?.activeUsers?.toLocaleString() || '1,420'}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                ↑ 14.8% from previous deployment
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Throughput</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {metrics?.throughput || '3.8k req/s'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Zero bottlenecks detected
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Database Latency</span>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {health?.dbLatency || '2.4ms'}
              </div>
              <div className="text-[11px] text-purple-300 mt-1 uppercase font-mono">
                ${dbType} connection active
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Error Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {metrics?.errorRate || '0.01%'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Type safety synced via contracts
              </div>
            </div>
          </div>

          {/* Quick Create Form */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Create New ${schema.models[1]?.name || 'Record'} (Direct DB Mutation)
            </h2>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input 
                type="text"
                value={newItemTitle}
                onChange={e => setNewItemTitle(e.target.value)}
                placeholder="Enter title or name..."
                className="flex-1 px-4 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Record
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              ${schema.models[1]?.name || 'Item'} Data Table
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Engine: ${dbType.toUpperCase()} | Table: "${schema.models[1]?.tableName || 'items'}"
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title / Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Price / Value</th>
                  <th className="py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-cyan-400">{item.id}</td>
                    <td className="py-3 px-4 font-medium text-white">{item.title || item.name}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{item.description || '—'}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">\${item.price?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{item.createdAt || 'Just now'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'api-live' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" />
            Live Client-Server Activity Stream
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {actionLog.map((log, i) => (
              <div key={i} className="text-slate-300 flex items-start gap-2">
                <span className="text-cyan-500">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;

    // Frontend API Client
    const frontendApiClientTs = `import type { SystemHealth, DashboardMetrics } from '../../contracts/api';

const BASE_URL = 'http://localhost:5000';

export const apiClient = {
  async getHealth(): Promise<SystemHealth> {
    return {
      status: 'healthy',
      uptime: Math.floor(Math.random() * 50000) + 1000,
      dbLatency: '2.3ms',
      timestamp: new Date().toISOString()
    };
  },

  async getStats(): Promise<DashboardMetrics> {
    return {
      activeUsers: 1420,
      throughput: '3.8k req/s',
      errorRate: '0.01%',
      databaseStatus: 'CONNECTED'
    };
  },

  async getItems(): Promise<{ data: any[]; total: number }> {
    // Simulated live request to backend database
    const raw = localStorage.getItem('antigravity_mock_items');
    if (raw) {
      return JSON.parse(raw);
    }
    const defaults = ${JSON.stringify(schema.mockData[schema.models[1]?.id || ''] || [])};
    return { data: defaults, total: defaults.length };
  },

  async createItem(payload: any): Promise<{ success: boolean; item: any }> {
    const existing = await this.getItems();
    const newItem = {
      id: 'itm_' + Math.random().toString(36).substr(2, 6),
      ...payload,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...existing.data];
    localStorage.setItem('antigravity_mock_items', JSON.stringify({ data: updated, total: updated.length }));
    return { success: true, item: newItem };
  }
};
`;

    // Backend server.ts
    const backendServerTs = `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api';
import { db } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Mount Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Boot Server
app.listen(PORT, async () => {
  console.log(\`🚀 Backend Agent Server running on http://localhost:\${PORT}\`);
  console.log(\`📦 Database Connection: ${dbType.toUpperCase()} connected successfully.\`);
});
`;

    // Backend routes/api.ts
    const backendRoutesTs = `import { Router, Request, Response } from 'express';
import { resourceController } from '../controllers/resourceController';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    dbLatency: '1.8ms',
    timestamp: new Date().toISOString()
  });
});

// Dashboard Stats
apiRouter.get('/stats', (req: Request, res: Response) => {
  res.json({
    activeUsers: 1420,
    throughput: '3.8k req/s',
    errorRate: '0.01%',
    databaseStatus: 'CONNECTED'
  });
});

// Resource CRUD
apiRouter.get('/items', resourceController.getAll);
apiRouter.post('/items', resourceController.create);
apiRouter.get('/items/:id', resourceController.getById);
`;

    // Backend controllers/resourceController.ts
    const backendControllerTs = `import { Request, Response } from 'express';
import { db } from '../config/database';

export const resourceController = {
  async getAll(req: Request, res: Response) {
    try {
      const items = await db.query('SELECT * FROM ${schema.models[1]?.tableName || 'items'} ORDER BY "createdAt" DESC');
      res.json({ data: items, total: items.length });
    } catch (error: any) {
      res.status(500).json({ error: 'Database fetch failed', details: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, description, price } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newItem = await db.insert('${schema.models[1]?.tableName || 'items'}', {
        title,
        description,
        price: parseFloat(price) || 0,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ success: true, item: newItem });
    } catch (error: any) {
      res.status(500).json({ error: 'Database insertion failed', details: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await db.findById('${schema.models[1]?.tableName || 'items'}', id);
      if (!item) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ data: item });
    } catch (error: any) {
      res.status(500).json({ error: 'Query error', details: error.message });
    }
  }
};
`;

    // Backend config/database.ts
    const backendDbConfigTs = `// Database Connector: ${dbType.toUpperCase()}
// Auto-configured by Antigravity Database Agent

export interface DbClient {
  query: (sql: string, params?: any[]) => Promise<any[]>;
  insert: (table: string, data: any) => Promise<any>;
  findById: (table: string, id: string) => Promise<any>;
}

class DatabaseConnectionPool implements DbClient {
  private uri: string = process.env.DATABASE_URL || '${schema.connectionUri}';

  constructor() {
    console.log('[DB] Initializing pool connection for ' + '${dbType.toUpperCase()}');
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    // Simulated DB Execution matching schema
    return ${JSON.stringify(schema.mockData[schema.models[1]?.id || ''] || [])};
  }

  async insert(table: string, data: any): Promise<any> {
    return {
      id: 'db_' + Math.random().toString(36).substr(2, 6),
      ...data
    };
  }

  async findById(table: string, id: string): Promise<any> {
    return { id, title: 'Sample DB Record', status: 'ACTIVE' };
  }
}

export const db = new DatabaseConnectionPool();
`;

    // Package.jsons and Readme
    const frontendPackageJson = `{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.475.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}`;

    const backendPackageJson = `{
  "name": "backend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "express": "^4.21.2",
    "cors": "^2.8.5",
    "@prisma/client": "^6.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^22.13.4",
    "prisma": "^6.3.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}`;

    const readmeMd = `# ${projectName}
Built simultaneously with **Antigravity Multi-AI Agent IDE**.

## Architecture
- **Frontend Agent**: React 18 + Vite + Tailwind CSS + Lucide
- **Backend Agent**: Node.js + Express + TypeScript
- **Database Agent**: ${dbType.toUpperCase()} + Prisma ORM + SQL Migrations
- **Contracts**: Shared TypeScript API specifications in \`contracts/api.ts\`

## Getting Started

### 1. Database Setup
\`\`\`bash
cd database
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 2. Run Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### 3. Run Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
`;

    const dockerCompose = `version: '3.8'

services:
  ${dbType === 'postgresql' ? `postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_antigravity
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data` : ''}

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${schema.connectionUri}
      - PORT=5000
    depends_on:
      - ${dbType === 'postgresql' ? 'postgres' : ''}

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

volumes:
  pgdata:
`;

    const now = Date.now();

    const files: Record<string, VirtualFile> = {
      'frontend/src/App.tsx': {
        id: 'f_app_tsx',
        path: 'frontend/src/App.tsx',
        name: 'App.tsx',
        content: frontendAppTsx,
        language: 'tsx',
        module: 'frontend',
        generatedBy: 'frontend',
        lastModified: now
      },
      'frontend/src/services/apiClient.ts': {
        id: 'f_api_client',
        path: 'frontend/src/services/apiClient.ts',
        name: 'apiClient.ts',
        content: frontendApiClientTs,
        language: 'typescript',
        module: 'frontend',
        generatedBy: 'frontend',
        lastModified: now
      },
      'frontend/package.json': {
        id: 'f_pkg',
        path: 'frontend/package.json',
        name: 'package.json',
        content: frontendPackageJson,
        language: 'json',
        module: 'frontend',
        generatedBy: 'frontend',
        lastModified: now
      },
      'backend/src/server.ts': {
        id: 'b_server',
        path: 'backend/src/server.ts',
        name: 'server.ts',
        content: backendServerTs,
        language: 'typescript',
        module: 'backend',
        generatedBy: 'backend',
        lastModified: now
      },
      'backend/src/routes/api.ts': {
        id: 'b_routes',
        path: 'backend/src/routes/api.ts',
        name: 'api.ts',
        content: backendRoutesTs,
        language: 'typescript',
        module: 'backend',
        generatedBy: 'backend',
        lastModified: now
      },
      'backend/src/controllers/resourceController.ts': {
        id: 'b_ctrl',
        path: 'backend/src/controllers/resourceController.ts',
        name: 'resourceController.ts',
        content: backendControllerTs,
        language: 'typescript',
        module: 'backend',
        generatedBy: 'backend',
        lastModified: now
      },
      'backend/src/config/database.ts': {
        id: 'b_db_cfg',
        path: 'backend/src/config/database.ts',
        name: 'database.ts',
        content: backendDbConfigTs,
        language: 'typescript',
        module: 'backend',
        generatedBy: 'backend',
        lastModified: now
      },
      'backend/package.json': {
        id: 'b_pkg',
        path: 'backend/package.json',
        name: 'package.json',
        content: backendPackageJson,
        language: 'json',
        module: 'backend',
        generatedBy: 'backend',
        lastModified: now
      },
      'database/schema.prisma': {
        id: 'db_prisma',
        path: 'database/schema.prisma',
        name: 'schema.prisma',
        content: prismaContent,
        language: 'prisma',
        module: 'database',
        generatedBy: 'database',
        lastModified: now
      },
      'database/migrations/001_init.sql': {
        id: 'db_sql',
        path: 'database/migrations/001_init.sql',
        name: '001_init.sql',
        content: sqlContent,
        language: 'sql',
        module: 'database',
        generatedBy: 'database',
        lastModified: now
      },
      'contracts/api.ts': {
        id: 'shared_contract',
        path: 'contracts/api.ts',
        name: 'api.ts',
        content: contractTsContent,
        language: 'typescript',
        module: 'shared',
        generatedBy: 'architect',
        lastModified: now
      },
      'README.md': {
        id: 'root_readme',
        path: 'README.md',
        name: 'README.md',
        content: readmeMd,
        language: 'markdown',
        module: 'root',
        generatedBy: 'architect',
        lastModified: now
      },
      'docker-compose.yml': {
        id: 'root_docker',
        path: 'docker-compose.yml',
        name: 'docker-compose.yml',
        content: dockerCompose,
        language: 'yaml',
        module: 'root',
        generatedBy: 'architect',
        lastModified: now
      }
    };

    return {
      name: projectName,
      description: prompt,
      database: dbType,
      schema,
      contract,
      files
    };
  }
}
