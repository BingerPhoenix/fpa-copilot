// Multi-Agent Financial Intelligence System
export interface AgentInsight {
  id: string;
  agentId: string;
  type: 'risk' | 'opportunity' | 'trend' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  details: string;
  actionItems?: string[];
  affectedDepartments: string[];
  confidence: number;
  timestamp: Date;
}

export interface AgentAlert {
  id: string;
  agentId: string;
  type: 'budget_risk' | 'variance_alert' | 'trend_change' | 'deadline_alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  department?: string;
  suggestedActions: string[];
  timestamp: Date;
  acknowledged: boolean;
}

export interface QuerySuggestion {
  id: string;
  agentId: string;
  query: string;
  reason: string;
  category: 'variance' | 'trend' | 'performance' | 'forecast' | 'risk';
  relevanceScore: number;
  estimatedInsights: number;
}

export interface ExecutiveSummary {
  id: string;
  generatedBy: string;
  period: string;
  keyFindings: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  metrics: {
    totalBudget: number;
    totalActual: number;
    overallVariance: number;
    departmentsAtRisk: number;
    trendsIdentified: number;
  };
  timestamp: Date;
}

// Mock FinancialData interface for now
interface FinancialData {
  id: string;
  department: { id: string; name: string };
  category: { id: string; name: string };
  period: { year: number; quarter: string };
  metrics: {
    budget: number;
    actual: number;
    forecast: number;
    priorYear: number;
  };
}

// Base Agent Class
export abstract class FinancialAgent {
  abstract id: string;
  abstract name: string;
  abstract specialty: string;
  abstract personality: string;
  abstract avatar: string;

  abstract analyzeData(data: FinancialData[]): AgentInsight[];
  abstract generateAlerts(data: FinancialData[]): AgentAlert[];
  abstract suggestQueries(data: FinancialData[]): QuerySuggestion[];

  protected generateInsightId(): string {
    return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected calculateVariancePercentage(budget: number, actual: number): number {
    return budget > 0 ? ((actual - budget) / budget) * 100 : 0;
  }

  protected assessSeverity(variancePercentage: number): 'low' | 'medium' | 'high' | 'critical' {
    const absVariance = Math.abs(variancePercentage);
    if (absVariance >= 20) return 'critical';
    if (absVariance >= 15) return 'high';
    if (absVariance >= 10) return 'medium';
    return 'low';
  }
}

// Budget Analyst Agent
export class BudgetAnalystAgent extends FinancialAgent {
  id = 'budget-analyst';
  name = 'Alex Chen';
  specialty = 'Budget Analysis & Variance Detection';
  personality = 'Detail-oriented, analytical, proactive in identifying budget discrepancies';
  avatar = '👩‍💼';

  analyzeData(data: FinancialData[]): AgentInsight[] {
    const insights: AgentInsight[] = [];
    const departmentVariances = this.analyzeDepartmentVariances(data);

    departmentVariances.forEach(dept => {
      if (Math.abs(dept.variancePercentage) >= 10) {
        insights.push({
          id: this.generateInsightId(),
          agentId: this.id,
          type: dept.variancePercentage > 0 ? 'risk' : 'opportunity',
          severity: this.assessSeverity(dept.variancePercentage),
          title: `${dept.name} Department Variance Alert`,
          description: `${dept.name} is ${dept.variancePercentage > 0 ? 'over' : 'under'} budget by ${Math.abs(dept.variancePercentage).toFixed(1)}%`,
          details: `Budget: $${dept.budget.toLocaleString()}, Actual: $${dept.actual.toLocaleString()}, Variance: $${dept.variance.toLocaleString()}`,
          actionItems: dept.variancePercentage > 0 ? [
            'Review recent expenses and identify cost drivers',
            'Implement cost control measures',
            'Update budget forecast for remaining periods'
          ] : [
            'Analyze underspending reasons',
            'Consider reallocating unused budget',
            'Accelerate planned initiatives'
          ],
          affectedDepartments: [dept.name],
          confidence: 0.9,
          timestamp: new Date()
        });
      }
    });

    return insights;
  }

