import { RouterProvider } from 'react-router-dom';
import AntdProvider from './components/layouts/AntdProvider';
import { ReactQueryClientProvider } from './providers/react-query-provider';
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

  return (
    <ReactQueryClientProvider>
      <AntdProvider>
        <LoadingProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </LoadingProvider>
      </AntdProvider>
    </ReactQueryClientProvider>
  );
}

export default App;
