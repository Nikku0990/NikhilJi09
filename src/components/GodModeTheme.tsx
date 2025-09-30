import React from 'react';
import { motion } from 'framer-motion';

interface GodModeThemeProps {
  children: React.ReactNode;
  isGodMode: boolean;
}

const GodModeTheme: React.FC<GodModeThemeProps> = ({ children, isGodMode }) => {
  if (!isGodMode) {
    return <>{children}</>;
  }

  return (
    <div className="god-mode-theme">
      {/* God Mode Background */}
      <div className="fixed inset-0 z-0">
        {/* Animated Rainbow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 animate-pulse" />
        
        {/* Moving Rainbow Waves */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={`god-wave-${i}`}
              className="absolute w-full h-32 opacity-30"
              style={{
                background: `linear-gradient(90deg, 
                  #FF0080 0%, 
                  #00FF80 14%, 
                  #8000FF 28%, 
                  #FF8000 42%, 
                  #0080FF 56%, 
                  #FF0040 70%, 
                  #40FF00 84%, 
                  #FF0080 100%)`,
                top: `${i * 15}%`,
              }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Floating God Mode Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`god-particle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#FF0040', '#40FF00'][i % 7],
                boxShadow: `0 0 10px ${['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#FF0040', '#40FF00'][i % 7]}`,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* God Mode Energy Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`god-ring-${i}`}
              className="absolute border-4 rounded-full"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                borderColor: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF'][i],
                borderStyle: 'dashed',
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* God Mode Lightning */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`lightning-${i}`}
              className="absolute w-1 bg-gradient-to-b from-yellow-400 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${Math.random() * 300 + 100}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0, 1, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3 + 1,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* God Mode Content Wrapper */}
      <div className="relative z-10 god-mode-content">
        {children}
      </div>

      {/* God Mode CSS Styles */}
      <style jsx>{`
        .god-mode-theme {
          --bg: #1a0d2e;
          --card: #2d1b3d;
          --muted: #b794f6;
          --text: #ffffff;
          --acc1: #ff0080;
          --acc2: #00ff80;
          --acc3: #8000ff;
        }
        
        .god-mode-content {
          background: linear-gradient(135deg, 
            rgba(255, 0, 128, 0.1) 0%,
            rgba(0, 255, 128, 0.1) 25%,
            rgba(128, 0, 255, 0.1) 50%,
            rgba(255, 128, 0, 0.1) 75%,
            rgba(0, 128, 255, 0.1) 100%);
          animation: godModeShimmer 3s ease-in-out infinite;
        }
        
        @keyframes godModeShimmer {
          0%, 100% { filter: hue-rotate(0deg) saturate(1); }
          25% { filter: hue-rotate(90deg) saturate(1.5); }
          50% { filter: hue-rotate(180deg) saturate(2); }
          75% { filter: hue-rotate(270deg) saturate(1.5); }
        }
        
        .god-mode-content .card-gradient {
          background: linear-gradient(145deg, 
            rgba(255, 0, 128, 0.3) 0%, 
            rgba(128, 0, 255, 0.3) 50%, 
            rgba(0, 255, 128, 0.3) 100%);
          border: 2px solid rgba(255, 0, 128, 0.5);
          box-shadow: 
            0 0 30px rgba(255, 0, 128, 0.3),
            inset 0 0 30px rgba(128, 0, 255, 0.2);
        }
        
        .god-mode-content .accent-gradient {
          background: linear-gradient(135deg, 
            #ff0080 0%, 
            #00ff80 25%, 
            #8000ff 50%, 
            #ff8000 75%, 
            #0080ff 100%);
          animation: godModeGradient 2s ease-in-out infinite;
        }
        
        @keyframes godModeGradient {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }
        
        .god-mode-content .logo-gradient {
          background: conic-gradient(from 0deg, 
            #ff0080, #00ff80, #8000ff, #ff8000, 
            #0080ff, #ff0040, #40ff00, #ff0080);
          animation: godModeRotate 3s linear infinite;
        }
        
        @keyframes godModeRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .god-mode-content button {
          position: relative;
          overflow: hidden;
        }
        
        .god-mode-content button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.4), 
            transparent);
          transition: left 0.5s;
        }
        
        .god-mode-content button:hover::before {
          left: 100%;
        }
        
        .god-mode-content input, 
        .god-mode-content textarea, 
        .god-mode-content select {
          background: rgba(255, 0, 128, 0.1) !important;
          border: 2px solid rgba(255, 0, 128, 0.3) !important;
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.2) !important;
        }
        
        .god-mode-content input:focus, 
        .god-mode-content textarea:focus, 
        .god-mode-content select:focus {
          border-color: rgba(0, 255, 128, 0.8) !important;
          box-shadow: 0 0 25px rgba(0, 255, 128, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default GodModeTheme;