import React, { useState, useEffect } from 'react';
import { Camera, RotateCcw, Trash2, Download, Upload, Clock, FileText, GitBranch } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { snapshotManager } from '../engine/snapshotManager';
import { toast } from 'react-toastify';

interface Snapshot {
  id: string;
  timestamp: number;
  message: string;
  files: any[];
  filesCount: number;
  totalSize: number;
}

const SnapshotManager: React.FC = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [diffData, setDiffData] = useState<any>(null);
  const { files, addMessage, currentSessionId } = useAppStore();

  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = () => {
    const allSnapshots = snapshotManager.list();
    setSnapshots(allSnapshots);
  };

  const createSnapshot = () => {
    const message = prompt('Snapshot description:', `Snapshot ${new Date().toLocaleString()}`);
    if (!message) return;

    const snapshot = snapshotManager.saveSnapshot(message);
    loadSnapshots();
    
    toast.success(`📸 Snapshot created: ${message}`);
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `📸 **Snapshot Created Successfully!**\n\n🏷️ **Name:** ${message}\n📁 **Files:** ${snapshot.filesCount}\n💾 **Size:** ${(snapshot.totalSize / 1024).toFixed(1)}KB\n⏰ **Time:** ${new Date(snapshot.timestamp).toLocaleString()}\n\n✨ **Your project state has been saved!**`,
      timestamp: Date.now(),
    });
  };

  const restoreSnapshot = (snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return;

    if (confirm(`Restore to snapshot: "${snapshot.message}"?\n\nThis will replace your current files.`)) {
      const success = snapshotManager.restore(snapshotId);
      
      if (success) {
        loadSnapshots();
        toast.success(`🔄 Restored to: ${snapshot.message}`);
        
        addMessage(currentSessionId, {
          role: 'assistant',
          content: `🔄 **Snapshot Restored Successfully!**\n\n📸 **Restored:** ${snapshot.message}\n📁 **Files:** ${snapshot.filesCount}\n⏰ **From:** ${new Date(snapshot.timestamp).toLocaleString()}\n\n✨ **Your project has been restored to this point in time!**`,
          timestamp: Date.now(),
        });
        
        // Reload the page to reflect changes
        window.location.reload();
      } else {
        toast.error('❌ Failed to restore snapshot');
      }
    }
  };

  const deleteSnapshot = (snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return;

    if (confirm(`Delete snapshot: "${snapshot.message}"?`)) {
      snapshotManager.delete(snapshotId);
      loadSnapshots();
      toast.success('🗑️ Snapshot deleted');
    }
  };

  const exportSnapshot = (snapshotId: string) => {
    const exportData = snapshotManager.export(snapshotId);
    if (!exportData) return;

    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapshot-${snapshotId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('📥 Snapshot exported');
  };

  const importSnapshot = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const success = snapshotManager.import(e.target?.result as string);
            if (success) {
              loadSnapshots();
              toast.success('📤 Snapshot imported successfully!');
            } else {
              toast.error('❌ Failed to import snapshot');
            }
          } catch (error) {
            toast.error('❌ Invalid snapshot file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const compareSnapshots = (id1: string, id2: string) => {
    const diff = snapshotManager.compare(id1, id2);
    setDiffData(diff);
    setShowDiff(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-[var(--acc1)]" />
        <h3 className="text-lg font-bold text-white">Snapshot Manager</h3>
        <div className="ml-auto text-xs text-[var(--muted)]">
          Time Travel for Code
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={createSnapshot}
          className="flex-1 bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Create Snapshot
        </button>
        <button
          onClick={importSnapshot}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* Snapshots List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {snapshots.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted)]">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No snapshots yet</p>
            <p className="text-xs mt-1">Create your first snapshot to save project state</p>
          </div>
        ) : (
          snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedSnapshot === snapshot.id
                  ? 'bg-[var(--acc1)]/20 border-[var(--acc1)]/30'
                  : 'bg-[#14183f] border-white/8 hover:border-white/15'
              }`}
              onClick={() => setSelectedSnapshot(selectedSnapshot === snapshot.id ? null : snapshot.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{snapshot.message}</div>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {snapshot.filesCount} files
                    </span>
                    <span>{formatFileSize(snapshot.totalSize)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(snapshot.timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreSnapshot(snapshot.id);
                    }}
                    className="p-1 hover:bg-green-500/20 rounded transition-colors"
                    title="Restore snapshot"
                  >
                    <RotateCcw className="w-3 h-3 text-green-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportSnapshot(snapshot.id);
                    }}
                    className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                    title="Export snapshot"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSnapshot(snapshot.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete snapshot"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
              
              {selectedSnapshot === snapshot.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-[var(--muted)]">
                    <div>Created: {new Date(snapshot.timestamp).toLocaleString()}</div>
                    <div>ID: {snapshot.id}</div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => restoreSnapshot(snapshot.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                    {snapshots.length > 1 && (
                      <button
                        onClick={() => {
                          const otherSnapshot = snapshots.find(s => s.id !== snapshot.id);
                          if (otherSnapshot) {
                            compareSnapshots(snapshot.id, otherSnapshot.id);
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                      >
                        <GitBranch className="w-3 h-3" />
                        Compare
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Diff Modal */}
      {showDiff && diffData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDiff(false)}
          />
          <div className="relative bg-[var(--card)] border border-white/10 rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold text-white mb-4">Snapshot Comparison</h3>
            
            <div className="space-y-4">
              {diffData.added.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <h4 className="text-green-400 font-semibold mb-2">Added Files ({diffData.added.length})</h4>
                  <div className="text-sm text-green-100 space-y-1">
                    {diffData.added.map((file: string) => (
                      <div key={file}>+ {file}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {diffData.removed.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <h4 className="text-red-400 font-semibold mb-2">Removed Files ({diffData.removed.length})</h4>
                  <div className="text-sm text-red-100 space-y-1">
                    {diffData.removed.map((file: string) => (
                      <div key={file}>- {file}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {diffData.modified.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <h4 className="text-yellow-400 font-semibold mb-2">Modified Files ({diffData.modified.length})</h4>
                  <div className="text-sm text-yellow-100 space-y-1">
                    {diffData.modified.map((file: string) => (
                      <div key={file}>~ {file}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowDiff(false)}
              className="mt-4 w-full bg-[var(--acc1)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 p-3 bg-[#1a1e3f] rounded-lg">
        <div className="text-xs text-[var(--muted)] space-y-1">
          <div className="flex justify-between">
            <span>Total Snapshots:</span>
            <span className="text-white">{snapshots.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Files:</span>
            <span className="text-white">{files.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Used:</span>
            <span className="text-white">
              {formatFileSize(snapshots.reduce((sum, s) => sum + s.totalSize, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotManager;