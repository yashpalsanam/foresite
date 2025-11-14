import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, SUCCESS_MESSAGES } from '@/utils/constants';
import { toast } from 'react-toastify';

/**
 * Favorites Context
 * Manages user's favorite properties
 */

const FavoritesContext = createContext(undefined);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [loading, setLoading] = useState(false);

  /**
   * Check if property is in favorites
   */
  const isFavorite = useCallback((propertyId) => {
    return favorites.some((fav) => fav.id === propertyId || fav === propertyId);
  }, [favorites]);

  /**
   * Add property to favorites
   */
  const addFavorite = useCallback((property) => {
    setLoading(true);
    
    try {
      // Store either the full property object or just the ID
      const favoriteItem = typeof property === 'object' ? property : { id: property };
      
      setFavorites((prev) => {
        // Check if already exists
        if (prev.some((fav) => {
          const favId = typeof fav === 'object' ? fav.id : fav;
          const newId = typeof favoriteItem === 'object' ? favoriteItem.id : favoriteItem;
          return favId === newId;
        })) {
          return prev;
        }
        
        return [...prev, favoriteItem];
      });

      toast.success(SUCCESS_MESSAGES.FAVORITE_ADDED, {
        position: 'bottom-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
    } finally {
      setLoading(false);
    }
  }, [setFavorites]);

  /**
   * Remove property from favorites
   */
  const removeFavorite = useCallback((propertyId) => {
    setLoading(true);
    
    try {
      setFavorites((prev) =>
        prev.filter((fav) => {
          const favId = typeof fav === 'object' ? fav.id : fav;
          return favId !== propertyId;
        })
      );

      toast.success(SUCCESS_MESSAGES.FAVORITE_REMOVED, {
        position: 'bottom-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    } finally {
      setLoading(false);
    }
  }, [setFavorites]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((property) => {
    const propertyId = typeof property === 'object' ? property.id : property;
    
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(property);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    toast.info('All favorites cleared', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  }, [setFavorites]);

  /**
   * Get favorites count
   */
  const favoritesCount = favorites.length;

  /**
   * Get favorite property IDs
   */
  const favoriteIds = favorites.map((fav) => 
    typeof fav === 'object' ? fav.id : fav
  );

  const value = {
    favorites,
    favoritesCount,
    favoriteIds,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook to use favorites context
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
};

export default FavoritesContext;
