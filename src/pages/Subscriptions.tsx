import { useQuery } from '@tanstack/react-query'
import { fetchPlans, testApiConnection, type Plan } from '../utils/api'
import SubscriptionCard from '../components/SubscriptionCard'
import { useState, useEffect } from 'react'
import { AlertCircle, Wifi, RefreshCw } from 'lucide-react'

export default function Subscriptions() {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Debug: Log when component mounts
  useEffect(() => {
    console.log('🔵 Subscriptions component mounted');
    return () => {
      console.log('🔴 Subscriptions component unmounted');
    };
  }, []);

  const { 
    data: plans = [],
    isLoading, 
    error, 
    refetch,
    isRefetching,
    status, // Add status for debugging
    fetchStatus // Add fetchStatus for debugging
  } = useQuery<Plan[], Error>({ 
    queryKey: ['plans'], 
    queryFn: fetchPlans,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true, // Changed to true for debugging
    refetchOnMount: true, // Ensure it refetches on mount
    enabled: true, // Explicitly enable the query
  });

  // Debug: Log query state changes
  useEffect(() => {
    console.log('📊 Query state:', {
      status,
      fetchStatus,
      isLoading,
      hasData: !!plans,
      dataLength: plans?.length,
      error: error?.message
    });
  }, [status, fetchStatus, isLoading, plans, error]);

  const handleTestConnection = async () => {
    const result = await testApiConnection();
    console.log('Connection test result:', result);
    alert(`Connection test: ${result.message}`);
  };

  const handleRetry = () => {
    console.log('Manual retry triggered');
    refetch();
  };

  // Debug: Check if we're even getting to the loading state
  console.log('🔄 Current render state:', { isLoading, hasError: !!error, hasData: !!plans });

  // Loading state
  if (isLoading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading subscription plans...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded mb-6" />
              <div className="h-5 w-20 bg-muted rounded mb-4" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log('❌ Showing error state:', error.message);
    const errorMessage = error.message;
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Failed to Load Subscription Plans
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {errorMessage}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRetry}
                  disabled={isRefetching}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                  <span>{isRefetching ? 'Retrying...' : 'Try Again'}</span>
                </button>
                
                <button
                  onClick={handleTestConnection}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                >
                  <Wifi className="h-4 w-4" />
                  <span>Test Connection</span>
                </button>
                
                <button
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  {showDebugInfo ? 'Hide' : 'Show'} Debug Info
                </button>
              </div>
              
              {showDebugInfo && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Debug Information:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'https://gamehub-i770.onrender.com'}</p>
                    <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
                    <p><strong>Error Type:</strong> {error?.constructor?.name || 'Unknown'}</p>
                    <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Stack Trace</summary>
                        <pre className="mt-1 text-xs bg-gray-200 p-2 rounded overflow-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Troubleshooting Steps:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Check your internet connection</li>
            <li>Verify the API server is running at the configured URL</li>
            <li>Check browser console for additional error details</li>
            <li>Try refreshing the page</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
      </div>
    );
  }

  // Empty state
  if (plans.length === 0) {
    console.log('📭 Showing empty state');
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Subscription Plans Available
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              There are currently no subscription plans to display. They may be loading or temporarily unavailable.
            </p>
            <button
              onClick={handleRetry}
              disabled={isRefetching}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  console.log('✅ Showing success state with', plans.length, 'plans');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose from {plans.length} available plan{plans.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={handleRetry}
          disabled={isRefetching}
          className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          title="Refresh plans"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, idx) => (
          <SubscriptionCard 
            key={plan._id || `${plan.category}-${plan.plan}-${idx}`} 
            plan={plan} 
          />
        ))}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <details>
            <summary className="text-sm font-medium text-yellow-800 cursor-pointer">
              Development Debug Info (click to expand)
            </summary>
            <div className="mt-2 text-xs text-yellow-700">
              <p><strong>Plans loaded:</strong> {plans.length}</p>
              <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'https://gamehub-i770.onrender.com'}</p>
              <p><strong>Last updated:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Query status:</strong> {status}</p>
              <p><strong>Fetch status:</strong> {fetchStatus}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}