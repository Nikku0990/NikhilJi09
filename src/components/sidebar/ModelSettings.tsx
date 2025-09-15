import React, { useState } from 'react';
import { Brain, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const ModelSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [customModel, setCustomModel] = useState('');
  const [availableModels, setAvailableModels] = useState([
    'google/gemini-1.5-flash',
    'google/gemini-1.5-pro',
    'anthropic/claude-3-5-sonnet',
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'mistralai/mixtral-8x7b-instruct',
    'qwen/qwen2.5-72b-instruct',
    'meta-llama/llama-3.1-70b-instruct',
    'anthropic/claude-3-haiku',
    'deepseek/deepseek-r1-0528-qwen3-8b:free',
    'qwen/qwen3-coder:free',
  ]);

  const handleAddCustomModel = () => {
    if (!customModel.trim()) return;
    
    if (!availableModels.includes(customModel)) {
      setAvailableModels([...availableModels, customModel]);
      updateSettings({ model: customModel });
    }
    setCustomModel('');
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <Brain className="w-3 h-3" />
        Model Selection
      </h4>
      
      <div className="space-y-3">
        <div>
          <select
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value })}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model.includes(':free') 
                  ? `🆓 ${model.split('/')[1].split(':')[0]} (Free)` 
                  : `💎 ${model.split('/')[1] || model}`}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Add Custom Model ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="provider/model-id[:tag]"
              className="flex-1 bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
            />
            <button
              onClick={handleAddCustomModel}
              className="bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-[var(--muted)] p-2 bg-[#1a1e3f] rounded-lg">
          <div className="font-semibold mb-1">Selected Model:</div>
          <div className="text-white">{settings.model}</div>
        </div>
      </div>
    </div>
  );
};

export default ModelSettings;