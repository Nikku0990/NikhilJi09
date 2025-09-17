import React, { useState } from 'react';
import { Sparkles, Bug, Zap, FileText, TestTube, Shield, Brain, Wand2, Code2, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

const FloatingAIActions: React.FC = () => {
  const { 
    showCodeArea, 
    currentMode, 
    addMessage, 
    currentSessionId,
    files,
    activeFile 
  } = useAppStore();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const aiActions = [
    {
      id: 'fix',
      icon: Bug,
      label: 'Fix with AI',
      color: 'bg-red-500',
      description: 'Fix bugs and issues in your code',
      action: () => {
        if (currentMode === 'chat') {
          toast.error('🤖 Bhai, Agent Mode mein switch karo for coding features!');
          return;
        }
        
        const currentFile = files.find(f => f.name === activeFile);
        const codeContext = currentFile ? `\n\nCurrent file: ${currentFile.name}\n\`\`\`\n${currentFile.content}\n\`\`\`` : '';
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `🐛 **AI Bug Fix Request**\n\nPlease analyze and fix any bugs in my code:\n- Identify syntax errors\n- Fix logical issues\n- Handle edge cases\n- Improve error handling\n- Add proper validation${codeContext}`,
          timestamp: Date.now(),
        });
        toast.success('🔧 AI Bug Fixer activated!');
      }
    },
    {
      id: 'optimize',
      icon: Zap,
      label: 'Optimize',
      color: 'bg-yellow-500',
      description: 'Optimize code for better performance',
      action: () => {
        if (currentMode === 'chat') {
          toast.error('🤖 Agent Mode required for optimization!');
          return;
        }
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `⚡ **Performance Optimization Request**\n\nPlease optimize my code for maximum performance:\n- Identify bottlenecks\n- Improve algorithms\n- Optimize memory usage\n- Reduce complexity\n- Add performance monitoring`,
          timestamp: Date.now(),
        });
        toast.success('⚡ Performance optimizer engaged!');
      }
    },
    {
      id: 'explain',
      icon: FileText,
      label: 'Explain Code',
      color: 'bg-blue-500',
      description: 'Get detailed code explanation',
      action: () => {
        const currentFile = files.find(f => f.name === activeFile);
        const codeContext = currentFile ? `\n\nFile: ${currentFile.name}\n\`\`\`\n${currentFile.content.slice(0, 2000)}\n\`\`\`` : '';
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `📚 **Code Explanation Request**\n\nPlease explain this code in detail:\n- What it does\n- How it works\n- Key concepts used\n- Best practices applied\n- Potential improvements${codeContext}`,
          timestamp: Date.now(),
        });
        toast.success('📖 AI Code Explainer activated!');
      }
    },
    {
      id: 'tests',
      icon: TestTube,
      label: 'Generate Tests',
      color: 'bg-green-500',
      description: 'Create comprehensive test suites',
      action: () => {
        if (currentMode === 'chat') {
          toast.error('🤖 Switch to Agent Mode for test generation!');
          return;
        }
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `🧪 **Test Generation Request**\n\nPlease generate comprehensive tests:\n- Unit tests\n- Integration tests\n- Edge case testing\n- Mock data setup\n- Test coverage analysis\n- Performance benchmarks`,
          timestamp: Date.now(),
        });
        toast.success('🧪 Test Generator activated!');
      }
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security Scan',
      color: 'bg-purple-500',
      description: 'Scan for security vulnerabilities',
      action: () => {
        if (currentMode === 'chat') {
          toast.error('🤖 Agent Mode needed for security scanning!');
          return;
        }
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `🛡️ **Security Audit Request**\n\nPlease perform a comprehensive security analysis:\n- OWASP Top 10 vulnerabilities\n- Input validation issues\n- Authentication flaws\n- Data exposure risks\n- Dependency vulnerabilities\n- Security best practices`,
          timestamp: Date.now(),
        });
        toast.success('🛡️ Security scanner engaged!');
      }
    },
    {
      id: 'refactor',
      icon: Wand2,
      label: 'Smart Refactor',
      color: 'bg-pink-500',
      description: 'Refactor code with AI intelligence',
      action: () => {
        if (currentMode === 'chat') {
          toast.error('🤖 Agent Mode required for refactoring!');
          return;
        }
        
        addMessage(currentSessionId, {
          role: 'user',
          content: `✨ **Smart Refactoring Request**\n\nPlease refactor my code intelligently:\n- Improve code structure\n- Apply design patterns\n- Enhance readability\n- Reduce duplication\n- Follow SOLID principles\n- Modern best practices`,
          timestamp: Date.now(),
        });
        toast.success('✨ Smart Refactorer activated!');
      }
    }
  ];

  if (!showCodeArea) return null;

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
      <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-90'}`}>
        {/* AI Actions */}
        <div className={`flex flex-col gap-2 transition-all duration-300 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {aiActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`${action.color} hover:scale-110 text-white p-3 rounded-full shadow-lg transition-all duration-200 group relative`}
              style={{ animationDelay: `${index * 50}ms` }}
              title={action.description}
            >
              <action.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {action.label}
              </div>
            </button>
          ))}
        </div>
        
        {/* Main Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`accent-gradient hover:scale-110 text-white p-4 rounded-full shadow-xl transition-all duration-300 pulse-glow ${isExpanded ? 'rotate-45' : ''}`}
        >
          <Brain className="w-6 h-6" />
        </button>
        
        {/* Status Indicator */}
        <div className="text-xs text-center mt-2">
          <div className={`px-2 py-1 rounded-full text-white text-xs ${
            currentMode === 'agent' ? 'bg-green-500' : 'bg-orange-500'
          }`}>
            {currentMode === 'agent' ? '🤖 Agent Active' : '💬 Chat Mode'}
          </div>
          {activeFile && (
            <div className="text-[var(--muted)] mt-1 text-xs">
              📄 {activeFile}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingAIActions;