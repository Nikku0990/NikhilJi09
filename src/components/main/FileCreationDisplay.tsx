import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code, Database, Settings, CheckCircle, Loader2, Folder } from 'lucide-react';

interface FileCreationItem {
  name: string;
  status: 'creating' | 'updating' | 'complete';
  content: string;
}

interface FileCreationDisplayProps {
  files: FileCreationItem[];
  onFileClick: (fileName: string) => void;
}

const FileCreationDisplay: React.FC<FileCreationDisplayProps> = ({ files, onFileClick }) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return Code;
      case 'json':
        return Database;
      case 'css':
      case 'scss':
        return Settings;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'creating':
        return 'text-blue-400';
      case 'updating':
        return 'text-yellow-400';
      case 'complete':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'creating':
      case 'updating':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-20 right-6 z-40 w-80"
    >
      <div className="bg-[var(--card)] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">AI Creating Files</h3>
            <div className="ml-auto text-xs text-[var(--muted)]">
              {files.filter(f => f.status === 'complete').length}/{files.length}
            </div>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {files.map((file, index) => {
              const Icon = getFileIcon(file.name);
              return (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onFileClick(file.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {file.name}
                        </span>
                        <div className={`${getStatusColor(file.status)}`}>
                          {getStatusIcon(file.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${getStatusColor(file.status)}`}>
                          {file.status === 'creating' ? 'Creating...' :
                           file.status === 'updating' ? 'Updating...' :
                           'Complete'}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {file.content.length} chars
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for creating/updating files */}
                  {file.status !== 'complete' && (
                    <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Summary */}
        <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <div className="text-xs text-[var(--muted)] text-center">
            🚀 AI is creating your project files with professional structure
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCreationDisplay;