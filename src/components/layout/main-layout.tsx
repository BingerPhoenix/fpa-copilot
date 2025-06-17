'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Brain, Home, Settings, HelpCircle, User } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Visual Intelligence', href: '/test-charts', icon: BarChart3 },
    { name: 'AI Agents', href: '/test-agents', icon: Brain },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-professional border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container-professional">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover-scale transition-smooth">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FP&A Copilot</h1>
                <p className="text-xs text-gray-500 -mt-1">Enterprise Intelligence Platform</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-smooth hover-lift focus-ring ${
                      active
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Help */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-smooth hover-lift focus-ring">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-smooth hover-lift focus-ring">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-smooth hover-lift cursor-pointer">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Demo User</span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
            <div className="flex justify-around">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium text-xs transition-smooth ${
                      active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container-professional py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">FP&A Copilot</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Transform your financial planning and analysis with AI-powered insights, 
                automated chart generation, and intelligent agents that provide proactive 
                recommendations for better decision-making.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="status-dot status-online" />
                  <span>System Operational</span>
                </div>
                <div className="text-sm text-gray-500">
                  Version 1.0.0
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/test-charts" className="hover:text-blue-600 transition-colors">Visual Intelligence</Link></li>
                <li><Link href="/test-agents" className="hover:text-blue-600 transition-colors">AI Agents</Link></li>
                <li><span className="text-gray-400">Executive Summaries</span></li>
                <li><span className="text-gray-400">Smart Alerts</span></li>
                <li><span className="text-gray-400">Export & Share</span></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="text-gray-400">Documentation</span></li>
                <li><span className="text-gray-400">API Reference</span></li>
                <li><span className="text-gray-400">Support</span></li>
                <li><span className="text-gray-400">Contact</span></li>
                <li><span className="text-gray-400">Privacy Policy</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 FP&A Copilot. Enterprise Financial Intelligence Platform.
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="text-sm text-gray-500">Built with AI & Modern Tech</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
