import React, { useState, useEffect } from 'react';
import { Bot, Play, Pause, Square, Zap, FileText, Code, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sendToAPI } from '../utils/api';
import { toast } from 'react-toastify';

interface BeastState {
  active: boolean;
  paused: boolean;
  progress: number;
  currentStep: string;
  filesWritten: number;
  totalFiles: number;
  lastPlan: string;
  lastTask: string;
}

const BeastCoder: React.FC = () => {
  const { 
    addMessage, 
    currentSessionId, 
    settings, 
    userMemory, 
    filesContext,
    createFile,
    updateFile,
    godMode,
    updateGodMode
  } = useAppStore();

  const [beastState, setBeastState] = useState<BeastState>({
    active: false,
    paused: false,
    progress: 0,
    currentStep: 'Ready',
    filesWritten: 0,
    totalFiles: 0,
    lastPlan: '',
    lastTask: ''
  });

  const [showPlanModal, setShowPlanModal] = useState(false);

  const startBeastTask = async (task: string) => {
    setBeastState(prev => ({ ...prev, lastTask: task }));
    await generatePlan(task);
  };

  const generatePlan = async (task: string) => {
    setBeastState(prev => ({ ...prev, currentStep: 'Generating plan...' }));
    
    try {
      const planResponse = await sendToAPI({
        message: `Create a detailed project plan for: ${task}\n\nProvide:\n1. File structure\n2. Technology stack\n3. Implementation steps\n4. File list with descriptions\n\nDo not write code yet, just the plan.`,
        mode: 'agent',
        settings: { ...settings, temperature: 0.2, maxTokens: 1000 },
        userMemory,
        filesContext: [],
        stylePreset: 'pro',
        sessionId: currentSessionId,
      });

      setBeastState(prev => ({ 
        ...prev, 
        lastPlan: planResponse,
        currentStep: 'Plan ready - review & approve'
      }));

      setShowPlanModal(true);

      addMessage(currentSessionId, {
        role: 'assistant',
        content: `📋 **Beast Coder Plan Generated!**\n\n${planResponse}\n\n🚀 **Ready to execute?** Review the plan and click "Approve & Execute" to start autonomous coding!`,
        timestamp: Date.now(),
      });

    } catch (error) {
      console.error('Plan generation failed:', error);
      setBeastState(prev => ({ 
        ...prev, 
        currentStep: 'Plan failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      }));
      toast.error('Plan generation failed');
    }
  };

  const startBeastExecution = async () => {
    if (beastState.active) return;

    setBeastState(prev => ({
      ...prev,
      active: true,
      paused: false,
      progress: 0,
      filesWritten: 0,
      currentStep: 'Beast Mode activated - starting autonomous coding...'
    }));

    setShowPlanModal(false);

    try {
      await continuousCodingLoop(beastState.lastTask);
    } catch (error) {
      console.error('Beast coding error:', error);
      setBeastState(prev => ({ 
        ...prev, 
        currentStep: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error')
      }));
      toast.error('Beast coding failed');
    } finally {
      setBeastState(prev => ({ 
        ...prev, 
        active: false,
        currentStep: 'Beast finished or stopped'
      }));
    }
  };

  const continuousCodingLoop = async (taskDescription: string) => {
    const systemPrompt = `You are NikkuAi09, an autonomous professional developer AI. You will produce the full project files progressively. Use this exact file output convention:

For each file, first output a line:
FILE: <relative/path/filename.ext>

Then output a fenced code block with language:
\`\`\`<language>
<file contents>
\`\`\`

When you are completely done with all files and tasks, output exactly: [ALL_DONE]
If you need user input or a manual pause, output exactly: [PAUSE_FOR_APPROVAL]
Keep your messages concise, avoid long explanation. Prioritize files and code.`;

    let history = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Task: ${taskDescription}\nProduce files using FILE markers + code fences. Start with minimal scaffold and continue until finished.` }
    ];

    let continuePrompt = 'Please continue the output from where you left off. Continue producing the next files/sections until complete. Reply only with FILE markers and code fences for files, and minimal necessary commentary. If completed, include [ALL_DONE].';
    let attemptCount = 0;
    let finished = false;

    while (beastState.active && !finished) {
      if (beastState.paused) {
        await waitForResume();
        if (!beastState.active) break;
      }

      setBeastState(prev => ({ ...prev, currentStep: 'Streaming from AI model...' }));

      try {
        const response = await sendToAPI({
          message: history[history.length - 1].content,
          mode: 'agent',
          settings: { ...settings, temperature: 0.2, maxTokens: 2048 },
          userMemory,
          filesContext,
          stylePreset: 'pro',
          sessionId: currentSessionId,
        });

        // Display response in chat
        addMessage(currentSessionId, {
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        });

        // Parse and write code blocks
        const blocks = parseCodeBlocks(response);
        if (blocks.length > 0) {
          await writeAndDebugBlocks(blocks);
        }

        // Check if finished
        if (/\[ALL_DONE\]/i.test(response)) {
          finished = true;
          setBeastState(prev => ({ ...prev, currentStep: 'Beast coding completed!' }));
          toast.success('🎉 Beast Mode completed the project!');
          break;
        }

        if (/\[PAUSE_FOR_APPROVAL\]/i.test(response)) {
          setBeastState(prev => ({ ...prev, currentStep: 'Paused for approval', paused: true }));
          await waitForResume();
          if (!beastState.active) break;
        }

        // Continue with next iteration
        history.push({ role: 'assistant', content: response });
        history.push({ role: 'user', content: continuePrompt });
        attemptCount = 0;

        // Update progress
        setBeastState(prev => ({ 
          ...prev, 
          progress: Math.min(95, prev.filesWritten * 10)
        }));

        // Small delay before next request
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error('Beast coding iteration failed:', error);
        attemptCount++;
        
        if (attemptCount > 6) {
          setBeastState(prev => ({ ...prev, currentStep: 'Max retries reached. Stopping Beast Mode.' }));
          break;
        }

        const backoff = 1000 * Math.pow(2, attemptCount);
        setBeastState(prev => ({ 
          ...prev, 
          currentStep: `Error: retrying in ${Math.round(backoff/1000)}s (attempt ${attemptCount})`
        }));
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }

    setBeastState(prev => ({ 
      ...prev, 
      currentStep: finished ? 'Beast completed successfully!' : 'Beast stopped',
      progress: 100
    }));
    
    // Reset progress after delay
    setTimeout(() => setBeastState(prev => ({ ...prev, progress: 0 })), 2000);
  };

  const parseCodeBlocks = (text: string) => {
    const blocks: Array<{ filename: string; language: string; content: string }> = [];
    
    // Look for FILE: marker pattern
    const fileRegex = /FILE:\s*([^\n\r]+)\s*\n(?:```(\w+)?\s*\n([\s\S]*?)```)/gi;
    let match;
    
    while ((match = fileRegex.exec(text)) !== null) {
      const filename = match[1].trim();
      const language = (match[2] || '').trim();
      const content = match[3] || '';
      
      blocks.push({ 
        filename, 
        language: language || guessLanguageFromName(filename), 
        content
      });
    }

    return blocks;
  };

  const writeAndDebugBlocks = async (blocks: Array<{ filename: string; language: string; content: string }>) => {
    for (const block of blocks) {
      try {
        let filename = block.filename;
        
        // Ensure proper extension
        if (!filename.includes('.') && block.language) {
          const ext = block.language === 'javascript' ? 'js' : 
                     block.language === 'typescript' ? 'ts' : 
                     block.language;
          filename = `${filename}.${ext}`;
        }

        // Create file
        createFile(filename, block.content);
        
        setBeastState(prev => ({ 
          ...prev, 
          filesWritten: prev.filesWritten + 1,
          currentStep: `Created file: ${filename}`
        }));
        
        toast.success(`📁 Created ${filename}`, { autoClose: 2000 });

      } catch (error) {
        console.error('Write block failed:', error);
        toast.error(`❌ Failed to create ${block.filename}`);
      }
    }
  };

  const guessLanguageFromName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript', 
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const waitForResume = async (): Promise<void> => {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!beastState.active || !beastState.paused) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 400);
    });
  };

  const stopBeast = () => {
    setBeastState(prev => ({ 
      ...prev, 
      active: false, 
      paused: false,
      currentStep: 'Beast Mode stopped by user'
    }));
    toast.info('🛑 Beast Mode stopped');
  };

  const pauseBeast = () => {
    if (beastState.active) {
      setBeastState(prev => ({ 
        ...prev, 
        paused: !prev.paused,
        currentStep: prev.paused ? 'Beast Mode resumed' : 'Beast Mode paused'
      }));
      toast.info(beastState.paused ? '▶️ Beast Mode resumed' : '⏸️ Beast Mode paused');
    }
  };

  // God Mode Integration
  useEffect(() => {
    if (godMode.active && godMode.currentMission && !beastState.active) {
      startBeastTask(godMode.currentMission);
    }
  }, [godMode.active, godMode.currentMission]);

  return (
    <>
      {/* Beast Coder Overlay */}
      <div className="fixed bottom-4 right-4 z-40 w-80">
        <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">NikkuBeastCoder</h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={pauseBeast}
                disabled={!beastState.active}
                className="p-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                {beastState.paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
              <button
                onClick={stopBeast}
                disabled={!beastState.active}
                className="p-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                <Square className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm text-purple-100 mb-1">{beastState.currentStep}</div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${beastState.progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const task = prompt('Describe your project:', 'Build a React portfolio website');
                if (task) startBeastTask(task);
              }}
              disabled={beastState.active}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {beastState.active ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Working...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start Beast
                </>
              )}
            </button>
          </div>

          <div className="mt-2 text-xs text-purple-200 text-center">
            Files: {beastState.filesWritten} | Status: {beastState.active ? 'Active' : 'Idle'}
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPlanModal(false)} />
          <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500/30 rounded-xl p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">🤖 Beast Coder Plan</h3>
              <div className="flex gap-2">
                <button
                  onClick={startBeastExecution}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  ✅ Approve & Execute
                </button>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <pre className="text-purple-100 whitespace-pre-wrap">{beastState.lastPlan}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeastCoder;