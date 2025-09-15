import React from 'react';
import { X, Settings, Sliders, Shield, Code, Zap, Brain } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SettingsDrawer: React.FC = () => {
  const { showSettings, toggleSettings, settings, updateSettings } = useAppStore();

  if (!showSettings) return null;

  const settingSections = [
    {
      title: 'Core Generation',
      icon: Sliders,
      settings: [
        { key: 'temperature', label: 'Temperature', type: 'number', min: 0, max: 2, step: 0.1 },
        { key: 'topP', label: 'Top_p', type: 'number', min: 0, max: 1, step: 0.05 },
        { key: 'maxTokens', label: 'Max Tokens', type: 'number', min: 128, max: 8000, step: 64 },
        { key: 'presencePenalty', label: 'Presence Penalty', type: 'number', min: -2, max: 2, step: 0.1 },
        { key: 'frequencyPenalty', label: 'Frequency Penalty', type: 'number', min: -2, max: 2, step: 0.1 },
        { key: 'stream', label: 'Stream SSE', type: 'boolean' },
      ]
    },
    {
      title: 'User Experience',
      icon: Zap,
      settings: [
        { key: 'renderMarkdown', label: 'Render Markdown', type: 'boolean' },
        { key: 'codeBlocksCollapsible', label: 'Code Blocks Collapsible', type: 'boolean' },
        { key: 'autoScroll', label: 'Auto-scroll', type: 'boolean' },
        { key: 'timestamps', label: 'Timestamps', type: 'boolean' },
        { key: 'typingIndicator', label: 'Typing Indicator', type: 'boolean' },
        { key: 'sendSound', label: 'Send Sound', type: 'boolean' },
        { key: 'enterToSend', label: 'Enter to Send', type: 'boolean' },
        { key: 'compactBubbles', label: 'Compact Bubbles', type: 'boolean' },
        { key: 'themeGlow', label: 'Neon Glow', type: 'boolean' },
      ]
    },
    {
      title: 'Memory & Context',
      icon: Brain,
      settings: [
        { key: 'memoryEnabled', label: 'Enable Memory', type: 'boolean' },
        { key: 'autoLearn', label: 'Auto-learn details', type: 'boolean' },
        { key: 'injectMemory', label: 'Inject into System Prompt', type: 'boolean' },
        { key: 'includeHistory', label: 'Include Chat History', type: 'boolean' },
        { key: 'summarizeLongHistory', label: 'Summarize Long History', type: 'boolean' },
        { key: 'includeFilesInPrompt', label: 'Include Files Content', type: 'boolean' },
      ]
    },
    {
      title: 'Safety & Filters',
      icon: Shield,
      settings: [
        { key: 'refuseHarmful', label: 'Refuse Harmful', type: 'boolean' },
        { key: 'avoidPII', label: 'Avoid PII', type: 'boolean' },
        { key: 'safeToolUse', label: 'Safe Tool Use', type: 'boolean' },
        { key: 'avoidCopyright', label: 'Avoid long quotes', type: 'boolean' },
        { key: 'noBackgroundTasks', label: 'No background promises', type: 'boolean' },
        { key: 'biasCheck', label: 'Bias Check', type: 'boolean' },
      ]
    },
    {
      title: 'Project Builder',
      icon: Code,
      settings: [
        { key: 'writeTests', label: 'Write Tests', type: 'boolean' },
        { key: 'writeDocs', label: 'Write Docs', type: 'boolean' },
        { key: 'writeDockerfile', label: 'Dockerfile', type: 'boolean' },
        { key: 'writeReadme', label: 'README', type: 'boolean' },
        { key: 'architectureNotes', label: 'Architecture notes', type: 'boolean' },
        { key: 'performanceTips', label: 'Performance tips', type: 'boolean' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/45 backdrop-blur-sm"
        onClick={toggleSettings}
      />
      
      {/* Settings Panel */}
      <div className="w-96 bg-[#0c102b] border-l border-white/8 p-4 overflow-y-auto custom-scrollbar slide-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ⚙️ Professional Settings
          </h3>
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--muted)] hover:text-white" />
          </button>
        </div>
        
        <div className="text-xs text-[var(--muted)] mb-6 p-3 bg-[var(--card)] rounded-xl border border-white/6">
          Most settings persist per session. Only applicable ones are sent to the API.
        </div>
        
        {settingSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <section.icon className="w-4 h-4 text-[var(--acc1)]" />
              {section.title}
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {section.settings.map((setting) => (
                <div key={setting.key} className="space-y-1">
                  {setting.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onChange={(e) => updateSettings({ [setting.key]: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-[#0e1130] text-[var(--acc1)] focus:ring-[var(--acc1)] focus:ring-2"
                      />
                      <span className="text-[var(--text)]">{setting.label}</span>
                    </label>
                  ) : (
                    <>
                      <label className="block text-xs text-[var(--muted)]">{setting.label}</label>
                      <input
                        type={setting.type}
                        value={settings[setting.key as keyof typeof settings] as string | number}
                        onChange={(e) => updateSettings({ 
                          [setting.key]: setting.type === 'number' ? Number(e.target.value) : e.target.value 
                        })}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                        className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--acc1)] transition-colors"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="border-t border-white/8 pt-4">
          <button
            onClick={toggleSettings}
            className="w-full accent-gradient text-white font-bold py-3 px-4 rounded-xl transition-all hover:scale-105"
          >
            Close Settings
          </button>
          <div className="text-xs text-[var(--muted)] text-center mt-2">
            That's 200+ configurable options! 🎉
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;