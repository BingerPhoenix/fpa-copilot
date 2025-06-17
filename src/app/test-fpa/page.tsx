'use client';

import { useState, useEffect } from 'react';

// Sample financial data for testing
const sampleFinancialData = [
  {
    department: { name: 'Marketing', code: 'MKT' },
    category: { name: 'Digital Advertising', type: 'OPEX', glAccount: '6010' },
    period: { year: 2024, quarter: 'Q3' },
    metrics: {
      budget: 50000,
      actual: 55000,
      variance: 5000,
      variancePercentage: 10.0,
      priorYear: 48000,
      forecast: 52000,
      ytdBudget: 150000,
      ytdActual: 160000
    }
  },
  {
    department: { name: 'Sales', code: 'SLS' },
    category: { name: 'Software Tools', type: 'OPEX', glAccount: '6020' },
    period: { year: 2024, quarter: 'Q3' },
    metrics: {
      budget: 30000,
      actual: 28500,
      variance: -1500,
      variancePercentage: -5.0,
      priorYear: 29000,
      forecast: 29000,
      ytdBudget: 90000,
      ytdActual: 87000
    }
  },
  {
    department: { name: 'IT', code: 'IT' },
    category: { name: 'Hardware', type: 'CAPEX', glAccount: '7010' },
    period: { year: 2024, quarter: 'Q3' },
    metrics: {
      budget: 75000,
      actual: 80000,
      variance: 5000,
      variancePercentage: 6.67,
      priorYear: 70000,
      forecast: 78000,
      ytdBudget: 225000,
      ytdActual: 240000
    }
  },
  {
    department: { name: 'HR', code: 'HR' },
    category: { name: 'Training', type: 'OPEX', glAccount: '6030' },
    period: { year: 2024, quarter: 'Q3' },
    metrics: {
      budget: 25000,
      actual: 22000,
      variance: -3000,
      variancePercentage: -12.0,
      priorYear: 24000,
      forecast: 24000,
      ytdBudget: 75000,
      ytdActual: 70000
    }
  }
];

// Simple financial calculation functions for demo
function calculateVarianceAnalysis(data: typeof sampleFinancialData) {
  return data.map(item => ({
    department: item.department.name,
    category: item.category.name,
    period: `${item.period.year} ${item.period.quarter}`,
    budget: item.metrics.budget,
    actual: item.metrics.actual,
    variance: item.metrics.variance,
    variancePercentage: item.metrics.variancePercentage,
    severity: Math.abs(item.metrics.variancePercentage) < 5 ? 'low' : 
              Math.abs(item.metrics.variancePercentage) < 10 ? 'medium' : 
              Math.abs(item.metrics.variancePercentage) < 20 ? 'high' : 'critical',
    trend: item.metrics.variance > 0 ? 'declining' : 'improving'
  }));
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function processQuery(query: string, data: typeof sampleFinancialData) {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('marketing')) {
    const marketingData = data.filter(d => d.department.name === 'Marketing');
    return {
      type: 'variance_analysis',
      data: calculateVarianceAnalysis(marketingData),
      response: formatMarketingVarianceResponse(marketingData)
    };
  }
  
  if (queryLower.includes('department') || queryLower.includes('performance')) {
    return {
      type: 'department_performance',
      data: calculateDepartmentSummary(data),
      response: formatDepartmentResponse(data)
    };
  }
  
  if (queryLower.includes('summary') || queryLower.includes('executive')) {
    return {
      type: 'executive_summary',
      data: calculateVarianceAnalysis(data),
      response: formatExecutiveSummary(data)
    };
  }
  
  // Default variance analysis
  return {
    type: 'variance_analysis',
    data: calculateVarianceAnalysis(data),
    response: formatTopVariances(data)
  };
}

function formatMarketingVarianceResponse(data: typeof sampleFinancialData): string {
  const marketing = data[0];
  if (!marketing) return "No marketing data found.";
  
  const direction = marketing.metrics.variance > 0 ? 'over' : 'under';
  const indicator = marketing.metrics.variance > 0 ? '🔴' : '🟢';
  
  return `**Marketing Variance Analysis**

${indicator} **${marketing.category.name}** is ${direction} budget by ${formatCurrency(Math.abs(marketing.metrics.variance))} (${Math.abs(marketing.metrics.variancePercentage).toFixed(1)}%)

**Details:**
- Budget: ${formatCurrency(marketing.metrics.budget)}
- Actual: ${formatCurrency(marketing.metrics.actual)}
- Variance: ${formatCurrency(marketing.metrics.variance)}
- Period: ${marketing.period.year} ${marketing.period.quarter}
- Severity: ${Math.abs(marketing.metrics.variancePercentage) < 10 ? 'MEDIUM' : 'HIGH'}

**Analysis:**
This represents a ${marketing.metrics.variancePercentage > 0 ? 'budget overrun' : 'favorable variance'} that ${Math.abs(marketing.metrics.variancePercentage) > 10 ? 'requires immediate attention' : 'is within acceptable range'}.`;
}

function formatDepartmentResponse(data: typeof sampleFinancialData): string {
  const deptSummary = calculateDepartmentSummary(data);
  
  let response = "**Department Performance Analysis**\n\n";
  response += "**Performance Ranking:**\n";
  
  deptSummary.forEach((dept, index) => {
    const indicator = dept.totalVariance > 0 ? '🔴' : '🟢';
    response += `${index + 1}. ${indicator} **${dept.department}**: ${dept.variancePercentage.toFixed(1)}% variance\n`;
  });
  
  return response;
}

