import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import CodeSoulWhisperer from './CodeSoulWhisperer';
import TemporalCodeSynthesizer from './TemporalCodeSynthesizer';
import QuantumDebugger from './QuantumDebugger';
import AIDoppelganger from './AIDoppelganger';
import CosmicCollaboration from './CosmicCollaboration';

const CosmicFeatures: React.FC = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'soul-whisperer',
      title: 'Code Soul Whisperer',
      description: 'Analyze and heal your code\'s emotional state',
      component: CodeSoulWhisperer,
      icon: '🔮'
    },
    {
      id: 'temporal-synthesizer',
      title: 'Temporal Code Synthesizer',
      description: 'Fetch perfect code from the future',
      component: TemporalCodeSynthesizer,
      icon: '⏰'
    },
    {
      id: 'quantum-debugger',
      title: 'Quantum Entanglement Debugger',
      description: 'Fix bugs across all timelines simultaneously',
      component: QuantumDebugger,
      icon: '⚡'
    },
    {
      id: 'ai-doppelganger',
      title: 'AI Doppelganger Mode',
      description: 'Your digital twin that codes while you sleep',
      component: AIDoppelganger,
      icon: '🎭'
    },
    {
      id: 'cosmic-collaboration',
      title: 'Cosmic Collaboration Mode',
      description: 'Code with developers from parallel universes',
      component: CosmicCollaboration,
      icon: '🌌'
    }
  ];

  const toggleFeature = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Cosmic Features</h2>
        <div className="ml-auto text-xs text-gray-400">
          Universe-Shattering Technology
        </div>
      </div>
      
      {features.map((feature) => {
        const Component = feature.component;
        const isExpanded = expandedFeature === feature.id;
        
        return (
          <div key={feature.id} className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFeature(feature.id)}
              className="w-full p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 hover:from-purple-900/30 hover:to-blue-900/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div className="text-left">
                  <div className="text-white font-semibold">{feature.title}</div>
                  <div className="text-sm text-gray-400">{feature.description}</div>
                </div>
              </div>
              <div className="text-purple-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>
            
            {isExpanded && (
              <div className="p-4 bg-black/20 border-t border-white/10">
                <Component />
              </div>
            )}
          </div>
        );
      })}
      
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <div className="text-white font-semibold mb-1">Cosmic Level Achieved! 🚀</div>
        <div className="text-sm text-gray-400">
          You now have access to universe-shattering development tools
        </div>
      </div>
    </div>
  );
};

export default CosmicFeatures;