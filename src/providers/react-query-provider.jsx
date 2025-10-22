import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export const ReactQueryClientProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 30 * 60 * 1000, // 30 minutes - keep data in cache longer for better performance
            retryOnMount: true, // Retry failed queries when component mounts
            refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
            refetchOnReconnect: true, // Refetch when network reconnects
            refetchOnMount: false, // Don't refetch fresh data on mount
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
