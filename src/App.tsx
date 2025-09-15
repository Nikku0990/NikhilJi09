import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsDrawer from './components/SettingsDrawer';
import PreviousChatsDrawer from './components/PreviousChatsDrawer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { settings } = useAppStore();

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
    <div className="gradient-bg text-[var(--text)] font-sans">
      <div className="grid grid-cols-[320px_1fr] h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <MainContent />
      </div>
      
      {/* Overlay Drawers */}
      <SettingsDrawer />
      <PreviousChatsDrawer />
      <AnalyticsDashboard />
      
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
            box-shadow: 0 0 20px rgba(106, 90, 205, 0.3);
          }
          .logo-gradient {
            box-shadow: 0 0 25px rgba(255, 105, 180, 0.4);
          }
        `}</style>
      )}
    </div>
  );
}

export default App;