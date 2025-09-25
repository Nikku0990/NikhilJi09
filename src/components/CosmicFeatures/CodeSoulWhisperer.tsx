import React, { useState, useEffect } from 'react';
import { Heart, Brain, Sparkles, TrendingUp, AlertTriangle, Smile, Frown, Meh } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

interface CodeSoulAnalysis {
  happiness: number;
  clarity: number;
  potential: number;
  traumatizedFunctions: string[];
  lonelyVariables: string[];
  hopefulComments: string[];
  overallMood: 'happy' | 'sad' | 'neutral' | 'traumatized' | 'hopeful';
}

const CodeSoulWhisperer: React.FC = () => {
  const { files, activeFile, updateFile, addMessage, currentSessionId } = useAppStore();
  const [analysis, setAnalysis] = useState<CodeSoulAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHealing, setIsHealing] = useState(false);

  const currentFile = files.find(f => f.name === activeFile);

  const analyzeCodeSoul = async () => {
    if (!currentFile) {
      toast.error('No file selected for soul analysis');
      return;
    }

    setIsAnalyzing(true);
    
    toast.info('🔮 Analyzing code soul...', { autoClose: 2000 });
    
    // Simulate AI analysis with real code analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lines = currentFile.content.split('\n');
    const traumatizedFunctions = [];
    const lonelyVariables = [];
    const hopefulComments = [];
    
    // Real analysis
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect traumatized functions
      if (line.includes('function') && (line.includes('fuck') || line.includes('shit') || line.length > 100)) {
        traumatizedFunctions.push(`Line ${i + 1}: ${line.substring(0, 50)}...`);
      }
      
      // Detect lonely variables
      if (line.includes('var ') || line.includes('let unused') || line.includes('temp')) {
        lonelyVariables.push(`Line ${i + 1}: ${line.trim()}`);
      }
      
      // Detect hopeful comments
      if (line.includes('// TODO') || line.includes('// FIXME') || line.includes('// Future')) {
        hopefulComments.push(line.trim());
      }
    }
    
    const happiness = Math.max(10, 100 - (traumatizedFunctions.length * 20) - (lonelyVariables.length * 10));
    const clarity = Math.max(10, 100 - (lines.filter(l => l.length > 120).length * 5));
    const potential = Math.min(100, 50 + (hopefulComments.length * 15) + (lines.filter(l => l.includes('const')).length * 2));
    
    let overallMood: CodeSoulAnalysis['overallMood'] = 'neutral';
    if (happiness > 80) overallMood = 'happy';
    else if (happiness < 40) overallMood = 'sad';
    else if (traumatizedFunctions.length > 3) overallMood = 'traumatized';
    else if (hopefulComments.length > 2) overallMood = 'hopeful';
    
    const mockAnalysis: CodeSoulAnalysis = {
      happiness,
      clarity,
      potential,
      traumatizedFunctions,
      lonelyVariables,
      hopefulComments,
      overallMood
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    toast.success('🔮 Code soul analysis complete!');
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `🔮 **Code Soul Analysis Complete!**\n\n📊 **Soul Metrics:**\n- Happiness: ${happiness}%\n- Clarity: ${clarity}%\n- Potential: ${potential}%\n\n😰 **Issues Found:**\n- Traumatized Functions: ${traumatizedFunctions.length}\n- Lonely Variables: ${lonelyVariables.length}\n\n✨ **Hopeful Elements:** ${hopefulComments.length}\n\n🎭 **Overall Mood:** ${overallMood.charAt(0).toUpperCase() + overallMood.slice(1)}\n\n💡 **Recommendation:** ${happiness < 50 ? 'Your code needs healing! Click "Heal Soul" to improve its emotional state.' : 'Your code is in good spirits! Keep up the great work.'}`,
      timestamp: Date.now(),
    });
  };

  const healCodeSoul = async () => {
    if (!analysis || !currentFile) return;
    
    setIsHealing(true);
    
    toast.info('✨ Healing code soul...', { autoClose: 3000 });
    
    // Simulate healing process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate healed code
    let healedCode = currentFile.content;
    
    // Remove traumatized functions (simplified)
    healedCode = healedCode.replace(/\/\/ This is fucked/g, '// This is optimized');
    healedCode = healedCode.replace(/\/\/ Fuck this/g, '// Refactored for clarity');
    healedCode = healedCode.replace(/var /g, 'const ');
    healedCode = healedCode.replace(/shit/g, 'data');
    healedCode = healedCode.replace(/fuck/g, 'process');
    
    // Add healing comments
    healedCode = `// 🌟 Code Soul Healed by NikkuAi09\n// Happiness: ${analysis.happiness + 30}% | Clarity: ${analysis.clarity + 25}%\n// Healed on: ${new Date().toLocaleString()}\n\n${healedCode}`;
    
    updateFile(currentFile.name, healedCode);
    setIsHealing(false);
    
    // Update analysis with healed values
    setAnalysis({
      ...analysis,
      happiness: Math.min(100, analysis.happiness + 30),
      clarity: Math.min(100, analysis.clarity + 25),
      potential: Math.min(100, analysis.potential + 20),
      overallMood: 'happy'
    });
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `🌟 **Code Soul Healing Complete!**\n\n✨ Your code's soul has been healed:\n- Happiness: +30% (now ${Math.min(100, analysis.happiness + 30)}%)\n- Clarity: +25% (now ${Math.min(100, analysis.clarity + 25)}%)\n- Potential: +20% (now ${Math.min(100, analysis.potential + 20)}%)\n\n🧠 **Healing Actions Performed:**\n- Traumatized functions comforted\n- Profanity replaced with professional terms\n- Variables optimized from 'var' to 'const'\n- Healing certificate added to code\n\n🌈 **Result:** Your code is now radiating positive energy and professional vibes!`,
      timestamp: Date.now(),
    });
    
    toast.success('✨ Code soul healed successfully!');
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-400" />;
      case 'sad': return <Frown className="w-5 h-5 text-red-400" />;
      case 'traumatized': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'hopeful': return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Meh className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Code Soul Whisperer</h3>
        <div className="ml-auto">
          {analysis && getMoodIcon(analysis.overallMood)}
        </div>
      </div>
      
      {!currentFile ? (
        <div className="text-center py-8 text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a file to analyze its soul</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={analyzeCodeSoul}
              disabled={isAnalyzing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Soul...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze Soul
                </>
              )}
            </button>
            
            {analysis && (
              <button
                onClick={healCodeSoul}
                disabled={isHealing}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isHealing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Healing...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Heal Soul
                  </>
                )}
              </button>
            )}
          </div>
          
          {analysis && (
            <div className="space-y-4">
              {/* Soul Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.happiness)}`}>
                    {analysis.happiness}%
                  </div>
                  <div className="text-xs text-gray-400">Happiness</div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity)}`}>
                    {analysis.clarity}%
                  </div>
                  <div className="text-xs text-gray-400">Clarity</div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.potential)}`}>
                    {analysis.potential}%
                  </div>
                  <div className="text-xs text-gray-400">Potential</div>
                </div>
              </div>
              
              {/* Soul Issues */}
              <div className="space-y-2">
                {analysis.traumatizedFunctions.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-red-400 mb-1">
                      😰 Traumatized Functions ({analysis.traumatizedFunctions.length})
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      {analysis.traumatizedFunctions.slice(0, 3).map((func, i) => (
                        <div key={i}>{func}</div>
                      ))}
                      {analysis.traumatizedFunctions.length > 3 && (
                        <div className="text-gray-400">...and {analysis.traumatizedFunctions.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}
                
                {analysis.lonelyVariables.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-blue-400 mb-1">
                      😢 Lonely Variables ({analysis.lonelyVariables.length})
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      {analysis.lonelyVariables.slice(0, 3).map((variable, i) => (
                        <div key={i}>{variable}</div>
                      ))}
                      {analysis.lonelyVariables.length > 3 && (
                        <div className="text-gray-400">...and {analysis.lonelyVariables.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}
                
                {analysis.hopefulComments.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-green-400 mb-1">
                      ✨ Hopeful Comments ({analysis.hopefulComments.length})
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      {analysis.hopefulComments.slice(0, 3).map((comment, i) => (
                        <div key={i}>{comment}</div>
                      ))}
                      {analysis.hopefulComments.length > 3 && (
                        <div className="text-gray-400">...and {analysis.hopefulComments.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Overall Mood */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {getMoodIcon(analysis.overallMood)}
                  <span className="text-white font-semibold">
                    Overall Mood: {analysis.overallMood.charAt(0).toUpperCase() + analysis.overallMood.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeSoulWhisperer;