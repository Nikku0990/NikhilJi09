import type { FileData } from './monacoAdapter';

type FileChangeListener = (files: FileData[]) => void;

export class FileManager {
  private files: FileData[] = [];
  private listeners: Set<FileChangeListener> = new Set();
  private storageKey = 'nikku_files_v3';

  constructor() {
    this.load();
  }

  load(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.files = JSON.parse(stored);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('[FileManager] Load error:', error);
      this.files = [];
    }
  }

  save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.files));
      this.notifyListeners();
    } catch (error) {
      console.error('[FileManager] Save error:', error);
    }
  }

  list(): FileData[] {
    return [...this.files];
  }

  create(file: Omit<FileData, 'version' | 'createdAt' | 'updatedAt'>): FileData {
    const newFile: FileData = {
      ...file,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.files.push(newFile);
    this.save();
    return newFile;
  }

  read(name: string): FileData | null {
    return this.files.find((f) => f.name === name) ?? null;
  }

  update(name: string, content: string): FileData {
    const existingFile = this.files.find((f) => f.name === name);

    if (existingFile) {
      existingFile.content = content;
      existingFile.version++;
      existingFile.updatedAt = Date.now();
      this.save();
      return existingFile;
    } else {
      return this.create({ name, content });
    }
  }

  delete(name: string): void {
    this.files = this.files.filter((f) => f.name !== name);
    this.save();
  }

  rename(oldName: string, newName: string): boolean {
    const file = this.files.find((f) => f.name === oldName);
    if (!file) return false;

    if (this.files.some((f) => f.name === newName)) {
      console.warn(`[FileManager] File already exists: ${newName}`);
      return false;
    }

    file.name = newName;
    file.updatedAt = Date.now();
    this.save();
    return true;
  }

  exists(name: string): boolean {
    return this.files.some((f) => f.name === name);
  }

  clear(): void {
    this.files = [];
    this.save();
  }

  bulkUpdate(files: FileData[]): void {
    files.forEach((file) => {
      const existing = this.files.find((f) => f.name === file.name);
      if (existing) {
        existing.content = file.content;
        existing.version++;
        existing.updatedAt = Date.now();
      } else {
        this.files.push({
          ...file,
          version: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    });
    this.save();
  }

  onChange(listener: FileChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const filesCopy = [...this.files];
    this.listeners.forEach((listener) => {
      try {
        listener(filesCopy);
      } catch (error) {
        console.error('[FileManager] Listener error:', error);
      }
    });
  }

  getStats() {
    return {
      totalFiles: this.files.length,
      totalSize: this.files.reduce((sum, f) => sum + f.content.length, 0),
      lastModified: Math.max(...this.files.map((f) => f.updatedAt), 0),
    };
  }

  search(query: string): FileData[] {
    const lowerQuery = query.toLowerCase();
    return this.files.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.content.toLowerCase().includes(lowerQuery)
    );
  }

  export(): string {
    return JSON.stringify(this.files, null, 2);
  }

  import(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) return false;

      this.files = imported;
      this.save();
      return true;
    } catch (error) {
      console.error('[FileManager] Import error:', error);
      return false;
    }
  }
}

export const fileManager = new FileManager();
