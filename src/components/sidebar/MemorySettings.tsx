import React from 'react';
import { Brain, Save, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const MemorySettings: React.FC = () => {
  const { userMemory, updateUserMemory, addMessage, currentSessionId } = useAppStore();

  const handleSave = () => {
    addMessage(currentSessionId, {
      role: 'assistant',
      content: '🧠 Memory saved successfully!',
      timestamp: Date.now(),
    });
  };

  const handleClear = () => {
    updateUserMemory({
      name: '',
      about: '',
      preferences: [],
      projects: [],
    });
    addMessage(currentSessionId, {
      role: 'assistant',
      content: '🧽 Memory cleared successfully!',
      timestamp: Date.now(),
    });
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <Brain className="w-3 h-3" />
        AI Memory
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">User Name</label>
          <input
            type="text"
            value={userMemory.name}
            onChange={(e) => updateUserMemory({ name: e.target.value })}
            placeholder="Your name (e.g., Nikku)"
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">About You / Goals</label>
          <textarea
            value={userMemory.about}
            onChange={(e) => updateUserMemory({ about: e.target.value })}
            placeholder="Your goals, style, projects…"
            rows={3}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors resize-none"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-transparent border border-white/12 hover:border-white/20 text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
        
        <div className="text-xs text-[var(--muted)]">
          Memory is injected into the system prompt for Agent mode.
        </div>
      </div>
    </div>
  );
};

export default MemorySettings;