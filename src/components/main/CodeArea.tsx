import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  File, Plus, Save, Trash2, FileCode, FolderOpen, Play, Terminal, MessageSquare,
  RefreshCw, Zap, Search, GitBranch, Maximize2, Code2, Brain, Send, User, Bot,
  Database, Globe, Package, TestTube, Shield, Sparkles, Activity, X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';
import { sendToAPI } from '../../utils/api';

const CodeArea: React.FC = () => {
  const { 
    files, 
    activeFile, 
    createFile, 
    updateFile, 
    deleteFile, 
    setActiveFile,
    addMessage,
    currentSessionId,
    settings 
  } = useAppStore();
  
  const [newFileName, setNewFileName] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [gitStatus, setGitStatus] = useState('clean');
  const [dbConnected, setDbConnected] = useState(false);
  const [liveTypingContent, setLiveTypingContent] = useState('');
  const [isLiveTyping, setIsLiveTyping] = useState(false);
  const [showCodeChat, setShowCodeChat] = useState(false);
  const [codeChatMessages, setCodeChatMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: number}>>([]);
  const [codeChatInput, setCodeChatInput] = useState('');
  const [isCodeChatLoading, setIsCodeChatLoading] = useState(false);
  const editorRef = useRef<any>(null);
  const codeChatEndRef = useRef<HTMLDivElement>(null);

  const currentFile = files.find(f => f.name === activeFile);

  useEffect(() => {
    if (currentFile) {
      if (settings.liveTyping && !isLiveTyping) {
        startLiveTyping(currentFile.content);
      } else {
        setEditorContent(currentFile.content);
      }
      setIsModified(false);
    } else {
      setEditorContent('');
      setIsModified(false);
    }
  }, [currentFile, settings.liveTyping]);

  const startLiveTyping = async (content: string) => {
    if (!content || isLiveTyping) return;
    
    setIsLiveTyping(true);
    setEditorContent('');
    
    // Super fast typing at 8ms intervals (40x speed)
    for (let i = 0; i <= content.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 8));
      setEditorContent(content.slice(0, i));
      
      // Add some visual effects during typing
      if (i % 50 === 0) {
        setLiveTypingContent(`Typing... ${Math.floor((i / content.length) * 100)}%`);
      }
    }
    
    setIsLiveTyping(false);
    setLiveTypingContent('');
    toast.success('Live typing completed!');
  };

  const handleCodeChatSend = async () => {
    if (!codeChatInput.trim() || isCodeChatLoading) return;
    
    const userMessage = codeChatInput.trim();
    setCodeChatInput('');
    setIsCodeChatLoading(true);
    
    // Add user message
    const newUserMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user' as const,
      content: userMessage,
      timestamp: Date.now(),
    };
    setCodeChatMessages(prev => [...prev, newUserMessage]);
    
    try {
      // Get current file context
      const fileContext = currentFile ? `\n\nCurrent file: ${currentFile.name}\n\`\`\`${currentFile.language}\n${currentFile.content}\n\`\`\`` : '';
      
      const response = await sendToAPI({
        message: `${userMessage}${fileContext}`,
        mode: 'agent',
        settings,
        userMemory,
        filesContext,
        stylePreset: 'pro',
        sessionId: currentSessionId,
      });
      
      // Add AI response
      const aiMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant' as const,
        content: response,
        timestamp: Date.now(),
      };
      setCodeChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      const errorMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant' as const,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      };
      setCodeChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsCodeChatLoading(false);
    }
  };

  useEffect(() => {
    if (codeChatEndRef.current) {
      codeChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [codeChatMessages]);
  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    
    if (files.find(f => f.name === newFileName)) {
      toast.error('File already exists');
      return;
    }
    
    const template = getFileTemplate(newFileName);
    createFile(newFileName, template);
    setActiveFile(newFileName);
    setNewFileName('');
    toast.success(`Created ${newFileName}`);
  };

  const getFileTemplate = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const templates: Record<string, string> = {
      'html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>',
      'css': '/* Styles for ' + fileName + ' */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}\n',
      'js': '// JavaScript file: ' + fileName + '\nconsole.log("Hello from ' + fileName + '");\n',
      'ts': '// TypeScript file: ' + fileName + '\ninterface Example {\n    message: string;\n}\n\nconst example: Example = {\n    message: "Hello TypeScript!"\n};\n\nconsole.log(example.message);\n',
      'py': '# Python file: ' + fileName + '\ndef main():\n    print("Hello from ' + fileName + '")\n\nif __name__ == "__main__":\n    main()\n',
      'java': 'public class ' + fileName.replace('.java', '') + ' {\n    public static void main(String[] args) {\n        System.out.println("Hello from ' + fileName + '");\n    }\n}\n',
      'jsx': 'import React from "react";\n\nconst Component = () => {\n    return (\n        <div>\n            <h1>Hello from ' + fileName + '</h1>\n        </div>\n    );\n};\n\nexport default Component;\n',
      'tsx': 'import React from "react";\n\ninterface Props {\n    title?: string;\n}\n\nconst Component: React.FC<Props> = ({ title = "Hello" }) => {\n    return (\n        <div>\n            <h1>{title} from ' + fileName + '</h1>\n        </div>\n    );\n};\n\nexport default Component;\n',
      'dockerfile': 'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n',
      'gitignore': 'node_modules/\n.env\n.DS_Store\ndist/\nbuild/\n*.log\n',
      'json': '{\n  "name": "' + fileName.replace('.json', '') + '",\n  "version": "1.0.0",\n  "description": ""\n}\n',
    };
    
    return templates[ext || ''] || `// New file: ${fileName}\n`;
  };

  const handleSaveFile = () => {
    if (!activeFile) {
      toast.error('No file selected');
      return;
    }
    
    updateFile(activeFile, editorContent);
    setIsModified(false);
    toast.success(`Saved ${activeFile}`);
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `File "${activeFile}" saved successfully!`,
      timestamp: Date.now(),
    });
  };

  const handleRunCode = async () => {
    if (!activeFile || !currentFile) {
      toast.error('No file selected');
      return;
    }

    setIsRunning(true);
    setOutput('Starting execution...\n');

    try {
      const ext = activeFile.split('.').pop()?.toLowerCase();
      
      if (ext === 'html') {
        let htmlContent = editorContent;
        
        const cssFiles = files.filter(f => f.name.endsWith('.css'));
        if (cssFiles.length > 0) {
          const cssLinks = cssFiles.map(f => 
            `<style>\n/* ${f.name} */\n${f.content}\n</style>`
          ).join('\n');
          
          if (htmlContent.includes('</head>')) {
            htmlContent = htmlContent.replace('</head>', `${cssLinks}\n</head>`);
          } else {
            htmlContent = `<head>${cssLinks}</head>\n${htmlContent}`;
          }
        }
        
        const jsFiles = files.filter(f => f.name.endsWith('.js') && f.name !== activeFile);
        if (jsFiles.length > 0) {
          const jsScripts = jsFiles.map(f => 
            `<script>\n/* ${f.name} */\n${f.content}\n</script>`
          ).join('\n');
          
          if (htmlContent.includes('</body>')) {
            htmlContent = htmlContent.replace('</body>', `${jsScripts}\n</body>`);
          } else {
            htmlContent = `${htmlContent}\n${jsScripts}`;
          }
        }
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setOutput(`HTML opened in new tab\nLinked: ${cssFiles.length} CSS, ${jsFiles.length} JS`);
        
      } else if (ext === 'js' || ext === 'jsx') {
        try {
          const safeEval = new Function(`
            const output = [];
            const console = {
              log: (...args) => output.push(args.join(' ')),
              error: (...args) => output.push('ERROR: ' + args.join(' ')),
              warn: (...args) => output.push('WARN: ' + args.join(' '))
            };
            
            try {
              ${editorContent};
              return output.join('\\n');
            } catch (e) {
              return 'ERROR: ' + e.message;
            }
          `);
          
          const result = safeEval();
          setOutput(`JavaScript executed\n\nOutput:\n${result || 'No output'}`);
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
      } else if (ext === 'py') {
        setOutput(`Python requires server environment\nTry online interpreters or local setup`);
        
      } else if (ext === 'css') {
        const demoHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${editorContent}
  </style>
</head>
<body>
  <h1>CSS Preview</h1>
  <p>This is a demo page to preview your CSS styles.</p>
  <div class="demo-content">
    <button>Button</button>
    <input type="text" placeholder="Input field" />
    <div class="card">Card element</div>
  </div>
</body>
</html>`;
        
        const blob = new Blob([demoHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setOutput(`CSS preview opened\nDemo page created`);
        
      } else if (ext === 'json') {
        try {
          const parsed = JSON.parse(editorContent);
          setOutput(`Valid JSON\n${JSON.stringify(parsed, null, 2)}`);
        } catch (error) {
          setOutput(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
      } else {
        setOutput(`File type: .${ext}\nUse appropriate runtime environment`);
      }
      
    } catch (error) {
      setOutput(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDatabaseTest = () => {
    setDbConnected(!dbConnected);
    toast.success(dbConnected ? 'Database disconnected' : 'Database connected!');
  };

  const handleGitCommit = () => {
    setGitStatus('committing');
    setTimeout(() => {
      setGitStatus('committed');
      toast.success('Git commit successful!');
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `Git commit successful!\nFiles: ${files.length}\nBranch: main`,
        timestamp: Date.now(),
      });
    }, 1500);
  };

  const handleDockerBuild = () => {
    setOutput('Building Docker image...\n');
    
    setTimeout(() => {
      setOutput('Docker build completed\nImage: myapp:latest');
      toast.success('Docker build completed!');
    }, 2000);
  };

  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || '';
    setEditorContent(newContent);
    setIsModified(currentFile ? newContent !== currentFile.content : false);
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorSelection((e: any) => {
      const selection = editor.getModel()?.getValueInRange(e.selection);
      setSelectedText(selection || '');
    });
  };

  const handleDeleteFile = (fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      deleteFile(fileName);
      toast.success(`Deleted ${fileName}`);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const professionalTools = [
    { icon: GitBranch, label: 'Git', action: handleGitCommit, color: 'bg-orange-600' },
    { icon: Database, label: 'DB', action: handleDatabaseTest, color: 'bg-blue-600' },
    { icon: Package, label: 'Docker', action: handleDockerBuild, color: 'bg-purple-600' },
    { icon: TestTube, label: 'Test', action: () => toast.info('Running tests...'), color: 'bg-yellow-600' },
    { icon: Shield, label: 'Security', action: () => toast.info('Security scan...'), color: 'bg-red-600' },
    { icon: Activity, label: 'Monitor', action: () => toast.info('Performance monitor...'), color: 'bg-green-600' },
  ];

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'm-3'} bg-[var(--card)] border border-white/6 rounded-[var(--radius)] overflow-hidden`}>
      <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
        {/* Enhanced File Explorer */}
        <div className={`${isFullscreen ? 'w-80' : 'w-64'} bg-[#0f1330] border-r border-white/6 p-3`}>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-[var(--acc1)]" />
            <span className="text-sm font-semibold text-white">Professional IDE</span>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <Maximize2 className="w-3 h-3 text-[var(--muted)]" />
              </button>
            </div>
          </div>
          
          {/* Professional Tools */}
          <div className="mb-4">
            <div className="text-xs text-[var(--muted)] mb-2">Pro Tools:</div>
            <div className="grid grid-cols-3 gap-1">
              {professionalTools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  className={`${tool.color} hover:opacity-80 text-white p-1 rounded text-xs flex items-center justify-center gap-1 transition-colors`}
                  title={tool.label}
                >
                  <tool.icon className="w-3 h-3" />
                  <span className="text-xs">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Git Status */}
          <div className="mb-3 p-2 bg-[#1a1e3f] rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <GitBranch className="w-3 h-3 text-orange-400" />
              <span className="text-white">main</span>
              <div className={`w-2 h-2 rounded-full ${
                gitStatus === 'clean' ? 'bg-green-400' :
                gitStatus === 'committing' ? 'bg-yellow-400 animate-pulse' :
                'bg-blue-400'
              }`}></div>
              <span className="text-[var(--muted)]">{gitStatus}</span>
            </div>
          </div>

          {/* Database Status */}
          <div className="mb-3 p-2 bg-[#1a1e3f] rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <Database className="w-3 h-3 text-blue-400" />
              <span className="text-white">Database</span>
              <div className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-[var(--muted)]">{dbConnected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
          
          {/* Search Files */}
          <div className="mb-3">
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-2 text-[var(--muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-lg pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-[var(--acc1)]"
              />
            </div>
          </div>

          {/* Create New File */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.py"
              className="flex-1 bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[var(--acc1)]"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
            />
            <button
              onClick={handleCreateFile}
              className="bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 text-white p-1 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* File List */}
          <div className={`space-y-1 ${isFullscreen ? 'max-h-96' : 'max-h-60'} overflow-y-auto custom-scrollbar`}>
            {filteredFiles.length === 0 ? (
              <div className="text-xs text-[var(--muted)] text-center py-4">
                {searchTerm ? 'No files match your search' : 'No files yet. Create your first file!'}
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group ${
                    activeFile === file.name
                      ? 'accent-gradient text-white'
                      : 'hover:bg-white/5 text-[var(--text)]'
                  }`}
                  onClick={() => setActiveFile(file.name)}
                >
                  <FileCode className="w-3 h-3" />
                  <span className="flex-1 text-xs truncate">{file.name}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {(file.content.length / 1024).toFixed(1)}KB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Editor Controls */}
          <div className="flex items-center justify-between p-3 border-b border-white/6 bg-gradient-to-r from-[#06102a] to-[#0a0e1f]">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-[var(--acc1)]" />
              <span className="text-sm text-white font-medium">
                {activeFile || 'Select a file'}
              </span>
              {isModified && (
                <span className="w-2 h-2 rounded-full bg-orange-400" title="Unsaved changes" />
              )}
              {isLiveTyping && (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Typing...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.getAction('editor.action.formatDocument').run();
                    toast.success('Code formatted!');
                  }
                }}
                disabled={!activeFile}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Format
              </button>
              
              <button
                onClick={handleSaveFile}
                disabled={!activeFile || !isModified}
                className="flex items-center gap-1 px-3 py-1 bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 disabled:opacity-50 text-white rounded-lg text-xs transition-colors"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
              
              <button
                onClick={handleRunCode}
                disabled={!activeFile || isRunning}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-xs transition-colors"
              >
                {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Run
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/6 bg-[#0a0e1f]">
            {['editor', 'terminal', 'docker', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--card)] text-white border-b-2 border-[var(--acc1)]'
                    : 'text-[var(--muted)] hover:text-white'
                }`}
              >
                {tab === 'chat' ? (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Code Chat
                  </div>
                ) : (
                  tab.charAt(0).toUpperCase() + tab.slice(1)
                )}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'editor' && (
              <div className="flex-1">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={currentFile?.language || 'plaintext'}
                    value={editorContent}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true,
                      },
                      suggest: {
                        showKeywords: true,
                        showSnippets: true,
                      },
                      quickSuggestions: true,
                      parameterHints: { enabled: true },
                      formatOnPaste: true,
                      formatOnType: true,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: true,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-[#06102a] text-[var(--muted)]">
                    <div className="text-center">
                      <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Professional Development Environment</p>
                      <p className="text-xs mt-1">Monaco Editor with AI-powered features</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="flex-1 p-4 bg-[#06102a]">
                <div className="bg-[#0a0e1f] p-3 rounded-lg">
                  <pre className="text-xs text-green-400">
                    Terminal Ready
                    $ npm run dev
                    $ git status
                    $ docker build .
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'docker' && (
              <div className="flex-1 p-4 bg-[#06102a]">
                <div className="mb-4">
                  <button
                    onClick={handleDockerBuild}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Build Docker Image
                  </button>
                </div>
                <div className="bg-[#0a0e1f] p-3 rounded-lg">
                  <pre className="text-xs text-blue-400 whitespace-pre-wrap">
                    {output || 'Docker ready for build...'}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col">
                {/* Code Chat Header */}
                <div className="p-4 border-b border-white/6 bg-[#06102a]">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--acc1)]" />
                    <span className="text-sm font-semibold text-white">Code Chat</span>
                    <div className="ml-auto text-xs text-[var(--muted)]">
                      Chat about your code with AI
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#06102a]">
                  {codeChatMessages.length === 0 ? (
                    <div className="text-center py-8 text-[var(--muted)]">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Ask me anything about your code!</p>
                      <p className="text-xs mt-1">I can explain, debug, optimize, and help you improve it.</p>
                    </div>
                  ) : (
                    codeChatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full accent-gradient flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        <div className={`max-w-xs p-3 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-[var(--acc1)]/20 text-white'
                            : 'bg-[#1a1e3f] text-white'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs text-[var(--muted)] mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  {isCodeChatLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full accent-gradient flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white animate-pulse" />
                      </div>
                      <div className="bg-[#1a1e3f] p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[var(--acc1)] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[var(--acc1)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[var(--acc1)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={codeChatEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-white/6 bg-[#06102a]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeChatInput}
                      onChange={(e) => setCodeChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCodeChatSend()}
                      placeholder="Ask about your code..."
                      className="flex-1 bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors"
                      disabled={isCodeChatLoading}
                    />
                    <button
                      onClick={handleCodeChatSend}
                      disabled={!codeChatInput.trim() || isCodeChatLoading}
                      className="bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {isCodeChatLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setCodeChatInput('Explain this code')}
                      className="text-xs bg-white/10 hover:bg-white/20 text-[var(--text)] px-2 py-1 rounded transition-colors"
                    >
                      Explain Code
                    </button>
                    <button
                      onClick={() => setCodeChatInput('Find bugs in this code')}
                      className="text-xs bg-white/10 hover:bg-white/20 text-[var(--text)] px-2 py-1 rounded transition-colors"
                    >
                      Find Bugs
                    </button>
                    <button
                      onClick={() => setCodeChatInput('Optimize this code')}
                      className="text-xs bg-white/10 hover:bg-white/20 text-[var(--text)] px-2 py-1 rounded transition-colors"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Terminal */}
          {(output || isRunning) && (
            <div className={`${isFullscreen ? 'h-40' : 'h-32'} border-t border-white/6 bg-[#0a0e1f] p-3`}>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Terminal</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-xs text-green-400">Active</div>
                </div>
                <button
                  onClick={() => setOutput('')}
                  className="ml-auto text-xs text-[var(--muted)] hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div 
                className={`text-xs font-mono text-green-400 whitespace-pre-wrap overflow-y-auto ${isFullscreen ? 'max-h-32' : 'max-h-20'}`}
              >
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeArea;