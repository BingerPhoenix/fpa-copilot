'use client';

import React, { useState, useEffect } from 'react';
import { AgentAlert, AgentManager } from '@/lib/agents/financial-agents';

interface NotificationSystemProps {
  financialData?: any[];
  autoRefresh?: boolean;
  showToasts?: boolean;
  maxVisible?: number;
  onAlertAction?: (alertId: string, action: string) => void;
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  financialData = [],
  autoRefresh = true,
  showToasts = true,
  maxVisible = 5,
  onAlertAction,
  className = ''
}) => {
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [toastAlerts, setToastAlerts] = useState<AgentAlert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [agentManager] = useState(new AgentManager());
  const [filter, setFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    if (financialData.length > 0) {
      generateAlerts();
    }
  }, [financialData]);

  useEffect(() => {
    if (autoRefresh && financialData.length > 0) {
      const interval = setInterval(() => {
        generateAlerts();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [autoRefresh, financialData]);

  const generateAlerts = () => {
    if (financialData.length === 0) return;

    const newAlerts = agentManager.generateAllAlerts(financialData);
    
    // Find truly new alerts (not just refreshed)
    const existingIds = new Set(alerts.map(a => a.id));
    const actuallyNewAlerts = newAlerts.filter(alert => !existingIds.has(alert.id));
    
    setAlerts(newAlerts);
    setUnreadCount(newAlerts.filter(a => !a.acknowledged).length);

    // Show toast notifications for new urgent/high priority alerts
    if (showToasts && actuallyNewAlerts.length > 0) {
      const urgentNewAlerts = actuallyNewAlerts.filter(
        alert => alert.priority === 'urgent' || alert.priority === 'high'
      );
      
      urgentNewAlerts.forEach(alert => {
        showToastNotification(alert);
      });
    }
  };

  const showToastNotification = (alert: AgentAlert) => {
    setToastAlerts(prev => [...prev, alert]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToastAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 5000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const getAgentInfo = (agentId: string) => {
    const agent = agentManager.getAgent(agentId);
    return {
      name: agent?.name || 'AI Agent',
      avatar: agent?.avatar || '🤖'
    };
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    onAlertAction?.(alertId, 'acknowledge');
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => Math.max(0, prev - 1));
    onAlertAction?.(alertId, 'dismiss');
  };

  const dismissToast = (alertId: string) => {
    setToastAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.priority === filter);

  const activeAlerts = filteredAlerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = filteredAlerts.filter(a => a.acknowledged);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Notification Bell/Trigger */}
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="relative p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-xl">🔔</div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {isVisible && (
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg border border-gray-200 shadow-xl z-50">
            {/* Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  🔔 Notifications
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-1">
                {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilter(priority as any)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === priority
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {priority === 'all' ? 'All' : priority}
                    {priority !== 'all' && (
                      <span className="ml-1">
                        ({alerts.filter(a => a.priority === priority && !a.acknowledged).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts List */}
            <div className="max-h-96 overflow-y-auto">
              {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-2xl mb-2">✅</div>
                  <p>No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {/* Active Alerts */}
                  {activeAlerts.slice(0, maxVisible).map((alert) => {
                    const agentInfo = getAgentInfo(alert.agentId);
                    return (
                      <div
                        key={alert.id}
                        className={`border rounded-lg p-3 ${getPriorityBg(alert.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
                            <span className="text-lg">{agentInfo.avatar}</span>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                              <p className="text-xs text-gray-600">by {agentInfo.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(alert.priority)}`}></div>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(alert.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>

                        {alert.department && (
                          <p className="text-xs text-gray-600 mb-2">
                            Department: {alert.department}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="text-xs text-gray-600 hover:text-gray-800 underline"
                            >
                              Dismiss
                            </button>
                          </div>
                          <span className="text-xs font-medium text-gray-700 uppercase">
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Show more indicator */}
                  {activeAlerts.length > maxVisible && (
                    <div className="text-center py-2">
                      <span className="text-xs text-gray-500">
                        +{activeAlerts.length - maxVisible} more alerts
                      </span>
                    </div>
                  )}

                  {/* Acknowledged Alerts Section */}
                  {acknowledgedAlerts.length > 0 && activeAlerts.length > 0 && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">
                        Acknowledged ({acknowledgedAlerts.length})
                      </h5>
                      {acknowledgedAlerts.slice(0, 3).map((alert) => {
                        const agentInfo = getAgentInfo(alert.agentId);
                        return (
                          <div
                            key={alert.id}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50 opacity-60"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{agentInfo.avatar}</span>
                                <span className="text-sm text-gray-700">{alert.title}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ✓ {formatTimeAgo(alert.timestamp)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {alerts.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {activeAlerts.length} active • {acknowledgedAlerts.length} acknowledged
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 underline">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {showToasts && (
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toastAlerts.map((alert) => {
            const agentInfo = getAgentInfo(alert.agentId);
            return (
              <div
                key={alert.id}
                className={`max-w-sm rounded-lg border p-4 shadow-lg animate-slide-in-right ${getPriorityBg(alert.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
                    <span className="text-lg">{agentInfo.avatar}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                      <p className="text-xs text-gray-600">by {agentInfo.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissToast(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      acknowledgeAlert(alert.id);
                      dismissToast(alert.id);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => dismissToast(alert.id)}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationSystem; 