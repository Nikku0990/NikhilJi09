import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCenter, setShowCenter] = useState(false);
  const { currentMode, files, sessions } = useAppStore();

  useEffect(() => {
    // Add welcome notification
    addNotification({
      type: 'info',
      title: 'Welcome to NikkuAi09! 🚀',
      message: 'Professional AI Development Platform by Nikhil Mehra is ready!',
    });

    // Add mode change notifications
    const modeNotification = currentMode === 'agent' 
      ? {
          type: 'success' as const,
          title: '🤖 Agent Mode Activated',
          message: 'Full coding powers unlocked! Ready to build amazing projects.',
        }
      : {
          type: 'info' as const,
          title: '💬 Chat Mode Active',
          message: 'Strategic planning and discussion mode enabled.',
        };
    
    addNotification(modeNotification);
  }, [currentMode]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowCenter(!showCenter)}
        className="fixed top-4 right-4 z-50 p-3 bg-[var(--card)] border border-white/10 rounded-full hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-[var(--text)]" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Center */}
      {showCenter && (
        <div className="fixed top-16 right-4 z-50 w-80 max-h-96 bg-[var(--card)] border border-white/10 rounded-xl shadow-2xl overflow-hidden slide-up">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setShowCenter(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-[var(--muted)]" />
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[var(--muted)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                      !notification.read ? 'bg-white/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getColor(notification.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <X className="w-3 h-3 text-[var(--muted)]" />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[var(--muted)]">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                              className="text-xs text-[var(--acc1)] hover:text-[var(--acc2)] transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-xs text-[var(--muted)] hover:text-white transition-colors"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationCenter;