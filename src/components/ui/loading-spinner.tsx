'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: 'blue' | 'green' | 'gray' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'blue',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={`animate-spin ${baseClasses}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            <div
              className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div className={`${baseClasses} animate-pulse bg-current rounded-full`} />
        );

      case 'bars':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1 bg-current rounded-full animate-pulse`}
                style={{
                  height: size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '48px',
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={`${baseClasses} relative`}>
            <div className="absolute inset-0 rounded-full border-2 border-current opacity-25" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
          </div>
        );

      default:
        return null;
    }
  };

  if (text) {
    return (
      <div className="flex items-center space-x-3">
        {renderSpinner()}
        <span className="text-sm font-medium text-gray-600">{text}</span>
      </div>
    );
  }

  return renderSpinner();
};

// Skeleton loading components
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const SkeletonText: React.FC<SkeletonProps> = ({ className = '', lines = 1 }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded animate-pulse ${
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-64 bg-gray-200 rounded mb-4" />
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
    <div className="animate-pulse">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="border-b border-gray-100 p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  className = '',
  children
}) => (
  <div className={`relative ${className}`}>
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm font-medium text-gray-600">{text}</span>
        </div>
      </div>
    )}
  </div>
);

export default LoadingSpinner; 