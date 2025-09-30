import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsDrawer from './components/SettingsDrawer';
import PreviousChatsDrawer from './components/PreviousChatsDrawer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CommandPalette from './components/CommandPalette';
import FloatingAIActions from './components/FloatingAIActions';
import BackgroundAnimation from './components/BackgroundAnimation';
import NotificationCenter from './components/NotificationCenter';
import GodModeActivation from './components/GodModeActivation';
import GodModeTheme from './components/GodModeTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';

function App() {
  const { settings, showCommandPalette, toggleCommandPalette, godMode } = useAppStore();
  const [isActivatingGodMode, setIsActivatingGodMode] = useState(false);
  const [isDeactivatingGodMode, setIsDeactivatingGodMode] = useState(false);
  const [showGodModeActivation, setShowGodModeActivation] = useState(false);

  // Global hotkeys
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    toggleCommandPalette();
  });

  useEffect(() => {
    // Load persisted settings on app start
    const savedBaseUrl = localStorage.getItem('baseUrl');
    const savedApiKey = localStorage.getItem('apiKey');
    
    if (savedBaseUrl || savedApiKey) {
      // Migration from old localStorage format
      useAppStore.getState().updateSettings({
        baseUrl: savedBaseUrl || settings.baseUrl,
        apiKey: savedApiKey || settings.apiKey,
      });
      
      // Clean up old keys
      localStorage.removeItem('baseUrl');
      localStorage.removeItem('apiKey');
    }
  }, [settings.baseUrl, settings.apiKey]);

  // Watch for God Mode changes
  useEffect(() => {
    const prevGodMode = useAppStore.getState().godMode.active;
    
    const unsubscribe = useAppStore.subscribe((state) => {
      const currentGodMode = state.godMode.active;
      
      if (currentGodMode && !prevGodMode) {
        // God Mode activated
        setIsActivatingGodMode(true);
        setShowGodModeActivation(true);
      } else if (!currentGodMode && prevGodMode) {
        // God Mode deactivated
        setIsDeactivatingGodMode(true);
        setShowGodModeActivation(true);
      }
    });
    
    return unsubscribe;
  }, []);

  const handleGodModeActivationComplete = () => {
    setIsActivatingGodMode(false);
    setShowGodModeActivation(false);
  };

  const handleGodModeDeactivationComplete = () => {
    setIsDeactivatingGodMode(false);
    setShowGodModeActivation(false);
  };
  return (
    <GodModeTheme isGodMode={godMode.active}>
      <div className={`${godMode.active ? 'god-mode-active' : 'cosmic-bg'} text-[var(--text)] font-sans relative overflow-hidden`}>
        {/* Background Animation */}
        {!godMode.active && <BackgroundAnimation />}
        
        <div className="grid grid-cols-[320px_1fr] h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <MainContent />
        </div>
        
        {/* Floating AI Actions */}
        <FloatingAIActions />
        
        {/* Overlay Drawers */}
        <CommandPalette />
        <SettingsDrawer />
        <PreviousChatsDrawer />
        <AnalyticsDashboard />
        <NotificationCenter />
        
        {/* God Mode Activation Animation */}
        {showGodModeActivation && (
          <GodModeActivation
            isActivating={isActivatingGodMode}
            isDeactivating={isDeactivatingGodMode}
            onComplete={handleGodModeActivationComplete}
            onDeactivateComplete={handleGodModeDeactivationComplete}
          />
        )}
        
        {/* Toast Notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName={`${godMode.active ? 'god-mode-toast' : 'bg-[var(--card)]'} border border-white/10`}
        />
        
        {/* Global Styles Effect */}
        {settings.themeGlow && !godMode.active && (
          <style>{`
            .accent-gradient {
              box-shadow: 0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(255, 0, 245, 0.2);
            }
            .logo-gradient {
              box-shadow: 0 0 35px rgba(0, 255, 163, 0.5);
            }
            .cosmic-glow {
              box-shadow: 0 0 40px rgba(0, 245, 255, 0.3), inset 0 0 40px rgba(255, 0, 245, 0.1);
            }
          `}</style>
        )}
        
        {/* God Mode Styles */}
        {godMode.active && (
          <style>{`
            .god-mode-active {
              background: linear-gradient(135deg, 
                #1a0d2e 0%, 
                #2d1b3d 25%, 
                #3d2b4d 50%, 
                #2d1b3d 75%, 
                #1a0d2e 100%);
              animation: godModeBackground 5s ease-in-out infinite;
            }
            
            @keyframes godModeBackground {
              0%, 100% { filter: hue-rotate(0deg) saturate(1.5); }
              25% { filter: hue-rotate(90deg) saturate(2); }
              50% { filter: hue-rotate(180deg) saturate(2.5); }
              75% { filter: hue-rotate(270deg) saturate(2); }
            }
            
            .god-mode-toast {
              background: linear-gradient(135deg, #ff0080, #8000ff) !important;
              border: 2px solid #00ff80 !important;
              box-shadow: 0 0 20px rgba(255, 0, 128, 0.5) !important;
            }
            
            .accent-gradient {
              background: linear-gradient(135deg, #ff0080, #00ff80, #8000ff, #ff8000) !important;
              box-shadow: 
                0 0 40px rgba(255, 0, 128, 0.6),
                0 0 80px rgba(0, 255, 128, 0.4),
                0 0 120px rgba(128, 0, 255, 0.3) !important;
              animation: godModeGlow 2s ease-in-out infinite !important;
            }
            
            @keyframes godModeGlow {
              0%, 100% { 
                box-shadow: 
                  0 0 40px rgba(255, 0, 128, 0.6),
                  0 0 80px rgba(0, 255, 128, 0.4),
                  0 0 120px rgba(128, 0, 255, 0.3);
              }
              50% { 
                box-shadow: 
                  0 0 60px rgba(255, 0, 128, 0.8),
                  0 0 120px rgba(0, 255, 128, 0.6),
                  0 0 180px rgba(128, 0, 255, 0.5);
              }
            }
            
            .logo-gradient {
              background: conic-gradient(from 0deg, 
                #ff0080, #00ff80, #8000ff, #ff8000, 
                #0080ff, #ff0040, #40ff00, #ff0080) !important;
              animation: godModeRotate 3s linear infinite !important;
            }
            
            @keyframes godModeRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        )}
      </div>
    </GodModeTheme>
  );
}

export default App;