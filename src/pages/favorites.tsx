import Head from 'next/head';
import { User } from '@/features/users/types';
import { useUserList } from '@/features/users/hooks';
import { useFavorites } from '@/features/favorites/hooks';
import SearchBar from '@/core/components/SearchBar';
import UserGrid from '@/features/users/components/UserGrid';
import styles from '@/styles/Home.module.css';
import { useState, useEffect } from 'react';

// Componente de presentación
interface FavoritesViewProps {
  users: User[];
  favorites: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
}

const FavoritesView = ({
  users,
  favorites,
  loading,
  error,
  hasMore,
  onSearch,
  onLoadMore
}: FavoritesViewProps) => {
  return (
    <>
      <Head>
        <title>Favoritos | GitHub Explorer</title>
        <meta name="description" content="¡Explora usuarios y haz clic en el icono de corazón para agregarlos a tus favoritos!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Mis favoritos</h1>
          <SearchBar onSearch={onSearch} placeholder="Buscar en favoritos..." />
        </header>

        {favorites.length === 0 && !loading && !error && (
          <div className={styles.emptyState}>
            <p>No tienes favoritos aún.</p>
            <p>Explora usuarios y haz clic en el icono de corazón para agregarlos a tus favoritos.</p>
          </div>
        )}

        <UserGrid 
          users={users} 
          loading={loading}
          error={error || undefined}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        />
      </div>
    </>
  );
};

// Componente contenedor principal
export default function FavoritesPage() {
  const { favorites, isLoading: isFavoritesLoading, isInitialized } = useFavorites();
  
  const {
    users,
    loading,
    searchUsers,
    loadMoreUsers,
    hasMore,
    error
  } = useUserList({ favorites, showFavorites: true });

  // Reset search when favorites change
  useEffect(() => {
    if (isInitialized) {
      searchUsers('');
    }
  }, [favorites, isInitialized, searchUsers]);

  const handleSearch = (query: string) => {
    searchUsers(query);
  };

  if (!isInitialized || isFavoritesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  // Pasar props al componente de presentación
  return (
    <FavoritesView
      users={users}
      favorites={favorites}
      loading={loading}
      error={error ? error.message : null}
      hasMore={hasMore}
      onSearch={handleSearch}
      onLoadMore={loadMoreUsers}
    />
  );
} 