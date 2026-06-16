import { Suspense, type FC, type ReactNode } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes/Index';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from './components/ScrollToTop';
import RouteAwareFallback from './components/ui/RouteAwareFallback';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
  <AuthProvider>
    <AdminAuthProvider>
      <SocketProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SocketProvider>
    </AdminAuthProvider>
  </AuthProvider>
);

const AppRoutes = () => {
  const element = useRoutes(routes);
  return <Suspense fallback={<RouteAwareFallback />}>{element}</Suspense>;
};

const App = () => {
  const appContent = (
    <AppProviders>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <AppRoutes />
      </ErrorBoundary>
    </AppProviders>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {appContent}
        </GoogleOAuthProvider>
      ) : (
        appContent
      )}
    </BrowserRouter>
  );
};

export default App;
