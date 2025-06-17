'use client';

import React, { useState } from 'react';
import { FinancialAgent, AgentManager } from '@/lib/agents/financial-agents';

interface AgentPanelProps {
  financialData?: any[];
  onAgentSelect?: (agentId: string) => void;
  onQueryAgent?: (agentId: string, query: string) => void;
  className?: string;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  financialData = [],
  onAgentSelect,
  onQueryAgent,
  className = ''
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentQuery, setAgentQuery] = useState('');
  const [agentManager] = useState(new AgentManager());

  const agents = agentManager.getAllAgents();

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(selectedAgent === agentId ? null : agentId);
    onAgentSelect?.(agentId);
  };

  const handleQuerySubmit = (agentId: string) => {
    if (agentQuery.trim()) {
      onQueryAgent?.(agentId, agentQuery);
      setAgentQuery('');
    }
  };

  const getAgentStatusColor = (agentId: string) => {
    if (financialData.length === 0) return 'bg-gray-100 border-gray-200';
    
    // Simulate agent activity based on data
    const insights = agentManager.getAgent(agentId)?.analyzeData(financialData) || [];
    const alerts = agentManager.getAgent(agentId)?.generateAlerts(financialData) || [];
    
    if (alerts.length > 0) return 'bg-red-50 border-red-200';
    if (insights.length > 0) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getAgentActivity = (agentId: string) => {
    if (financialData.length === 0) return { insights: 0, alerts: 0, status: 'Ready' };
    
    const agent = agentManager.getAgent(agentId);
    if (!agent) return { insights: 0, alerts: 0, status: 'Ready' };
    
    const insights = agent.analyzeData(financialData);
    const alerts = agent.generateAlerts(financialData);
    
    let status = 'Active';
    if (alerts.length > 0) status = 'Alerting';
    else if (insights.length > 0) status = 'Analyzing';
    
    return { insights: insights.length, alerts: alerts.length, status };
  };

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes('Budget')) return '📊';
    if (specialty.includes('Risk')) return '🛡️';
    if (specialty.includes('Performance')) return '📈';
    return '🤖';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🤖 Financial Agents
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Specialized AI agents for comprehensive financial analysis
        </p>
      </div>

      {/* Agents List */}
      <div className="p-4 space-y-4">
        {agents.map((agent) => {
          const activity = getAgentActivity(agent.id);
          const isSelected = selectedAgent === agent.id;
          
          return (
            <div key={agent.id} className="space-y-3">
              {/* Agent Card */}
              <div
                onClick={() => handleAgentClick(agent.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? 'ring-2 ring-blue-500 border-blue-300' : getAgentStatusColor(agent.id)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{agent.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span>{getSpecialtyIcon(agent.specialty)}</span>
                        {agent.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'Alerting' ? 'bg-red-100 text-red-800' :
                      activity.status === 'Analyzing' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </div>
                    {financialData.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.insights} insights • {activity.alerts} alerts
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2 italic">
                  "{agent.personality}"
                </p>

                {/* Quick Stats */}
                {financialData.length > 0 && (
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-600">{activity.insights} insights generated</span>
                    </div>
                    {activity.alerts > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-gray-600">{activity.alerts} alerts active</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand/Collapse Indicator */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-400">
                    {isSelected ? '▲ Click to collapse' : '▼ Click to interact'}
                  </span>
                </div>
              </div>

              {/* Agent Interaction Panel */}
              {isSelected && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {/* Agent Capabilities */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Capabilities</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• {agent.specialty}</div>
                      <div>• Real-time financial analysis</div>
                      <div>• Proactive risk detection</div>
                      <div>• Strategic recommendations</div>
                    </div>
                  </div>

                  {/* Direct Query Interface */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Ask {agent.name}</h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={agentQuery}
                        onChange={(e) => setAgentQuery(e.target.value)}
                        placeholder={`Ask ${agent.name} about financial data...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(agent.id)}
                      />
                      <button
                        onClick={() => handleQuerySubmit(agent.id)}
                        disabled={!agentQuery.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Ask
                      </button>
                    </div>
                  </div>

                  {/* Sample Queries */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Sample Questions</h5>
                    <div className="space-y-2">
                      {agent.id === 'budget-analyst' && (
                        <>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "What departments have the highest budget variances?")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "What departments have the highest budget variances?"
                          </button>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "Show me spending trends by category")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "Show me spending trends by category"
                          </button>
                        </>
                      )}
                      
                      {agent.id === 'risk-advisor' && (
                        <>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "What are the biggest financial risks we face?")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "What are the biggest financial risks we face?"
                          </button>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "Analyze spending volatility across departments")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "Analyze spending volatility across departments"
                          </button>
                        </>
                      )}
                      
                      {agent.id === 'performance-analyst' && (
                        <>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "Compare department performance metrics")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "Compare department performance metrics"
                          </button>
                          <button 
                            onClick={() => onQueryAgent?.(agent.id, "Identify efficiency improvement opportunities")}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded bg-white hover:bg-blue-50"
                          >
                            "Identify efficiency improvement opportunities"
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Data State */}
      {financialData.length === 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm">Agents are ready to analyze your financial data</p>
            <p className="text-xs mt-1">Upload data to see agent insights and activity</p>
          </div>
        </div>
      )}

      {/* Agent Summary */}
      {financialData.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Multi-Agent Analysis Active
            </div>
            <div className="text-xs text-gray-600">
              {agents.reduce((sum, agent) => sum + getAgentActivity(agent.id).insights, 0)} total insights • 
              {agents.reduce((sum, agent) => sum + getAgentActivity(agent.id).alerts, 0)} total alerts
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPanel; 