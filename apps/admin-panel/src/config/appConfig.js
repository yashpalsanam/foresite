export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Foresite Admin',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  environment: import.meta.env.MODE || 'development',
};

export default appConfig;
