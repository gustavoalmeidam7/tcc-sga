import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Configuração otimizada do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados ficam em cache
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos

      // Retry automático em caso de erro
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch automático
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // Suspense mode desabilitado por padrão
      suspense: false,

      // Mantém dados anteriores durante refetch
      keepPreviousData: true,

      // Handler global de erro
      onError: (error) => {
        console.error('Query error:', error);
        // Aqui você pode adicionar integração com serviço de monitoramento
      },
    },
    mutations: {
      // Retry para mutations
      retry: 1,

      // Handler global de erro para mutations
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)