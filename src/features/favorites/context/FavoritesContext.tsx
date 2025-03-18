import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User } from '@/features/users/types';
import { useGithubService } from '@/features/users/hooks/useGithubService';

interface FavoriteUser extends User {
  lastUpdated?: number;
}

// Define action types
type FavoritesAction = 
  | { type: 'ADD_FAVORITE'; payload: FavoriteUser }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: FavoriteUser[] }
  | { type: 'UPDATE_FAVORITE'; payload: FavoriteUser }
  | { type: 'SET_LOADING'; payload: boolean };

// Define context state
interface FavoritesState {
  favorites: FavoriteUser[];
  isLoading: boolean;
  isInitialized: boolean;
}

// Define context value type
export interface FavoritesContextType {
  favorites: FavoriteUser[];
  isLoading: boolean;
  isInitialized: boolean;
  addFavorite: (user: User) => Promise<void>;
  removeFavorite: (login: string) => void;
  isFavorite: (login: string) => boolean;
  updateFavoriteData: (login: string) => Promise<void>;
}

// Create context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Constants
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Reducer function
const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, { ...action.payload, lastUpdated: Date.now() }]
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(user => user.login !== action.payload)
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload.map(user => ({
          ...user,
          lastUpdated: user.lastUpdated || Date.now()
        })),
        isLoading: false,
        isInitialized: true
      };
    case 'UPDATE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.map(user => 
          user.login === action.payload.login 
            ? { ...action.payload, lastUpdated: Date.now() }
            : user
        )
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    isLoading: true,
    isInitialized: false
  });

  const githubService = useGithubService();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          dispatch({ type: 'SET_FAVORITES', payload: favorites });
        } else {
          dispatch({ type: 'SET_FAVORITES', payload: [] });
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        dispatch({ type: 'SET_FAVORITES', payload: [] });
      }
    };

    if (!state.isInitialized) {
      loadFavorites();
    }
  }, [state.isInitialized]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (state.isInitialized) {
      try {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [state.favorites, state.isInitialized]);

  // Context value
  const addFavorite = useCallback(async (user: User) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const completeUser = await githubService.getUser(user.login);
      dispatch({ type: 'ADD_FAVORITE', payload: completeUser });
    } catch (error) {
      console.error('Error fetching complete user data:', error);
      dispatch({ type: 'ADD_FAVORITE', payload: user });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [githubService]);

  const removeFavorite = useCallback((login: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: login });
  }, []);

  const isFavorite = useCallback((login: string) => {
    return state.favorites.some(user => user.login === login);
  }, [state.favorites]);

  const updateFavoriteData = useCallback(async (login: string) => {
    try {
      // Check if we need to update (only if more than UPDATE_INTERVAL has passed)
      const favorite = state.favorites.find(f => f.login === login);
      if (!favorite || !favorite.lastUpdated || (Date.now() - favorite.lastUpdated > UPDATE_INTERVAL)) {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedUser = await githubService.getUser(login);
        dispatch({ type: 'UPDATE_FAVORITE', payload: updatedUser });
      }
    } catch (error) {
      console.error('Error updating favorite data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [githubService, state.favorites]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    favorites: state.favorites,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    addFavorite,
    removeFavorite,
    isFavorite,
    updateFavoriteData
  }), [
    state.favorites,
    state.isLoading,
    state.isInitialized,
    addFavorite,
    removeFavorite,
    isFavorite,
    updateFavoriteData
  ]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 