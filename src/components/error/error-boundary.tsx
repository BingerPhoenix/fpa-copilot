'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Generate a unique event ID for tracking
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, eventId);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo, eventId: string) => {
    // Here you would integrate with your error tracking service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    const errorData = {
      eventId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: 'demo-user', // Replace with actual user ID
      buildVersion: process.env.NEXT_PUBLIC_APP_VERSION,
    };

    // Example: Send to your error tracking API
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData),
    // }).catch(console.error);

    console.log('Error reported:', errorData);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, eventId } = this.state;
    const subject = `FP&A Copilot Error Report - ${eventId}`;
    const body = `Error ID: ${eventId}
Error Message: ${error?.message || 'Unknown error'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:


Additional context:
`;

    const mailtoUrl = `mailto:support@fpa-copilot.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  private getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk') || message.includes('loading')) {
      return 'medium'; // Network/loading issues
    }
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'high'; // Security/permission issues
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'medium'; // API issues
    }
    
    return 'high'; // Default to high for unknown errors
  };

  private getErrorTitle = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk')) {
      return 'Loading Error';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Connection Error';
    }
    
    if (message.includes('permission')) {
      return 'Access Error';
    }
    
    return 'Unexpected Error';
  };

  private getErrorDescription = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk')) {
      return 'Failed to load application resources. This usually happens due to network issues or when the application has been updated.';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect to our servers. Please check your internet connection and try again.';
    }
    
    if (message.includes('permission')) {
      return 'You don\'t have permission to access this resource. Please contact your administrator.';
    }
    
    return 'An unexpected error occurred while processing your request. Our team has been notified.';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, eventId } = this.state;
      const severity = error ? this.getErrorSeverity(error) : 'high';
      const title = error ? this.getErrorTitle(error) : 'Error';
      const description = error ? this.getErrorDescription(error) : 'An error occurred';

      const severityColors = {
        low: 'blue',
        medium: 'yellow',
        high: 'orange',
        critical: 'red',
      };

      const color = severityColors[severity];

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className={`bg-${color}-50 border-b border-${color}-200 p-6`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <AlertTriangle className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600">{description}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">Error ID:</span>
                        <span className="ml-2 font-mono text-gray-900">{eventId}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timestamp:</span>
                        <span className="ml-2 text-gray-900">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Message:</span>
                        <span className="ml-2 text-gray-900">{error?.message}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={this.handleRetry}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                    
                    <button
                      onClick={this.handleReload}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reload Page
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={this.handleGoHome}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium"
                    >
                      <Home className="w-4 h-4" />
                      Go to Homepage
                    </button>
                    
                    <button
                      onClick={this.handleReportBug}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Report Issue
                    </button>
                  </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">What can you do?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Try refreshing the page or clicking "Try Again"</li>
                    <li>• Check your internet connection</li>
                    <li>• Clear your browser cache and cookies</li>
                    <li>• Contact support if the problem persists</li>
                  </ul>
                </div>

                {/* Development Info */}
                {process.env.NODE_ENV === 'development' && error && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      <Bug className="w-4 h-4 inline mr-1" />
                      Development Details
                    </summary>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
                      <div className="mb-3">
                        <strong>Error Stack:</strong>
                        <pre className="mt-1 text-xs text-red-800 overflow-x-auto whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 text-xs text-red-800 overflow-x-auto whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-gray-500">
              FP&A Copilot v{process.env.NEXT_PUBLIC_APP_VERSION} • 
              Need help? Contact{' '}
              <a href="mailto:support@fpa-copilot.com" className="text-blue-600 hover:underline">
                support@fpa-copilot.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Lightweight error boundary for specific components
export function ErrorFallback({ 
  error, 
  resetError,
  title = 'Something went wrong'
}: { 
  error: Error; 
  resetError: () => void;
  title?: string;
}) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="font-medium text-red-900">{title}</h3>
      </div>
      <p className="text-red-800 text-sm mb-4">{error.message}</p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorBoundary; 