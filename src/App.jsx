import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import AntdProvider from './components/layouts/AntdProvider';
import router from './routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingProvider } from './context/LoadingContext.jsx';

function App() {
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('/firebase-messaging-sw.js')
  //     .then((registration) => {
  //       console.log('Service Worker registered:', registration);
  //     })
  //     .catch((err) => {
  //       console.error('Service Worker registration failed:', err);
  //     });
  // }

  // useFirebaseMessaging();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AntdProvider>
        <LoadingProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </LoadingProvider>
      </AntdProvider>
    </QueryClientProvider>
  );
}

export default App;
