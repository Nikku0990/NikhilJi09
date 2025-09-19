import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface FileItem {
  name: string;
  content: string;
  language?: string;
  lastModified: number;
}

export interface AppSettings {
  // API Settings
  baseUrl: string;
  apiKey: string;
  model: string;
  
  // Generation Settings
  temperature: number;
  topP: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stream: boolean;
  
  // UI Settings
  renderMarkdown: boolean;
  codeBlocksCollapsible: boolean;
  autoScroll: boolean;
  timestamps: boolean;
  typingIndicator: boolean;
  sendSound: boolean;
  enterToSend: boolean;
  compactBubbles: boolean;
  themeGlow: boolean;
  liveTyping: boolean;
  
  // Memory & Context
  memoryEnabled: boolean;
  autoLearn: boolean;
  injectMemory: boolean;
  includeHistory: boolean;
  summarizeLongHistory: boolean;
  includeFilesInPrompt: boolean;
  conversationMemory: boolean;
  
  // Safety
  refuseHarmful: boolean;
  avoidPII: boolean;
  safeToolUse: boolean;
  avoidCopyright: boolean;
  noBackgroundTasks: boolean;
  biasCheck: boolean;
  
  // Project Builder
  writeTests: boolean;
  writeDocs: boolean;
  writeDockerfile: boolean;
  writeReadme: boolean;
  architectureNotes: boolean;
  performanceTips: boolean;
  
  // Advanced Features
  autoCodeEditor: boolean;
  smartSuggestions: boolean;
  codeAnalysis: boolean;
  securityScan: boolean;
  performanceMonitor: boolean;
  collaborativeMode: boolean;
  versionControl: boolean;
  deploymentPipeline: boolean;
  testingFramework: boolean;
  documentationGen: boolean;
}

export interface UserMemory {
  name: string;
  about: string;
  preferences: string[];
  projects: string[];
  conversationHistory: string[];
  learningPoints: string[];
  codeStyle: string;
  favoriteLanguages: string[];
}

export interface AppState {
  // Core State
  currentMode: 'agent' | 'chat';
  currentSessionId: string;
  sessions: Record<string, Session>;
  
  // UI State
  showCodeArea: boolean;
  showSettings: boolean;
  showPreviousChats: boolean;
  showAnalytics: boolean;
  showCommandPalette: boolean;
  activeFile: string | null;
  
  // Files
  files: FileItem[];
  filesContext: FileItem[];
  
  // Settings
  settings: AppSettings;
  userMemory: UserMemory;
  
  // Analytics
  analytics: {
    totalMessages: number;
    totalSessions: number;
    totalFiles: number;
    totalCodeLines: number;
    favoriteLanguages: Record<string, number>;
    dailyUsage: Record<string, number>;
  };
  
  // Actions
  setMode: (mode: 'agent' | 'chat') => void;
  createNewSession: (title?: string) => void;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'id'>) => void;
  removeThinkingMessage: (sessionId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateUserMemory: (memory: Partial<UserMemory>) => void;
  
  // File Actions
  createFile: (name: string, content?: string) => void;
  updateFile: (name: string, content: string) => void;
  deleteFile: (name: string) => void;
  setActiveFile: (name: string | null) => void;
  addFileToContext: (file: FileItem) => void;
  removeFileFromContext: (fileName: string) => void;
  
  // UI Actions
  toggleCodeArea: () => void;
  toggleSettings: () => void;
  togglePreviousChats: () => void;
  toggleAnalytics: () => void;
  toggleCommandPalette: () => void;
  
  // Analytics Actions
  updateAnalytics: () => void;
  
  // Cosmic Features State
  cosmicFeatures: {
    codeTelepathy: boolean;
    selfEvolvingCode: boolean;
    holographicVisualizer: boolean;
    emotionSyntaxHighlighting: boolean;
    autonomousPairProgrammer: boolean;
    realityCompiler: boolean;
    timeLoopOptimizer: boolean;
    soulVersionControl: boolean;
    cosmicUI: boolean;
    digitalGodMode: boolean;
  };
  updateCosmicFeatures: (features: Partial<AppState['cosmicFeatures']>) => void;
}

