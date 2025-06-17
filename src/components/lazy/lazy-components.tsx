'use client';

import { lazy, Suspense } from 'react';
import { LoadingSpinner, SkeletonCard, SkeletonChart } from '@/components/ui/loading-spinner';

// Lazy load heavy components for better initial page load
export const LazyProactiveInsights = lazy(() => 
  import('@/components/insights/proactive-insights').then(module => ({
    default: module.default
  }))
);

export const LazyExecutiveSummary = lazy(() =>
  import('@/components/insights/executive-summary').then(module => ({
    default: module.default
  }))
);

export const LazyQuerySuggestions = lazy(() =>
  import('@/components/insights/query-suggestions').then(module => ({
    default: module.default
  }))
);

export const LazyAgentPanel = lazy(() =>
  import('@/components/agents/agent-panel').then(module => ({
    default: module.default
  }))
);

export const LazyNotificationSystem = lazy(() =>
  import('@/components/alerts/notification-system').then(module => ({
    default: module.default
  }))
);

export const LazyOnboardingFlow = lazy(() =>
  import('@/components/onboarding/onboarding-flow').then(module => ({
    default: module.default
  }))
);

export const LazyExportManager = lazy(() =>
  import('@/components/export/export-manager').then(module => ({
    default: module.ExportManager
  }))
);

export const LazyQuickExport = lazy(() =>
  import('@/components/export/export-manager').then(module => ({
    default: module.QuickExport
  }))
);

// Wrapper components with proper Suspense boundaries and loading states
export function ProactiveInsightsWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-fade-in">
        <SkeletonCard className="h-96" />
      </div>
    }>
      <LazyProactiveInsights {...props} />
    </Suspense>
  );
}

export function ExecutiveSummaryWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-fade-in">
        <SkeletonCard className="h-80" />
      </div>
    }>
      <LazyExecutiveSummary {...props} />
    </Suspense>
  );
}

export function QuerySuggestionsWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-fade-in">
        <SkeletonCard className="h-64" />
      </div>
    }>
      <LazyQuerySuggestions {...props} />
    </Suspense>
  );
}

export function AgentPanelWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-fade-in">
        <SkeletonCard className="h-96" />
      </div>
    }>
      <LazyAgentPanel {...props} />
    </Suspense>
  );
}

export function NotificationSystemWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-fade-in">
        <SkeletonCard className="h-48" />
      </div>
    }>
      <LazyNotificationSystem {...props} />
    </Suspense>
  );
}

export function OnboardingFlowWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Onboarding</h3>
            <p className="text-gray-600">Setting up your experience...</p>
          </div>
        </div>
      </div>
    }>
      <LazyOnboardingFlow {...props} />
    </Suspense>
  );
}

export function ExportManagerWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Export</h3>
            <p className="text-gray-600">Preparing export options...</p>
          </div>
        </div>
      </div>
    }>
      <LazyExportManager {...props} />
    </Suspense>
  );
}

export function QuickExportWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
      </div>
    }>
      <LazyQuickExport {...props} />
    </Suspense>
  );
}

// Generic lazy component wrapper
export function LazyComponentWrapper({
  children,
  fallback,
  className = ''
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  return (
    <Suspense fallback={
      fallback || (
        <div className={`animate-fade-in ${className}`}>
          <SkeletonCard />
        </div>
      )
    }>
      {children}
    </Suspense>
  );
}

// Performance monitoring for lazy components
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode,
  displayName?: string
) {
  const LazyComponent = lazy(async () => {
    const start = performance.now();
    
    try {
      const module = await importFn();
      const end = performance.now();
      
      // Log loading performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Lazy component ${displayName || 'Unknown'} loaded in ${(end - start).toFixed(2)}ms`);
      }
      
      return module;
    } catch (error) {
      console.error(`Failed to load lazy component ${displayName || 'Unknown'}:`, error);
      throw error;
    }
  });

  // LazyComponent.displayName = `Lazy(${displayName || 'Component'})`;

  function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }

  LazyWrapper.displayName = `Lazy(${displayName || 'Component'})`;
  return LazyWrapper;
}

// Preload utility for critical components
export function preloadComponent(importFn: () => Promise<any>) {
  // Start loading the component
  const componentPromise = importFn();
  
  // Return a function to await the component
  return () => componentPromise;
}

// Preload critical components on user interaction
export function preloadCriticalComponents() {
  // Preload components that are likely to be needed
  if (typeof window !== 'undefined') {
    // Preload on user interaction
    const preloadOnInteraction = () => {
      preloadComponent(() => import('@/components/insights/proactive-insights'));
      preloadComponent(() => import('@/components/insights/executive-summary'));
      preloadComponent(() => import('@/components/export/export-manager'));
    };

    // Preload on mouse move (user is active)
    document.addEventListener('mousemove', preloadOnInteraction, { once: true });
    
    // Preload on touch (mobile users)
    document.addEventListener('touchstart', preloadOnInteraction, { once: true });
    
    // Preload after a delay (for inactive users)
    setTimeout(preloadOnInteraction, 2000);
  }
}

export default {
  ProactiveInsightsWithSuspense,
  ExecutiveSummaryWithSuspense,
  QuerySuggestionsWithSuspense,
  AgentPanelWithSuspense,
  NotificationSystemWithSuspense,
  OnboardingFlowWithSuspense,
  ExportManagerWithSuspense,
  QuickExportWithSuspense,
  LazyComponentWrapper,
  withLazyLoading,
  preloadComponent,
  preloadCriticalComponents,
}; 