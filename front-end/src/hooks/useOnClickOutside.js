import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside an element
 * Useful for modals, dropdowns, and menus
 * 
 * @param {Function} handler - Function to call when clicked outside
 * @param {Array} events - Array of event types to listen for
 * @returns {ref} Element ref
 */
export const useOnClickOutside = (handler, events = ['mousedown', 'touchstart']) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      const element = ref.current;
      
      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target)) {
        return;
      }

      handler(event);
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [ref, handler, events]);

  return ref;
};

/**
 * Hook for detecting clicks outside multiple elements
 * @param {Function} handler - Function to call when clicked outside
 * @param {Array} refs - Array of refs to check
 * @returns {void}
 */
export const useOnClickOutsideMultiple = (handler, refs = []) => {
  useEffect(() => {
    const listener = (event) => {
      // Check if click is outside all refs
      const clickedOutside = refs.every((ref) => {
        const element = ref.current;
        return !element || !element.contains(event.target);
      });

      if (clickedOutside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, refs]);
};

export default useOnClickOutside;
