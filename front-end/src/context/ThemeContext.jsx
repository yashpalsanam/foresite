import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Theme Context
 * Manages application theme (light/dark mode)
 */

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light');
  const [mounted, setMounted] = useState(false);

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  /**
   * Set theme to light
   */
  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  /**
   * Set theme to dark
   */
  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  /**
   * Set theme to system preference
   */
  const setSystemTheme = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [setTheme]);

  /**
   * Apply theme to document
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem(STORAGE_KEYS.THEME);
      if (!hasManualPreference) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Add listener (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [setTheme]);

  /**
   * Prevent flash of unstyled content on initial load
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * @returns {object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
