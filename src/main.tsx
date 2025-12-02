import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import './index.css'
import App from './App.tsx'
import { CACHE_CONFIG } from './api/constants'
import { measureWebVitals } from './utils/performance'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Create Query Client with optimized cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.POKEMON_DETAIL_STALE_TIME,
      gcTime: CACHE_CONFIG.POKEMON_DETAIL_CACHE_TIME,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
})

// Create persister for localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'POKEDEX_CACHE',
})

// Persist the query client
persistQueryClient({
  queryClient,
  persister,
  maxAge: CACHE_CONFIG.POKEMON_DETAIL_CACHE_TIME,
})

// Initialize performance monitoring
measureWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
