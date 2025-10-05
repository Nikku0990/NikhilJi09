import type { editor } from 'monaco-editor';

export interface FileData {
  name: string;
  content: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class MonacoAdapter {
  private editorInstance: editor.IStandaloneCodeEditor | null = null;
  private models: Record<string, editor.ITextModel> = {};
  private currentFile: string | null = null;

  setEditor(editorInstance: editor.IStandaloneCodeEditor) {
    this.editorInstance = editorInstance;
  }

  createFile(file: FileData): void {
    if (!this.editorInstance) {
      console.warn('[MonacoAdapter] Editor not initialized');
      return;
    }

    const monaco = (window as any).monaco;
    if (!monaco) return;

    const uri = monaco.Uri.parse(`inmemory://model/${file.name}`);
    let model = monaco.editor.getModel(uri);

    if (!model) {
      model = monaco.editor.createModel(file.content, this.guessLanguage(file.name), uri);
    } else {
      model.setValue(file.content);
    }

    this.models[file.name] = model;
    this.editorInstance.setModel(model);
    this.currentFile = file.name;
  }

  openFile(name: string): void {
    if (!this.editorInstance) return;

    const model = this.models[name];
    if (model) {
      this.editorInstance.setModel(model);
      this.currentFile = name;
    } else {
      console.warn(`[MonacoAdapter] File not found: ${name}`);
    }
  }

  updateFile(name: string, content: string): void {
    const model = this.models[name];

    if (model) {
      const fullRange = model.getFullModelRange();
      model.pushEditOperations(
        [],
        [
          {
            range: fullRange,
            text: content,
          },
        ],
        () => null
      );
    } else {
      this.createFile({
        name,
        content,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }

  deleteFile(name: string): void {
    const model = this.models[name];
    if (model) {
      model.dispose();
      delete this.models[name];

      if (this.currentFile === name) {
        this.currentFile = null;
        this.editorInstance?.setModel(null);
      }
    }
  }

  getCurrentContent(): string {
    return this.editorInstance?.getModel()?.getValue() ?? '';
  }

  getCurrentFile(): string | null {
    return this.currentFile;
  }

  getSelection(): string {
    if (!this.editorInstance) return '';
    const selection = this.editorInstance.getSelection();
    if (!selection) return '';
    return this.editorInstance.getModel()?.getValueInRange(selection) ?? '';
  }

  insertAtCursor(text: string): void {
    if (!this.editorInstance) return;
    const position = this.editorInstance.getPosition();
    if (!position) return;

    this.editorInstance.executeEdits('', [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text,
      },
    ]);
  }

  replaceSelection(text: string): void {
    if (!this.editorInstance) return;
    const selection = this.editorInstance.getSelection();
    if (!selection) return;

    this.editorInstance.executeEdits('', [
      {
        range: selection,
        text,
      },
    ]);
  }

  getFileList(): string[] {
    return Object.keys(this.models);
  }

  hasFile(name: string): boolean {
    return name in this.models;
  }

  private guessLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();

    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      html: 'html',
      css: 'css',
      scss: 'scss',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rs: 'rust',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
    };

    return langMap[ext || ''] || 'plaintext';
  }

  dispose(): void {
    Object.values(this.models).forEach((model) => model.dispose());
    this.models = {};
    this.currentFile = null;
  }
}
