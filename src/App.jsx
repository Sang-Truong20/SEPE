import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
import router from './routes';
import AntdProvider from './components/layouts/AntdProvider';

const queryClient = new QueryClient();

function App() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  }

  useFirebaseMessaging();

  return (
    <QueryClientProvider client={queryClient}>
      <AntdProvider>
        <RouterProvider router={router} />
      </AntdProvider>
    </QueryClientProvider>
  );
}

export default App;
