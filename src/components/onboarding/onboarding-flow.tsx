'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Play, Upload, BarChart3, Brain, Bell } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onLoadSampleData: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose,
  onComplete,
  onLoadSampleData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FP&A Copilot',
      description: 'Your AI-powered financial planning and analysis companion',
      icon: <Brain className="w-6 h-6" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to the Future of Financial Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              FP&A Copilot combines visual intelligence with AI agents to provide 
              proactive insights, executive summaries, and intelligent recommendations 
              for your financial data.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-900">Visual Intelligence</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Brain className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-900">AI Agents</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-900">Smart Alerts</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sample-data',
      title: 'Load Sample Data',
      description: 'Start with sample financial data to explore all features',
      icon: <Upload className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Load Sample Financial Data
            </h3>
            <p className="text-gray-600 mb-6">
              We'll load sample financial data including budget vs actual, department breakdowns, 
              and spending categories to demonstrate all features.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Sample Data Includes:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>5 Departments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Budget vs Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Spending Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Variance Analysis</span>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Load Sample Data',
        onClick: onLoadSampleData
      }
    },
    {
      id: 'visual-intelligence',
      title: 'Visual Intelligence',
      description: 'AI-powered charts and dashboards that generate automatically',
      icon: <BarChart3 className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Visual Intelligence System
            </h3>
            <p className="text-gray-600 mb-6">
              Ask questions in natural language and get appropriate charts automatically. 
              The system understands context and recommends the best visualizations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Try These Queries:</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 px-3 py-2 rounded">
                  "Show me variance charts by department"
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  "Display financial trends over time"
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  "Create a pie chart of budget allocation"
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Multiple chart types</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Export capabilities</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Responsive design</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Test Visual Intelligence',
        onClick: () => window.open('/test-charts', '_blank')
      }
    },
    {
      id: 'ai-agents',
      title: 'Meet Your AI Agents',
      description: 'Specialized AI personalities for comprehensive financial analysis',
      icon: <Brain className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Intelligent AI Agents
            </h3>
            <p className="text-gray-600 mb-6">
              Three specialized AI agents work together to analyze your financial data 
              and provide proactive insights, risk assessments, and performance optimization.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">👩‍💼</span>
                <div>
                  <h4 className="font-medium text-gray-900">Alex Chen - Budget Analyst</h4>
                  <p className="text-sm text-gray-600">Variance detection & budget analysis</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">🛡️</span>
                <div>
                  <h4 className="font-medium text-gray-900">Morgan Taylor - Risk Advisor</h4>
                  <p className="text-sm text-gray-600">Strategic risk assessment & planning</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">📈</span>
                <div>
                  <h4 className="font-medium text-gray-900">Jamie Rivera - Performance Analyst</h4>
                  <p className="text-sm text-gray-600">Performance optimization & efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Meet the Agents',
        onClick: () => window.open('/test-agents', '_blank')
      }
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start exploring your financial data with AI-powered insights',
      icon: <Check className="w-6 h-6" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Transform Your Financial Analysis!
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              You now have access to the complete FP&A Copilot system. Upload your own data 
              or continue with the sample data to start receiving AI-powered insights.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>Upload your financial data or use sample data</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>Ask questions to generate insights and charts</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>Review proactive insights from AI agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>Export and share your findings</span>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Start Analyzing',
        onClick: onComplete
      }
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleStepAction = () => {
    const step = steps[currentStep];
    if (step.action) {
      step.action.onClick();
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStepData.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className={`px-6 pb-6 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="min-h-[400px] flex items-center">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-blue-600 w-6'
                    : completedSteps.has(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            {currentStepData.action && (
              <button
                onClick={handleStepAction}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStepData.action.label}
              </button>
            )}

            {!isLastStep ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Get Started
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 