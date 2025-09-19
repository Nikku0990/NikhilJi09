import React from 'react';
import { Code, MessageSquare, Bot, Cpu, Database, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const TopBar: React.FC = () => {
  const { 
    currentMode, 
    setMode, 
    settings, 
    currentSessionId, 
    toggleCodeArea,
    showCodeArea 
  } = useAppStore();

  const handleModeSwitch = (mode: 'agent' | 'chat') => {
    setMode(mode);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-gradient-to-r from-[var(--card)]/50 to-transparent backdrop-blur-sm relative z-10">
      {/* Status Pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 px-3 py-1 bg-[var(--card)] border border-white/12 rounded-full text-xs">
          <Database className="w-3 h-3 text-green-400" />
          <span className="text-[var(--muted)]">Base:</span>
          <span className="text-white font-medium">
            {settings.baseUrl ? (() => {
              try {
                return new URL(settings.baseUrl).hostname;
              } catch {
                return 'Invalid URL';
              }
            })() : '—'}
          </span>
        </div>
        
        <div className="flex items-center gap-1 px-3 py-1 bg-[var(--card)] border border-white/12 rounded-full text-xs">
          <Cpu className="w-3 h-3 text-blue-400" />
          <span className="text-[var(--muted)]">Model:</span>
          <span className="text-white font-medium">
            {settings.model.split('/')[1]?.split(':')[0] || settings.model}
          </span>
        </div>
        
        <div className="flex items-center gap-1 px-3 py-1 bg-[var(--card)] border border-white/12 rounded-full text-xs">
          <Activity className="w-3 h-3 text-purple-400" />
          <span className="text-[var(--muted)]">Session:</span>
          <span className="text-white font-medium">{currentSessionId.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Mode Toggle and Actions */}
      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <div className="flex gap-1 bg-[var(--card)] p-1 rounded-full border border-white/6">
          <button
            onClick={() => handleModeSwitch('agent')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              currentMode === 'agent'
                ? 'accent-gradient text-white shadow-lg'
                : 'text-[var(--muted)] hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Agent Mode
          </button>
          <button
            onClick={() => handleModeSwitch('chat')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              currentMode === 'chat'
                ? 'accent-gradient text-white shadow-lg'
                : 'text-[var(--muted)] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Mode
          </button>
        </div>

        {/* Code Editor Toggle */}
        <button
          onClick={toggleCodeArea}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
            showCodeArea
              ? 'bg-[var(--acc1)] text-white border-[var(--acc1)]'
              : 'bg-transparent text-[var(--muted)] border-white/12 hover:border-white/20 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          Code Editor
        </button>
      </div>
    </div>
  );
};

export default TopBar;