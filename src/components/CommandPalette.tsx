import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Zap, Code, MessageSquare, Settings, BarChart3, FileText, Play, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
  shortcut?: string;
}

const CommandPalette: React.FC = () => {
  const { 
    showCommandPalette, 
    toggleCommandPalette, 
    setMode, 
    toggleCodeArea, 
    toggleSettings, 
    toggleAnalytics,
    createNewSession,
    currentMode,
    addMessage,
    currentSessionId
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'switch-agent',
      title: 'Switch to Agent Mode',
      description: 'Activate AI coding agent with full development powers',
      icon: Zap,
      action: () => setMode('agent'),
      category: 'Mode',
      shortcut: 'Ctrl+Shift+A'
    },
    {
      id: 'switch-chat',
      title: 'Switch to Chat Mode',
      description: 'Switch to strategic planning and discussion mode',
      icon: MessageSquare,
      action: () => setMode('chat'),
      category: 'Mode',
      shortcut: 'Ctrl+Shift+C'
    },
    {
      id: 'toggle-editor',
      title: 'Toggle Code Editor',
      description: 'Open/close the Monaco code editor',
      icon: Code,
      action: () => toggleCodeArea(),
      category: 'Editor',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'new-session',
      title: 'New Chat Session',
      description: 'Start a fresh conversation with clean context',
      icon: MessageSquare,
      action: () => createNewSession(),
      category: 'Session'
    },
    {
      id: 'open-settings',
      title: 'Open Settings',
      description: 'Configure AI models, UI preferences, and more',
      icon: Settings,
      action: () => toggleSettings(),
      category: 'Settings',
      shortcut: 'Ctrl+,'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View detailed usage statistics and insights',
      icon: BarChart3,
      action: () => toggleAnalytics(),
      category: 'Analytics'
    },
    {
      id: 'ai-fix-code',
      title: 'AI Fix Code',
      description: 'Let AI analyze and fix issues in your code',
      icon: Zap,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for coding features!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🔧 **AI Code Fix Request**\n\nPlease analyze my current code and fix any bugs, optimize performance, and improve code quality. Focus on:\n- Bug fixes\n- Performance optimization\n- Code quality improvements\n- Best practices implementation',
          timestamp: Date.now(),
        });
      },
      category: 'AI Actions'
    },
    {
      id: 'ai-explain',
      title: 'AI Explain Code',
      description: 'Get detailed explanation of your code',
      icon: FileText,
      action: () => {
        addMessage(currentSessionId, {
          role: 'user',
          content: '📚 **Code Explanation Request**\n\nPlease explain my current code in detail:\n- What it does\n- How it works\n- Key concepts and patterns used\n- Potential improvements\n- Learning opportunities',
          timestamp: Date.now(),
        });
      },
      category: 'AI Actions'
    },
    {
      id: 'ai-optimize',
      title: 'AI Optimize Performance',
      description: 'Optimize code for better performance',
      icon: Zap,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for coding features!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '⚡ **Performance Optimization Request**\n\nPlease optimize my code for maximum performance:\n- Identify bottlenecks\n- Suggest algorithmic improvements\n- Optimize memory usage\n- Improve execution speed\n- Add performance monitoring',
          timestamp: Date.now(),
        });
      },
      category: 'AI Actions'
    },
    {
      id: 'ai-generate-tests',
      title: 'AI Generate Tests',
      description: 'Generate comprehensive test suites',
      icon: Play,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for coding features!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🧪 **Test Generation Request**\n\nPlease generate comprehensive tests for my code:\n- Unit tests\n- Integration tests\n- Edge case testing\n- Performance tests\n- Test coverage analysis',
          timestamp: Date.now(),
        });
      },
      category: 'AI Actions'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (showCommandPalette && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCommandPalette]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      toggleCommandPalette();
    }
  };

  const executeCommand = (command: Command) => {
    command.action();
    toggleCommandPalette();
    setSearchTerm('');
    toast.success(`Executed: ${command.title}`);
  };

  if (!showCommandPalette) return null;

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCommandPalette}
      />
      
      {/* Command Palette */}
      <div className="command-palette w-[600px] rounded-2xl p-6 scale-in relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Command className="w-5 h-5 text-[var(--acc1)]" />
          <h3 className="text-lg font-bold text-white">Command Palette</h3>
          <div className="ml-auto text-xs text-[var(--muted)]">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> to close
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands... (↑↓ to navigate, Enter to execute)"
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--acc1)] transition-colors"
          />
        </div>
        
        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category} className="mb-4">
              <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2 px-2">
                {category}
              </div>
              <div className="space-y-1">
                {categoryCommands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      onClick={() => executeCommand(command)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                        selectedIndex === globalIndex
                          ? 'bg-[var(--acc1)]/20 border border-[var(--acc1)]/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <command.icon className={`w-4 h-4 ${
                        selectedIndex === globalIndex ? 'text-[var(--acc1)]' : 'text-[var(--muted)]'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{command.title}</div>
                        <div className="text-xs text-[var(--muted)]">{command.description}</div>
                      </div>
                      {command.shortcut && (
                        <div className="text-xs text-[var(--muted)] bg-white/10 px-2 py-1 rounded">
                          {command.shortcut}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-[var(--muted)]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found for "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-white/10 pt-3 mt-4">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <div>
              {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>Enter Execute</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;