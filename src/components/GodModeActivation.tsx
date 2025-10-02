import React, { useState, useEffect, useRef } from 'react';
import { Crown, Sparkles, Zap, Star, Heart, Diamond, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GodModeActivationProps {
  isActivating: boolean;
  isDeactivating: boolean;
  onComplete: () => void;
  onDeactivateComplete: () => void;
}

interface PartyPopup {
  id: string;
  x: number;
  y: number;
  color: string;
  icon: React.ComponentType<any>;
  delay: number;
}

const GodModeActivation: React.FC<GodModeActivationProps> = ({
  isActivating,
  isDeactivating,
  onComplete,
  onDeactivateComplete
}) => {
  const [partyPopups, setPartyPopups] = useState<PartyPopup[]>([]);
  const [showMovingText, setShowMovingText] = useState(false);
  const [showDeactivateText, setShowDeactivateText] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const colors = [
    '#FF0080', // Hot Pink
    '#00FF80', // Electric Green
    '#8000FF', // Electric Purple
    '#FF8000', // Electric Orange
    '#0080FF', // Electric Blue
    '#FF0040', // Electric Red
    '#40FF00', // Lime Green
  ];

  const icons = [Crown, Sparkles, Zap, Star, Heart, Diamond, Flame];

  useEffect(() => {
    if (isActivating && !audioPlayed) {
      // Play audio first
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log('Audio autoplay blocked by browser');
        });
        setAudioPlayed(true);
      }
      
      // Show moving text immediately
      setShowMovingText(true);
      
      // Generate minimal party popups for 2 seconds only
      generatePartyPopups();
      
      // Complete activation after 3 seconds
      setTimeout(() => {
        setShowMovingText(false);
        setPartyPopups([]);
        onComplete();
        setAudioPlayed(false);
      }, 3000);
    }
  }, [isActivating, audioPlayed, onComplete]);

  useEffect(() => {
    if (isDeactivating) {
      setShowDeactivateText(true);
      
      // Complete deactivation after 2 seconds
      setTimeout(() => {
        setShowDeactivateText(false);
        onDeactivateComplete();
      }, 2000);
    }
  }, [isDeactivating, onDeactivateComplete]);

  const generatePartyPopups = () => {
    const popups: PartyPopup[] = [];
    
    // Generate 20 party popups (reduced for performance)
    for (let i = 0; i < 20; i++) {
      popups.push({
        id: `popup-${i}`,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200, // Start from bottom
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        delay: Math.random() * 1000, // Random delay up to 1 second
      });
    }
    
    setPartyPopups(popups);
  };

  if (!isActivating && !isDeactivating) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Audio Element */}
      <audio ref={audioRef} preload="auto">
        <source src="/ttsMP3.com_VoiceText_2025-9-26_18-21-4.mp3" type="audio/mpeg" />
      </audio>

      {/* Blur Background */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ 
          opacity: 1, 
          backdropFilter: isActivating ? 'blur(20px)' : 'blur(10px)' 
        }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className="absolute inset-0 bg-black/60"
        style={{ backdropFilter: 'blur(20px)' }}
      />

      {/* Moving Text - Activation */}
      <AnimatePresence>
        {showMovingText && (
          <motion.div
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: '-100vw', opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ duration: 3, ease: 'linear' }}
            className="absolute top-1/2 transform -translate-y-1/2 z-50"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              🚀 NikkuAi09 GOD IS NOW ACTIVATED! 👑
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moving Text - Deactivation */}
      <AnimatePresence>
        {showDeactivateText && (
          <motion.div
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: '-100vw', opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ duration: 2, ease: 'linear' }}
            className="absolute top-1/2 transform -translate-y-1/2 z-50"
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
              😴 NikkuAi09 GOD IS NOW DEACTIVATED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Party Popups */}
      <AnimatePresence>
        {partyPopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ 
              x: popup.x, 
              y: popup.y, 
              scale: 0, 
              rotate: 0,
              opacity: 0 
            }}
            animate={{ 
              y: popup.y - window.innerHeight - 200, // Move upward
              scale: [0, 1.5, 1, 1.2, 0],
              rotate: [0, 180, 360, 540, 720],
              opacity: [0, 1, 1, 1, 0]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 3,
              delay: popup.delay / 1000,
              ease: 'easeOut'
            }}
            className="absolute pointer-events-none"
            style={{
              color: popup.color,
              filter: `drop-shadow(0 0 10px ${popup.color})`,
            }}
          >
            <popup.icon className="w-8 h-8" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Fireworks Effect */}
      <AnimatePresence>
        {isActivating && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`firework-${i}`}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  scale: [0, 2, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 3,
                  repeat: 2
                }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`,
                  boxShadow: `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Rainbow Waves */}
      <AnimatePresence>
        {isActivating && (
          <div className="absolute inset-0 overflow-hidden">
            {colors.map((color, index) => (
              <motion.div
                key={`wave-${index}`}
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: '100%', 
                  opacity: [0, 0.7, 0],
                }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.2,
                  repeat: 1
                }}
                className="absolute top-0 w-full h-full"
                style={{
                  background: `linear-gradient(45deg, transparent 0%, ${color}40 50%, transparent 100%)`,
                  transform: `translateY(${index * 10}px)`
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Sparkle Rain */}
      <AnimatePresence>
        {isActivating && (
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: window.innerHeight + 50,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 4,
                  ease: 'linear'
                }}
                className="absolute text-2xl"
                style={{ color: colors[Math.floor(Math.random() * colors.length)] }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GodModeActivation;