import { Suspense } from 'react';
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
import PageLoader from './components/ui/PageLoader';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AppRoutes = () => {
  const element = useRoutes(routes);
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <AdminAuthProvider>
            <SocketProvider>
              <NotificationProvider>
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
              </NotificationProvider>
            </SocketProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
};

export default App;
