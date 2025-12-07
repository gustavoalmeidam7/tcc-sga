import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    if (this.state.errorCount > 5) {
      console.error('Muitos erros consecutivos detectados!');
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo, resetError }) {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    resetError();
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Desculpe, encontramos um erro inesperado. Nossa equipe está trabalhando para resolver o problema.
          </p>

          {isDevelopment && error && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="font-semibold text-sm text-destructive mb-2">
                Detalhes do erro:
              </p>
              <pre className="text-xs overflow-auto max-h-40 text-foreground">
                {error.toString()}
              </pre>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium">
                    Stack trace
                  </summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-60">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={resetError}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
            <Button
              onClick={handleReload}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recarregar página
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir para início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorBoundary;
