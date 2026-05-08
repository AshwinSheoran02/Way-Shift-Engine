import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; errorMessage: string; }

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

  handleReload = () => { window.location.reload(); };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg animate-fade-in">
            <div className="text-5xl mb-4">🛑</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-1 text-sm">Wayshift encountered an unexpected error.</p>
            <p className="text-gray-500 mb-6 text-xs font-mono bg-gray-50 rounded-lg p-3 border border-gray-200">
              {this.state.errorMessage || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReload}
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
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
