import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Zap, Star, Heart, Diamond, Flame, Rocket, CloudLightning as Lightning, Gem } from 'lucide-react';

interface PartyEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  icon: React.ComponentType<any>;
  size: number;
  duration: number;
}

interface GodModePartyEffectsProps {
  isActive: boolean;
}

const GodModePartyEffects: React.FC<GodModePartyEffectsProps> = ({ isActive }) => {
  const [effects, setEffects] = useState<PartyEffect[]>([]);

  const colors = [
    '#FF0080', '#00FF80', '#8000FF', '#FF8000', 
    '#0080FF', '#FF0040', '#40FF00', '#FF4080',
    '#80FF40', '#4080FF', '#FF8040', '#8040FF'
  ];

  const icons = [Crown, Sparkles, Zap, Star, Heart, Diamond, Flame, Rocket, Lightning, Gem];

  useEffect(() => {
    if (!isActive) {
      setEffects([]);
      return;
    }

    const generateEffects = () => {
      const newEffects: PartyEffect[] = [];
      
      // Generate effects from bottom of screen
      for (let i = 0; i < 30; i++) {
        newEffects.push({
          id: `effect-${Date.now()}-${i}`,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: icons[Math.floor(Math.random() * icons.length)],
          size: Math.random() * 30 + 20,
          duration: Math.random() * 2 + 3,
        });
      }
      
      setEffects(newEffects);
    };

    // Generate initial effects
    generateEffects();

    // Generate new effects every 2 seconds
    const interval = setInterval(generateEffects, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {effects.map((effect) => (
          <motion.div
            key={effect.id}
            initial={{
              x: effect.x,
              y: effect.y,
              scale: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: -100,
              scale: [0, 1.5, 1, 1.2, 0],
              rotate: [0, 180, 360, 540, 720],
              opacity: [0, 1, 1, 1, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: effect.duration,
              ease: 'easeOut',
            }}
            className="absolute"
            style={{
              color: effect.color,
              filter: `drop-shadow(0 0 15px ${effect.color})`,
              fontSize: `${effect.size}px`,
            }}
          >
            <effect.icon className="w-full h-full" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Continuous Sparkle Rain */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              color: colors[Math.floor(Math.random() * colors.length)],
            }}
            animate={{
              y: ['-50px', `${window.innerHeight + 50}px`],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* God Mode Energy Pulses */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute rounded-full border-4"
            style={{
              width: `${(i + 1) * 150}px`,
              height: `${(i + 1) * 150}px`,
              borderColor: colors[i],
              borderStyle: 'dashed',
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 360],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Rainbow Lightning */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`lightning-${i}`}
            className="absolute w-2 bg-gradient-to-b from-yellow-400 via-pink-500 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 400 + 200}px`,
              background: `linear-gradient(to bottom, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
              scaleX: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2 + 1,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GodModePartyEffects;