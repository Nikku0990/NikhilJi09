import React, { useState } from 'react';
import { Download, Monitor, Smartphone, Globe, Package, Zap, Shield, Code } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

const DownloadSection: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { sessions, files, settings, userMemory } = useAppStore();

  const downloadOptions = [
    {
      id: 'windows',
      title: 'Windows Desktop App',
      description: 'Full-featured desktop application with Ollama integration',
      icon: Monitor,
      color: 'from-blue-600 to-cyan-600',
      features: ['Offline Mode', 'Ollama Models', 'System Integration', 'Auto Updates'],
      size: '~150MB',
      format: '.exe'
    },
    {
      id: 'mac',
      title: 'macOS Application',
      description: 'Native macOS app with Apple Silicon optimization',
      icon: Monitor,
      color: 'from-gray-600 to-gray-800',
      features: ['M1/M2 Optimized', 'Native Performance', 'Keychain Integration'],
      size: '~120MB',
      format: '.dmg'
    },
    {
      id: 'linux',
      title: 'Linux AppImage',
      description: 'Universal Linux application with all dependencies',
      icon: Monitor,
      color: 'from-orange-600 to-red-600',
      features: ['Universal Binary', 'No Dependencies', 'Portable'],
      size: '~140MB',
      format: '.AppImage'
    },
    {
      id: 'web',
      title: 'Progressive Web App',
      description: 'Install as web app with offline capabilities',
      icon: Globe,
      color: 'from-purple-600 to-pink-600',
      features: ['Offline Mode', 'Push Notifications', 'Auto Sync'],
      size: '~5MB',
      format: 'PWA'
    },
    {
      id: 'mobile',
      title: 'Mobile App (Coming Soon)',
      description: 'Native iOS and Android applications',
      icon: Smartphone,
      color: 'from-green-600 to-blue-600',
      features: ['Touch Optimized', 'Voice Commands', 'Cloud Sync'],
      size: '~80MB',
      format: '.apk/.ipa',
      comingSoon: true
    }
  ];

  const generateDesktopApp = async (platform: string) => {
    setIsGenerating(true);
    
    toast.info(`🚀 Generating ${platform} application...`, { autoClose: 3000 });
    
    try {
      // Simulate app generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock download
      const appData = {
        name: 'NikkuAi09',
        version: '1.0.0',
        platform,
        features: {
          ollamaIntegration: platform === 'windows' || platform === 'mac' || platform === 'linux',
          offlineMode: true,
          autoUpdates: true,
          systemIntegration: true
        },
        settings: settings,
        userProfile: userMemory,
        timestamp: Date.now()
      };
      
      const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NikkuAi09-${platform}-installer.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`✅ ${platform} app package generated!`, {
        autoClose: 5000,
      });
      
    } catch (error) {
      toast.error(`❌ Failed to generate ${platform} app`);
    } finally {
      setIsGenerating(false);
    }
  };

  const installPWA = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Register service worker for PWA
        await navigator.serviceWorker.register('/sw.js');
        toast.success('🌐 PWA installation ready!');
        
        // Trigger install prompt if available
        if ((window as any).deferredPrompt) {
          (window as any).deferredPrompt.prompt();
          const { outcome } = await (window as any).deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            toast.success('📱 PWA installed successfully!');
          }
        } else {
          toast.info('💡 Add to home screen from browser menu to install PWA');
        }
      } catch (error) {
        toast.error('❌ PWA installation failed');
      }
    } else {
      toast.error('❌ PWA not supported in this browser');
    }
  };

  return (
    <div className="bg-[var(--card)] border border-white/6 rounded-[var(--radius)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-[var(--acc1)]" />
        <h3 className="text-lg font-bold text-white">Download NikkuAi09</h3>
        <div className="ml-auto text-xs text-[var(--muted)]">
          Install for offline use
        </div>
      </div>

      <div className="space-y-3">
        {downloadOptions.map((option) => (
          <div
            key={option.id}
            className={`bg-gradient-to-r ${option.color} bg-opacity-10 border border-white/10 rounded-xl p-4 ${
              option.comingSoon ? 'opacity-60' : 'hover:bg-opacity-20 cursor-pointer'
            } transition-all`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color}`}>
                <option.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{option.title}</h4>
                  {option.comingSoon && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-[var(--muted)] mb-2">{option.description}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs text-[var(--muted)]">Size: {option.size}</span>
                  <span className="text-xs text-[var(--muted)]">Format: {option.format}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {option.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-white/10 text-white px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {!option.comingSoon && (
                    <>
                      {option.id === 'web' ? (
                        <button
                          onClick={installPWA}
                          className="bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          Install PWA
                        </button>
                      ) : (
                        <button
                          onClick={() => generateDesktopApp(option.id)}
                          disabled={isGenerating}
                          className="bg-[var(--acc1)] hover:bg-[var(--acc1)]/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download
                            </>
                          )}
                        </button>
                      )}
                      
                      <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        Info
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Features for Desktop */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          Desktop App Exclusive Features
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3 text-blue-400" />
            <span className="text-[var(--text)]">Ollama Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-[var(--text)]">Local AI Models</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3 text-purple-400" />
            <span className="text-[var(--text)]">System File Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-3 h-3 text-orange-400" />
            <span className="text-[var(--text)]">Native Performance</span>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="mt-4 text-xs text-[var(--muted)] p-3 bg-[#1a1e3f] rounded-xl">
        <div className="font-semibold mb-1">📋 Installation Notes:</div>
        <div>• Windows: Run as administrator for full features</div>
        <div>• macOS: Allow in Security & Privacy settings</div>
        <div>• Linux: Make executable with chmod +x</div>
        <div>• Ollama: Install separately for local AI models</div>
      </div>
    </div>
  );
};

export default DownloadSection;