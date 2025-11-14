// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './router/AppRoutes';
import ErrorBoundary from './layouts/ErrorBoundary';
import Toast from './components/common/Toast';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <UIProvider>
            <AuthProvider>
              <AppRoutes />
              <Toast />
            </AuthProvider>
          </UIProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;