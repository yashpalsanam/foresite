import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * UI Context
 * Manages global UI state (modals, toasts, loading states, etc.)
 */

const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {
  // Modal state
  const [modals, setModals] = useState({});

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Global loading state
  const [isLoading, setIsLoading] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search modal/overlay
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sidebar state (for filters, etc.)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Modal Management
   */
  const openModal = useCallback((modalId) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: true,
    }));
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: false,
    }));
    // Restore body scroll
    document.body.style.overflow = 'unset';
  }, []);

  const toggleModal = useCallback((modalId) => {
    setModals((prev) => {
      const newState = !prev[modalId];
      document.body.style.overflow = newState ? 'hidden' : 'unset';
      return {
        ...prev,
        [modalId]: newState,
      };
    });
  }, []);

  const isModalOpen = useCallback(
    (modalId) => {
      return !!modals[modalId];
    },
    [modals]
  );

  const closeAllModals = useCallback(() => {
    setModals({});
    document.body.style.overflow = 'unset';
  }, []);

  /**
   * Toast Notifications
   */
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Shorthand toast methods
  const showSuccess = useCallback(
    (message, duration) => showToast(message, 'success', duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => showToast(message, 'error', duration),
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration) => showToast(message, 'warning', duration),
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration) => showToast(message, 'info', duration),
    [showToast]
  );

  /**
   * Mobile Menu
   */
  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'unset';
      return newState;
    });
  }, []);

  /**
   * Search Modal
   */
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'unset';
      return newState;
    });
  }, []);

  /**
   * Sidebar
   */
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Global Loading
   */
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Scroll to top utility
   */
  const scrollToTop = useCallback((behavior = 'smooth') => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior,
      });
    }
  }, []);

  /**
   * Scroll to element utility
   */
  const scrollToElement = useCallback((elementId, offset = 0) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  const value = {
    // Modals
    modals,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    closeAllModals,

    // Toasts
    toasts,
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Mobile Menu
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,

    // Search
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,

    // Sidebar
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,

    // Loading
    isLoading,
    startLoading,
    stopLoading,

    // Utilities
    scrollToTop,
    scrollToElement,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

/**
 * Hook to use UI context
 * @returns {object} UI context value
 */
export const useUI = () => {
  const context = useContext(UIContext);

  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
};

export default UIContext;
