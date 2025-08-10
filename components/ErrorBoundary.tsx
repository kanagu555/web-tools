'use client';

import React from 'react';
import { Box, Typography, Button, Container, Alert, Collapse } from '@mui/material';
import { logBoundaryError } from '@/lib/utils/errorLogging';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  componentName?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error using our error logging system
    logBoundaryError(error, errorInfo);
    
    // Store error info in state for display
    this.setState({ errorInfo });
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box textAlign="center">
            {/* Error Icon */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                ⚠️
              </Typography>
            </Box>

            <Typography variant="h4" gutterBottom color="error">
              Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We're sorry for the inconvenience. An error occurred while rendering this component.
              {this.props.componentName && ` (${this.props.componentName})`}
            </Typography>

            {/* Error Message */}
            {this.state.error && (
              <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {this.state.error.message}
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                onClick={this.resetError}
                sx={{ mr: 2 }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{ mr: 2 }}
              >
                Refresh Page
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="text"
                  onClick={this.toggleDetails}
                  size="small"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Details
                </Button>
              )}
            </Box>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <Collapse in={this.state.showDetails}>
                <Box sx={{ textAlign: 'left', mb: 4 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Development Error Details:
                    </Typography>
                  </Alert>
                  
                  {this.state.error?.stack && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Stack Trace:
                      </Typography>
                      <Box 
                        component="pre" 
                        sx={{ 
                          fontSize: '0.75rem',
                          backgroundColor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          maxHeight: '200px',
                        }}
                      >
                        {this.state.error.stack}
                      </Box>
                    </Box>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Component Stack:
                      </Typography>
                      <Box 
                        component="pre" 
                        sx={{ 
                          fontSize: '0.75rem',
                          backgroundColor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          maxHeight: '200px',
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>
            )}

            {/* Help Text */}
            <Typography variant="body2" color="text.secondary">
              If this problem persists, please try clearing your browser cache or contact support.
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;