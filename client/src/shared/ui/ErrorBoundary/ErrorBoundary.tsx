import React, { type ReactNode } from 'react';

type IErrorBoundaryProps = {
  children: ReactNode;
};

type IErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error:', error, errorInfo, this.state.error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Упс! Что-то пошло не так.</h1>
        </div>
      );
    }

    return this.props.children;
  }
}
