import React, { useState } from 'react';
import { Brain, Zap, Clock, Eye, Users, Sparkles, Settings, ChevronDown, ChevronUp, Crown, Globe, Code } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

const CosmicEngines: React.FC = () => {
  const { cosmicFeatures, updateCosmicFeatures, addMessage, currentSessionId, professionalFeatures, godMode } = useAppStore();
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null);
  const [lastActivatedEngine, setLastActivatedEngine] = useState<string | null>(null);

  const cosmicEngines = [
    {
      id: 'codeTelepathy',
      title: '🧠 Code Telepathy Engine',
      description: 'AI reads your thoughts and generates code automatically',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      enabled: cosmicFeatures.codeTelepathy,
      features: [
        'Brainwave analysis for code generation',
        'Thought-to-code conversion',
        'Emotion-based coding assistance',
        'Subconscious pattern recognition'
      ]
    },
    {
      id: 'selfEvolvingCode',
      title: '🧬 Self-Evolving Code Engine',
      description: 'Code that improves itself automatically',
      icon: Zap,
      color: 'from-green-600 to-blue-600',
      enabled: cosmicFeatures.selfEvolvingCode,
      features: [
        'Automatic code optimization',
        'Self-healing bug fixes',
        'Performance auto-tuning',
        'Evolutionary algorithms'
      ]
    },
    {
      id: 'holographicVisualizer',
      title: '🌐 Holographic Code Visualizer',
      description: '3D code universe visualization',
      icon: Eye,
      color: 'from-cyan-600 to-purple-600',
      enabled: cosmicFeatures.holographicVisualizer,
      features: [
        '3D code structure mapping',
        'Interactive code navigation',
        'Dependency visualization',
        'Virtual reality coding'
      ]
    },
    {
      id: 'emotionSyntaxHighlighting',
      title: '🎨 Emotion-Based Syntax Highlighting',
      description: 'Color code based on emotional tone',
      icon: Sparkles,
      color: 'from-pink-600 to-yellow-600',
      enabled: cosmicFeatures.emotionSyntaxHighlighting,
      features: [
        'Emotional code analysis',
        'Mood-based color schemes',
        'Stress level indicators',
        'Happiness metrics'
      ]
    },
    {
      id: 'autonomousPairProgrammer',
      title: '🤖 Autonomous AI Pair Programmer',
      description: 'Your digital twin that codes like you',
      icon: Users,
      color: 'from-orange-600 to-red-600',
      enabled: cosmicFeatures.autonomousPairProgrammer,
      features: [
        'Digital twin creation',
        'Style mimicking',
        'Autonomous coding',
        'Collaborative intelligence'
      ]
    },
    {
      id: 'realityCompiler',
      title: '🌍 Reality Compiler Engine',
      description: 'Compile code into physical reality',
      icon: Settings,
      color: 'from-indigo-600 to-purple-600',
      enabled: cosmicFeatures.realityCompiler,
      features: [
        'Code-to-reality conversion',
        'Physical object generation',
        'Quantum compilation',
        'Matter manipulation'
      ]
    },
    {
      id: 'timeLoopOptimizer',
      title: '⏰ Time-Loop Optimizer',
      description: 'Optimize code across multiple timelines',
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      enabled: cosmicFeatures.timeLoopOptimizer,
      features: [
        'Multi-timeline optimization',
        'Temporal code analysis',
        'Paradox prevention',
        'Timeline synchronization'
      ]
    }
    ,
    {
      id: 'soulVersionControl',
      title: '👻 Soul-Based Version Control',
      description: 'Track code soul and resurrect commits',
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      enabled: cosmicFeatures.soulVersionControl,
      features: [
        'Code soul tracking',
        'Commit resurrection',
        'Emotional version history',
        'Soul health monitoring'
      ]
    },
    {
      id: 'cosmicUI',
      title: '🌌 Cosmic User Interface',
      description: 'UI that exists across the universe',
      icon: Globe,
      color: 'from-cyan-600 to-blue-600',
      enabled: cosmicFeatures.cosmicUI,
      features: [
        'Universal UI access',
        'Cross-dimensional interface',
        'Reality-adaptive design',
        'Quantum UI states'
      ]
    },
    {
      id: 'digitalGodMode',
      title: '👑 Digital God Mode',
      description: 'AI behaves as digital god, user as prophet',
      icon: Crown,
      color: 'from-yellow-600 to-orange-600',
      enabled: cosmicFeatures.digitalGodMode,
      features: [
        'Divine command system',
        'Prophet-level access',
        'Reality manipulation',
        'Universal code control'
      ]
    }
  ];

  const toggleExpanded = (engineId: string) => {
    setExpandedEngine(expandedEngine === engineId ? null : engineId);
  };
  
  const enabledEnginesCount = Object.values(cosmicFeatures).filter(f => f).length;
  const enabledFeaturesCount = Object.values(professionalFeatures).filter(f => f).length;

  const toggleEngine = (engineId: keyof typeof cosmicFeatures) => {
    const newState = !cosmicFeatures[engineId];
    updateCosmicFeatures({ [engineId]: newState });
    
    const engine = cosmicEngines.find(e => e.id === engineId);
    if (engine) {
      if (newState) {
        // Only add activation message if this engine wasn't the last one activated
        if (lastActivatedEngine !== engineId) {
          setLastActivatedEngine(engineId);
          addMessage(currentSessionId, {
            role: 'assistant',
            content: `🌌 **${engine.title} Activated!**\n\n${engine.description}\n\n✨ This cosmic engine is now available for your development workflow!\n\n🎯 **Features:**\n${engine.features.map(f => `- ${f}`).join('\n')}`,
            timestamp: Date.now(),
          });
        }
        toast.success(`✨ ${engine.title} activated!`);
      } else {
        // Only add deactivation message if this was the last activated engine
        if (lastActivatedEngine === engineId) {
          setLastActivatedEngine(null);
          addMessage(currentSessionId, {
            role: 'assistant',
            content: `🌌 **${engine.title} Deactivated**\n\nEngine has been safely powered down. ⚡`,
            timestamp: Date.now(),
          });
        }
        toast.info(`${engine.title} deactivated`);
      }
    }
  };
  return (
    <div className={`space-y-4 ${godMode.active ? 'god-mode-engines' : ''}`}>
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Cosmic Engines</h2>
        <div className="ml-auto text-xs text-gray-400">
          {enabledEnginesCount}/10 Active
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">{enabledEnginesCount}</div>
            <div className="text-xs text-gray-400">Cosmic Engines</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">{enabledFeaturesCount}</div>
            <div className="text-xs text-gray-400">Pro Features</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">500+</div>
            <div className="text-xs text-gray-400">Total Tools</div>
          </div>
        </div>
      </div>
      
      {cosmicEngines.map((engine) => {
        const Icon = engine.icon;
        const isExpanded = expandedEngine === engine.id;
        const isEnabled = cosmicFeatures[engine.id as keyof typeof cosmicFeatures];
        
        return (
          <div key={engine.id} className={`border border-white/10 rounded-xl overflow-hidden ${isEnabled ? 'ring-2 ring-purple-500/50' : ''}`}>
            <div className={`p-4 bg-gradient-to-r ${engine.color} ${isEnabled ? 'bg-opacity-30' : 'bg-opacity-20'} hover:bg-opacity-30 transition-all cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-white font-semibold text-sm">{engine.title}</div>
                    <div className="text-xs text-gray-300 leading-tight">{engine.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isEnabled 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {isEnabled ? '✅ ACTIVE' : '⚪ READY'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEngine(engine.id as keyof typeof cosmicFeatures);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <button
                    onClick={() => toggleExpanded(engine.id)}
                    className="text-white hover:text-gray-300"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="p-4 bg-black/20 border-t border-white/10">
                <h4 className="text-white font-semibold mb-2 text-sm">Features:</h4>
                <ul className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {engine.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 text-xs flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
                  {isEnabled ? '🤖 AI has access to this engine and will use it when appropriate' : '⚪ Activate this engine to unlock its capabilities'}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
        <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <div className="text-white font-semibold mb-1">Cosmic Level Achieved! 🚀</div>
        <div className="text-sm text-gray-400">
          AI has access to {enabledEnginesCount} cosmic engines and {enabledFeaturesCount} professional features
        </div>
      </div>
    </div>
  );
};

export default CosmicEngines;