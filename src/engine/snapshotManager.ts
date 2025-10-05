import { fileManager } from './fileManager';
import type { FileData } from './monacoAdapter';

export interface Snapshot {
  id: string;
  timestamp: number;
  message: string;
  files: FileData[];
  filesCount: number;
  totalSize: number;
}

export class SnapshotManager {
  private storageKey = 'nikku_snapshots_v1';
  private maxSnapshots = 50;

  saveSnapshot(message: string): Snapshot {
    const snapshots = this.list();
    const files = fileManager.list();

    const snapshot: Snapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      message,
      files: JSON.parse(JSON.stringify(files)),
      filesCount: files.length,
      totalSize: files.reduce((sum, f) => sum + f.content.length, 0),
    };

    snapshots.push(snapshot);

    if (snapshots.length > this.maxSnapshots) {
      snapshots.shift();
    }

    this.saveToStorage(snapshots);
    return snapshot;
  }

  list(): Snapshot[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('[SnapshotManager] List error:', error);
      return [];
    }
  }

  get(id: string): Snapshot | null {
    const snapshots = this.list();
    return snapshots.find((s) => s.id === id) ?? null;
  }

  restore(id: string): boolean {
    const snapshot = this.get(id);
    if (!snapshot) {
      console.error('[SnapshotManager] Snapshot not found:', id);
      return false;
    }

    try {
      fileManager.clear();
      fileManager.bulkUpdate(snapshot.files);

      this.saveSnapshot(`Restored from: ${snapshot.message}`);

      return true;
    } catch (error) {
      console.error('[SnapshotManager] Restore error:', error);
      return false;
    }
  }

  delete(id: string): boolean {
    try {
      const snapshots = this.list();
      const filtered = snapshots.filter((s) => s.id !== id);

      if (filtered.length === snapshots.length) {
        return false;
      }

      this.saveToStorage(filtered);
      return true;
    } catch (error) {
      console.error('[SnapshotManager] Delete error:', error);
      return false;
    }
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  getLatest(): Snapshot | null {
    const snapshots = this.list();
    return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  }

  compare(id1: string, id2: string): {
    added: string[];
    removed: string[];
    modified: string[];
  } {
    const snap1 = this.get(id1);
    const snap2 = this.get(id2);

    if (!snap1 || !snap2) {
      return { added: [], removed: [], modified: [] };
    }

    const files1 = new Map(snap1.files.map((f) => [f.name, f]));
    const files2 = new Map(snap2.files.map((f) => [f.name, f]));

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    files2.forEach((file, name) => {
      if (!files1.has(name)) {
        added.push(name);
      } else if (files1.get(name)!.content !== file.content) {
        modified.push(name);
      }
    });

    files1.forEach((file, name) => {
      if (!files2.has(name)) {
        removed.push(name);
      }
    });

    return { added, removed, modified };
  }

  export(id: string): string | null {
    const snapshot = this.get(id);
    if (!snapshot) return null;
    return JSON.stringify(snapshot, null, 2);
  }

  import(jsonData: string): boolean {
    try {
      const snapshot: Snapshot = JSON.parse(jsonData);

      if (!snapshot.id || !snapshot.files || !Array.isArray(snapshot.files)) {
        console.error('[SnapshotManager] Invalid snapshot format');
        return false;
      }

      const snapshots = this.list();
      snapshots.push(snapshot);
      this.saveToStorage(snapshots);

      return true;
    } catch (error) {
      console.error('[SnapshotManager] Import error:', error);
      return false;
    }
  }

  getStats() {
    const snapshots = this.list();
    return {
      totalSnapshots: snapshots.length,
      oldestSnapshot: snapshots[0]?.timestamp ?? null,
      latestSnapshot: snapshots[snapshots.length - 1]?.timestamp ?? null,
      totalSize: snapshots.reduce((sum, s) => sum + s.totalSize, 0),
    };
  }

  private saveToStorage(snapshots: Snapshot[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(snapshots));
    } catch (error) {
      console.error('[SnapshotManager] Save to storage error:', error);
    }
  }
}

export const snapshotManager = new SnapshotManager();
