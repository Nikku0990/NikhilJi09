// Enhanced File Manager with Monaco Integration
// Based on the provided scripts but upgraded for our project

export interface FileItem {
  name: string;
  content: string;
  language?: string;
  lastModified: number;
  size?: number;
  type?: 'file' | 'folder';
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'rename';
  path: string;
  oldContent?: string;
  newContent?: string;
  timestamp: number;
}

class EnhancedFileManager {
  private files = new Map<string, FileItem>();
  private listeners: ((op: FileOperation) => void)[] = [];
  private undoStack: (() => Promise<void>)[] = [];
  private redoStack: (() => Promise<void>)[] = [];

  constructor(initialFiles?: FileItem[]) {
    if (initialFiles) {
      initialFiles.forEach(file => this.files.set(file.name, file));
    }
  }

  // Core file operations
  async createFile(name: string, content: string = '', language?: string): Promise<FileItem> {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid file name');
    }
    
    if (this.files.has(name)) {
      throw new Error('File already exists');
    }

    const file: FileItem = {
      name,
      content: String(content || ''),
      language: language || this.guessLanguageFromName(name),
      lastModified: Date.now(),
      size: content.length,
      type: 'file'
    };

    this.files.set(name, file);
    
    // Add to undo stack
    this.addToUndoStack(async () => {
      this.files.delete(name);
      this.emit({ type: 'delete', path: name, timestamp: Date.now() });
    });

    this.emit({ 
      type: 'create', 
      path: name, 
      newContent: content,
      timestamp: Date.now() 
    });

