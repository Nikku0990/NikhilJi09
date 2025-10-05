import type { ChatMessage } from '../types';

export interface APIConfig {
  engine: 'openrouter' | 'ollama' | 'custom';
  baseUrl: string;
  apiKey?: string;
  model: string;
}

export class ApiClient {
  private cfg: APIConfig;

  constructor(cfg: APIConfig) {
    this.cfg = cfg;
  }

  setConfig(cfg: Partial<APIConfig>) {
    this.cfg = { ...this.cfg, ...cfg };
  }

  getConfig() {
    return { ...this.cfg };
  }

  async callSingle(system: string, user: string, opts: any = {}): Promise<string> {
    const base = this.cfg.baseUrl.replace(/\/$/, '');
    const url = this.cfg.engine === 'ollama' ? `${base}/chat` : `${base}/chat/completions`;
    const payload = this.makePayload(system, user, opts);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (this.cfg.engine === 'openrouter' && this.cfg.apiKey) {
      headers['Authorization'] = `Bearer ${this.cfg.apiKey}`;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error (${res.status}): ${errorText}`);
      }

      const json = await res.json();
      return this.extractText(json);
    } catch (error) {
      console.error('[ApiClient] callSingle error:', error);
      throw error;
    }
  }

  async callStream(
    system: string,
    messages: ChatMessage[],
    handlers: {
      onChunk: (text: string) => Promise<void> | void;
      onComplete?: () => void;
      onError?: (error: Error) => void;
      signal?: AbortSignal;
    }
  ) {
    const base = this.cfg.baseUrl.replace(/\/$/, '');
    const url = this.cfg.engine === 'ollama' ? `${base}/chat` : `${base}/chat/completions`;

    const payload =
      this.cfg.engine === 'ollama'
        ? {
            model: this.cfg.model,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          }
        : {
            model: this.cfg.model,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            stream: true,
            temperature: 0.2,
            max_tokens: 2000,
          };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.cfg.engine === 'openrouter' && this.cfg.apiKey) {
      headers['Authorization'] = `Bearer ${this.cfg.apiKey}`;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: handlers.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error (${res.status}): ${errorText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n/);
        buffer = parts.pop() || '';

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed) continue;

          let raw = trimmed;
          if (raw.startsWith('data:')) {
            raw = raw.slice(5).trim();
          }

          if (raw === '[DONE]') {
            handlers.onComplete?.();
            return;
          }

          try {
            const json = JSON.parse(raw);
            const text =
              json.choices?.[0]?.delta?.content ||
              json.choices?.[0]?.message?.content ||
              json.choices?.[0]?.text ||
              json.message?.content;

            if (text) {
              await handlers.onChunk(text);
            }
          } catch (e) {
            if (raw) await handlers.onChunk(raw);
          }
        }
      }

      if (buffer.trim()) {
        await handlers.onChunk(buffer);
      }

      handlers.onComplete?.();
    } catch (error) {
      console.error('[ApiClient] callStream error:', error);
      handlers.onError?.(error as Error);
      throw error;
    }
  }

  private makePayload(system: string, user: string, opts: any) {
    if (this.cfg.engine === 'ollama') {
      return {
        model: this.cfg.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      };
    }

    return {
      model: this.cfg.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.max_tokens ?? 2000,
    };
  }

  private extractText(json: any): string {
    return (
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.text ||
      json.message?.content ||
      json.output ||
      JSON.stringify(json)
    );
  }
}
