import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

interface FavoriteState {
  favorites: FavoriteProduct[];
}

type FavoriteAction =
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteProduct }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_FAVORITES'; payload: FavoriteProduct[] };

const FavoriteContext = createContext<{
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string, product?: FavoriteProduct) => void;
} | null>(null);

const favoriteReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      if (!state.favorites.find(item => item.id === action.payload.id)) {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }
      return state;
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    default:
      return state;
  }
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoriteReducer, {
    favorites: [],
  });
  
  const { user, isAuthenticated } = useAuth();
  
  // Load favorites from localStorage on mount or when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`;
      const savedFavorites = localStorage.getItem(storageKey);
      
      if (savedFavorites) {
        try {
          const favoritesData = JSON.parse(savedFavorites);
          dispatch({ type: 'SET_FAVORITES', payload: favoritesData });
        } catch (error) {
          console.error('Error parsing favorites data:', error);
        }
      }
    } else {
      // Clear favorites when logged out
      dispatch({ type: 'CLEAR_FAVORITES' });
    }
  }, [user, isAuthenticated]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(state.favorites));
    }
  }, [state.favorites, user, isAuthenticated]);

  const addToFavorites = (product: FavoriteProduct) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
  };

  const removeFromFavorites = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  const isFavorite = (productId: string) => {
    return state.favorites.some(item => item.id === productId);
  };
  
  const toggleFavorite = (productId: string, product?: FavoriteProduct) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else if (product) {
      addToFavorites(product);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites: state.favorites,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}; 