    return file;
  }

  async updateFile(name: string, content: string): Promise<FileItem> {
    const existingFile = this.files.get(name);
    if (!existingFile) {
      throw new Error('File not found');
    }

    const oldContent = existingFile.content;
    const updatedFile: FileItem = {
      ...existingFile,
      content: String(content || ''),
      lastModified: Date.now(),
      size: content.length
    };

    this.files.set(name, updatedFile);

    // Add to undo stack
    this.addToUndoStack(async () => {
      const file = this.files.get(name);
      if (file) {
        file.content = oldContent;
        file.lastModified = Date.now();
        this.files.set(name, file);
        this.emit({ type: 'update', path: name, newContent: oldContent, timestamp: Date.now() });
      }
    });

    this.emit({ 
      type: 'update', 
      path: name, 
      oldContent,
      newContent: content,
      timestamp: Date.now() 
    });

    return updatedFile;
  }

  async deleteFile(name: string): Promise<boolean> {
    const file = this.files.get(name);
    if (!file) {
      throw new Error('File not found');
    }

    this.files.delete(name);

    // Add to undo stack
    this.addToUndoStack(async () => {
      this.files.set(name, file);
      this.emit({ type: 'create', path: name, newContent: file.content, timestamp: Date.now() });
    });

    this.emit({ 
      type: 'delete', 
      path: name, 
      oldContent: file.content,
      timestamp: Date.now() 
    });

    return true;
  }

  async renameFile(oldName: string, newName: string): Promise<FileItem> {
    if (!oldName || !newName) {
      throw new Error('Provide old and new names');
    }

    const file = this.files.get(oldName);
    if (!file) {
      throw new Error('File not found');
    }

    if (this.files.has(newName)) {
      throw new Error('Target name already exists');
    }

    const updatedFile: FileItem = {
      ...file,
      name: newName,
      language: this.guessLanguageFromName(newName),
      lastModified: Date.now()
    };

    this.files.delete(oldName);
    this.files.set(newName, updatedFile);

    // Add to undo stack
    this.addToUndoStack(async () => {
      this.files.delete(newName);
      this.files.set(oldName, { ...updatedFile, name: oldName });
      this.emit({ type: 'rename', path: oldName, timestamp: Date.now() });
    });

    this.emit({ 
      type: 'rename', 
      path: newName, 
      oldContent: oldName,
      newContent: newName,
      timestamp: Date.now() 
    });

    return updatedFile;
  }

  // Utility methods
  getFile(name: string): FileItem | null {
    return this.files.get(name) || null;
  }

  listFiles(): FileItem[] {
    return Array.from(this.files.values()).sort((a, b) => b.lastModified - a.lastModified);
  }

  searchFiles(query: string): FileItem[] {
    const lowerQuery = query.toLowerCase();
    return this.listFiles().filter(file => 
      file.name.toLowerCase().includes(lowerQuery) ||
      file.content.toLowerCase().includes(lowerQuery)
    );
  }

  getFilesByLanguage(language: string): FileItem[] {
    return this.listFiles().filter(file => file.language === language);
  }

  getTotalSize(): number {
    return Array.from(this.files.values()).reduce((total, file) => total + (file.size || 0), 0);
  }

  // Language detection
  private guessLanguageFromName(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'dockerfile': 'dockerfile',
    };
    
    return languageMap[ext || ''] || 'plaintext';
  }

  // Syntax checking
  async runSyntaxCheck(name: string): Promise<{ ok: boolean; errors: Array<{ message: string; line?: number }> }> {
    const file = this.files.get(name);
    if (!file) {
      throw new Error('File not found');
    }

    const errors: Array<{ message: string; line?: number }> = [];
    const code = file.content;
    const language = file.language || 'plaintext';

    try {
      if (language === 'javascript' || language === 'typescript') {
        // Basic syntax check using Function constructor
        try {
          new Function(code);
        } catch (e: any) {
          errors.push({ 
            message: e.message || 'Syntax error', 
            line: this.extractLineFromError(e) 
          });
        }
      } else if (language === 'json') {
        try {
          JSON.parse(code);
        } catch (e: any) {
          errors.push({ message: e.message || 'Invalid JSON' });
        }
      } else if (language === 'html') {
        // Basic tag balance check
        const openTags = (code.match(/<([a-zA-Z]+)(\s|>)/g) || [])
          .map(s => s.replace(/<|(\s.*)/g, ''));
        const closeTags = (code.match(/<\/([a-zA-Z]+)>/g) || [])
          .map(s => s.replace(/<\/|>/g, ''));
        const unmatched = openTags.filter(t => !closeTags.includes(t));
        
        if (unmatched.length) {
          errors.push({ 
            message: 'Possible unclosed tags: ' + Array.from(new Set(unmatched)).slice(0, 5).join(', ') 
          });
        }
      } else if (language === 'css') {
        // Check braces balance
        const opens = (code.match(/{/g) || []).length;
        const closes = (code.match(/}/g) || []).length;
        if (opens !== closes) {
          errors.push({ 
            message: `Mismatched braces: { = ${opens}, } = ${closes}` 
          });
        }
      }
    } catch (e: any) {
      errors.push({ message: String(e.message || e) });
    }

    return { ok: errors.length === 0, errors };
  }

  private extractLineFromError(e: any): number {
    if (!e || !e.stack) return 1;
    const match = e.stack.match(/<anonymous>:(\d+):(\d+)/) || 
                  e.stack.match(/eval.*:(\d+):(\d+)/) || 
                  e.stack.match(/:(\d+):\d+\)?\s*$/);
    if (match && match[1]) return Number(match[1]);
    return 1;
  }

  // Event system
  on(listener: (op: FileOperation) => void): void {
    this.listeners.push(listener);
  }

  off(listener: (op: FileOperation) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private emit(operation: FileOperation): void {
    this.listeners.forEach(listener => {
      try {
        listener(operation);
      } catch (e) {
        console.error('File operation listener error:', e);
      }
    });
  }

  // Undo/Redo system
  private addToUndoStack(undoFn: () => Promise<void>): void {
    this.undoStack.push(undoFn);
    this.redoStack = []; // Clear redo stack when new operation is performed
    
    // Limit undo stack size
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  async undo(): Promise<boolean> {
    const undoFn = this.undoStack.pop();
    if (!undoFn) return false;

    try {
      await undoFn();
      return true;
    } catch (e) {
      console.error('Undo operation failed:', e);
      return false;
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // Export/Import
  exportProject(): string {
    const projectData = {
      name: 'NikkuAi09 Project',
      version: '1.0.0',
      files: Array.from(this.files.values()),
      exportedAt: Date.now(),
      totalFiles: this.files.size,
      totalSize: this.getTotalSize()
    };

    return JSON.stringify(projectData, null, 2);
  }

  async importProject(jsonData: string): Promise<number> {
    try {
      const projectData = JSON.parse(jsonData);
      let importedCount = 0;

      if (projectData.files && Array.isArray(projectData.files)) {
        for (const fileData of projectData.files) {
          if (fileData.name && typeof fileData.content === 'string') {
            await this.createFile(fileData.name, fileData.content, fileData.language);
            importedCount++;
          }
        }
      }

      return importedCount;
    } catch (e) {
      throw new Error('Invalid project file format');
    }
  }

  // Advanced features
  async batchOperation(operations: Array<() => Promise<void>>): Promise<void> {
    const undoOperations: (() => Promise<void>)[] = [];
    
    try {
      for (const operation of operations) {
        await operation();
      }
    } catch (e) {
      // Rollback all operations
      for (const undoOp of undoOperations.reverse()) {
        try {
          await undoOp();
        } catch (undoError) {
          console.error('Rollback failed:', undoError);
        }
      }
      throw e;
    }
  }

  // File templates
  getFileTemplate(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const templates: Record<string, string> = {
      'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName.replace('.html', '')}</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
      'css': `/* Styles for ${fileName} */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}`,
      'js': `// JavaScript file: ${fileName}
console.log("Hello from ${fileName}");`,
      'ts': `// TypeScript file: ${fileName}
interface Example {
    message: string;
}

const example: Example = {
    message: "Hello TypeScript!"
};

console.log(example.message);`,
      'jsx': `import React from 'react';

const Component = () => {
    return (
        <div>
            <h1>Hello from ${fileName}</h1>
        </div>
    );
};

export default Component;`,
      'tsx': `import React from 'react';

interface Props {
    title?: string;
}

const Component: React.FC<Props> = ({ title = "Hello" }) => {
    return (
        <div>
            <h1>{title} from ${fileName}</h1>
        </div>
    );
};

export default Component;`,
      'py': `# Python file: ${fileName}
def main():
    print("Hello from ${fileName}")

if __name__ == "__main__":
    main()`,
      'json': `{
  "name": "${fileName.replace('.json', '')}",
  "version": "1.0.0",
  "description": ""
}`,
    };
    
    return templates[ext || ''] || `// New file: ${fileName}\n`;
  }

  // Statistics
  getStatistics() {
    const files = this.listFiles();
    const languageStats = files.reduce((acc, file) => {
      const lang = file.language || 'unknown';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: files.length,
      totalSize: this.getTotalSize(),
      languageDistribution: languageStats,
      lastModified: Math.max(...files.map(f => f.lastModified), 0),
      averageFileSize: files.length > 0 ? this.getTotalSize() / files.length : 0
    };
  }
}

// Global instance
export const fileManager = new EnhancedFileManager();

// Monaco integration helpers
export const monacoIntegration = {
  async moveCodeToEditor(name: string, code: string, options: {
    language?: string;
    setCursorToEnd?: boolean;
    check?: boolean;
  } = {}): Promise<{ ok: boolean; errors?: any[] }> {
    try {
      // Create or update file
      const existingFile = fileManager.getFile(name);
      if (existingFile) {
        await fileManager.updateFile(name, code);
      } else {
        await fileManager.createFile(name, code, options.language);
      }

      // Run syntax check if requested
      if (options.check !== false) {
        return await fileManager.runSyntaxCheck(name);
      }

      return { ok: true };
    } catch (error) {
      console.error('Move code to editor failed:', error);
      return { ok: false, errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }] };
    }
  },

  async createFileWithTemplate(name: string, template?: string): Promise<FileItem> {
    const content = template || fileManager.getFileTemplate(name);
    return await fileManager.createFile(name, content);
  },

  async batchCreateFiles(files: Array<{ name: string; content: string; language?: string }>): Promise<FileItem[]> {
    const createdFiles: FileItem[] = [];
    
    for (const fileData of files) {
      try {
        const file = await fileManager.createFile(fileData.name, fileData.content, fileData.language);
        createdFiles.push(file);
      } catch (error) {
        console.error(`Failed to create file ${fileData.name}:`, error);
      }
    }

    return createdFiles;
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).NikkuFileManager = fileManager;
  (window as any).NikkuMonacoAPI = monacoIntegration;
}