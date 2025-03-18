import { memo, useCallback } from 'react';
import { User } from '../../types';
import UserCard from '../UserCard';
import styles from './UserGrid.module.css';

export interface UserGridViewProps {
  users: User[];
  loading: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * Componente de presentación pura para mostrar una cuadrícula de usuarios.
 * Este componente se encarga sólo del renderizado y no contiene lógica de negocio.
 */
const UserGridView = memo(({ users, loading, error, hasMore = false, onLoadMore }: UserGridViewProps) => {
  // Función para manejar el click en "Cargar más"
  const handleLoadMore = useCallback(() => {
    console.log('UserGridView - Click en "Cargar más"', { hasMore, loading, usersCount: users.length });
    if (onLoadMore && hasMore && !loading) {
      console.log('UserGridView - Ejecutando onLoadMore');
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore, users.length]);
  
  // Si tenemos un error
  if (error) {
    return (
      <div className={styles.empty} role="alert">
        <div className={styles.emptyContent}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  // Si estamos cargando inicialmente y no hay usuarios
  if (loading && users.length === 0) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  // Si no hay usuarios para mostrar
  if (users.length === 0) {
    return (
      <div className={styles.empty} role="status" aria-live="polite">
        <div className={styles.emptyContent}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <p>No se encontraron usuarios. Intenta con otra búsqueda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userGridContainer}>
      <ul className={styles.grid} aria-label="Lista de usuarios de GitHub">
        {users.map((user: User) => (
          <li key={user.id} className={styles.gridItem}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
      
      {/* Indicador de carga o botón de cargar más */}
      <div className={styles.loadMore}>
        {loading ? (
          <>
            <div className={styles.spinner} aria-hidden="true"></div>
            <p>Cargando más usuarios...</p>
          </>
        ) : hasMore ? (
          <button 
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
            disabled={loading}
          >
            Cargar más
          </button>
        ) : null}
      </div>
    </div>
  );
});

// Agregar nombre de visualización para facilitar la depuración
UserGridView.displayName = 'UserGridView';

export default UserGridView; 