export type AgentRole = 'architect' | 'frontend' | 'backend' | 'database' | 'reviewer';

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
  progress: number; // 0-100
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
}
