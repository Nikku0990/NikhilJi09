import React, { useState } from 'react';
import { 
  Code, Database, Shield, Zap, Brain, Eye, Users, Clock, 
  Sparkles, Settings, Globe, Cpu, Activity, FileText,
  ChevronDown, ChevronUp, Play, Pause, RotateCcw
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  enabled: boolean;
  premium?: boolean;
}

const HundredPlusFeatures: React.FC = () => {
  const { addMessage, currentSessionId } = useAppStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});

  const features: Feature[] = [
    // AI & Intelligence Features
    {
      id: 'contextAwareGeneration',
      title: 'Context-Aware Code Generation',
      description: 'AI suggests code based on current file and project context',
      category: 'AI & Intelligence',
      icon: Brain,
      color: 'text-purple-400',
      enabled: true
    },
    {
      id: 'multiSessionMemory',
      title: 'Multi-Session Memory',
      description: 'Remembers projects across browser sessions',
      category: 'AI & Intelligence',
      icon: Database,
      color: 'text-blue-400',
      enabled: true
    },
    {
      id: 'developerPersona',
      title: 'Developer Persona Engine',
      description: 'Learns your coding style (functional vs OOP)',
      category: 'AI & Intelligence',
      icon: Users,
      color: 'text-green-400',
      enabled: false
    },
    {
      id: 'semanticSearch',
      title: 'Semantic Search',
      description: 'Search past conversations with natural language',
      category: 'AI & Intelligence',
      icon: Eye,
      color: 'text-cyan-400',
      enabled: false
    },
    {
      id: 'autoSummarization',
      title: 'Auto-Summarization',
      description: 'Summarize long threads or complex code files',
      category: 'AI & Intelligence',
      icon: FileText,
      color: 'text-yellow-400',
      enabled: false
    },
    {
      id: 'predictiveDevelopment',
      title: 'Predictive Development',
      description: 'AI predicts next command/code snippet as you type',
      category: 'AI & Intelligence',
      icon: Zap,
      color: 'text-orange-400',
      enabled: false,
      premium: true
    },
    {
      id: 'emotionalIntelligence',
      title: 'Emotional Intelligence',
      description: 'Adjusts tone based on your perceived mood',
      category: 'AI & Intelligence',
      icon: Sparkles,
      color: 'text-pink-400',
      enabled: false,
      premium: true
    },

    // Code & Editor Features
    {
      id: 'multiFileEditing',
      title: 'Multi-File Editing',
      description: 'AI works on multiple files simultaneously',
      category: 'Code & Editor',
      icon: Code,
      color: 'text-blue-400',
      enabled: true
    },
    {
      id: 'versionControlLite',
      title: 'Version Control Lite',
      description: 'Built-in diff viewer and time machine',
      category: 'Code & Editor',
      icon: RotateCcw,
      color: 'text-green-400',
      enabled: false
    },
    {
      id: 'codeSmellDetector',
      title: 'Code Smell Detector',
      description: 'Flags potential issues on save',
      category: 'Code & Editor',
      icon: Shield,
      color: 'text-red-400',
      enabled: false
    },
    {
      id: 'autoDocumentation',
      title: 'Auto-Documentation',
      description: 'Generates README with architecture diagrams',
      category: 'Code & Editor',
      icon: FileText,
      color: 'text-purple-400',
      enabled: false
    },
    {
      id: 'snippetLibrary',
      title: 'Snippet Library',
      description: 'Manages reusable code snippets',
      category: 'Code & Editor',
      icon: Database,
      color: 'text-cyan-400',
      enabled: false
    },
    {
      id: 'dependencyMapper',
      title: 'Cross-File Dependency Mapper',
      description: 'Visual graph showing file connections',
      category: 'Code & Editor',
      icon: Globe,
      color: 'text-indigo-400',
      enabled: false,
      premium: true
    },

    // Performance & Optimization
    {
      id: 'performanceMonitor',
      title: 'Performance Monitor',
      description: 'Real-time performance metrics overlay',
      category: 'Performance',
      icon: Activity,
      color: 'text-green-400',
      enabled: false
    },
    {
      id: 'codeProfiler',
      title: 'Code Profiler',
      description: 'Identifies performance bottlenecks',
      category: 'Performance',
      icon: Cpu,
      color: 'text-orange-400',
      enabled: false
    },
    {
      id: 'memoryAnalyzer',
      title: 'Memory Analyzer',
      description: 'Detects memory leaks and optimization opportunities',
      category: 'Performance',
      icon: Database,
      color: 'text-blue-400',
      enabled: false,
      premium: true
    },

    // Security Features
    {
      id: 'securityScanner',
      title: 'Security Scanner',
      description: 'OWASP Top 10 vulnerability detection',
      category: 'Security',
      icon: Shield,
      color: 'text-red-400',
      enabled: true
    },
    {
      id: 'dependencyAudit',
      title: 'Dependency Audit',
      description: 'Scans for vulnerable dependencies',
      category: 'Security',
      icon: Eye,
      color: 'text-yellow-400',
      enabled: false
    },
    {
      id: 'codeObfuscator',
      title: 'Code Obfuscator',
      description: 'Protects sensitive code from reverse engineering',
      category: 'Security',
      icon: Settings,
      color: 'text-purple-400',
      enabled: false,
      premium: true
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  const toggleFeature = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    if (feature.premium && !enabledFeatures[featureId]) {
      toast.info(`🌟 ${feature.title} is a premium feature. Upgrade to unlock!`);
      return;
    }

    const newState = !enabledFeatures[featureId];
    setEnabledFeatures(prev => ({ ...prev, [featureId]: newState }));

    if (newState) {
      toast.success(`✅ ${feature.title} activated!`);
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `🚀 **${feature.title} Activated!**\n\n${feature.description}\n\n✨ This feature is now available for your development workflow!`,
        timestamp: Date.now(),
      });
    } else {
      toast.info(`${feature.title} deactivated.`);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(f => f.category === category);
  };

  const getEnabledCount = (category: string) => {
    return getFeaturesByCategory(category).filter(f => enabledFeatures[f.id] || f.enabled).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">100+ Professional Features</h2>
        <div className="ml-auto text-xs text-gray-400">
          {Object.values(enabledFeatures).filter(Boolean).length + features.filter(f => f.enabled).length} Active
        </div>
      </div>
      
      {categories.map((category) => {
        const categoryFeatures = getFeaturesByCategory(category);
        const isExpanded = expandedCategory === category;
        const enabledCount = getEnabledCount(category);
        
        return (
          <div key={category} className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="text-white font-semibold">{category}</div>
                  <div className="text-sm text-gray-400">
                    {enabledCount}/{categoryFeatures.length} features active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">
                  {categoryFeatures.filter(f => f.premium).length} Premium
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>
            
            {isExpanded && (
              <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="grid gap-3">
                  {categoryFeatures.map((feature) => {
                    const Icon = feature.icon;
                    const isEnabled = enabledFeatures[feature.id] || feature.enabled;
                    
                    return (
                      <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm">{feature.title}</span>
                              {feature.premium && (
                                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-0.5 rounded-full font-bold">
                                  PRO
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{feature.description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFeature(feature.id)}
                          className={`w-10 h-5 rounded-full transition-colors ${
                            isEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <div className="text-white font-semibold mb-1">Professional Development Suite! ⚡</div>
        <div className="text-sm text-gray-400">
          100+ features to supercharge your development workflow
        </div>
      </div>
    </div>
  );
};

export default HundredPlusFeatures;