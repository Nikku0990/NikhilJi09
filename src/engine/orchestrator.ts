import { ApiClient } from './apiClient';
import { MonacoAdapter, FileData } from './monacoAdapter';
import { fileManager } from './fileManager';
import { snapshotManager } from './snapshotManager';
import { SYSTEM_PROMPTS, TEMPLATES } from './prompts';
import type { ChatMessage } from '../types';

export interface OrchestratorStatus {
  active: boolean;
  paused: boolean;
  progress: number;
  filesWritten: number;
  step: string;
  currentTask: string;
}

interface ParsedFileBlock {
  name: string;
  language: string;
  content: string;
}

export class Orchestrator {
  private api: ApiClient;
  private monaco: MonacoAdapter;
  private buffer = '';
  public status: OrchestratorStatus = {
    active: false,
    paused: false,
    progress: 0,
    filesWritten: 0,
    step: '',
    currentTask: '',
  };
  private abortController: AbortController | null = null;
  private onStatusChange?: (status: OrchestratorStatus) => void;
  private onFileCreated?: (file: FileData) => void;
  private onChunkReceived?: (chunk: string) => void;

  constructor(api: ApiClient, monaco: MonacoAdapter) {
    this.api = api;
    this.monaco = monaco;
  }

  setStatusCallback(callback: (status: OrchestratorStatus) => void) {
    this.onStatusChange = callback;
  }

  setFileCreatedCallback(callback: (file: FileData) => void) {
    this.onFileCreated = callback;
  }

  setChunkCallback(callback: (chunk: string) => void) {
    this.onChunkReceived = callback;
  }

  async generatePlan(task: string): Promise<string> {
    this.updateStatus({ step: 'Generating plan...', currentTask: task });

    try {
      const plan = await this.api.callSingle(
        SYSTEM_PROMPTS.AGENT,
        TEMPLATES.GENERATE_PLAN(task),
        { temperature: 0.5, max_tokens: 2000 }
      );

      this.updateStatus({ step: 'Plan generated' });
      return plan;
    } catch (error) {
      console.error('[Orchestrator] Plan generation error:', error);
      throw error;
    }
  }

  async executePlan(task: string): Promise<void> {
    if (this.status.active) {
      throw new Error('Orchestrator already running');
    }

    this.abortController = new AbortController();
    this.buffer = '';

    this.updateStatus({
      active: true,
      paused: false,
      progress: 0,
      filesWritten: 0,
      step: 'Starting execution...',
      currentTask: task,
    });

    const history: ChatMessage[] = [
      { id: '1', role: 'system', content: SYSTEM_PROMPTS.BEAST, time: Date.now() },
      {
        id: '2',
        role: 'user',
        content: `Task: ${task}\n\nGenerate files using FILE: markers with fenced code blocks. Continue until complete and output [ALL_DONE].`,
        time: Date.now(),
      },
    ];

    try {
      await this.api.callStream(SYSTEM_PROMPTS.BEAST, history, {
        signal: this.abortController.signal,
        onChunk: async (chunk) => {
          if (this.onChunkReceived) {
            this.onChunkReceived(chunk);
          }
          await this.handleChunk(chunk);
        },
        onComplete: () => {
          this.updateStatus({
            active: false,
            step: 'Execution completed',
            progress: 100,
          });
          snapshotManager.saveSnapshot(`Completed: ${task}`);
        },
        onError: (error) => {
          console.error('[Orchestrator] Execution error:', error);
          this.updateStatus({
            active: false,
            step: `Error: ${error.message}`,
          });
        },
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('[Orchestrator] Execution error:', error);
        this.updateStatus({
          active: false,
          step: `Error: ${error.message}`,
        });
      }
    }
  }

  private async handleChunk(chunk: string): Promise<void> {
    this.buffer += chunk;

    if (this.buffer.includes('[ALL_DONE]')) {
      this.stop();
      return;
    }

    if (this.buffer.includes('[PAUSE_FOR_APPROVAL]')) {
      this.pause();
      return;
    }

    const progressMatch = this.buffer.match(/\[PROGRESS\]\s*(\d+)%/);
    if (progressMatch) {
      const progress = parseInt(progressMatch[1], 10);
      this.updateStatus({ progress });
    }

    const stepMatch = this.buffer.match(/\[STEP\]\s*(.+?)(?:\n|$)/);
    if (stepMatch) {
      this.updateStatus({ step: stepMatch[1].trim() });
    }

    const blocks = this.parseFileBlocks(this.buffer);

    for (const block of blocks) {
      await this.applyFileBlock(block);
      this.buffer = this.buffer.replace(
        new RegExp(
          `FILE:\\s*${block.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\`\`\`${block.language}[\\s\\S]*?\`\`\``,
          'i'
        ),
        ''
      );
    }
  }

  private parseFileBlocks(text: string): ParsedFileBlock[] {
    const blocks: ParsedFileBlock[] = [];
    const fileRegex = /FILE:\s*([^\n\r]+)\s*\n```(\w+)?\s*\n([\s\S]*?)```/gi;

    let match;
    while ((match = fileRegex.exec(text)) !== null) {
      blocks.push({
        name: match[1].trim(),
        language: match[2] || 'plaintext',
        content: match[3],
      });
    }

    return blocks;
  }

  private async applyFileBlock(block: ParsedFileBlock): Promise<void> {
    try {
      const file = fileManager.update(block.name, block.content);
      this.monaco.updateFile(block.name, block.content);

      this.status.filesWritten++;
      this.updateStatus({
        filesWritten: this.status.filesWritten,
        progress: Math.min(95, this.status.filesWritten * 10),
        step: `Created ${block.name}`,
      });

      if (this.onFileCreated) {
        this.onFileCreated(file);
      }

      snapshotManager.saveSnapshot(`Created ${block.name}`);
    } catch (error) {
      console.error('[Orchestrator] Error applying file block:', error);
    }
  }

  pause(): void {
    this.updateStatus({ paused: true, step: 'Paused' });
  }

  resume(): void {
    this.updateStatus({ paused: false, step: 'Resumed' });
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.updateStatus({
      active: false,
      paused: false,
      step: 'Stopped',
    });
  }

  isRunning(): boolean {
    return this.status.active && !this.status.paused;
  }

  private updateStatus(updates: Partial<OrchestratorStatus>): void {
    this.status = { ...this.status, ...updates };

    if (this.onStatusChange) {
      this.onStatusChange(this.status);
    }
  }

  getStatus(): OrchestratorStatus {
    return { ...this.status };
  }
}
