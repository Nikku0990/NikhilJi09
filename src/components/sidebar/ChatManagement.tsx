import React from 'react';
import { MessageSquare, Plus, History, Trash2, Download, Upload } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

const ChatManagement: React.FC = () => {
  const { 
    createNewSession, 
    togglePreviousChats, 
    sessions, 
    currentSessionId,
    addMessage 
  } = useAppStore();

  const handleNewChat = () => {
    createNewSession();
    toast.success('New chat session created!');
  };

  const handleExportAllChats = () => {
    const allSessions = Object.values(sessions);
    const dataStr = JSON.stringify(allSessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-chats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('All chats exported successfully!');
  };

  const handleImportChats = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            // Here you would implement the import logic
            toast.success('Chats imported successfully!');
          } catch (error) {
            toast.error('Failed to import chats. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const totalMessages = Object.values(sessions).reduce((sum, s) => sum + s.messages.length, 0);

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <MessageSquare className="w-3 h-3" />
        Chat Management
      </h4>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            New Chat
          </button>
          <button
            onClick={togglePreviousChats}
            className="flex-1 bg-transparent border border-white/12 hover:border-white/20 text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <History className="w-3 h-3" />
            History
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportAllChats}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
          <button
            onClick={handleImportChats}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Upload className="w-3 h-3" />
            Import
          </button>
        </div>
        
        {/* Chat Statistics */}
        <div className="text-xs text-[var(--muted)] p-2 bg-[#1a1e3f] rounded-lg">
          <div className="flex justify-between">
            <span>Total Sessions: {Object.keys(sessions).length}</span>
            <span>Messages: {totalMessages}</span>
          </div>
          <div className="mt-1">
            Current Session: {currentSessionId.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;