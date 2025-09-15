import React from 'react';
import { X, MessageSquare, Clock, Trash2, Edit3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

const PreviousChatsDrawer: React.FC = () => {
  const { 
    showPreviousChats, 
    togglePreviousChats, 
    sessions, 
    currentSessionId,
    setCurrentSession,
    deleteSession 
  } = useAppStore();

  if (!showPreviousChats) return null;

  const sortedSessions = Object.values(sessions)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const handleLoadSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    togglePreviousChats();
    toast.success('Session loaded successfully!');
  };

  const handleDeleteSession = (sessionId: string, sessionTitle: string) => {
    if (confirm(`Are you sure you want to delete "${sessionTitle}"?`)) {
      deleteSession(sessionId);
      toast.success('Session deleted successfully!');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/45 backdrop-blur-sm"
        onClick={togglePreviousChats}
      />
      
      {/* Previous Chats Panel */}
      <div className="w-96 bg-[#0c102b] border-l border-white/8 p-4 overflow-y-auto custom-scrollbar slide-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            🗂️ Previous Chats
          </h3>
          <button
            onClick={togglePreviousChats}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--muted)] hover:text-white" />
          </button>
        </div>
        
        {sortedSessions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--muted)] text-sm">No previous chats yet</p>
            <p className="text-xs text-[var(--muted)] mt-1">Start a conversation to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] group ${
                  session.id === currentSessionId
                    ? 'bg-[var(--acc1)]/20 border-[var(--acc1)]/30'
                    : 'bg-[#14183f] border-white/8 hover:border-white/15'
                }`}
                onClick={() => handleLoadSession(session.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm leading-tight">
                    {session.title}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id, session.title);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                      title="Delete session"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[var(--muted)]">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.updatedAt)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--muted)]">
                      {session.messages.length} messages
                    </span>
                    <span className="px-2 py-0.5 bg-[#222651] rounded-full text-[var(--muted)]">
                      {session.id.slice(0, 6)}
                    </span>
                  </div>
                </div>
                
                {/* Preview of last message */}
                {session.messages.length > 0 && (
                  <div className="mt-2 text-xs text-[var(--muted)] line-clamp-2">
                    {session.messages[session.messages.length - 1].content.slice(0, 100)}
                    {session.messages[session.messages.length - 1].content.length > 100 && '...'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-6 p-4 bg-[var(--card)] rounded-xl border border-white/6">
          <h4 className="text-sm font-semibold text-white mb-2">Chat Statistics</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[var(--muted)]">Total Chats</div>
              <div className="text-white font-bold text-lg">{sortedSessions.length}</div>
            </div>
            <div>
              <div className="text-[var(--muted)]">Total Messages</div>
              <div className="text-white font-bold text-lg">
                {sortedSessions.reduce((sum, s) => sum + s.messages.length, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousChatsDrawer;