import { useState, useCallback } from 'react';

/**
 * Custom hook for toggling boolean state
 * Useful for modals, menus, accordions, etc.
 * 
 * @param {boolean} initialValue - Initial state value
 * @returns {Array} [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};

/**
 * Hook for managing multiple toggle states
 * @param {object} initialStates - Object with initial boolean states
 * @returns {object} State and toggle functions
 */
export const useMultipleToggles = (initialStates = {}) => {
  const [states, setStates] = useState(initialStates);

  const toggle = useCallback((key) => {
    setStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const setTrue = useCallback((key) => {
    setStates((prev) => ({
      ...prev,
      [key]: true,
    }));
  }, []);

  const setFalse = useCallback((key) => {
    setStates((prev) => ({
      ...prev,
      [key]: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setStates(initialStates);
  }, [initialStates]);

  return {
    states,
    toggle,
    setTrue,
    setFalse,
    reset,
  };
};

export default useToggle;