  generateAlerts(data: FinancialData[]): AgentAlert[] {
    const alerts: AgentAlert[] = [];
    const departmentVariances = this.analyzeDepartmentVariances(data);

    departmentVariances.forEach(dept => {
      if (Math.abs(dept.variancePercentage) >= 20) {
        alerts.push({
          id: `alert-${Date.now()}-${dept.name}`,
          agentId: this.id,
          type: 'budget_risk',
          priority: 'urgent',
          title: `Critical Budget Variance - ${dept.name}`,
          message: `${dept.name} department has exceeded budget threshold with ${dept.variancePercentage.toFixed(1)}% variance`,
          department: dept.name,
          suggestedActions: [
            'Schedule immediate budget review meeting',
            'Freeze non-essential spending',
            'Prepare variance explanation report'
          ],
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });

    return alerts;
  }

  suggestQueries(data: FinancialData[]): QuerySuggestion[] {
    const suggestions: QuerySuggestion[] = [];
    const departmentVariances = this.analyzeDepartmentVariances(data);
    
    const highVarianceDepts = departmentVariances
      .filter(d => Math.abs(d.variancePercentage) >= 10)
      .sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage))
      .slice(0, 3);

    highVarianceDepts.forEach(dept => {
      suggestions.push({
        id: `suggestion-${Date.now()}-${dept.name}`,
        agentId: this.id,
        query: `What's driving the ${dept.name} budget variance?`,
        reason: `${dept.name} shows ${Math.abs(dept.variancePercentage).toFixed(1)}% variance - worth investigating`,
        category: 'variance',
        relevanceScore: Math.min(Math.abs(dept.variancePercentage) / 20, 1),
        estimatedInsights: 3
      });
    });

    return suggestions;
  }

  private analyzeDepartmentVariances(data: FinancialData[]) {
    const deptMap = new Map();
    
    data.forEach(item => {
      const deptName = item.department.name;
      if (!deptMap.has(deptName)) {
        deptMap.set(deptName, { name: deptName, budget: 0, actual: 0 });
      }
      const dept = deptMap.get(deptName);
      dept.budget += item.metrics.budget;
      dept.actual += item.metrics.actual;
    });

    return Array.from(deptMap.values()).map(dept => ({
      ...dept,
      variance: dept.actual - dept.budget,
      variancePercentage: this.calculateVariancePercentage(dept.budget, dept.actual)
    }));
  }
}

// Risk Advisor Agent
export class RiskAdvisorAgent extends FinancialAgent {
  id = 'risk-advisor';
  name = 'Morgan Taylor';
  specialty = 'Risk Assessment & Strategic Planning';
  personality = 'Strategic thinker, risk-aware, focused on long-term financial health';
  avatar = '🛡️';

  analyzeData(data: FinancialData[]): AgentInsight[] {
    const insights: AgentInsight[] = [];
    const riskAssessment = this.assessFinancialRisks(data);

    riskAssessment.forEach(risk => {
      insights.push({
        id: this.generateInsightId(),
        agentId: this.id,
        type: 'risk',
        severity: risk.severity,
        title: risk.title,
        description: risk.description,
        details: risk.details,
        actionItems: risk.actionItems,
        affectedDepartments: risk.departments,
        confidence: risk.confidence,
        timestamp: new Date()
      });
    });

    return insights;
  }

  generateAlerts(data: FinancialData[]): AgentAlert[] {
    const alerts: AgentAlert[] = [];
    const risks = this.assessFinancialRisks(data);

    risks.filter(r => r.severity === 'critical' || r.severity === 'high').forEach(risk => {
      alerts.push({
        id: `risk-alert-${Date.now()}-${risk.departments[0]}`,
        agentId: this.id,
        type: 'budget_risk',
        priority: risk.severity === 'critical' ? 'urgent' : 'high',
        title: risk.title,
        message: risk.description,
        department: risk.departments[0],
        suggestedActions: risk.actionItems,
        timestamp: new Date(),
        acknowledged: false
      });
    });

    return alerts;
  }

  suggestQueries(data: FinancialData[]): QuerySuggestion[] {
    return [
      {
        id: `risk-suggestion-${Date.now()}-1`,
        agentId: this.id,
        query: 'Show me departments with highest financial risk',
        reason: 'Identify departments requiring immediate attention',
        category: 'risk',
        relevanceScore: 0.9,
        estimatedInsights: 4
      },
      {
        id: `risk-suggestion-${Date.now()}-2`,
        agentId: this.id,
        query: 'Analyze spending volatility by category',
        reason: 'Understand expense predictability and control',
        category: 'variance',
        relevanceScore: 0.8,
        estimatedInsights: 3
      }
    ];
  }

