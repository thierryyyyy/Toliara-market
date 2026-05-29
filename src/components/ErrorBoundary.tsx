import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught error:', error);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="w-full p-6 my-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
              {this.props.componentName ? 'Erreur dans ' + this.props.componentName : 'Une erreur est survenue'}
            </h4>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Ce composant a rencontre un probleme. Cliquez sur Reessayer.
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
            >
              Reessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<P>, name?: string): React.FC<P> {
  const displayName = name || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Wrapped: React.FC<P> = (props: P) => (
    <ErrorBoundary componentName={displayName}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  Wrapped.displayName = 'WithErrorBoundary(' + displayName + ')';
  return Wrapped;
}

export default ErrorBoundary;
