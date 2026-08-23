import { DatabaseSchema, DatabaseType } from './database';

export type FileLanguage = 
  | 'typescript'
  | 'javascript'
  | 'tsx'
  | 'jsx'
  | 'json'
  | 'html'
  | 'css'
  | 'sql'
  | 'prisma'
  | 'markdown'
  | 'yaml'
  | 'env';

export interface VirtualFile {
  id: string;
  path: string; // e.g. "frontend/src/App.tsx" or "backend/src/routes/auth.ts"
  name: string;
  content: string;
  originalContent?: string;
  language: FileLanguage;
  module: 'frontend' | 'backend' | 'database' | 'shared' | 'config' | 'root';
  isModified?: boolean;
  generatedBy?: 'frontend' | 'backend' | 'architect' | 'database' | 'user';
  lastModified: number;
}

export interface EndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestSchema?: string;
  responseSchema: string;
  frontendCaller?: string; // e.g. "useAuthApi()"
  backendHandler?: string; // e.g. "authController.login"
  status: 'draft' | 'synced' | 'tested';
  sampleResponse?: any;
}

export interface TypeDefinition {
  name: string;
  typescriptDef: string;
  usedInFrontend: boolean;
  usedInBackend: boolean;
}

export interface ApiContract {
  version: string;
  title: string;
  baseUrl: string;
  endpoints: EndpointSpec[];
  types: TypeDefinition[];
  lastSyncedAt: number;
}

export interface FullstackProject {
  id: string;
  name: string;
  description: string;
  frontendStack: 'React + Vite' | 'Next.js App Router' | 'Vue 3 + Vite' | 'SvelteKit';
  backendStack: 'Node.js + Express' | 'FastAPI Python' | 'Hono + Cloudflare' | 'NestJS';
  database: DatabaseType;
  databaseSchema: DatabaseSchema;
  contract: ApiContract;
  files: Record<string, VirtualFile>; // path -> VirtualFile
  activeFileId: string;
  openFileIds: string[];
}