const defaultSettings: AppSettings = {
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'google/gemini-1.5-flash',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 8000,
  presencePenalty: 0,
  frequencyPenalty: 0,
  stream: false,
  renderMarkdown: true,
  codeBlocksCollapsible: true,
  autoScroll: true,
  timestamps: true,
  typingIndicator: true,
  sendSound: true,
  enterToSend: true,
  compactBubbles: false,
  themeGlow: true,
  liveTyping: true,
  memoryEnabled: true,
  autoLearn: true,
  injectMemory: true,
  includeHistory: true,
  summarizeLongHistory: true,
  includeFilesInPrompt: true,
  conversationMemory: true,
  refuseHarmful: true,
  avoidPII: true,
  safeToolUse: true,
  avoidCopyright: true,
  noBackgroundTasks: true,
  biasCheck: true,
  writeTests: true,
  writeDocs: true,
  writeDockerfile: true,
  writeReadme: true,
  architectureNotes: true,
  performanceTips: true,
  autoCodeEditor: true,
  smartSuggestions: true,
  codeAnalysis: true,
  securityScan: true,
  performanceMonitor: true,
  collaborativeMode: false,
  versionControl: true,
  deploymentPipeline: false,
  testingFramework: true,
  documentationGen: true,
};

const defaultUserMemory: UserMemory = {
  name: '',
  about: '',
  preferences: [],
  projects: [],
  conversationHistory: [],
  learningPoints: [],
  codeStyle: 'clean',
  favoriteLanguages: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentMode: 'agent',
      currentSessionId: 's_' + Math.random().toString(36).slice(2, 9),
      sessions: {},
      showCodeArea: false,
      showSettings: false,
      showPreviousChats: false,
      showAnalytics: false,
      showCommandPalette: false,
      activeFile: null,
      files: [],
      filesContext: [],
      settings: defaultSettings,
      userMemory: defaultUserMemory,
      analytics: {
        totalMessages: 0,
        totalSessions: 0,
        totalFiles: 0,
        totalCodeLines: 0,
        favoriteLanguages: {},
        dailyUsage: {},
      },

      cosmicFeatures: {
        codeTelepathy: false,
        selfEvolvingCode: false,
        holographicVisualizer: false,
        emotionSyntaxHighlighting: false,
        autonomousPairProgrammer: false,
        realityCompiler: false,
        timeLoopOptimizer: false,
        soulVersionControl: false,
        cosmicUI: false,
        digitalGodMode: false,
      },

      // Actions
      setMode: (mode) => set({ currentMode: mode }),
      
      createNewSession: (title) => {
        const newSessionId = 's_' + Math.random().toString(36).slice(2, 9);
        const sessionTitle = title || `New Project ${new Date().toLocaleDateString()}`;
        
        set((state) => ({
          currentSessionId: newSessionId,
          files: [], // Reset files for new session
          filesContext: [], // Reset file context
          activeFile: null, // Reset active file
          sessions: {
            ...state.sessions,
            [newSessionId]: {
              id: newSessionId,
              title: sessionTitle,
              messages: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          }
        }));
      },
      
      setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),
      
      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = { ...state.sessions };
          delete newSessions[sessionId];
          
          // If deleting current session, create a new one
          const newCurrentId = sessionId === state.currentSessionId 
            ? 's_' + Math.random().toString(36).slice(2, 9)
            : state.currentSessionId;
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          };
        });
      },
      
      addMessage: (sessionId, message) => {
        const messageWithId: Message = {
          ...message,
          id: 'm_' + Math.random().toString(36).slice(2, 9),
        };
        
        set((state) => {
          const session = state.sessions[sessionId] || {
            id: sessionId,
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          const updatedMessages = [...session.messages, messageWithId];
          
          // Update title if this is the first user message
          const title = updatedMessages.length === 1 && message.role === 'user' 
            ? message.content.slice(0, 40) + (message.content.length > 40 ? '…' : '')
            : session.title;
          
          // Update user memory with conversation context
          const newUserMemory = { ...state.userMemory };
          if (state.settings.conversationMemory && message.role === 'user') {
            newUserMemory.conversationHistory = [
              ...newUserMemory.conversationHistory.slice(-20), // Keep last 20 interactions
              message.content
            ];
          }
          
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                title,
                messages: updatedMessages,
                updatedAt: Date.now(),
              },
            },
            userMemory: newUserMemory,
            analytics: {
              ...state.analytics,
              totalMessages: state.analytics.totalMessages + 1,
            }
          };
        });
      },
      
      removeThinkingMessage: (sessionId) => {
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;
          
          const updatedMessages = session.messages.filter(m => m.role !== 'thinking');
          
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: updatedMessages,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
      
      updateUserMemory: (newMemory) => 
        set((state) => ({ 
          userMemory: { ...state.userMemory, ...newMemory } 
        })),
      
      // File Actions
      createFile: (name, content = '') => {
        set((state) => {
          const newFile = {
            name,
            content,
            language: getLanguageFromFileName(name),
            lastModified: Date.now(),
          };
          
          return {
            files: [
              ...state.files.filter(f => f.name !== name),
              newFile,
            ],
            analytics: {
              ...state.analytics,
              totalFiles: state.analytics.totalFiles + 1,
              totalCodeLines: state.analytics.totalCodeLines + content.split('\n').length,
            }
          };
        });
      },
      
      updateFile: (name, content) => {
        set((state) => ({
          files: state.files.map(f => 
            f.name === name 
              ? { ...f, content, lastModified: Date.now() }
              : f
          ),
        }));
      },
      
      deleteFile: (name) => {
        set((state) => ({
          files: state.files.filter(f => f.name !== name),
          activeFile: state.activeFile === name ? null : state.activeFile,
          filesContext: state.filesContext.filter(f => f.name !== name),
        }));
      },
      
      setActiveFile: (name) => set({ activeFile: name }),
      
      addFileToContext: (file) => {
        set((state) => ({
          filesContext: [
            ...state.filesContext.filter(f => f.name !== file.name),
            { ...file, content: (file.content && typeof file.content === 'string') ? file.content : '' },
          ],
        }));
      },
      
      removeFileFromContext: (fileName) => {
        set((state) => ({
          filesContext: state.filesContext.filter(f => f.name !== fileName),
        }));
      },
      
      // UI Actions
      toggleCodeArea: () => set((state) => ({ showCodeArea: !state.showCodeArea })),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      togglePreviousChats: () => set((state) => ({ showPreviousChats: !state.showPreviousChats })),
      toggleAnalytics: () => set((state) => ({ showAnalytics: !state.showAnalytics })),
      toggleCommandPalette: () => set((state) => ({ showCommandPalette: !state.showCommandPalette })),
      
      // Analytics Actions
      updateAnalytics: () => {
        set((state) => {
          const today = new Date().toDateString();
          return {
            analytics: {
              ...state.analytics,
              totalSessions: Object.keys(state.sessions).length,
              dailyUsage: {
                ...state.analytics.dailyUsage,
                [today]: (state.analytics.dailyUsage[today] || 0) + 1,
              }
            }
          };
        });
      },
      
      updateCosmicFeatures: (newFeatures) => 
        set((state) => ({ 
          cosmicFeatures: { ...state.cosmicFeatures, ...newFeatures } 
        })),
    }),
    {
      name: 'nikku-ai-store',
      partialize: (state) => ({
        sessions: state.sessions,
        settings: state.settings,
        userMemory: state.userMemory,
        files: state.files,
        currentSessionId: state.currentSessionId,
        analytics: state.analytics,
      }),
    }
  )
);

function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'fish': 'shell',
    'ps1': 'powershell',
    'dockerfile': 'dockerfile',
    'r': 'r',
    'matlab': 'matlab',
    'lua': 'lua',
    'perl': 'perl',
    'dart': 'dart',
    'elm': 'elm',
    'haskell': 'haskell',
    'clojure': 'clojure',
    'erlang': 'erlang',
    'elixir': 'elixir',
    'fsharp': 'fsharp',
    'ocaml': 'ocaml',
    'reason': 'reason',
    'nim': 'nim',
    'crystal': 'crystal',
    'zig': 'zig',
    'v': 'v',
    'solidity': 'solidity',
    'move': 'move',
  };
  
  return languageMap[ext || ''] || 'plaintext';
}