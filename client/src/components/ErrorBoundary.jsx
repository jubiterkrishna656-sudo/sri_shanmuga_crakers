import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#0f0720] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">Something went wrong</h1>
            <p className="text-white/60 text-sm mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
              >
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-white/40 text-xs cursor-pointer hover:text-white/60">Error details</summary>
                <pre className="mt-2 p-3 bg-black/40 rounded-lg text-red-400 text-xs overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
