import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const ThinkingAnimation: React.FC = () => {
  return (
    <div className="flex gap-2 fade-in justify-start mb-2">
      <div className="flex-shrink-0 w-6 h-6 rounded-full accent-gradient flex items-center justify-center">
        <Brain className="w-3 h-3 text-white animate-pulse" />
      </div>
      
      <div className="max-w-sm">
        <div className="bg-[#161a49] border border-purple-500/20 text-white p-2 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-purple-400 animate-spin" />
                <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  NikkuAi09 is thinking...
                </span>
              </div>
              
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            
            {/* Compact neural network visualization */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-8 h-8 border border-purple-400/30 rounded-full animate-spin"></div>
                <div className="absolute inset-1 w-6 h-6 border border-blue-400/30 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute inset-2 w-4 h-4 border border-pink-400/30 rounded-full animate-spin"></div>
                <div className="absolute inset-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;