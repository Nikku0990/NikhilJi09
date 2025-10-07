import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Zap, Brain, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ApiClient } from '../engine/apiClient';
import { MonacoAdapter } from '../engine/monacoAdapter';
import { Orchestrator } from '../engine/orchestrator';
import { toast } from 'react-toastify';
import PlanApprovalModal from './PlanApprovalModal';

interface OrchestratorStatus {
  active: boolean;
  paused: boolean;
  progress: number;
  filesWritten: number;
  step: string;
  currentTask: string;
}

const OrchestratorControl: React.FC = () => {
  const { 
    settings, 
    files, 
    createFile, 
    addMessage, 
    currentSessionId,
    userMemory,
    filesContext 
  } = useAppStore();
  
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);
  const [status, setStatus] = useState<OrchestratorStatus>({
    active: false,
    paused: false,
    progress: 0,
    filesWritten: 0,
    step: 'Ready',
    currentTask: ''
  });
  const [currentPlan, setCurrentPlan] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [pendingTask, setPendingTask] = useState('');
  const [streamingContent, setStreamingContent] = useState('');

  useEffect(() => {
    // Initialize orchestrator
    const apiClient = new ApiClient({
      engine: settings.baseUrl.includes('openrouter') ? 'openrouter' : 
              settings.baseUrl.includes('localhost') ? 'ollama' : 'custom',
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
      model: settings.model
    });

    const monacoAdapter = new MonacoAdapter();
    const orch = new Orchestrator(apiClient, monacoAdapter);

    // Set up callbacks
    orch.setStatusCallback((newStatus) => {
      setStatus(newStatus);
    });

    orch.setFileCreatedCallback((file) => {
      createFile(file.name, file.content);
      toast.success(`📁 Created ${file.name}`);
    });

    orch.setChunkCallback((chunk) => {
      setStreamingContent(prev => prev + chunk);
    });

    setOrchestrator(orch);
  }, [settings, createFile]);

  const generatePlan = async (task: string) => {
    if (!orchestrator) return;

    try {
      setStatus(prev => ({ ...prev, step: 'Generating plan...', currentTask: task }));
      
      const plan = await orchestrator.generatePlan(task);
      setCurrentPlan(plan);
      setPendingTask(task);
      setShowPlanModal(true);
      
      toast.success('📋 Project plan generated!');
    } catch (error) {
      toast.error(`❌ Plan generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus(prev => ({ ...prev, step: 'Plan generation failed' }));
    }
  };

  const executePlan = async () => {
    if (!orchestrator || !pendingTask) return;

    setShowPlanModal(false);
    
    try {
      await orchestrator.executePlan(pendingTask);
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🚀 **Orchestrator Execution Started!**\n\n📋 **Task:** ${pendingTask}\n🎯 **Mode:** Autonomous execution\n⚡ **Status:** Running continuously until completion\n\n🤖 **The AI will now:**\n- Generate files progressively\n- Parse FILE: markers automatically\n- Update Monaco editor in real-time\n- Track progress and status\n- Stop when [ALL_DONE] is reached\n\n✨ **Sit back and watch the magic happen!**`,
        timestamp: Date.now(),
      });
    } catch (error) {
      toast.error(`❌ Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const pauseExecution = () => {
    if (orchestrator) {
      orchestrator.pause();
      toast.info('⏸️ Orchestrator paused');
    }
  };

  const resumeExecution = () => {
    if (orchestrator) {
      orchestrator.resume();
      toast.success('▶️ Orchestrator resumed');
    }
  };

  const stopExecution = () => {
    if (orchestrator) {
      orchestrator.stop();
      setStreamingContent('');
      toast.info('🛑 Orchestrator stopped');
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🛑 **Orchestrator Stopped**\n\n📊 **Final Status:**\n- Files Written: ${status.filesWritten}\n- Progress: ${status.progress}%\n- Last Step: ${status.step}\n\n✨ **Session Summary:** Orchestrator completed ${status.filesWritten} files before stopping.`,
        timestamp: Date.now(),
      });
    }
  };

  const handlePlanApproval = () => {
    executePlan();
  };

  const handlePlanRejection = () => {
    setShowPlanModal(false);
    setCurrentPlan('');
    setPendingTask('');
    toast.info('📋 Plan rejected');
  };

  const handlePlanEdit = (editedPlan: string) => {
    setCurrentPlan(editedPlan);
    toast.success('📝 Plan updated');
  };

  const quickTasks = [
    'Build a React portfolio website with modern design',
    'Create a todo app with local storage',
    'Build an e-commerce product catalog',
    'Create a blog with markdown support',
    'Build a dashboard with charts and analytics',
    'Create a chat application with real-time features'
  ];

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-[var(--acc1)]" />
        <h3 className="text-lg font-bold text-white">Orchestrator Control</h3>
        <div className="ml-auto">
          {status.active && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-[#1a1e3f] border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            {status.active ? (
              status.paused ? (
                <Pause className="w-4 h-4 text-yellow-400" />
              ) : (
                <Play className="w-4 h-4 text-green-400" />
              )
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-white font-medium">{status.step}</span>
          </div>
          
          {status.currentTask && (
            <div className="text-sm text-gray-300 mb-2">
              Task: {status.currentTask}
            </div>
          )}
          
          {status.progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{status.progress}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Files Written: {status.filesWritten}</span>
            <span>Status: {status.active ? (status.paused ? 'Paused' : 'Running') : 'Idle'}</span>
          </div>
        </div>

        {/* Quick Task Buttons */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Quick Tasks</label>
          <div className="grid grid-cols-1 gap-2">
            {quickTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => generatePlan(task)}
                disabled={status.active}
                className="text-left p-2 bg-[#14183f] hover:bg-[#1a1e47] disabled:opacity-50 border border-white/8 hover:border-white/15 rounded-lg transition-colors"
              >
                <div className="text-sm text-white">{task}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Task Input */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Custom Task</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Describe your project..."
              className="flex-1 bg-black/30 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    generatePlan(target.value.trim());
                    target.value = '';
                  }
                }
              }}
              disabled={status.active}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Describe your project..."]') as HTMLInputElement;
                if (input?.value.trim()) {
                  generatePlan(input.value.trim());
                  input.value = '';
                }
              }}
              disabled={status.active}
              className="bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orchestrator Controls */}
        {status.active && (
          <div className="flex gap-2">
            {status.paused ? (
              <button
                onClick={resumeExecution}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseExecution}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            
            <button
              onClick={stopExecution}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </div>
        )}

        {/* Streaming Content Preview */}
        {streamingContent && (
          <div className="bg-black/30 border border-blue-500/20 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div className="text-sm text-blue-400 mb-1">Live Stream:</div>
            <div className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
              {streamingContent.slice(-500)}...
            </div>
          </div>
        )}
      </div>

      {/* Plan Approval Modal */}
      <PlanApprovalModal
        plan={currentPlan}
        onApprove={handlePlanApproval}
        onReject={handlePlanRejection}
        onEdit={handlePlanEdit}
        isVisible={showPlanModal}
      />
    </div>
  );
};

export default OrchestratorControl;