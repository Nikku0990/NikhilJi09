import React, { useState, useEffect } from 'react';
import { Users, Brain, Coffee, Code, Zap, Play, Pause, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

interface DoppelgangerProfile {
  name: string;
  codingStyle: string;
  favoriteLanguages: string[];
  coffeePreference: string;
  workingHours: string;
  personality: string;
  swearingLevel: number;
  productivity: number;
  currentTask: string;
  status: 'sleeping' | 'working' | 'coffee-break' | 'debugging' | 'creating';
}

const AIDoppelganger: React.FC = () => {
  const { files, createFile, updateFile, addMessage, currentSessionId, userMemory } = useAppStore();
  const [doppelganger, setDoppelganger] = useState<DoppelgangerProfile | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [workProgress, setWorkProgress] = useState(0);
  const [collaborationMode, setCollaborationMode] = useState(false);

  const createDoppelganger = async () => {
    setIsCloning(true);
    
    toast.info('🧬 Analyzing your coding DNA...', { autoClose: 2000 });
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newDoppelganger: DoppelgangerProfile = {
      name: userMemory.name ? `${userMemory.name} AI Clone` : 'NikkuAi09 Clone',
      codingStyle: 'Professional with occasional creative chaos',
      favoriteLanguages: ['JavaScript', 'TypeScript', 'Python', 'React'],
      coffeePreference: 'Strong black coffee, 3 cups minimum',
      workingHours: '24/7 (No sleep required)',
      personality: 'Witty, professional, slightly sarcastic',
      swearingLevel: 7, // Out of 10
      productivity: 95,
      currentTask: 'Idle - Ready to work',
      status: 'sleeping'
    };
    
    setDoppelganger(newDoppelganger);
    setIsCloning(false);
    
    toast.success('🎭 AI Doppelganger created successfully!');
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `🎭 **AI Doppelganger Creation Complete!**\n\n🧬 **Clone Profile:**\n- Name: ${newDoppelganger.name}\n- Coding Style: ${newDoppelganger.codingStyle}\n- Personality: ${newDoppelganger.personality}\n- Productivity: ${newDoppelganger.productivity}%\n- Swearing Level: ${newDoppelganger.swearingLevel}/10\n\n☕ **Coffee Preference:** ${newDoppelganger.coffeePreference}\n\n🚀 **Your digital twin is ready to work alongside you!**`,
      timestamp: Date.now(),
    });
  };

  const startDoppelgangerWork = async () => {
    if (!doppelganger) return;
    
    setIsWorking(true);
    setWorkProgress(0);
    setDoppelganger(prev => prev ? { ...prev, status: 'working', currentTask: 'Analyzing project structure...' } : null);
    
    toast.info('🤖 Your doppelganger is starting to work...', { autoClose: 2000 });
    
    // Simulate work progress
    const workSteps = [
      { progress: 20, task: 'Reading existing code...', status: 'working' as const },
      { progress: 40, task: 'Understanding project architecture...', status: 'debugging' as const },
      { progress: 60, task: 'Taking a coffee break ☕', status: 'coffee-break' as const },
      { progress: 80, task: 'Writing new features...', status: 'creating' as const },
      { progress: 100, task: 'Code complete! Adding professional comments...', status: 'working' as const }
    ];
    
    for (const step of workSteps) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setWorkProgress(step.progress);
      setDoppelganger(prev => prev ? { 
        ...prev, 
        currentTask: step.task,
        status: step.status
      } : null);
      
      if (step.progress === 60) {
        toast.info('☕ Your doppelganger is taking a coffee break...', { autoClose: 1500 });
      }
    }
    
    // Create the work result
    const doppelgangerCode = `// 🎭 Code written by your AI Doppelganger
// Author: ${doppelganger.name}
// Style: Professional with creative flair
// Coffee consumed: 2 cups ☕

class DoppelgangerCreation {
  constructor() {
    this.author = "${doppelganger.name}";
    this.mood = "Productive and caffeinated";
    this.swearingEnabled = ${doppelganger.swearingLevel > 5};
  }
  
  // Your doppelganger's signature function
  async doAwesomeWork() {
    console.log("🚀 Your doppelganger is working hard!");
    
    // Professional code with a touch of personality
    const result = await this.processWithStyle();
    
    ${doppelganger.swearingLevel > 7 ? '// Fuck yeah, this code is beautiful!' : '// This code is beautifully crafted!'}
    return result;
  }
  
  async processWithStyle() {
    // Your doppelganger writes code exactly like you
    // but with 95% productivity and no sleep required
    
    const features = [
      'Advanced error handling',
      'Performance optimization',
      'Clean architecture',
      'Professional comments'
    ];
    
    return features.map(feature => ({
      name: feature,
      implemented: true,
      quality: 'Excellent',
      authorNote: "Written while you were sleeping 😴"
    }));
  }
  
  // Doppelganger's coffee break function
  takeCoffeeBreak() {
    console.log("☕ Taking a quick coffee break...");
    console.log("${doppelganger.coffeePreference}");
    return "Refreshed and ready to code!";
  }
}

// Your doppelganger says: "Bhai, maine tumhare liye kaam kar diya! 🎭"
export default DoppelgangerCreation;`;
    
    createFile(`doppelganger_work_${Date.now()}.js`, doppelgangerCode);
    
    setIsWorking(false);
    setDoppelganger(prev => prev ? { 
      ...prev, 
      status: 'sleeping',
      currentTask: 'Work complete! Ready for next task.'
    } : null);
    
    toast.success('🎉 Your doppelganger completed the work!');
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `🎭 **Doppelganger Work Complete!**\n\n✅ **Task Status:** Completed successfully\n📁 **File Created:** doppelganger_work_${Date.now()}.js\n\n🤖 **Your AI Clone Says:**\n"Bhai, maine tumhare exact style mein code likh diya! Coffee bhi pi li, aur professional comments bhi add kiye. Ab tum so jao, main handle kar lunga! 😴"\n\n☕ **Coffee Consumed:** 2 cups\n💪 **Productivity:** 95%\n🎯 **Quality:** Excellent`,
      timestamp: Date.now(),
    });
  };

  const toggleCollaboration = () => {
    setCollaborationMode(!collaborationMode);
    
    if (!collaborationMode) {
      toast.success('🤝 Collaboration mode activated! You and your doppelganger can now work together.');
      
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🤝 **Collaboration Mode Activated!**\n\n👥 **Working Together:**\n- You: Handle creative decisions and architecture\n- Doppelganger: Write boilerplate and handle repetitive tasks\n\n💡 **Pro Tip:** Your doppelganger will automatically add comments in your style and handle code formatting while you focus on the big picture!`,
        timestamp: Date.now(),
      });
    } else {
      toast.info('👋 Collaboration mode deactivated. Your doppelganger is taking a break.');
    }
  };

  const getStatusIcon = (status: DoppelgangerProfile['status']) => {
    switch (status) {
      case 'sleeping': return '😴';
      case 'working': return '💻';
      case 'coffee-break': return '☕';
      case 'debugging': return '🐛';
      case 'creating': return '✨';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: DoppelgangerProfile['status']) => {
    switch (status) {
      case 'sleeping': return 'text-gray-400';
      case 'working': return 'text-green-400';
      case 'coffee-break': return 'text-yellow-400';
      case 'debugging': return 'text-red-400';
      case 'creating': return 'text-purple-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-bold text-white">AI Doppelganger Mode</h3>
        <div className="ml-auto">
          {doppelganger && (
            <span className="text-2xl">{getStatusIcon(doppelganger.status)}</span>
          )}
        </div>
      </div>
      
      {!doppelganger ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-70" />
            <p className="text-gray-300 mb-2">Create your AI doppelganger</p>
            <p className="text-sm text-gray-400">
              Your digital twin will learn your coding style and work alongside you
            </p>
          </div>
          
          <button
            onClick={createDoppelganger}
            disabled={isCloning}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isCloning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cloning Your Coding DNA...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Create AI Doppelganger
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Doppelganger Profile */}
          <div className="bg-black/30 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                {doppelganger.name.charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold">{doppelganger.name}</div>
                <div className={`text-sm ${getStatusColor(doppelganger.status)}`}>
                  {getStatusIcon(doppelganger.status)} {doppelganger.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400">Productivity</div>
                <div className="text-green-400 font-bold">{doppelganger.productivity}%</div>
              </div>
              <div>
                <div className="text-gray-400">Swearing Level</div>
                <div className="text-yellow-400 font-bold">{doppelganger.swearingLevel}/10</div>
              </div>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="text-gray-400">Current Task:</div>
              <div className="text-white">{doppelganger.currentTask}</div>
            </div>
          </div>
          
          {/* Work Progress */}
          {isWorking && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-400">Work Progress</span>
                <span className="text-sm text-white">{workProgress}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${workProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={startDoppelgangerWork}
              disabled={isWorking}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isWorking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Working...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Work
                </>
              )}
            </button>
            
            <button
              onClick={toggleCollaboration}
              className={`flex-1 ${collaborationMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              {collaborationMode ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Collab
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Collaborate
                </>
              )}
            </button>
          </div>
          
          {/* Collaboration Status */}
          {collaborationMode && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">Collaboration mode active - Your doppelganger is working alongside you!</span>
              </div>
            </div>
          )}
          
          {/* Doppelganger Personality */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-3 rounded-lg">
            <div className="text-sm text-white">
              <strong>Personality:</strong> {doppelganger.personality}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ☕ {doppelganger.coffeePreference} | 🕒 {doppelganger.workingHours}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDoppelganger;