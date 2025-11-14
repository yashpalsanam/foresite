// src/context/UIContext.jsx
import { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info',
    title: '',
    duration: 3000
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = ({ message, type = 'info', title = '', duration = 3000 }) => {
    setToast({
      show: true,
      message,
      type,
      title,
      duration
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const value = {
    // Toast
    toast,
    showToast,
    hideToast,
    
    // Sidebar
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    
    // Loading
    isLoading,
    setIsLoading
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};