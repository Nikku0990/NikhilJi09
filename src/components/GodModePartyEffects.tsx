import React from 'react';

interface GodModePartyEffectsProps {
  isActive: boolean;
}

const GodModePartyEffects: React.FC<GodModePartyEffectsProps> = ({ isActive }) => {
  // Removed heavy party effects to reduce lag
  // Only keeping minimal cosmic background for God Mode
  
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Subtle cosmic background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default GodModePartyEffects;