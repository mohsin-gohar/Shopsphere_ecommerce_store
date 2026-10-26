import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ShopSphere runtime error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
            <div className="card border-0 rounded-4 shadow-lg p-5 text-center" style={{ maxWidth: 520 }}>
              <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <span className="fw-bold fs-3">!</span>
              </div>
              <h3 className="fw-bold text-dark mb-2">Something went wrong</h3>
              <p className="text-muted small mb-4">
                The ShopSphere studio encountered an unexpected error. Your cart and saved data are safe.
                {this.state.error?.message ? (
                  <span className="d-block mt-2 text-danger" style={{ fontSize: '0.75rem' }}>
                    {this.state.error.message}
                  </span>
                ) : null}
              </p>
              <button onClick={this.handleReset} className="btn btn-dark rounded-pill px-4 py-2 fw-semibold">
                Reload Studio
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
