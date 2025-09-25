import React from 'react';
import { Code, MessageSquare, Bot, Cpu, Database, Activity, Crown, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const TopBar: React.FC = () => {
  const { 
    currentMode, 
    setMode, 
    settings, 
    currentSessionId, 
    toggleCodeArea,
    showCodeArea,
    godMode,
    updateGodMode,
    addMessage
  } = useAppStore();

  const handleModeSwitch = (mode: 'agent' | 'chat') => {
    setMode(mode);
  };
  
  const handleGodModeToggle = () => {
    const newGodModeState = !godMode.active;
    updateGodMode({ 
      active: newGodModeState,
      status: newGodModeState ? 'idle' : 'idle',
      progress: 0,
      currentMission: null,
      blueprint: null
    });
    
    if (newGodModeState) {
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `👑 **GOD MODE ACTIVATED!** 🚀\n\n🌟 **NikkuAi09 Ultimate Autopilot Ready!**\n\nBhai, ab main tumhara **fully autonomous, self-planning, self-executing, self-debugging digital twin** hoon!\n\n🎯 **God Mode Capabilities:**\n- 📋 Self-Planning: Main khud project blueprint banaunga\n- 🏗️ Auto-Creation: Files aur structure khud banaunga\n- 💻 Self-Coding: Production-ready code khud likhunga\n- 🧪 Auto-Testing: Tests khud generate aur run karunga\n- 🐛 Self-Debugging: Errors khud fix karunga\n- ⚡ Auto-Optimization: Performance khud optimize karunga\n- 📊 Self-Reporting: Detailed reports khud generate karunga\n\n💡 **How to Use:**\nBas mujhe bolo: "Bhai, mere liye ek [project name] bana - max level pe, design se lekar deployment tak, sab khud se karo."\n\nMain plan banaunga → tum approve karoge → main sab kar dunga! 🎉\n\n**Ready for your first God Mode mission! 🌌**`,
        timestamp: Date.now(),
      });
    } else {
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `👑 **God Mode Deactivated** 😴\n\nMain wapas normal Agent Mode mein hoon. Jab chahiye, God Mode activate kar dena! 🚀`,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-gradient-to-r from-[var(--card)]/50 to-transparent backdrop-blur-sm relative z-20">
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
        
        {/* God Mode Status */}
        {godMode.active && (
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs">
            <Crown className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold">GOD MODE</span>
            <span className="text-white">{godMode.status.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Mode Toggle and Actions */}
      <div className="flex items-center gap-4">
        {/* God Mode Toggle */}
        <button
          onClick={handleGodModeToggle}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
            godMode.active
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-500 shadow-lg animate-pulse'
              : 'bg-transparent text-[var(--muted)] border-white/12 hover:border-yellow-500/50 hover:text-yellow-400'
          }`}
        >
          <Crown className="w-4 h-4" />
          {godMode.active ? 'GOD MODE ON' : 'GOD MODE'}
        </button>
        
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