'use client';

import React, { useState, useEffect } from 'react';
import { ExecutiveSummary, AgentManager } from '@/lib/agents/financial-agents';

interface ExecutiveSummaryProps {
  financialData?: any[];
  autoGenerate?: boolean;
  showMetrics?: boolean;
  className?: string;
}

export const ExecutiveSummaryComponent: React.FC<ExecutiveSummaryProps> = ({
  financialData = [],
  autoGenerate = true,
  showMetrics = true,
  className = ''
}) => {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [agentManager] = useState(new AgentManager());

  useEffect(() => {
    if (autoGenerate && financialData.length > 0) {
      generateSummary();
    }
  }, [financialData, autoGenerate]);

  const generateSummary = async () => {
    if (financialData.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSummary = agentManager.generateExecutiveSummary(financialData);
      setSummary(newSummary);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Failed to generate executive summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (financialData.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Executive Summary
          </h3>
          <p className="text-gray-600 mb-4">
            Upload financial data to generate AI-powered executive insights
          </p>
          <div className="text-sm text-gray-500">
            Get instant summaries with key findings, risks, and strategic recommendations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              📊 Executive Summary
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              AI-generated insights for leadership review
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastGenerated && (
              <span className="text-xs text-gray-500">
                Generated: {formatTimeAgo(lastGenerated)}
              </span>
            )}
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {isGenerating ? (
                <>
                  <div className="inline-block animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                'Refresh Summary'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && !summary && (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Content */}
      {summary && (
        <div className="p-6">
          {/* Key Metrics */}
          {showMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-600">Total Budget</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(summary.metrics.totalBudget)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-600">Total Actual</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(summary.metrics.totalActual)}
                </div>
              </div>
              <div className={`rounded-lg p-4 ${
                summary.metrics.overallVariance >= 0 
                  ? 'bg-red-50' 
                  : 'bg-green-50'
              }`}>
                <div className={`text-sm font-medium ${
                  summary.metrics.overallVariance >= 0 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  Overall Variance
                </div>
                <div className={`text-2xl font-bold ${
                  summary.metrics.overallVariance >= 0 
                    ? 'text-red-900' 
                    : 'text-green-900'
                }`}>
                  {summary.metrics.overallVariance >= 0 ? '+' : ''}
                  {summary.metrics.overallVariance.toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Key Findings */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🔍 Key Findings
            </h4>
            <div className="space-y-2">
              {summary.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risks */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                ⚠️ Risks
                {summary.risks.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {summary.risks.length}
                  </span>
                )}
              </h4>
              {summary.risks.length > 0 ? (
                <div className="space-y-2">
                  {summary.risks.map((risk, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <span className="text-sm text-red-800">{risk}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">✅</div>
                  <span className="text-sm">No significant risks detected</span>
                </div>
              )}
            </div>

            {/* Opportunities */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                💡 Opportunities
                {summary.opportunities.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {summary.opportunities.length}
                  </span>
                )}
              </h4>
              {summary.opportunities.length > 0 ? (
                <div className="space-y-2">
                  {summary.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                      <span className="text-sm text-green-800">{opportunity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🔍</div>
                  <span className="text-sm">No opportunities identified yet</span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                💭 Recommendations
                {summary.recommendations.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {summary.recommendations.length}
                  </span>
                )}
              </h4>
              {summary.recommendations.length > 0 ? (
                <div className="space-y-2">
                  {summary.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <span className="text-sm text-blue-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">💭</div>
                  <span className="text-sm">No specific recommendations yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.metrics.departmentsAtRisk}
                </div>
                <div className="text-sm text-gray-600">Departments at Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.metrics.trendsIdentified}
                </div>
                <div className="text-sm text-gray-600">Trends Identified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.risks.length + summary.opportunities.length}
                </div>
                <div className="text-sm text-gray-600">Total Insights</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.recommendations.length}
                </div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>Generated by {summary.generatedBy}</span>
            <span>Period: {summary.period}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummaryComponent; 