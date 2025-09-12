'use client'

import * as React from 'react'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Card } from '@/components/atoms/Card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Simple fallback component
const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <Card className="p-8 text-center border-red-200 bg-red-50">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name="alert-triangle" size="lg" className="text-red-600" />
    </div>
    
    <Typography variant="h4" className="font-bold text-red-900 mb-2">
      Algo salió mal
    </Typography>
    
    <Typography variant="body-default" color="muted" className="mb-4">
      Ha ocurrido un error inesperado. Puedes intentar recargar o volver atrás.
    </Typography>
    
    {process.env.NODE_ENV === 'development' && error && (
      <div className="mb-4 p-3 bg-red-100 rounded-lg text-left">
        <Typography variant="code" className="text-red-800 text-xs break-all">
          {error.message}
        </Typography>
      </div>
    )}
    
    <div className="space-y-2">
      <Button
        onClick={resetError}
        variant="primary"
        size="sm"
        leftIcon={<Icon name="refresh" size="sm" />}
      >
        Intentar nuevamente
      </Button>
      
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        size="sm"
        leftIcon={<Icon name="arrow-left" size="sm" />}
      >
        Recargar página
      </Button>
    </div>
  </Card>
)

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)
  
  const resetError = React.useCallback(() => {
    setError(null)
  }, [])
  
  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])
  
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
  
  return { captureError, resetError }
}