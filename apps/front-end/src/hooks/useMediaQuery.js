import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/utils/constants';

/**
 * Custom hook for media queries
 * Tracks whether a media query matches
 * 
 * @param {string} query - Media query string
 * @returns {boolean} Whether the query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event) => setMatches(event.matches);

    // Add listener (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Hook for checking if screen is mobile
 * @returns {boolean} True if mobile screen
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`);
};

/**
 * Hook for checking if screen is tablet
 * @returns {boolean} True if tablet screen
 */
export const useIsTablet = () => {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
};

/**
 * Hook for checking if screen is desktop
 * @returns {boolean} True if desktop screen
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
};

/**
 * Hook for getting current breakpoint
 * @returns {string} Current breakpoint name (sm, md, lg, xl, 2xl)
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < BREAKPOINTS.SM) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.MD) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.LG) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.XL) {
        setBreakpoint('lg');
      } else if (width < BREAKPOINTS['2XL']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Add resize listener
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};

/**
 * Hook for checking if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook for checking if user prefers dark mode
 * @returns {boolean} True if user prefers dark mode
 */
export const usePrefersDarkMode = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * Hook for checking screen orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    // Set initial orientation
    updateOrientation();

    // Add resize listener
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
};

/**
 * Hook for getting window dimensions
 * @returns {object} { width, height }
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Call handler right away to update state with initial window size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useMediaQuery;
