import React, { useState, useEffect } from 'react';
import { Key, Server, Save, Trash2, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

const ApiSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [showBaseUrlDropdown, setShowBaseUrlDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [modelSearchTerm, setModelSearchTerm] = useState('');

  const baseUrlOptions = [
    { 
      value: 'https://openrouter.ai/api/v1', 
      label: 'OpenRouter (Default)',
      models: [
        { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
        { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
        { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
        { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
        { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', provider: 'Mistral' },
        { id: 'qwen/qwen2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'Qwen' },
        { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta' },
        { id: 'deepseek/deepseek-r1-0528-qwen3-8b:free', name: 'DeepSeek R1 (Free)', provider: 'DeepSeek' },
      ]
    },
    { 
      value: 'https://api.anthropic.com/v1', 
      label: 'Claude (Anthropic)',
      models: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' },
      ]
    },
    { 
      value: 'https://api.openai.com/v1', 
      label: 'OpenAI',
      models: [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
        { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      ]
    },
    { 
      value: 'https://generativelanguage.googleapis.com/v1beta', 
      label: 'Gemini (Google)',
      models: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
        { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', provider: 'Google' },
      ]
    },
    { 
      value: 'http://localhost:11434/v1', 
      label: 'Ollama (Local)',
      models: [
        { id: 'llama3.2', name: 'Llama 3.2', provider: 'Meta' },
        { id: 'codellama', name: 'Code Llama', provider: 'Meta' },
        { id: 'mistral', name: 'Mistral 7B', provider: 'Mistral' },
        { id: 'qwen2.5', name: 'Qwen 2.5', provider: 'Qwen' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek' },
        { id: 'phi3', name: 'Phi-3', provider: 'Microsoft' },
      ]
    },
    { 
      value: 'custom', 
      label: 'Custom Endpoint',
      models: []
    }
  ];

  useEffect(() => {
    // Update available models when base URL changes
    const selectedProvider = baseUrlOptions.find(option => option.value === settings.baseUrl);
    if (selectedProvider) {
      setAvailableModels(selectedProvider.models);
      
      // If current model is not in the new provider's models, reset to first available
      if (selectedProvider.models.length > 0 && 
          !selectedProvider.models.some(model => model.id === settings.model)) {
        updateSettings({ model: selectedProvider.models[0].id });
      }
    }
  }, [settings.baseUrl, updateSettings]);

  const handleBaseUrlChange = (newBaseUrl: string) => {
    updateSettings({ baseUrl: newBaseUrl });
    setShowBaseUrlDropdown(false);
  };

  const filteredModels = availableModels.filter(model =>
    model.name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.id.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  const selectedBaseUrl = baseUrlOptions.find(option => option.value === settings.baseUrl);
  const selectedModel = availableModels.find(model => model.id === settings.model);

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
        {/* Base URL Dropdown */}
        <div className="relative">
          <label className="block text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
            <Server className="w-3 h-3" />
            Base URL Provider
          </label>
          <button
            onClick={() => setShowBaseUrlDropdown(!showBaseUrlDropdown)}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors flex items-center justify-between"
          >
            <span className="truncate">
              {selectedBaseUrl?.label || 'Custom Endpoint'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showBaseUrlDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showBaseUrlDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e1130] border border-white/12 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
              {baseUrlOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleBaseUrlChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                    settings.baseUrl === option.value ? 'bg-[var(--acc1)]/20 text-[var(--acc1)]' : 'text-[var(--text)]'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-[var(--muted)] truncate">{option.value}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Base URL Input (only show if custom is selected) */}
        {settings.baseUrl === 'custom' && (
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Custom Base URL</label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => updateSettings({ baseUrl: e.target.value })}
              placeholder="https://your-api-endpoint.com/v1"
              className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
            />
          </div>
        )}

        {/* Model Selection Dropdown */}
        <div className="relative">
          <label className="block text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
            <Server className="w-3 h-3" />
            AI Model
          </label>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors flex items-center justify-between"
          >
            <span className="truncate">
              {selectedModel?.name || settings.model}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showModelDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e1130] border border-white/12 rounded-xl shadow-xl z-50">
              {/* Search Input */}
              <div className="p-2 border-b border-white/6">
                <input
                  type="text"
                  value={modelSearchTerm}
                  onChange={(e) => setModelSearchTerm(e.target.value)}
                  placeholder="Search models..."
                  className="w-full bg-[#1a1e3f] border border-white/12 text-[var(--text)] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[var(--acc1)]"
                />
              </div>
              
              {/* Models List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredModels.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-[var(--muted)]">
                    {modelSearchTerm ? 'No models found' : 'No models available for this provider'}
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        updateSettings({ model: model.id });
                        setShowModelDropdown(false);
                        setModelSearchTerm('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                        settings.model === model.id ? 'bg-[var(--acc1)]/20 text-[var(--acc1)]' : 'text-[var(--text)]'
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-[var(--muted)]">{model.provider} • {model.id}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
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
            placeholder="sk-or-v1-... or your provider's key"
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
          {settings.baseUrl.includes('localhost') && (
            <div className="mt-1 text-yellow-400">
              💡 Ollama detected! Make sure Ollama is running locally.
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showBaseUrlDropdown || showModelDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowBaseUrlDropdown(false);
            setShowModelDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default ApiSettings;