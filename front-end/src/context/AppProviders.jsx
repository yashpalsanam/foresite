import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { PropertyProvider } from './PropertyContext';
import { UIProvider } from './UIContext';
import { FavoritesProvider } from './FavoritesContext';

/**
 * App Providers
 * Combines all context providers into a single wrapper component
 * This makes it easier to wrap the app with all providers
 */

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <UIProvider>
        <FavoritesProvider>
          <PropertyProvider>
            {children}
          </PropertyProvider>
        </FavoritesProvider>  
      </UIProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
