import React, { useEffect, useRef, useState } from 'react';
import { Bot, User, Clock, Copy, ThumbsUp, ThumbsDown, Code, Bug, Wrench, FileText, Play, FolderOpen, RefreshCw, Zap, Terminal, Download, Eye, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { renderMarkdown } from '../../utils/markdown';
import { toast } from 'react-toastify';
import ThinkingAnimation from './ThinkingAnimation';
import { sendToAPI } from '../../utils/api';

const ChatWindow: React.FC = () => {
  const { 
    sessions, 
    currentSessionId, 
    settings,
    addMessage,
    removeThinkingMessage,
    currentMode,
    userMemory,
    filesContext,
    createFile,
    toggleCodeArea,
    showCodeArea,
    addFileToContext,
    setActiveFile
  } = useAppStore();
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const currentSession = sessions[currentSessionId];
  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (settings.autoScroll && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, settings.autoScroll]);

  const handleRegenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    // Find the user message that prompted this response
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }
    
    if (userMessageIndex < 0) return;
    
    const userMessage = messages[userMessageIndex];
    setRegeneratingId(messageId);
    
    // Show thinking animation
    if (settings.typingIndicator) {
      addMessage(currentSessionId, {
        role: 'thinking',
        content: 'thinking',
        timestamp: Date.now(),
      });
    }
    
    try {
      const response = await sendToAPI({
        message: userMessage.content + '\\n\\n[Please provide an improved response]',
        mode: currentMode,
        settings,
        userMemory,
        filesContext,
        stylePreset: 'pro',
        sessionId: currentSessionId,
      });
      
      // Remove thinking animation
      if (settings.typingIndicator) {
        removeThinkingMessage(currentSessionId);
      }
      
      // Replace the old message with new response
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: response,
        timestamp: Date.now(),
      };
      
      // Update the session with new messages
      const updatedSession = {
        ...currentSession,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };
      
      // Update the store
      useAppStore.setState((state) => ({
        sessions: {
          ...state.sessions,
          [currentSessionId]: updatedSession,
        },
      }));
      
      toast.success('Response regenerated successfully!');
      
    } catch (error) {
      // Remove thinking animation on error
      if (settings.typingIndicator) {
        removeThinkingMessage(currentSessionId);
      }
      
      toast.error('Failed to regenerate response');
      console.error('Regenerate error:', error);
    } finally {
      setRegeneratingId(null);
    }
  };

  useEffect(() => {
    // Add welcome message for new sessions
    if (!currentSession || messages.length === 0) {
      const welcomeMessage = currentMode === 'agent' 
        ? '🚀 **NikkuAi09 Futuristic AI Agent Activated!**\n\n⚡ **Advanced AI Development Platform Ready!**\nI am your cutting-edge AI development partner with professional-grade capabilities.\n\n🌟 **Futuristic Features:**\n- 🧠 **AI Code Analysis** - Deep understanding & optimization\n- 🌐 **Internet Access** - Real-time data & API integration\n- 🏗️ **Architecture Planning** - Enterprise-level system design\n- 🔍 **Smart Debugging** - Automatic error detection & fixing\n- 🎨 **UI/UX Design** - Apple-level design aesthetics\n- 🛡️ **Security Scanning** - Vulnerability detection & fixes\n- 📊 **Analytics Dashboard** - Project metrics & insights\n- 🚀 **Performance Optimization** - Speed & efficiency improvements\n- 📱 **Cross-Platform** - Web, mobile, desktop compatibility\n- 🤖 **AI Pair Programming** - Intelligent code suggestions\n\n💎 **Professional Capabilities:**\n- Complete project architecture with best practices\n- Production-ready code with comprehensive testing\n- Real-time collaboration and version control\n- Enterprise security and scalability\n- Advanced deployment and CI/CD pipelines\n\n🎯 **Just tell me what you want to build and I\'ll create a professional, production-ready solution!**\n\n**Examples:** "Create a portfolio website", "Build an e-commerce platform", "Develop a mobile app", "Design an AI dashboard"'
        : '💬 **Chat Mode Activated!** I\'m here for general conversation and project discussions. For coding tasks, please switch to Agent Mode.\n\nI can help with:\n- Project planning and ideas\n- Technology recommendations\n- General programming concepts\n- Career advice\n\nWhat would you like to discuss?';

      addMessage(currentSessionId, {
        role: 'assistant',
        content: welcomeMessage,
        timestamp: Date.now(),
      });
    }
  }, [currentSessionId, currentSession, messages.length, addMessage, currentMode]);

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('📋 Copied to clipboard!', {
        position: 'bottom-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-green-500/20 text-green-400',
      });
    } catch (error) {
      toast.error('❌ Failed to copy to clipboard');
    }
  };

  const handleMoveToEditor = (content: string) => {
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g);
    if (!codeBlocks) {
      toast.error('No code blocks found in this message');
      return;
    }

    if (!showCodeArea) {
      toggleCodeArea();
    }

    let filesCreated = 0;
    
    // Show loading animation
    toast.info('🚀 Moving code to editor...', { autoClose: 1000 });
    
    codeBlocks.forEach((block, index) => {
      const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
      if (match) {
        const language = match[1] || 'txt';
        const code = match[2].trim();
        
        // Smart filename detection
        let fileName = '';
        const contentLines = content.split('\n');
        
        // Look for filename mentions near the code block
        for (let i = 0; i < contentLines.length; i++) {
          const line = contentLines[i];
          if (line.includes('```' + language)) {
            // Check previous lines for filename
            for (let j = Math.max(0, i - 3); j < i; j++) {
              const prevLine = contentLines[j].toLowerCase();
              if (prevLine.includes('file:') || prevLine.includes('creating') || prevLine.includes('filename')) {
                const fileMatch = contentLines[j].match(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/);
                if (fileMatch) {
                  fileName = fileMatch[1];
                  break;
                }
              }
            }
            break;
          }
        }
        
        if (!fileName) {
          fileName = `ai_code_${Date.now()}_${index + 1}.${getFileExtension(language)}`;
        }
        
        createFile(fileName, code);
        addFileToContext({
          name: fileName,
          content: code || '',
          lastModified: Date.now(),
        });
        
        if (index === 0) {
          setActiveFile(fileName);
        }
        
        filesCreated++;
      }
    });

    // Show success with clickable action
    setTimeout(() => {
      toast.success(
        <div className="flex items-center gap-2">
          <span>📁 Moved {filesCreated} file(s) to editor!</span>
          <button 
            onClick={() => {
              if (!showCodeArea) toggleCodeArea();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Open Editor
          </button>
        </div>,
        { autoClose: 5000 }
      );
    }, 1200);
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js', typescript: 'ts', python: 'py', html: 'html',
      css: 'css', json: 'json', jsx: 'jsx', tsx: 'tsx', java: 'java',
      cpp: 'cpp', c: 'c', go: 'go', rust: 'rs', php: 'php', ruby: 'rb',
      swift: 'swift', kotlin: 'kt', scala: 'scala', sql: 'sql', shell: 'sh',
      bash: 'sh', yaml: 'yml', xml: 'xml', markdown: 'md',
    };
    return extensions[language] || 'txt';
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const hasCodeBlocks = (content: string) => {
    return /```[\s\S]*?```/.test(content);
  };

  const handleRunCode = (content: string) => {
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g);
    if (!codeBlocks) {
      toast.error('No code blocks found');
      return;
    }

    codeBlocks.forEach((block, index) => {
      const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
      if (match) {
        const language = match[1] || 'txt';
        const code = match[2].trim();
        
        if (language === 'html') {
          const blob = new Blob([code], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          toast.success('HTML code opened in new tab!');
        } else if (language === 'javascript' || language === 'js') {
          try {
            const result = eval(code);
            toast.success(`JavaScript executed: ${result}`);
          } catch (error) {
            toast.error(`JavaScript error: ${error}`);
          }
        } else {
          toast.info(`${language} code copied to clipboard`);
          navigator.clipboard.writeText(code);
        }
      }
    });
  };

  const handleOptimizeCode = (content: string) => {
    addMessage(currentSessionId, {
      role: 'user',
      content: `**CODE OPTIMIZATION REQUEST**\n\nPlease optimize this code for:\n- Performance improvements\n- Best practices\n- Security enhancements\n- Clean code principles\n\n${content.slice(0, 1000)}${content.length > 1000 ? '...' : ''}`,
      timestamp: Date.now(),
    });
  };

  const handleExplainCode = (content: string) => {
    addMessage(currentSessionId, {
      role: 'user',
      content: `**CODE EXPLANATION REQUEST**\n\nPlease explain this code in detail:\n- What it does\n- How it works\n- Key concepts used\n- Potential improvements\n\n${content.slice(0, 1000)}${content.length > 1000 ? '...' : ''}`,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-4">
      {messages.map((message) => (
        message.role === 'thinking' ? (
          <ThinkingAnimation key={message.id} />
        ) : (
        <div
          key={message.id}
          className={`flex gap-3 fade-in ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full accent-gradient flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className={`max-w-4xl ${message.role === 'user' ? 'order-first' : ''}`}>
            <div
              className={`p-4 rounded-2xl border transition-all hover:shadow-lg ${
                message.role === 'user'
                  ? 'bg-[#0e2746] border-blue-500/20 text-white'
                  : 'bg-[#161a49] border-purple-500/20 text-white'
              }`}
            >
              <div 
                className="prose prose-invert max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: settings.renderMarkdown 
                    ? renderMarkdown(message.content) 
                    : message.content.replace(/\n/g, '<br>') 
                }}
              />
              
              {/* Message Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {settings.timestamps && (
                    <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(message.timestamp)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyMessage(message.content)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3 text-[var(--muted)] hover:text-white" />
                  </button>
                  
                  {message.role === 'assistant' && hasCodeBlocks(message.content) && (
                    <>
                      <button
                        onClick={() => handleRunCode(message.content)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Run code"
                      >
                        <Play className="w-3 h-3 text-[var(--muted)] hover:text-green-400" />
                      </button>
                      <button
                        onClick={() => handleMoveToEditor(message.content)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Move code to editor"
                      >
                        <Code className="w-3 h-3 text-[var(--muted)] hover:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleOptimizeCode(message.content)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Optimize code"
                      >
                        <Zap className="w-3 h-3 text-[var(--muted)] hover:text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleExplainCode(message.content)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Explain code"
                      >
                        <Eye className="w-3 h-3 text-[var(--muted)] hover:text-purple-400" />
                      </button>
                      <button
                        onClick={() => {
                          const fileName = `optimized_${Date.now()}.txt`;
                          const blob = new Blob([message.content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = fileName;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          toast.success(`📥 Downloaded ${fileName}`);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Download response"
                      >
                        <Download className="w-3 h-3 text-[var(--muted)] hover:text-green-400" />
                      </button>
                    </>
                  )}
                  
                  {message.role === 'assistant' && (
                    <>
                      <button
                        onClick={() => handleRegenerateResponse(message.id)}
                        disabled={regeneratingId === message.id}
                        className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                        title="Regenerate response"
                      >
                        {regeneratingId === message.id ? (
                          <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3 text-[var(--muted)] hover:text-blue-400" />
                        )}
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Good response"
                      >
                        <ThumbsUp className="w-3 h-3 text-[var(--muted)] hover:text-green-400" />
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Poor response"
                      >
                        <ThumbsDown className="w-3 h-3 text-[var(--muted)] hover:text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        )
      ))}
      
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;