import React from 'react';
import { Key, Server, Save, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const ApiSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  const handleSave = () => {
    if (!settings.apiKey.trim()) {
      alert('⚠️ Please enter your API key!');
      return;
    }
    
    if (!settings.baseUrl.trim()) {
      alert('⚠️ Please enter a valid base URL!');
      return;
    }
    
    alert('✅ API settings saved successfully!');
  };

  const handleClear = () => {
    updateSettings({
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: '',
    });
    alert('🧹 API settings cleared!');
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <Server className="w-3 h-3" />
        API Settings
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
            <Server className="w-3 h-3" />
            Base URL
          </label>
          <input
            type="text"
            value={settings.baseUrl}
            onChange={(e) => updateSettings({ baseUrl: e.target.value })}
            placeholder="https://openrouter.ai/api/v1"
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
            <Key className="w-3 h-3" />
            API Key
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value })}
            placeholder="sk-or-v1-..."
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors font-mono"
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
        
        <div className="text-xs text-[var(--muted)] p-2 border border-dashed border-white/20 rounded-xl">
          🔒 Your key is stored locally in your browser.
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;