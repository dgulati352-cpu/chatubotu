import { ModelMetadata } from '../types/agent';

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
];
