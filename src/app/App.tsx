import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider } from 'thirdweb/react'
import { polygon } from 'thirdweb/chains'
import { AppBootstrapProvider } from '../context/AppBootstrapContext'
import { ToastProvider } from '../context/ToastContext'
import AppRouter from '../router'
import InitialLoader from '../components/InitialLoader'
import { thirdwebClient } from '@/lib/thirdwebClient'

// Create a client with default options for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection time (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Only retry once on failure
    },
  },
})

function App() {
  return (
    <>
      <InitialLoader />
      <BrowserRouter>
      <ThirdwebProvider
        activeChain={polygon}
        client={thirdwebClient}
      >
          <QueryClientProvider client={queryClient}>
            <AppBootstrapProvider>
              <ToastProvider>
                <AppRouter />
              </ToastProvider>
            </AppBootstrapProvider>
          </QueryClientProvider>
        </ThirdwebProvider>
      </BrowserRouter>
    </>
  )
}

export default App