  private assessFinancialRisks(data: FinancialData[]) {
    const risks: any[] = [];
    const departmentVariances = this.analyzeDepartmentRisks(data);

    departmentVariances.forEach(dept => {
      if (dept.riskScore >= 7) {
        risks.push({
          title: `High Financial Risk - ${dept.name}`,
          description: `${dept.name} department shows high financial risk indicators`,
          details: `Risk Score: ${dept.riskScore}/10, Variance: ${dept.variancePercentage.toFixed(1)}%`,
          severity: dept.riskScore >= 8 ? 'critical' : 'high',
          departments: [dept.name],
          actionItems: [
            'Conduct comprehensive financial review',
            'Implement enhanced monitoring controls',
            'Develop risk mitigation plan'
          ],
          confidence: 0.85
        });
      }
    });

    return risks;
  }

  private analyzeDepartmentRisks(data: FinancialData[]) {
    const deptMap = new Map();
    
    data.forEach(item => {
      const deptName = item.department.name;
      if (!deptMap.has(deptName)) {
        deptMap.set(deptName, { name: deptName, budget: 0, actual: 0 });
      }
      const dept = deptMap.get(deptName);
      dept.budget += item.metrics.budget;
      dept.actual += item.metrics.actual;
    });

    return Array.from(deptMap.values()).map(dept => {
      const variancePercentage = this.calculateVariancePercentage(dept.budget, dept.actual);
      const riskScore = Math.min(Math.abs(variancePercentage) / 2, 10);

      return {
        ...dept,
        variancePercentage,
        riskScore
      };
    });
  }
}

// Performance Analyst Agent
export class PerformanceAnalystAgent extends FinancialAgent {
  id = 'performance-analyst';
  name = 'Jamie Rivera';
  specialty = 'Performance Metrics & Optimization';
  personality = 'Results-driven, optimization-focused, always looking for improvement opportunities';
  avatar = '📈';

  analyzeData(data: FinancialData[]): AgentInsight[] {
    const insights: AgentInsight[] = [];
    const performanceMetrics = this.analyzePerformanceMetrics(data);

    performanceMetrics.forEach(metric => {
      if (metric.score >= 8 || metric.score <= 3) {
        insights.push({
          id: this.generateInsightId(),
          agentId: this.id,
          type: metric.score >= 8 ? 'opportunity' : 'recommendation',
          severity: metric.score <= 3 ? 'high' : 'medium',
          title: `${metric.department} Performance ${metric.score >= 8 ? 'Excellence' : 'Improvement'}`,
          description: metric.score >= 8 
            ? `${metric.department} demonstrates exceptional financial performance`
            : `${metric.department} shows opportunity for performance improvement`,
          details: `Performance Score: ${metric.score}/10, Efficiency: ${metric.efficiency.toFixed(1)}%`,
          actionItems: metric.score >= 8 ? [
            'Document best practices for other departments',
            'Consider expanding successful initiatives'
          ] : [
            'Review current processes and identify bottlenecks',
            'Implement performance improvement plan'
          ],
          affectedDepartments: [metric.department],
          confidence: 0.8,
          timestamp: new Date()
        });
      }
    });

    return insights;
  }

  generateAlerts(data: FinancialData[]): AgentAlert[] {
    const alerts: AgentAlert[] = [];
    const performanceMetrics = this.analyzePerformanceMetrics(data);

    performanceMetrics.filter(m => m.score <= 3).forEach(metric => {
      alerts.push({
        id: `performance-alert-${Date.now()}-${metric.department}`,
        agentId: this.id,
        type: 'budget_risk',
        priority: 'high',
        title: `Performance Alert - ${metric.department}`,
        message: `${metric.department} performance score is critically low (${metric.score}/10)`,
        department: metric.department,
        suggestedActions: [
          'Schedule performance review meeting',
          'Analyze root causes of performance issues'
        ],
        timestamp: new Date(),
        acknowledged: false
      });
    });

    return alerts;
  }

