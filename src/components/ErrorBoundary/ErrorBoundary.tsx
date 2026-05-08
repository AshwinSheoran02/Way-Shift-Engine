import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Error boundary component that catches uncaught exceptions
 * and displays a friendly error screen with a reload button.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wayshift Error Boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="text-5xl mb-4">🛑</div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Something went wrong
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-1 text-sm">
              Wayshift encountered an unexpected error.
            </p>
            <p className="text-[var(--color-text-muted)] mb-6 text-xs font-mono bg-[var(--color-bg-card)] rounded-lg p-3">
              {this.state.errorMessage || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReload}
              className="gradient-accent text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Reload Wayshift
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
