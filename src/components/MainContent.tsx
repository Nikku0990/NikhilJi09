import React from 'react';
import { useAppStore } from '../store/useAppStore';
import TopBar from './main/TopBar';
import CodeArea from './main/CodeArea';
import ChatWindow from './main/ChatWindow';
import ChatBar from './main/ChatBar';
import GodModePartyEffects from './GodModePartyEffects';

const MainContent: React.FC = () => {
  const { showCodeArea, godMode } = useAppStore();

  return (
    <main className={`flex flex-col h-screen relative ${godMode.active ? 'god-mode-main' : ''}`}>
      {/* God Mode Party Effects */}
      <GodModePartyEffects isActive={godMode.active} />
      
      {/* Top Navigation Bar */}
      <TopBar />
      
      {/* Code Area (Conditional) */}
      {showCodeArea && (
        <div className="flex-shrink-0">
          <CodeArea />
        </div>
      )}
      
      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
      
      {/* Chat Input Bar */}
      <ChatBar />
    </main>
  );
};

export default MainContent;