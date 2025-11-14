/**
 * Context Index
 * Barrel exports for all context providers and hooks
 */

// Context Providers
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { PropertyProvider, useProperty } from './PropertyContext';
export { UIProvider, useUI } from './UIContext';
export { FavoritesProvider, useFavorites } from './FavoritesContext';
export { AppProviders } from './AppProviders';

// Default export
export { AppProviders as default } from './AppProviders';
