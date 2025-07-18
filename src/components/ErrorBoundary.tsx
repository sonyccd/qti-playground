import React, { Component, ReactNode } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('QTI Preview Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card sx={{ m: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" color="error.main" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The QTI Preview component encountered an unexpected error.
            </Typography>
            
            <Button
              variant="contained"
              onClick={this.handleRetry}
              startIcon={<Refresh />}
              sx={{ mb: 3 }}
            >
              Try Again
            </Button>

            {this.state.error && (
              <Alert severity="error" sx={{ textAlign: 'left', mt: 3 }}>
                <AlertTitle>Error Details</AlertTitle>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                  {this.state.error.message}
                </Typography>
                {this.state.error.stack && (
                  <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {this.state.error.stack}
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}