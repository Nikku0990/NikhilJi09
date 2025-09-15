import React from 'react';
import { useAppStore } from '../store/useAppStore';
import TopBar from './main/TopBar';
import CodeArea from './main/CodeArea';
import ChatWindow from './main/ChatWindow';
import ChatBar from './main/ChatBar';

const MainContent: React.FC = () => {
  const { showCodeArea } = useAppStore();

  return (
    <main className="flex flex-col h-screen">
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