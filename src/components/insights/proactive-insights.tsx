'use client';

import React, { useState, useEffect } from 'react';
import { AgentInsight, AgentAlert, AgentManager } from '@/lib/agents/financial-agents';

interface ProactiveInsightsProps {
  financialData?: any[];
  autoRefresh?: boolean;
  refreshInterval?: number;
  onInsightClick?: (insight: AgentInsight) => void;
  onAlertClick?: (alert: AgentAlert) => void;
}

export const ProactiveInsights: React.FC<ProactiveInsightsProps> = ({
  financialData = [],
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  onInsightClick,
  onAlertClick
}) => {
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'alerts'>('insights');
  const [agentManager] = useState(new AgentManager());

  // Analyze data when it changes
  useEffect(() => {
    if (financialData.length > 0) {
      analyzeFinancialData();
    }
  }, [financialData]);

  // Auto-refresh insights
  useEffect(() => {
    if (autoRefresh && financialData.length > 0) {
      const interval = setInterval(() => {
        analyzeFinancialData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, financialData]);

  const analyzeFinancialData = async () => {
    if (financialData.length === 0) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate async analysis with professional loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInsights = agentManager.analyzeDataWithAllAgents(financialData);
      const newAlerts = agentManager.generateAllAlerts(financialData);
      
      setInsights(newInsights);
      setAlerts(newAlerts);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error('Failed to analyze financial data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk': return '⚠️';
      case 'opportunity': return '💡';
      case 'trend': return '📈';
      case 'anomaly': return '🔍';
      case 'recommendation': return '💭';
      default: return '📊';
    }
  };

  const getAgentAvatar = (agentId: string) => {
    const agent = agentManager.getAgent(agentId);
    return agent?.avatar || '🤖';
  };

  const getAgentName = (agentId: string) => {
    const agent = agentManager.getAgent(agentId);
    return agent?.name || 'AI Agent';
  };

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

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  if (financialData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Proactive Insights Ready
          </h3>
          <p className="text-gray-600 mb-4">
            Upload financial data to start receiving AI-powered insights and alerts
          </p>
          <div className="text-sm text-gray-500">
            Our intelligent agents will automatically analyze your data and provide:
          </div>
          <div className="mt-3 text-sm text-gray-600">
            • Budget variance detection • Risk assessment • Performance optimization
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card hover-lift transition-smooth animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            🤖 Proactive Insights
          </h3>
          <div className="flex items-center gap-3">
            {lastAnalyzed && (
              <span className="text-xs text-gray-500">
                Last analyzed: {formatTimeAgo(lastAnalyzed)}
              </span>
            )}
            <button
              onClick={analyzeFinancialData}
              disabled={isAnalyzing}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-smooth hover-lift focus-ring"
            >
              {isAnalyzing ? (
                <>
                  <div className="inline-block animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'insights'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Insights ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors relative ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Alerts ({alerts.filter(a => !a.acknowledged).length})
            {alerts.filter(a => !a.acknowledged && (a.priority === 'urgent' || a.priority === 'high')).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {alerts.filter(a => !a.acknowledged && (a.priority === 'urgent' || a.priority === 'high')).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'insights' ? (
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">🔍</div>
                <p>No insights detected yet</p>
                <p className="text-sm">Insights will appear as patterns are identified</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  onClick={() => onInsightClick?.(insight)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(insight.type)}</span>
                        <span className="text-lg">{getAgentAvatar(insight.agentId)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600">by {getAgentName(insight.agentId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(insight.severity)}`}>
                        {insight.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(insight.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  
                  {insight.details && (
                    <p className="text-sm text-gray-600 mb-3">{insight.details}</p>
                  )}

                  {insight.affectedDepartments.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Affected: </span>
                      {insight.affectedDepartments.map((dept, idx) => (
                        <span key={dept} className="text-sm text-blue-600">
                          {dept}{idx < insight.affectedDepartments.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {insight.actionItems.slice(0, 2).map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                        {insight.actionItems.length > 2 && (
                          <li className="text-blue-600 text-xs">
                            +{insight.actionItems.length - 2} more actions...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < insight.confidence * 5 ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          {(insight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600">View Details →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.filter(a => !a.acknowledged).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">✅</div>
                <p>No active alerts</p>
                <p className="text-sm">You'll be notified when issues are detected</p>
              </div>
            ) : (
              alerts.filter(a => !a.acknowledged).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onAlertClick?.(alert)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getAgentAvatar(alert.agentId)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600">by {getAgentName(alert.agentId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{alert.message}</p>

                  {alert.department && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Department: </span>
                      <span className="text-sm text-blue-600">{alert.department}</span>
                    </div>
                  )}

                  {alert.suggestedActions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggested Actions:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {alert.suggestedActions.slice(0, 2).map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                        {alert.suggestedActions.length > 2 && (
                          <li className="text-orange-600 text-xs">
                            +{alert.suggestedActions.length - 2} more actions...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Acknowledge Alert
                    </button>
                    <span className="text-xs text-blue-600">View Details →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProactiveInsights; 