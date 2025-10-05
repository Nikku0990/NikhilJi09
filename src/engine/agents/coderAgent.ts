import { ApiClient } from '../apiClient';
import { AGENT_PROMPTS, TEMPLATES } from '../prompts';
import type { ChatMessage } from '../../types';

export class CoderAgent {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async produceFiles(task: string, context?: string): Promise<string> {
    const prompt = context
      ? `Task: ${task}\n\nContext:\n${context}\n\nGenerate files using FILE: markers with fenced code blocks.`
      : `Task: ${task}\n\nGenerate files using FILE: markers with fenced code blocks.`;

    return await this.api.callSingle(AGENT_PROMPTS.CODER, prompt, {
      temperature: 0.2,
      max_tokens: 3000,
    });
  }

  async explainCode(code: string): Promise<string> {
    return await this.api.callSingle(AGENT_PROMPTS.CODER, TEMPLATES.EXPLAIN_CODE(code));
  }

  async refactorCode(code: string, target: string): Promise<string> {
    return await this.api.callSingle(
      AGENT_PROMPTS.CODER,
      TEMPLATES.REFACTOR_CODE(code, target),
      { temperature: 0.2 }
    );
  }

  async optimizeCode(code: string): Promise<string> {
    return await this.api.callSingle(AGENT_PROMPTS.CODER, TEMPLATES.OPTIMIZE_CODE(code), {
      temperature: 0.2,
    });
  }

  async fixCode(filename: string, content: string, error: string): Promise<string> {
    return await this.api.callSingle(
      AGENT_PROMPTS.CODER,
      TEMPLATES.FIX_FILE(filename, content, error),
      { temperature: 0.1 }
    );
  }

  async addFeature(feature: string, existingCode: string): Promise<string> {
    return await this.api.callSingle(
      AGENT_PROMPTS.CODER,
      TEMPLATES.ADD_FEATURE(feature, existingCode),
      { temperature: 0.2 }
    );
  }

  async streamProduceFiles(
    task: string,
    context: string | undefined,
    handlers: {
      onChunk: (chunk: string) => void;
      onComplete?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    const prompt = context
      ? `Task: ${task}\n\nContext:\n${context}\n\nGenerate files using FILE: markers.`
      : `Task: ${task}\n\nGenerate files using FILE: markers.`;

    const messages: ChatMessage[] = [
      { id: '1', role: 'system', content: AGENT_PROMPTS.CODER, time: Date.now() },
      { id: '2', role: 'user', content: prompt, time: Date.now() },
    ];

    await this.api.callStream(AGENT_PROMPTS.CODER, messages, handlers);
  }
}
