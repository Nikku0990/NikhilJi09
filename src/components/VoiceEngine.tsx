import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages, Headphones, Radio } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

interface VoiceEngineProps {
  onTranscript: (text: string) => void;
}

const VoiceEngine: React.FC<VoiceEngineProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceCommands, setVoiceCommands] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const { settings, addMessage, currentSessionId } = useAppStore();

  // 12+ Language Support
  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
  ];

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      recognition.maxAlternatives = 3;
      
      recognition.onstart = () => {
        setIsListening(true);
        const lang = supportedLanguages.find(l => l.code === selectedLanguage);
        toast.success(`🎤 Voice input started (${lang?.name})`);
        
        addMessage(currentSessionId, {
          role: 'assistant',
          content: `🎤 **Voice Engine Activated!**\n\n🗣️ **Language:** ${lang?.flag} ${lang?.name}\n🎯 **Status:** Listening for voice commands\n\n💡 **Try saying:**\n- "Create a React component"\n- "Fix the bugs in my code"\n- "Generate a login page"\n- "Optimize this function"`,
          timestamp: Date.now(),
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setVolume(0);
        setTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        setConfidence(maxConfidence);
        
        if (finalTranscript) {
          // Process voice commands
          processVoiceCommand(finalTranscript);
          onTranscript(finalTranscript);
          setVoiceCommands(prev => [finalTranscript, ...prev.slice(0, 9)]);
          setTranscript('');
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`❌ Voice input error: ${event.error}`);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, [selectedLanguage, onTranscript, currentSessionId, addMessage]);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Voice command shortcuts
    if (lowerCommand.includes('create') && lowerCommand.includes('component')) {
      toast.info('🎤 Voice command detected: Creating React component');
    } else if (lowerCommand.includes('fix') && lowerCommand.includes('bug')) {
      toast.info('🎤 Voice command detected: Fixing bugs');
    } else if (lowerCommand.includes('optimize')) {
      toast.info('🎤 Voice command detected: Optimizing code');
    } else if (lowerCommand.includes('test')) {
      toast.info('🎤 Voice command detected: Generating tests');
    } else if (lowerCommand.includes('explain')) {
      toast.info('🎤 Voice command detected: Explaining code');
    }
  };

  const startListening = () => {
    if (!isSupported) {
      toast.error('❌ Speech recognition not supported in this browser');
      return;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Simulate volume levels for visual feedback
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVolume(Math.random() * 100);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setVolume(0);
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-400">
          <MicOff className="w-5 h-5" />
          <span className="text-sm">Voice input not supported in this browser</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Try using Chrome, Edge, or Safari for voice features
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Voice Engine</h3>
        <div className="ml-auto">
          {isListening && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-400">Live</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Language (12+ Supported)
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isListening}
            className="w-full bg-black/30 border border-blue-500/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 disabled:opacity-50"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Voice Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleListening}
            className={`flex-1 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold`}
          >
            {isListening ? (
              <>
                <Radio className="w-5 h-5" />
                🔴 LISTENING
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Voice Input
              </>
            )}
          </button>
        </div>
        
        {/* Audio Visualizer */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Audio Level</span>
              <span className="text-xs text-blue-400">{confidence > 0 ? `${(confidence * 100).toFixed(0)}% confidence` : ''}</span>
            </div>
            
            {/* Audio Bars Visualizer */}
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-blue-400 to-purple-400 w-2 rounded-t transition-all duration-100"
                  style={{ 
                    height: `${Math.random() * (volume / 100) * 100}%`,
                    minHeight: '4px'
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Live Transcript */}
        {transcript && (
          <div className="bg-black/30 border border-blue-500/20 rounded-lg p-3">
            <div className="text-sm text-blue-400 mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Live Transcript:
            </div>
            <div className="text-white text-sm">{transcript}</div>
            {confidence > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Confidence: {(confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}
        
        {/* Recent Voice Commands */}
        {voiceCommands.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-purple-400 mb-2">Recent Commands:</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {voiceCommands.map((command, index) => (
                <div key={index} className="text-xs text-purple-100 truncate">
                  {index + 1}. {command}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Voice Commands Help */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-blue-400 mb-2">Voice Commands:</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• "Create a React component for login"</div>
            <div>• "Fix the bugs in my JavaScript code"</div>
            <div>• "Optimize this function for performance"</div>
            <div>• "Generate unit tests for this file"</div>
            <div>• "Explain this code to me in detail"</div>
            <div>• "Build a complete website with navigation"</div>
            <div>• "Add authentication to my app"</div>
            <div>• "Create a database schema for users"</div>
          </div>
        </div>
        
        {/* Voice Settings */}
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-gray-300 mb-2">Voice Settings:</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={settings.sendSound}
                onChange={(e) => useAppStore.getState().updateSettings({ sendSound: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="text-gray-300">Play sound on voice command</span>
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-3 h-3"
              />
              <span className="text-gray-300">Auto-execute voice commands</span>
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-3 h-3"
              />
              <span className="text-gray-300">Show confidence levels</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceEngine;