'use client';

import { MainLayout } from "@/components/layout/main-layout";
import OnboardingFlow from "@/components/onboarding/onboarding-flow";
import { useState, useEffect } from 'react';
import { Brain, BarChart3, Bell, Play, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboardingValue = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboardingValue) {
      setShowOnboarding(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const handleLoadSampleData = () => {
    // This would load sample data into the system
    console.log('Loading sample data...');
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Visual Intelligence",
      description: "AI-powered charts and dashboards that generate automatically from natural language queries",
      color: "blue",
      link: "/test-charts"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Agents",
      description: "Specialized AI personalities providing proactive insights, risk assessment, and performance analysis",
      color: "purple",
      link: "/test-agents"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Alerts",
      description: "Real-time notifications and priority-based alerts for critical financial insights",
      color: "green",
      link: "/test-agents"
    }
  ];

  const stats = [
    { label: "AI Agents", value: "3", icon: <Brain className="w-4 h-4" /> },
    { label: "Chart Types", value: "8+", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Real-time Insights", value: "∞", icon: <Zap className="w-4 h-4" /> },
    { label: "Export Formats", value: "5", icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
            <div className="relative container-professional py-16">
              <div className="text-center mb-12 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-bounce-in">
                  <Sparkles className="w-4 h-4" />
                  Enterprise FP&A Intelligence Platform
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 text-gradient-blue">
                  Welcome to FP&A Copilot
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Transform your financial planning and analysis with AI-powered insights, 
                  automated chart generation, and intelligent agents that provide proactive 
                  recommendations for better decision-making.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="btn-professional text-lg px-8 py-4 animate-bounce-in"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Demo Tour
                  </button>
                  <a href="/test-charts" className="btn-secondary text-lg px-8 py-4">
                    View Live Demo
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="card-professional p-6 hover-scale">
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 mb-2">
                        {stat.icon}
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="container-professional py-16">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Intelligent Financial Analysis Platform
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the power of AI-driven financial insights with our comprehensive suite of tools
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="card-professional p-8 hover-lift animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <div className={`text-${feature.color}-600`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <a 
                    href={feature.link}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Explore Feature
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card-elevated p-8 animate-fade-in-up">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Financial Analysis?
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose your path to experience the power of AI-driven financial intelligence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 hover-lift transition-smooth">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visual Intelligence</h4>
                      <p className="text-sm text-gray-600">Interactive charts and dashboards</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Experience AI-powered chart generation from natural language queries. 
                    Create variance charts, trend analysis, and performance dashboards instantly.
                  </p>
                  <a href="/test-charts" className="btn-professional w-full">
                    Test Visual Intelligence
                  </a>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover-lift transition-smooth">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI Agents</h4>
                      <p className="text-sm text-gray-600">Proactive insights and recommendations</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Meet your AI financial advisors: Budget Analyst, Risk Advisor, and Performance Analyst. 
                    Get proactive insights and executive summaries automatically.
                  </p>
                  <a href="/test-agents" className="btn-secondary w-full">
                    Meet the Agents
                  </a>
                </div>
              </div>

              {/* System Status */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  System Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Visual Intelligence", status: "Online", color: "green" },
                    { label: "AI Agents", status: "Active", color: "green" },
                    { label: "Data Processing", status: "Ready", color: "green" },
                    { label: "Export System", status: "Available", color: "green" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`status-dot status-${item.color === 'green' ? 'online' : 'offline'}`} />
                        <span className={`text-${item.color}-600 font-medium`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Onboarding Flow */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        onLoadSampleData={handleLoadSampleData}
      />
    </>
  );
}