  suggestQueries(data: FinancialData[]): QuerySuggestion[] {
    return [
      {
        id: `perf-suggestion-${Date.now()}-1`,
        agentId: this.id,
        query: 'Compare department performance metrics',
        reason: 'Identify top and bottom performers for learning opportunities',
        category: 'performance',
        relevanceScore: 0.9,
        estimatedInsights: 3
      },
      {
        id: `perf-suggestion-${Date.now()}-2`,
        agentId: this.id,
        query: 'Show efficiency trends by category',
        reason: 'Track performance improvements over time',
        category: 'trend',
        relevanceScore: 0.8,
        estimatedInsights: 2
      }
    ];
  }

  private analyzePerformanceMetrics(data: FinancialData[]) {
    const deptMap = new Map();
    
    data.forEach(item => {
      const deptName = item.department.name;
      if (!deptMap.has(deptName)) {
        deptMap.set(deptName, { name: deptName, budget: 0, actual: 0 });
      }
      const dept = deptMap.get(deptName);
      dept.budget += item.metrics.budget;
      dept.actual += item.metrics.actual;
    });

    return Array.from(deptMap.values()).map(dept => {
      const variance = Math.abs(this.calculateVariancePercentage(dept.budget, dept.actual));
      const efficiency = dept.actual > 0 ? (dept.budget / dept.actual) * 100 : 0;
      const score = Math.max(0, 10 - (variance / 10));

      return {
        department: dept.name,
        efficiency,
        score
      };
    });
  }
}

// Agent Manager
export class AgentManager {
  private agents: FinancialAgent[] = [
    new BudgetAnalystAgent(),
    new RiskAdvisorAgent(),
    new PerformanceAnalystAgent()
  ];

  getAllAgents(): FinancialAgent[] {
    return this.agents;
  }

  getAgent(id: string): FinancialAgent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  analyzeDataWithAllAgents(data: FinancialData[]): AgentInsight[] {
    const allInsights: AgentInsight[] = [];
    
    this.agents.forEach(agent => {
      const insights = agent.analyzeData(data);
      allInsights.push(...insights);
    });

    return allInsights.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.confidence - a.confidence;
    });
  }

  generateAllAlerts(data: FinancialData[]): AgentAlert[] {
    const allAlerts: AgentAlert[] = [];
    
    this.agents.forEach(agent => {
      const alerts = agent.generateAlerts(data);
      allAlerts.push(...alerts);
    });

    return allAlerts.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  getAllQuerySuggestions(data: FinancialData[]): QuerySuggestion[] {
    const allSuggestions: QuerySuggestion[] = [];
    
    this.agents.forEach(agent => {
      const suggestions = agent.suggestQueries(data);
      allSuggestions.push(...suggestions);
    });

    return allSuggestions
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);
  }

  generateExecutiveSummary(data: FinancialData[]): ExecutiveSummary {
    const insights = this.analyzeDataWithAllAgents(data);
    const alerts = this.generateAllAlerts(data);

    const totalBudget = data.reduce((sum, item) => sum + item.metrics.budget, 0);
    const totalActual = data.reduce((sum, item) => sum + item.metrics.actual, 0);
    const overallVariance = totalBudget > 0 ? ((totalActual - totalBudget) / totalBudget) * 100 : 0;

    const departments = [...new Set(data.map(item => item.department.name))];
    const departmentsAtRisk = insights.filter(i => i.severity === 'high' || i.severity === 'critical')
      .map(i => i.affectedDepartments).flat();
    const uniqueDepartmentsAtRisk = [...new Set(departmentsAtRisk)].length;

    return {
      id: `exec-summary-${Date.now()}`,
      generatedBy: 'Multi-Agent Analysis',
      period: 'Current Period',
      keyFindings: [
        `Overall budget variance: ${overallVariance > 0 ? '+' : ''}${overallVariance.toFixed(1)}%`,
        `${insights.length} insights identified across ${departments.length} departments`,
        `${alerts.filter(a => a.priority === 'urgent' || a.priority === 'high').length} high-priority alerts require attention`,
        `${uniqueDepartmentsAtRisk} departments show elevated risk levels`
      ],
      risks: insights.filter(i => i.type === 'risk').map(i => i.title),
      opportunities: insights.filter(i => i.type === 'opportunity').map(i => i.title),
      recommendations: insights.flatMap(i => i.actionItems || []).slice(0, 5),
      metrics: {
        totalBudget,
        totalActual,
        overallVariance,
        departmentsAtRisk: uniqueDepartmentsAtRisk,
        trendsIdentified: insights.filter(i => i.type === 'trend').length
      },
      timestamp: new Date()
    };
  }
} 