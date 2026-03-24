import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes/Index'; // matches the filename src/routes/Index.tsx
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import SocketManager from './components/common/SocketManager';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
