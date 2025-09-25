import React, { useState, useEffect } from 'react';
import { Zap, GitBranch, Clock, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

interface QuantumFix {
  id: string;
  description: string;
  affectedVersions: string[];
  timelines: number;
  universes: number;
  status: 'fixing' | 'entangled' | 'complete';
  paradoxRisk: number;
}

const QuantumDebugger: React.FC = () => {
  const { files, activeFile, updateFile, addMessage, currentSessionId } = useAppStore();
  const [quantumFixes, setQuantumFixes] = useState<QuantumFix[]>([]);
  const [isEntangling, setIsEntangling] = useState(false);
  const [selectedBug, setSelectedBug] = useState('');

  const currentFile = files.find(f => f.name === activeFile);

  const detectQuantumBugs = () => {
    if (!currentFile) {
      toast.error('No file selected for quantum analysis');
      return [];
    }

    const bugs = [];
    const lines = currentFile.content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('console.log') && line.includes('fuck')) {
        bugs.push(`Line ${index + 1}: Profanity in console.log`);
      }
      if (line.includes('var ')) {
        bugs.push(`Line ${index + 1}: Using var instead of const/let`);
      }
      if (line.includes('== ') && !line.includes('===')) {
        bugs.push(`Line ${index + 1}: Using == instead of ===`);
      }
      if (line.includes('function') && line.length > 100) {
        bugs.push(`Line ${index + 1}: Function too long (${line.length} chars)`);
      }
    });

    return bugs;
  };

  const initiateQuantumFix = async (bugDescription: string) => {
    if (!currentFile) return;

    setIsEntangling(true);
    
    const newFix: QuantumFix = {
      id: Math.random().toString(36).substr(2, 9),
      description: bugDescription,
      affectedVersions: ['v1.0', 'v1.5', 'v2.0', 'v2.1', 'v3.0-beta'],
      timelines: Math.floor(Math.random() * 5) + 3,
      universes: Math.floor(Math.random() * 10) + 5,
      status: 'fixing',
      paradoxRisk: Math.random() * 0.1
    };
    
    setQuantumFixes(prev => [newFix, ...prev]);
    
    toast.info('🌀 Initiating quantum entanglement across timelines...', { autoClose: 2000 });
    
    // Simulate quantum fixing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status to entangled
    setQuantumFixes(prev => 
      prev.map(fix => 
        fix.id === newFix.id 
          ? { ...fix, status: 'entangled' }
          : fix
      )
    );
    
    toast.info('⚡ Quantum entanglement established. Applying fixes...', { autoClose: 2000 });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Apply the actual fix
    let fixedCode = currentFile.content;
    
    if (bugDescription.includes('console.log') && bugDescription.includes('fuck')) {
      fixedCode = fixedCode.replace(/console\.log\([^)]*fuck[^)]*\)/gi, 'console.log("Professional debug message")');
    }
    if (bugDescription.includes('var instead')) {
      fixedCode = fixedCode.replace(/var /g, 'const ');
    }
    if (bugDescription.includes('== instead')) {
      fixedCode = fixedCode.replace(/== /g, '=== ');
    }
    
    // Add quantum fix certificate
    const certificate = `// 🌌 QUANTUM FIX CERTIFICATE
// Fix ID: ${newFix.id}
// Applied across ${newFix.timelines} timelines and ${newFix.universes} parallel universes
// Paradox Risk: ${(newFix.paradoxRisk * 100).toFixed(2)}%
// Status: Quantum Entangled ✨

`;
    
    fixedCode = certificate + fixedCode;
    
    updateFile(currentFile.name, fixedCode);
    
    // Update status to complete
    setQuantumFixes(prev => 
      prev.map(fix => 
        fix.id === newFix.id 
          ? { ...fix, status: 'complete' }
          : fix
      )
    );
    
    setIsEntangling(false);
    
    toast.success('✨ Quantum fix applied across all timelines!');
    
    addMessage(currentSessionId, {
      role: 'assistant',
      content: `🌌 **Quantum Entanglement Debugger Complete!**\n\n⚡ **Fix Applied:** ${bugDescription}\n\n🌀 **Quantum Statistics:**\n- Timelines affected: ${newFix.timelines}\n- Parallel universes: ${newFix.universes}\n- Paradox risk: ${(newFix.paradoxRisk * 100).toFixed(2)}%\n\n✨ **Quantum Certificate:** Added to your code\n\n🚀 **Result:** This bug has been fixed in all past, present, and future versions of your code across the multiverse!`,
      timestamp: Date.now(),
    });
  };

  const detectedBugs = currentFile ? detectQuantumBugs() : [];

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Quantum Entanglement Debugger</h3>
        <div className="ml-auto">
          {isEntangling && (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </div>
      
      {!currentFile ? (
        <div className="text-center py-8 text-gray-400">
          <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a file to scan for quantum bugs</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Detected Bugs */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">
              Detected Quantum Bugs ({detectedBugs.length})
            </h4>
            
            {detectedBugs.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-center">
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-sm text-green-400">No quantum bugs detected!</div>
                <div className="text-xs text-gray-400">Your code is in perfect harmony across all timelines</div>
              </div>
            ) : (
              <div className="space-y-2">
                {detectedBugs.map((bug, index) => (
                  <div key={index} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-red-400 font-medium">{bug}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          This bug exists across multiple timelines and needs quantum fixing
                        </div>
                      </div>
                      <button
                        onClick={() => initiateQuantumFix(bug)}
                        disabled={isEntangling}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Quantum Fix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quantum Fixes History */}
          {quantumFixes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Quantum Fix History</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {quantumFixes.map((fix) => (
                  <div key={fix.id} className="bg-black/30 border border-indigo-500/20 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{fix.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Affected: {fix.affectedVersions.join(', ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {fix.status === 'fixing' && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                        {fix.status === 'entangled' && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        )}
                        {fix.status === 'complete' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-indigo-500/20 p-2 rounded text-center">
                        <div className="text-indigo-400 font-bold">{fix.timelines}</div>
                        <div className="text-gray-400">Timelines</div>
                      </div>
                      <div className="bg-purple-500/20 p-2 rounded text-center">
                        <div className="text-purple-400 font-bold">{fix.universes}</div>
                        <div className="text-gray-400">Universes</div>
                      </div>
                      <div className="bg-pink-500/20 p-2 rounded text-center">
                        <div className="text-pink-400 font-bold">{(fix.paradoxRisk * 100).toFixed(1)}%</div>
                        <div className="text-gray-400">Paradox Risk</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        fix.status === 'fixing' ? 'bg-yellow-500/20 text-yellow-400' :
                        fix.status === 'entangled' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {fix.status === 'fixing' ? '🔄 Quantum Fixing' :
                         fix.status === 'entangled' ? '🌀 Entangled' :
                         '✅ Complete'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantum Status */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-white">
                Quantum Debugger Status: {isEntangling ? 'Entangling across timelines...' : 'Ready for quantum fixes'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumDebugger;