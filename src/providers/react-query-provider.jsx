import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export const ReactQueryClientProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 30 * 60 * 1000, // 30 minutes - keep data in cache longer for better performance
            retryOnMount: true, // Retry failed queries when component mounts
            refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
            refetchOnReconnect: true, // Refetch when network reconnects
            refetchOnMount: true,
            retry: 0
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
