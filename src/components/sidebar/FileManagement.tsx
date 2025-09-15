import React, { useRef } from 'react';
import { FileText, Upload, Code, X, Eye, Download } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'react-toastify';

const FileManagement: React.FC = () => {
  const { 
    files, 
    filesContext, 
    addFileToContext, 
    removeFileFromContext,
    addMessage, 
    currentSessionId,
    toggleCodeArea,
    createFile 
  } = useAppStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const processedFiles: string[] = [];
    
    for (const file of Array.from(uploadedFiles)) {
      if (file.size > 5000000) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        continue;
      }
      
      try {
        const content = await file.text();
        const safeContent = (content && typeof content === 'string') ? content : '';
        const fileItem = {
          name: file.name,
          content: safeContent.slice(0, 500000) || '', // Limit content to 500KB
          lastModified: Date.now(),
        };
        
        // Add to both context and editor
        addFileToContext(fileItem);
        createFile(file.name, safeContent);
        processedFiles.push(file.name);
        
        toast.success(`Added ${file.name} to project`);
      } catch (error) {
        toast.error(`Failed to read ${file.name}`);
      }
    }
    
    if (processedFiles.length > 0) {
      addMessage(currentSessionId, {
        role: 'assistant',
        content: `📎 Successfully loaded ${processedFiles.length} file(s) into project:\n- ${processedFiles.join('\n- ')}\n\nFiles are now available in both context and code editor.`,
        timestamp: Date.now(),
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeFile = (file: FileItem) => {
    addMessage(currentSessionId, {
      role: 'user',
      content: `Please analyze this file and provide insights:\n\nFile: ${file.name}\nSize: ${(file.content.length / 1024).toFixed(1)}KB\nLanguage: ${getLanguageFromFileName(file.name)}\n\n\`\`\`${getLanguageFromFileName(file.name)}\n${file.content.slice(0, 2000)}${file.content.length > 2000 ? '\n\n<content clipped>' : ''}\n\`\`\``,
      timestamp: Date.now(),
    });
  };

  const handleExportFile = (file: FileItem) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${file.name}`);
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c', 'cs': 'csharp',
      'php': 'php', 'rb': 'ruby', 'go': 'go', 'rs': 'rust', 'swift': 'swift',
      'kt': 'kotlin', 'scala': 'scala', 'html': 'html', 'css': 'css',
      'json': 'json', 'xml': 'xml', 'yaml': 'yaml', 'md': 'markdown',
      'sql': 'sql', 'sh': 'shell',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-3">
      <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
        <FileText className="w-3 h-3" />
        File Management
      </h4>
      
      <div className="space-y-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="w-full bg-[#0e1130] border border-white/12 text-[var(--text)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--acc1)] transition-colors file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-[var(--acc1)] file:text-white file:cursor-pointer"
            accept=".txt,.js,.ts,.jsx,.tsx,.py,.html,.css,.json,.md,.sql,.php,.java,.cpp,.c,.go,.rs,.rb,.swift,.kt,.scala,.yml,.yaml,.xml,.sh"
          />
          <div className="text-xs text-[var(--muted)] mt-1">
            Upload files to add them to both context and code editor.
          </div>
        </div>
        
        {/* Files in Context */}
        {filesContext.length > 0 && (
          <div>
            <div className="text-xs text-[var(--muted)] mb-2 flex items-center justify-between">
              <span>Files in Context ({filesContext.length}):</span>
              <button
                onClick={() => {
                  filesContext.forEach(f => removeFileFromContext(f.name));
                  toast.success('Cleared all files from context');
                }}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
              {filesContext.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 text-xs bg-[#222653] border border-white/12 rounded-lg px-2 py-1 group"
                >
                  <Code className="w-3 h-3 text-[var(--acc1)]" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-[var(--muted)]">
                    {(file.content.length / 1024).toFixed(1)}KB
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAnalyzeFile(file)}
                      className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                      title="Analyze file"
                    >
                      <Eye className="w-3 h-3 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleExportFile(file)}
                      className="p-1 hover:bg-green-500/20 rounded transition-colors"
                      title="Export file"
                    >
                      <Download className="w-3 h-3 text-green-400" />
                    </button>
                    <button
                      onClick={() => {
                        removeFileFromContext(file.name);
                        toast.success(`Removed ${file.name} from context`);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      title="Remove from context"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Code Editor Toggle */}
        <button
          onClick={toggleCodeArea}
          className="w-full bg-[#232655] hover:bg-[#2a2d5f] text-[var(--text)] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Code className="w-4 h-4" />
          Open Monaco Editor
        </button>
        
        {/* File Statistics */}
        <div className="text-xs text-[var(--muted)] p-2 bg-[#1a1e3f] rounded-lg">
          <div className="flex justify-between">
            <span>Project Files: {files.length}</span>
            <span>Context Files: {filesContext.length}</span>
          </div>
          <div className="mt-1">
            Total Size: {((files.reduce((sum, f) => sum + f.content.length, 0)) / 1024).toFixed(1)}KB
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagement;