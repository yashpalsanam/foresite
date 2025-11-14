import '@/styles/globals.css';
import '@/styles/typography.css';
import { AppProviders } from '@/context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Custom App Component
 * Wraps all pages with providers and global configurations
 */

function MyApp({ Component, pageProps }) {
  return (
    <AppProviders>
      <Component {...pageProps} />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AppProviders>
  );
}

export default MyApp;
