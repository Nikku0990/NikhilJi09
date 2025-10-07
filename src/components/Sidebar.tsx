import React from 'react';
import { Settings, MessageSquare, FileText, Zap, Database, Code2, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ApiSettings from './sidebar/ApiSettings';
import ModelSettings from './sidebar/ModelSettings';
import MemorySettings from './sidebar/MemorySettings';
import ChatManagement from './sidebar/ChatManagement';
import FileManagement from './sidebar/FileManagement';
import QuickActions from './sidebar/QuickActions';
import CosmicEngines from './CosmicEngines';
import ProfessionalFeatures from './ProfessionalFeatures';
import VoiceControl from './VoiceControl';
import SnapshotManager from './SnapshotManager';
import DeploymentEngine from './DeploymentEngine';
import TestRunner from './TestRunner';
import OrchestratorControl from './OrchestratorControl';
import GodModePartyEffects from './GodModePartyEffects';
import DesktopDownload from './DesktopDownload';
import BeastCoder from './BeastCoder';

const Sidebar: React.FC = () => {
  const { toggleSettings, togglePreviousChats, toggleAnalytics, godMode } = useAppStore();

  return (
    <aside className={`w-80 ${godMode.active ? 'god-mode-sidebar' : 'card-gradient'} border-r border-white/6 p-4 overflow-auto custom-scrollbar relative`}>
      {/* God Mode Party Effects */}
      <GodModePartyEffects isActive={godMode.active} />
      
      {/* Brand Header */}
      <div className={`flex items-center gap-3 mb-6 ${godMode.active ? 'god-mode-header' : ''}`}>
        <div className={`w-9 h-9 rounded-full ${godMode.active ? 'god-mode-logo' : 'logo-gradient'} flex items-center justify-center`}>
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className={`font-bold text-lg ${godMode.active ? 'god-mode-title' : 'text-white'}`}>
            {godMode.active ? '👑 NikkuAi09 GOD' : 'NikkuAi09'}
          </div>
          <small className={`text-xs ${godMode.active ? 'god-mode-subtitle' : 'text-[var(--muted)]'}`}>
            {godMode.active ? 'DIVINE AI DEVELOPMENT POWERS' : 'Professional AI Development Platform'}
          </small>
        </div>
      </div>

      {/* API Settings Section */}
      <div className="mb-4">
        <ApiSettings />
      </div>

      {/* Model Settings Section */}
      <div className="mb-4">
        <ModelSettings />
      </div>

      {/* Memory Settings Section */}
      <div className="mb-4">
        <MemorySettings />
      </div>

      {/* Chat Management Section */}
      <div className="mb-4">
        <ChatManagement />
      </div>

      {/* File Management Section */}
      <div className="mb-4">
        <FileManagement />
      </div>

      {/* Quick Actions Section */}
      <div className="mb-4">
        <QuickActions />
      </div>
      
      {/* Voice Control Section */}
      <div className="mb-4">
        <VoiceControl onTranscript={(text) => {
          useAppStore.getState().addMessage(currentSessionId, {
            role: 'user',
            content: text,
            timestamp: Date.now(),
          });
        }} />
      </div>
      
      {/* Orchestrator Control Section */}
      <div className="mb-4">
        <OrchestratorControl />
      </div>
      
      {/* Snapshot Manager Section */}
      <div className="mb-4">
        <SnapshotManager />
      </div>
      
      {/* Test Runner Section */}
      <div className="mb-4">
        <TestRunner />
      </div>
      
      {/* Deployment Engine Section */}
      <div className="mb-4">
        <DeploymentEngine />
      </div>
      
      {/* Cosmic Engines Section */}
      <div className="mb-4">
        <CosmicEngines />
      </div>

      {/* 100+ Features Section */}
      <div className="mb-4">
        <ProfessionalFeatures />
      </div>

      {/* Download Section */}
      <div className="mb-4">
        <DesktopDownload />
      </div>

      {/* Analytics Section */}
      <div className="mb-4">
        <button
          onClick={toggleAnalytics}
          className="w-full bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <BarChart3 className="w-4 h-4" />
          Analytics Dashboard
        </button>
      </div>
      
      {/* Beast Coder Integration */}
      {godMode.active && (
        <div className="mb-4">
          <BeastCoder />
        </div>
      )}
      {/* Professional Features Preview */}
      <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3 mb-4">
        <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          Pro Features
        </h4>
        <div className="space-y-2 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            Monaco Editor (50+ languages)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            Advanced AI Agents
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            Real-time Collaboration
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            Analytics Dashboard
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            2000+ Features Active...
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;