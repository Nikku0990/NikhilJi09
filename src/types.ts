export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  time: number;
}

export interface FileData {
  name: string;
  content: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface Snapshot {
  id: string;
  timestamp: number;
  message: string;
  files: FileData[];
  filesCount: number;
  totalSize: number;
}

export interface APIConfig {
  engine: 'openrouter' | 'ollama' | 'custom';
  baseUrl: string;
  apiKey?: string;
  model: string;
}

export interface OrchestratorStatus {
  active: boolean;
  paused: boolean;
  progress: number;
  filesWritten: number;
  step: string;
  currentTask: string;
}

export interface TestResult {
  ok: boolean;
  logs: string;
  passed: number;
  failed: number;
  errors: string[];
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'supabase';
  repoUrl?: string;
  branch?: string;
  buildCommand?: string;
  outputDir?: string;
}

export interface DeploymentStatus {
  status: 'idle' | 'preparing' | 'deploying' | 'success' | 'error';
  progress: number;
  message: string;
  url?: string;
  error?: string;
}
