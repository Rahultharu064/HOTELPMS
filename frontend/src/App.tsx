import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes/Index'; // matches the filename src/routes/Index.tsx
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import SocketManager from './components/common/SocketManager';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "959138634926-nufr5p3j26rgufo36pg0p791tfjmf23c.apps.googleusercontent.com";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <SocketManager />
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
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
};

export default App;
