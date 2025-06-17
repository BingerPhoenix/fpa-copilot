'use client';

import React, { useState, useEffect } from 'react';
import { QuerySuggestion, AgentManager } from '@/lib/agents/financial-agents';

interface QuerySuggestionsProps {
  financialData?: any[];
  onQuerySelect?: (query: string) => void;
  showReasons?: boolean;
  maxSuggestions?: number;
  className?: string;
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({
  financialData = [],
  onQuerySelect,
  showReasons = true,
  maxSuggestions = 6,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentManager] = useState(new AgentManager());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (financialData.length > 0) {
      generateSuggestions();
    }
  }, [financialData]);

  const generateSuggestions = async () => {
    if (financialData.length === 0) return;

    setIsLoading(true);
    
    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSuggestions = agentManager.getAllQuerySuggestions(financialData);
      setSuggestions(newSuggestions.slice(0, maxSuggestions));
    } catch (error) {
      console.error('Failed to generate query suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentInfo = (agentId: string) => {
    const agent = agentManager.getAgent(agentId);
    return {
      name: agent?.name || 'AI Agent',
      avatar: agent?.avatar || '🤖',
      specialty: agent?.specialty || 'Financial Analysis'
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'variance': return '📊';
      case 'trend': return '📈';
      case 'performance': return '🎯';
      case 'forecast': return '🔮';
      case 'risk': return '⚠️';
      default: return '💡';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'variance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'trend': return 'bg-green-100 text-green-800 border-green-200';
      case 'performance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'forecast': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelevanceStars = (relevanceScore: number) => {
    const stars = Math.round(relevanceScore * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const categories = ['all', ...new Set(suggestions.map(s => s.category))];
  
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const handleQueryClick = (query: string) => {
    onQuerySelect?.(query);
  };

  // Sample static suggestions for when no data is available
  const staticSuggestions = [
    {
      id: 'static-1',
      agentId: 'budget-analyst',
      query: 'Show me budget variance by department',
      reason: 'Identify departments with significant budget deviations',
      category: 'variance' as const,
      relevanceScore: 0.9,
      estimatedInsights: 3
    },
    {
      id: 'static-2',
      agentId: 'risk-advisor',
      query: 'What are the biggest financial risks?',
      reason: 'Understand potential threats to financial performance',
      category: 'risk' as const,
      relevanceScore: 0.8,
      estimatedInsights: 4
    },
    {
      id: 'static-3',
      agentId: 'performance-analyst',
      query: 'Compare department performance trends',
      reason: 'Benchmark departments against each other',
      category: 'performance' as const,
      relevanceScore: 0.85,
      estimatedInsights: 2
    }
  ];

  const displaySuggestions = financialData.length > 0 ? filteredSuggestions : staticSuggestions;

  if (financialData.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Smart Query Suggestions
          </h3>
          <p className="text-gray-600 mb-4">
            Try these sample queries to get started with financial analysis
          </p>
        </div>
        
        <div className="space-y-3">
          {staticSuggestions.map((suggestion) => {
            const agentInfo = getAgentInfo(suggestion.agentId);
            return (
              <div
                key={suggestion.id}
                onClick={() => handleQueryClick(suggestion.query)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{agentInfo.avatar}</span>
                    <div>
                      <p className="font-medium text-gray-900">"{suggestion.query}"</p>
                      <p className="text-sm text-gray-600">by {agentInfo.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(suggestion.category)}`}>
                    {getCategoryIcon(suggestion.category)} {suggestion.category}
                  </span>
                </div>
                
                {showReasons && (
                  <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {getRelevanceStars(suggestion.relevanceScore)}
                      <span className="text-xs text-gray-500 ml-1">relevance</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ~{suggestion.estimatedInsights} insights
                    </span>
                  </div>
                  <span className="text-xs text-blue-600">Try this query →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            💡 Smart Suggestions
          </h3>
          <button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin h-3 w-3 border border-blue-700 border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? '🔍 All' : `${getCategoryIcon(category)} ${category}`}
              {category !== 'all' && (
                <span className="ml-1 bg-white rounded-full px-1 text-xs">
                  {suggestions.filter(s => s.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displaySuggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">🔍</div>
            <p>No suggestions for the selected category</p>
            <p className="text-sm">Try selecting a different category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySuggestions.map((suggestion) => {
              const agentInfo = getAgentInfo(suggestion.agentId);
              return (
                <div
                  key={suggestion.id}
                  onClick={() => handleQueryClick(suggestion.query)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-sm group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{agentInfo.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          "{suggestion.query}"
                        </p>
                        <p className="text-sm text-gray-600">by {agentInfo.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(suggestion.category)}`}>
                      {getCategoryIcon(suggestion.category)} {suggestion.category}
                    </span>
                  </div>
                  
                  {showReasons && (
                    <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {getRelevanceStars(suggestion.relevanceScore)}
                        <span className="text-xs text-gray-500 ml-1">relevance</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ~{suggestion.estimatedInsights} insights
                      </span>
                    </div>
                    <span className="text-xs text-blue-600 group-hover:text-blue-800">
                      Ask this question →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show more button */}
        {financialData.length > 0 && suggestions.length > maxSuggestions && (
          <div className="text-center mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
              Show {suggestions.length - maxSuggestions} more suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuerySuggestions; 