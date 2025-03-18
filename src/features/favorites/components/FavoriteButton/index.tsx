import { memo } from 'react';
import { User } from '@/features/users/types';
import { useFavorites } from '@/features/favorites';
import styles from './FavoriteButton.module.css';

export interface FavoriteButtonProps {
  user: User;
  variant?: 'icon' | 'button';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: {
    add?: string;
    remove?: string;
  }; 
}

/**
 * Reusable favorite button component with two variants:
 * - 'icon': Just the heart icon (for cards, compact views)
 * - 'button': Full button with text (for detailed views)
 */
const FavoriteButton = ({ 
  user, 
  variant = 'icon', 
  className = '',
  size = 'md',
  label = { add: 'Agregar a favoritos', remove: 'Favorito' }
}: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isUserFavorite = isFavorite(user.login);
  
  // Event handler for favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUserFavorite) {
      removeFavorite(user.login);
    } else {
      addFavorite(user);
    }
  };

  // CSS classes based on props
  const buttonClasses = [
    styles.favoriteButton,
    styles[variant],
    styles[size],
    isUserFavorite ? styles.favorited : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      onClick={handleFavoriteClick}
      className={buttonClasses}
      aria-label={isUserFavorite ? 'Remover de favoritos' : 'Add to Agregar a favoritos'}
      type="button"
    >
      {isUserFavorite ? (
        // Filled heart icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-5.201-3.64 11.672 11.672 0 01-2.176-2.723 6.787 6.787 0 01-.762-1.803c-.38-1.106-.399-2.302-.072-3.447.33-1.146 1.022-2.19 1.975-2.99a5.803 5.803 0 014.031-1.276c1.383.08 2.703.658 3.745 1.64a.75.75 0 001.084 0 5.797 5.797 0 013.745-1.64c1.38-.08 2.727.33 3.784 1.143.86.648 1.528 1.544 1.888 2.573.36 1.03.398 2.14.112 3.18-.28 1.043-.854 2.005-1.61 2.73a14.31 14.31 0 01-2.027 1.735c-.782.57-1.636 1.1-2.544 1.574a15.249 15.249 0 01-2.95 1.298l-.021.008-.007.003a.75.75 0 01-.556 0z" />
        </svg>
      ) : (
        // Outlined heart icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )}
      
      {/* Show text label only for button variant */}
      {variant === 'button' && (
        <span className={styles.label}>
          {isUserFavorite ? label.remove : label.add}
        </span>
      )}
    </button>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(FavoriteButton); 