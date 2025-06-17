'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import ProactiveInsights from '@/components/insights/proactive-insights';
import ExecutiveSummary from '@/components/insights/executive-summary';
import QuerySuggestions from '@/components/insights/query-suggestions';
import AgentPanel from '@/components/agents/agent-panel';
import NotificationSystem from '@/components/alerts/notification-system';
import { LoadingSpinner, LoadingOverlay, SkeletonCard } from '@/components/ui/loading-spinner';
import { QuickExport } from '@/components/export/export-manager';
import { Brain, Upload, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// Sample financial data for testing
const sampleFinancialData = [
  { department: 'Sales', budgetAmount: 500000, actualAmount: 520000, category: 'Revenue', period: '2024-Q1' },
  { department: 'Marketing', budgetAmount: 200000, actualAmount: 185000, category: 'Marketing', period: '2024-Q1' },
  { department: 'Operations', budgetAmount: 300000, actualAmount: 315000, category: 'Operations', period: '2024-Q1' },
  { department: 'HR', budgetAmount: 150000, actualAmount: 145000, category: 'Personnel', period: '2024-Q1' },
  { department: 'IT', budgetAmount: 180000, actualAmount: 195000, category: 'Technology', period: '2024-Q1' },
];

export default function TestAgentsPage() {
  const [financialData, setFinancialData] = useState(sampleFinancialData);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState({
    dataProcessing: 'loading',
    agentAnalysis: 'loading',
    insightGeneration: 'loading',
    alertSystem: 'loading'
  });

  // Simulate initial loading
  useEffect(() => {
    const loadSystem = async () => {
      // Simulate progressive loading
      const steps = [
        { name: 'dataProcessing', delay: 500 },
        { name: 'agentAnalysis', delay: 800 },
        { name: 'insightGeneration', delay: 1200 },
        { name: 'alertSystem', delay: 300 }
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await new Promise(resolve => setTimeout(resolve, step.delay));
        
        setSystemStatus(prev => ({
          ...prev,
          [step.name]: 'ready'
        }));
        
        setLoadingProgress(((i + 1) / steps.length) * 100);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loadSystem();
  }, []);

  const handleSendMessage = async (message: string) => {
    setSelectedMessage(message);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const exportData = {
    type: 'report' as const,
    title: 'FP&A Agent Analysis Report',
    data: {
      financialData,
      insights: 'AI-generated insights',
      summary: 'Executive summary'
    },
    metadata: {
      generatedBy: 'AI Agents System',
      timestamp: new Date(),
      department: 'Finance',
      period: '2024-Q1'
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="container-professional py-16">
            {/* Loading Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Initializing AI Agents System
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Setting up your intelligent financial analysis environment with specialized AI agents
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">System Status</span>
                <span className="text-sm text-gray-500">{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            {/* Loading Steps */}
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { key: 'dataProcessing', label: 'Processing Financial Data', icon: TrendingUp },
                { key: 'agentAnalysis', label: 'Activating AI Agents', icon: Brain },
                { key: 'insightGeneration', label: 'Generating Insights', icon: Sparkles },
                { key: 'alertSystem', label: 'Setting Up Alert System', icon: AlertTriangle }
              ].map((step) => (
                <div key={step.key} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className={`p-2 rounded-lg ${
                    systemStatus[step.key as keyof typeof systemStatus] === 'ready' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {systemStatus[step.key as keyof typeof systemStatus] === 'ready' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{step.label}</div>
                    <div className={`text-sm ${
                      systemStatus[step.key as keyof typeof systemStatus] === 'ready' 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }`}>
                      {systemStatus[step.key as keyof typeof systemStatus] === 'ready' ? 'Complete' : 'Loading...'}
                    </div>
                  </div>
                  {systemStatus[step.key as keyof typeof systemStatus] === 'loading' && (
                    <LoadingSpinner size="sm" color="gray" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container-professional py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6 animate-bounce-in">
              <Brain className="w-4 h-4" />
              AI Agents Testing Environment
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-gradient">
              Intelligent Agent System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience proactive financial analysis with AI agents that automatically detect risks, 
              generate insights, and provide executive summaries for data-driven decision making.
            </p>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <QuickExport data={exportData} />
              <button 
                onClick={() => setFinancialData([...sampleFinancialData])}
                className="btn-secondary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Refresh Sample Data
              </button>
            </div>
          </div>

          {/* System Status Banner */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="status-dot status-online" />
                <span className="font-medium text-green-900">All AI Agents Active</span>
                <span className="text-sm text-green-700">• Budget Analyst • Risk Advisor • Performance Analyst</span>
              </div>
              <div className="text-sm text-green-700">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Insights & Analysis */}
            <div className="lg:col-span-8 space-y-8">
              {/* Proactive Insights */}
              <LoadingOverlay isLoading={false} text="Analyzing financial data...">
                <div className="animate-fade-in-up">
                  <ProactiveInsights financialData={financialData} />
                </div>
              </LoadingOverlay>

              {/* Executive Summary */}
              <LoadingOverlay isLoading={false} text="Generating executive summary...">
                <div className="animate-fade-in-up">
                  <ExecutiveSummary financialData={financialData} />
                </div>
              </LoadingOverlay>

              {/* Query Suggestions */}
              <LoadingOverlay isLoading={false} text="Loading smart suggestions...">
                <div className="animate-fade-in-up">
                  <QuerySuggestions financialData={financialData} />
                </div>
              </LoadingOverlay>
            </div>

            {/* Right Column - Agents & Notifications */}
            <div className="lg:col-span-4 space-y-8">
              {/* Agent Panel */}
              <LoadingOverlay isLoading={false} text="Connecting to agents...">
                <div className="animate-fade-in-up animate-slide-in-right">
                  <AgentPanel financialData={financialData} />
                </div>
              </LoadingOverlay>

              {/* Notification System */}
              <LoadingOverlay isLoading={false} text="Setting up alerts...">
                <div className="animate-fade-in-up animate-slide-in-right">
                  <NotificationSystem financialData={financialData} />
                </div>
              </LoadingOverlay>

              {/* Performance Metrics */}
              <div className="card-professional p-6 animate-fade-in-up animate-slide-in-right">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  System Performance
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Analysis Speed', value: '< 2s', color: 'green' },
                    { label: 'Insight Accuracy', value: '94%', color: 'blue' },
                    { label: 'Data Coverage', value: '100%', color: 'purple' },
                    { label: 'Agent Response', value: 'Real-time', color: 'orange' }
                  ].map((metric, index) => (
                    <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className={`text-sm font-semibold text-${metric.color}-600`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-200 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Demo Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">1. Explore Proactive Insights</h4>
                <p className="text-sm text-gray-600">
                  View automatically generated insights from your AI agents including budget variances, 
                  risk assessments, and performance recommendations.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">2. Review Executive Summary</h4>
                <p className="text-sm text-gray-600">
                  Get high-level financial overview with key findings, risks, opportunities, 
                  and actionable recommendations from the AI analysis.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">3. Interact with Agents</h4>
                <p className="text-sm text-gray-600">
                  Chat directly with specialized AI agents, use suggested queries, 
                  and monitor real-time alerts and notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 