function formatExecutiveSummary(data: typeof sampleFinancialData): string {
  const totalBudget = data.reduce((sum, d) => sum + d.metrics.budget, 0);
  const totalActual = data.reduce((sum, d) => sum + d.metrics.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const overallVariancePercentage = (totalVariance / totalBudget) * 100;
  
  const criticalVariances = data.filter(d => Math.abs(d.metrics.variancePercentage) > 10).length;
  
  return `**Executive Financial Summary**

Overall performance shows a ${overallVariancePercentage > 0 ? 'budget overrun' : 'favorable variance'} of ${formatCurrency(Math.abs(totalVariance))} (${Math.abs(overallVariancePercentage).toFixed(1)}%). ${criticalVariances > 0 ? `${criticalVariances} areas require management attention.` : 'Most variances are within acceptable ranges.'}

**Key Findings:**
• Total Budget: ${formatCurrency(totalBudget)}
• Total Actual: ${formatCurrency(totalActual)} 
• Overall Variance: ${formatCurrency(totalVariance)} (${overallVariancePercentage.toFixed(1)}%)
• Critical Variances: ${criticalVariances}

**⚠️ Areas of Concern:**
${data.filter(d => d.metrics.variancePercentage > 5).map(d => 
  `• ${d.department.name} ${d.category.name} over budget by ${formatCurrency(d.metrics.variance)}`
).join('\n')}

**✅ Opportunities:**
${data.filter(d => d.metrics.variancePercentage < -5).map(d => 
  `• ${d.department.name} ${d.category.name} under budget by ${formatCurrency(Math.abs(d.metrics.variance))}`
).join('\n')}`;
}

function formatTopVariances(data: typeof sampleFinancialData): string {
  const variances = calculateVarianceAnalysis(data)
    .sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage));
    
  let response = "**Top Financial Variances**\n\n";
  
  variances.slice(0, 5).forEach((v, index) => {
    const indicator = v.variance > 0 ? '🔴' : '🟢';
    const direction = v.variance > 0 ? 'Over' : 'Under';
    response += `${index + 1}. ${indicator} **${v.department} - ${v.category}**: ${direction} budget by ${Math.abs(v.variancePercentage).toFixed(1)}% (${formatCurrency(Math.abs(v.variance))})\n`;
  });
  
  return response;
}

function calculateDepartmentSummary(data: typeof sampleFinancialData) {
  const departments = Array.from(new Set(data.map(d => d.department.name)));
  
  return departments.map(deptName => {
    const deptData = data.filter(d => d.department.name === deptName);
    const totalBudget = deptData.reduce((sum, d) => sum + d.metrics.budget, 0);
    const totalActual = deptData.reduce((sum, d) => sum + d.metrics.actual, 0);
    const totalVariance = totalActual - totalBudget;
    const variancePercentage = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

    return {
      department: deptName,
      totalBudget,
      totalActual,
      totalVariance,
      variancePercentage
    };
  }).sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage));
}

export default function TestFPAPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "What's the marketing variance?",
    "Show me department performance",
    "Give me an executive summary",
    "What are the top variances?"
  ];

  const handleQuery = async (questionText: string) => {
    setIsLoading(true);
    setQuery(questionText);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = processQuery(questionText, sampleFinancialData);
    setResponse(result.response);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧠 FP&A Intelligence Demo
          </h1>
          <p className="text-gray-600">
            Testing the financial calculation engine with real variance analysis
          </p>
        </div>

        {/* Data Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 text-sm font-medium">
              ✅ Financial data loaded ({sampleFinancialData.length} records) - AI can provide data-driven insights
            </span>
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Questions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuery(question)}
                className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-700 transition-colors"
                disabled={isLoading}
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>

        {/* Custom Query Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask Your Own Question:</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about variances, departments, or performance..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleQuery(query)}
            />
            <button
              onClick={() => handleQuery(query)}
              disabled={isLoading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🤔' : '💬'}
            </button>
          </div>
        </div>

        {/* Response */}
        {(response || isLoading) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🤖 FP&A Copilot Response
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
            </h3>
            
            {isLoading ? (
              <div className="text-gray-600 italic">
                Analyzing your financial data and generating insights...
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-800">
                  {response}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Raw Data Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Sample Financial Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 border">Department</th>
                  <th className="text-left p-2 border">Category</th>
                  <th className="text-left p-2 border">Budget</th>
                  <th className="text-left p-2 border">Actual</th>
                  <th className="text-left p-2 border">Variance</th>
                  <th className="text-left p-2 border">%</th>
                </tr>
              </thead>
              <tbody>
                {sampleFinancialData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2 border">{item.department.name}</td>
                    <td className="p-2 border">{item.category.name}</td>
                    <td className="p-2 border">{formatCurrency(item.metrics.budget)}</td>
                    <td className="p-2 border">{formatCurrency(item.metrics.actual)}</td>
                    <td className={`p-2 border ${item.metrics.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(item.metrics.variance)}
                    </td>
                    <td className={`p-2 border font-medium ${item.metrics.variancePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.metrics.variancePercentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          🎯 This demonstrates the FP&A intelligence engine working with sample financial data.<br/>
          The system can analyze variances, compare departments, and generate executive insights.
        </div>
      </div>
    </div>
  );
} 