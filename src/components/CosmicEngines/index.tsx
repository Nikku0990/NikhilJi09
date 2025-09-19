import React, { useState } from 'react';
import { Brain, Zap, Clock, Eye, Users, Sparkles, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

const CosmicEngines: React.FC = () => {
  const { cosmicFeatures, updateCosmicFeatures, addMessage, currentSessionId } = useAppStore();
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null);

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
  ];

  const toggleEngine = (engineId: string) => {
    const engine = cosmicEngines.find(e => e.id === engineId);
    if (!engine) return;

    const newState = !cosmicFeatures[engineId as keyof typeof cosmicFeatures];
    updateCosmicFeatures({ [engineId]: newState });

    if (newState) {
      toast.success(`🌌 ${engine.title} activated! AI now has cosmic powers.`);
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🌌 **${engine.title} Activated!**\n\n✨ I now have access to:\n${engine.features.map(f => `- ${f}`).join('\n')}\n\n🚀 **Ready to use cosmic powers for your development needs!**`,
        timestamp: Date.now(),
      });
    } else {
      toast.info(`${engine.title} deactivated.`);
    }
  };

  const toggleExpanded = (engineId: string) => {
    setExpandedEngine(expandedEngine === engineId ? null : engineId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Cosmic Engines</h2>
        <div className="ml-auto text-xs text-gray-400">
          {Object.values(cosmicFeatures).filter(f => f).length} Active
        </div>
      </div>
      
      {cosmicEngines.map((engine) => {
        const Icon = engine.icon;
        const isExpanded = expandedEngine === engine.id;
        
        return (
          <div key={engine.id} className="border border-white/10 rounded-xl overflow-hidden">
            <div className={`p-4 bg-gradient-to-r ${engine.color} bg-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-white font-semibold">{engine.title}</div>
                    <div className="text-sm text-gray-300">{engine.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEngine(engine.id)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      engine.enabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      engine.enabled ? 'translate-x-6' : 'translate-x-0.5'
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
                <h4 className="text-white font-semibold mb-2">Features:</h4>
                <ul className="space-y-1">
                  {engine.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {engine.enabled && (
                  <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                    ✅ Engine is active and ready to use
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
        <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <div className="text-white font-semibold mb-1">Cosmic Level Achieved! 🚀</div>
        <div className="text-sm text-gray-400">
          You now have access to universe-shattering development tools
        </div>
      </div>
    </div>
  );
};

export default CosmicEngines;