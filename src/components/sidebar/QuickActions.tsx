import React from 'react';
import { Settings, Download, Zap, BarChart3, Shield, Smartphone } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const QuickActions: React.FC = () => {
  const { 
    toggleSettings, 
    sessions, 
    currentSessionId, 
    addMessage 
  } = useAppStore();

  const handleExportChat = () => {
    const currentSession = sessions[currentSessionId];
    if (!currentSession) return;

    const dataStr = JSON.stringify(currentSession, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSession.title || 'chat'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: '📥 Chat exported successfully!',
      timestamp: Date.now(),
    });
  };

  const quickFeatures = [
    { icon: BarChart3, label: 'Analytics', color: 'text-blue-400', status: 'Coming Soon' },
    { icon: Shield, label: 'Security', color: 'text-green-400', status: 'Active' },
    { icon: Smartphone, label: 'Mobile Dev', color: 'text-purple-400', status: 'Beta' },
  ];

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <Zap className="w-3 h-3" />
        Quick Actions
      </h4>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={toggleSettings}
            className="flex-1 bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Settings className="w-3 h-3" />
            Settings (200+)
          </button>
          <button
            onClick={handleExportChat}
            className="flex-1 bg-transparent border border-white/12 hover:border-white/20 text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
        
        {/* Professional Features Preview */}
        <div className="space-y-2">
          <div className="text-xs text-[var(--muted)] font-semibold">Professional Features:</div>
          {quickFeatures.map((feature) => (
            <div key={feature.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <feature.icon className={`w-3 h-3 ${feature.color}`} />
                <span className="text-[var(--text)]">{feature.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                feature.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                feature.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {feature.status}
              </span>
            </div>
          ))}
        </div>
        
        {/* Feature Counter */}
        <div className="text-center p-2 bg-gradient-to-r from-[var(--acc1)]/20 to-[var(--acc2)]/20 rounded-xl border border-white/10">
          <div className="text-lg font-bold text-white">1500+</div>
          <div className="text-xs text-[var(--muted)]">Professional Features</div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;