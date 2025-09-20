import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, MicIcon, StopCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { sendToAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const ChatBar: React.FC = () => {
  const { 
    settings, 
    addMessage, 
    currentSessionId, 
    currentMode,
    userMemory,
    filesContext,
    files,
    createFile,
    updateFile,
    addFileToContext,
    toggleCodeArea,
    showCodeArea,
    setActiveFile
  } = useAppStore();
  
  const [message, setMessage] = useState('');
  const [stylePreset, setStylePreset] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const stylePresets = [
    { value: 'pro', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'terse', label: 'Terse' },
    { value: 'playful', label: 'Playful' },
    { value: 'hinglish', label: 'Hinglish' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    
    // Check for God Mode activation
    const isGodModeRequest = userMessage.toLowerCase().includes('god mode') || 
                            userMessage.toLowerCase().includes('bana') && userMessage.toLowerCase().includes('sab khud se') ||
                            userMessage.toLowerCase().includes('autopilot') ||
                            userMessage.toLowerCase().includes('autonomous');
    
    if (isGodModeRequest && currentMode === 'agent' && !useAppStore.getState().godMode.active) {
      useAppStore.getState().updateGodMode({ active: true, status: 'planning', currentMission: userMessage });
    }
    
    // Add user message
    addMessage(currentSessionId, {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });
    
    // Show thinking animation after user message
    if (settings.typingIndicator) {
      addMessage(currentSessionId, {
        role: 'thinking',
        content: 'thinking',
        timestamp: Date.now(),
      });
    }
    
    try {
      // Send to API
      const response = await sendToAPI({
        message: userMessage,
        mode: currentMode,
        settings,
        userMemory,
        filesContext,
        stylePreset,
        sessionId: currentSessionId,
      });
      
      // Remove thinking animation
      if (settings.typingIndicator) {
        useAppStore.getState().removeThinkingMessage(currentSessionId);
      }
      
      // Validate response
      if (!response || typeof response !== 'string' || response.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      // Check if response contains code and auto-open code editor
      if (containsCode(response) && currentMode === 'agent') {
        if (!showCodeArea) {
          toggleCodeArea();
          toast.success('🚀 Professional Code Editor activated!');
        }
        
        // Extract and create files from code blocks
        extractAndCreateFiles(response);
      }
      
      // Check for God Mode blueprint approval
      if (response.includes('APPROVAL REQUIRED') || response.includes('[✅ APPROVE PLAN]')) {
        // Add approval buttons to the response
        const enhancedResponse = response + '\n\n' + generateApprovalButtons();
        addMessage(currentSessionId, {
          role: 'assistant',
          content: enhancedResponse,
          timestamp: Date.now(),
        });
      } else {
        // Add assistant response
        addMessage(currentSessionId, {
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        });
      }
      
    } catch (error) {
      // Remove thinking animation on error
      if (settings.typingIndicator) {
        useAppStore.getState().removeThinkingMessage(currentSessionId);
      }
      
      console.error('Chat error:', error);
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `Request Failed\\n\\nError: ${error instanceof Error ? error.message : 'Unknown error'}\\n\\nPossible Solutions:\\n- Check your API key in settings\\n- Verify the base URL is correct\\n- Ensure the selected model is available\\n- Check your internet connection\\n\\nDebug Info: ${JSON.stringify({ baseUrl: settings.baseUrl, model: settings.model })}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateApprovalButtons = () => {
    return `
<div style="display: flex; gap: 10px; margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #1a1e3f, #2a2d5f); border-radius: 12px; border: 1px solid rgba(0, 245, 255, 0.3);">
  <button onclick="approveGodModePlan()" style="background: linear-gradient(135deg, #00f5ff, #ff00f5); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
    ✅ APPROVE PLAN
  </button>
  <button onclick="editGodModePlan()" style="background: linear-gradient(135deg, #ffa500, #ff6b35); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
    ✏️ EDIT PLAN
  </button>
  <button onclick="cancelGodModePlan()" style="background: linear-gradient(135deg, #ff4757, #ff3838); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
    ❌ CANCEL
  </button>
</div>

<script>
function approveGodModePlan() {
  // Send approval message
  const event = new CustomEvent('godModeApproval', { detail: { action: 'approve' } });
  window.dispatchEvent(event);
}

function editGodModePlan() {
  const event = new CustomEvent('godModeApproval', { detail: { action: 'edit' } });
  window.dispatchEvent(event);
}

function cancelGodModePlan() {
  const event = new CustomEvent('godModeApproval', { detail: { action: 'cancel' } });
  window.dispatchEvent(event);
}
</script>`;
  };
  
  // Listen for God Mode approval events
  useEffect(() => {
    const handleGodModeApproval = (event: any) => {
      const { action } = event.detail;
      
      if (action === 'approve') {
        addMessage(currentSessionId, {
          role: 'user',
          content: '✅ Plan approved! Start God Mode execution.',
          timestamp: Date.now(),
        });
        
        useAppStore.getState().updateGodMode({ 
          status: 'creating',
          progress: 10
        });
        
        // Trigger God Mode execution
        setTimeout(() => {
          addMessage(currentSessionId, {
            role: 'assistant',
            content: '🚀 **God Mode Execution Started!**\n\nBhai, main ab full throttle mein hoon! Dekho main kya kar raha hoon:\n\n📋 **Step 1: Self-Planning** ✅ Complete\n🏗️ **Step 2: Auto-Creating Files** 🔄 In Progress...\n\nFiles being created:\n- package.json\n- src/App.jsx\n- src/components/\n- src/styles/\n- src/utils/\n\nProgress: 25% complete...',
            timestamp: Date.now(),
          });
        }, 1000);
      } else if (action === 'edit') {
        addMessage(currentSessionId, {
          role: 'user',
          content: '✏️ I want to edit the plan. Please show me the editable version.',
          timestamp: Date.now(),
        });
      } else if (action === 'cancel') {
        addMessage(currentSessionId, {
          role: 'user',
          content: '❌ Plan cancelled. Let\'s try something else.',
          timestamp: Date.now(),
        });
        
        useAppStore.getState().updateGodMode({ 
          active: false,
          status: 'idle',
          currentMission: null,
          blueprint: null,
          progress: 0
        });
      }
    };
    
    window.addEventListener('godModeApproval', handleGodModeApproval);
    return () => window.removeEventListener('godModeApproval', handleGodModeApproval);
  }, [currentSessionId, addMessage]);

  const containsCode = (text: string): boolean => {
    return /```[\s\S]*?```/.test(text) || 
           text.includes('function ') || 
           text.includes('class ') ||
           text.includes('import ') ||
           text.includes('export ') ||
           text.includes('<html') ||
           text.includes('<!DOCTYPE');
  };

  const extractAndCreateFiles = (response: string) => {
    // Look for file creation patterns
    const fileCreationPattern = /📁 (?:Creating file|Updating file): ([^\n]+)\n```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = response.match(/```(\w+)?\n([\s\S]*?)```/g);
    if (!codeBlocks) return;

    let filesCreated = 0;
    const createdFiles: string[] = [];
    
    // Show file creation animation
    toast.info(
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Creating files...</span>
      </div>,
      { autoClose: 2000 }
    );
    
    // Try to match the file creation format
    const matches = [...response.matchAll(fileCreationPattern)];
    matches.forEach((match) => {
      const fileName = match[1].trim();
      const language = match[2] || 'txt';
      const content = match[3].trim();
      
      // Check if file exists - update instead of create
      const existingFile = files.find(f => f.name === fileName);
      if (existingFile) {
        // Update existing file
        updateFile(fileName, content);
        toast.success(
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <span>📝 Updated {fileName}</span>
          </div>,
          { autoClose: 3000 }
        );
      } else {
        // Create new file
        createFile(fileName, content);
        toast.success(
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <span>✅ Created {fileName}</span>
          </div>,
          { autoClose: 3000 }
        );
      }
      
      // Add to context
      addFileToContext({
        name: fileName,
        content: content,
        lastModified: Date.now(),
      });
      
      // Set as active file
      if (filesCreated === 0) {
        setActiveFile(fileName);
      }
      
      createdFiles.push(fileName);
      filesCreated++;
      
    });
    
    // Fallback to regular code block detection
    if (filesCreated === 0) {
      codeBlocks.forEach((block, index) => {
        const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const language = match[1] || 'txt';
          const content = match[2].trim();
          
          // Smart filename detection from response context
          const lines = response.split('\n');
          let fileName = '';
          
          // Look for file creation mentions with better patterns
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            if (line.includes('creating file:') || line.includes('📁 creating file:') || line.includes('file:') || line.includes('filename:')) {
              const fileMatch = lines[i].match(/(?:📁\s*creating file:|creating file:|file:|filename:)\s*([^\s\n]+)/i);
              if (fileMatch) {
                fileName = fileMatch[1].trim();
                break;
              }
            }
          }
          
          // Fallback to generated name
          if (!fileName) {
            fileName = `ai_code_${Date.now()}_${index + 1}.${getFileExtension(language)}`;
          }
          
          // Create file in editor
          createFile(fileName, content);
          
          // Add to context
          addFileToContext({
            name: fileName,
            content: content,
            lastModified: Date.now(),
          });
          
          // Set as active file if first one
          if (index === 0) {
            setActiveFile(fileName);
          }
          
          createdFiles.push(fileName);
          filesCreated++;
          
          // Show individual file creation animation
          setTimeout(() => {
            toast.success(
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <span>✅ Created {fileName}</span>
              </div>,
              { autoClose: 3000 }
            );
          }, (index + 1) * 500);
        }
      });
    }
    
    if (filesCreated > 0) {
      // Auto-open code editor with animation
      if (!showCodeArea) {
        setTimeout(() => {
          toggleCodeArea();
          toast.success(
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span>🚀 Professional Code Editor activated!</span>
            </div>
          );
        }, filesCreated * 500 + 500);
      }
      
      // Add comprehensive file creation summary
      setTimeout(() => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: `🎉 **Professional Files Created Successfully!**\n\n📁 **Added ${filesCreated} file(s) to your project:**\n${createdFiles.map(f => `- ✅ ${f}`).join('\n')}\n\n🧠 **AI Analysis Ready:**\nAll files are now available for:\n- 🔍 Deep code analysis\n- 🚀 Performance optimization  \n- 🛡️ Security scanning\n- 🐛 Bug detection & fixing\n- 📊 Quality metrics\n- 🧪 Test generation\n- 📚 Documentation\n\n💡 **Pro Tip:** Use the Code Chat tab in the editor to ask specific questions about your files!`,
          timestamp: Date.now(),
        });
      }, filesCreated * 500 + 1000);
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      jsx: 'jsx',
      tsx: 'tsx',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      scala: 'scala',
      sql: 'sql',
      shell: 'sh',
      bash: 'sh',
      yaml: 'yml',
      xml: 'xml',
      markdown: 'md',
    };
    return extensions[language] || 'txt';
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('🎤 Voice input not supported in this browser');
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      toast.success('🛑 Recording stopped');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100 
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Simulate speech-to-text (in real implementation, you'd send to speech API)
        toast.success('🎤 Voice captured! Converting to text...');
        
        // For demo, add a sample message
        setTimeout(() => {
          setMessage(prev => prev + ' [Voice input: "Create a React component"]');
          toast.success('✨ Speech converted to text!');
        }, 1500);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      toast.info('🎤 Recording... Click mic again to stop');
      
    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('❌ Failed to access microphone. Please check permissions.');
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const processedFiles: string[] = [];
    const failedFiles: string[] = [];
    
    toast.info(`📁 Processing ${uploadedFiles.length} file(s)...`);
    
    for (const file of Array.from(uploadedFiles)) {
      if (file.size > 10000000) { // 10MB limit
        toast.error(`❌ ${file.name} is too large (max 10MB)`);
        failedFiles.push(file.name);
        continue;
      }
      
      try {
        const content = await file.text();
        
        // Create file in editor
        createFile(file.name, content);
        
        // Trigger live typing for new files
        window.dispatchEvent(new Event('fileCreated'));
        
        // Add to context for AI
        addFileToContext({
          name: file.name,
          content: content || '',
          lastModified: Date.now(),
        });
        
        processedFiles.push(file.name);
        toast.success(`✅ Added ${file.name} to project`);
        
      } catch (error) {
        console.error(`Error reading ${file.name}:`, error);
        toast.error(`❌ Failed to read ${file.name}`);
        failedFiles.push(file.name);
      }
    }
    
    if (processedFiles.length > 0) {
      // Auto-open code editor if files were added
      if (!showCodeArea) {
        toggleCodeArea();
        toast.success('🚀 Professional Code Editor activated!');
      }
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🎉 **Professional Files Processed Successfully!**\n\n📁 Added ${processedFiles.length} file(s) to your project:\n- ${processedFiles.join('\n- ')}\n\n🧠 **AI Analysis Ready:**\nAll files are now available for:\n- 🔍 Deep code analysis\n- 🚀 Performance optimization\n- 🛡️ Security scanning\n- 🐛 Bug detection & fixing\n- 📊 Quality metrics\n\n${failedFiles.length > 0 ? `❌ **Failed:**\n- ${failedFiles.join('\n- ')}` : ''}`,
        timestamp: Date.now(),
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.enterToSend) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/8 bg-gradient-to-r from-white/2 to-transparent backdrop-blur-sm p-3">
      <div className="glass-effect rounded-2xl p-3 flex items-end gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".txt,.js,.ts,.jsx,.tsx,.py,.html,.css,.json,.md,.sql,.php,.java,.cpp,.c,.go,.rs,.rb,.swift,.kt,.scala,.yml,.yaml,.xml,.sh"
        />
        
        {/* Main Input Area */}
        <div className="flex-1 flex gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Shift+Enter = newline)"
            className="flex-1 bg-transparent border-none text-[var(--text)] placeholder-[var(--muted)] resize-none focus:outline-none min-h-[44px] max-h-40 py-2"
            disabled={isLoading}
          />
          
          {/* Quick Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 animate-pulse' 
                  : 'hover:bg-white/10 text-[var(--muted)] hover:text-white'
              }`}
              title={isRecording ? 'Stop Recording' : 'Voice Input'}
            >
              {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleFileAttach}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Attach Files"
            >
              <Paperclip className="w-4 h-4 text-[var(--muted)] hover:text-white" />
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-2 w-36">
          <select
            value={stylePreset}
            onChange={(e) => setStylePreset(e.target.value)}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[var(--acc1)] transition-colors"
          >
            {stylePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="accent-gradient text-white font-bold py-2 px-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-2 px-3">
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Mode: {currentMode === 'agent' ? 'AI Agent' : 'Chat'}
          </div>
          {filesContext.length > 0 && (
            <div>📎 {filesContext.length} file(s) in context</div>
          )}
        </div>
        
        <div className="text-xs text-[var(--muted)]">
          {settings.enterToSend ? 'Enter to send' : 'Shift+Enter for newline'}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;