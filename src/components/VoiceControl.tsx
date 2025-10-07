import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

interface VoiceControlProps {
  onTranscript: (text: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const { settings } = useAppStore();

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
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.success(`🎤 Voice input started (${supportedLanguages.find(l => l.code === selectedLanguage)?.name})`);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setVolume(0);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
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
  }, [selectedLanguage, onTranscript]);

  const startListening = () => {
    if (!isSupported) {
      toast.error('❌ Speech recognition not supported in this browser');
      return;
    }
    
    if (recognitionRef.current) {
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
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Voice Control</h3>
        <div className="ml-auto">
          {isListening && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-400">Recording</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-black/30 border border-blue-500/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
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
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>
        </div>
        
        {/* Volume Indicator */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Audio Level</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-100"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Live Transcript */}
        {transcript && (
          <div className="bg-black/30 border border-blue-500/20 rounded-lg p-3">
            <div className="text-sm text-blue-400 mb-1">Live Transcript:</div>
            <div className="text-white text-sm">{transcript}</div>
          </div>
        )}
        
        {/* Voice Commands Help */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-blue-400 mb-2">Voice Commands:</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• "Create a React component"</div>
            <div>• "Fix the bugs in my code"</div>
            <div>• "Optimize this function"</div>
            <div>• "Generate tests for this file"</div>
            <div>• "Explain this code to me"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;