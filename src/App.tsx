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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHotkeys } from 'react-hotkeys-hook';

function App() {
  const { settings, showCommandPalette, toggleCommandPalette } = useAppStore();

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

  return (
    <div className="cosmic-bg text-[var(--text)] font-sans relative overflow-hidden">
      {/* Cosmic Background Animation */}
      <BackgroundAnimation />
      
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
        toastClassName="bg-[var(--card)] border border-white/10"
      />
      
      {/* Global Styles Effect */}
      {settings.themeGlow && (
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
    </div>
  );
}

export default App;