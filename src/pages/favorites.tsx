import Head from 'next/head';
import { User } from '@/features/users/types';
import { useFavorites } from '@/features/favorites/hooks';
import SearchBar from '@/core/components/SearchBar';
import UserGrid from '@/features/users/components/UserGrid';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

// Componente de presentación
interface FavoritesViewProps {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onSearch: (query: string) => void;
}

const FavoritesView = ({
  users,
  loading,
  error,
  hasMore,
  onSearch
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

        {users.length === 0 && !loading && !error && (
          <div className={styles.emptyState}>
            <p>No tienes favoritos aún.</p>
            <p>Explora usuarios y haz clic en el icono de corazón para agregarlos a tus favoritos.</p>
          </div>
        )}

        <UserGrid 
          users={users} 
          loading={loading}
          error={error || undefined}
          hasMore={false}
        />
      </div>
    </>
  );
};

// Componente contenedor principal
export default function FavoritesPage() {
  const { favorites, isLoading: isFavoritesLoading, isInitialized } = useFavorites();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter favorites based on search query
  useEffect(() => {
    if (!isInitialized) return;
    
    setLoading(true);
    
    // If no query, show all favorites
    if (!searchQuery.trim()) {
      setFilteredUsers(favorites);
      setLoading(false);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Filter favorites based on multiple fields
    const filtered = favorites.filter(user => {
      return (
        user.login.toLowerCase().includes(query) || 
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        (user.location && user.location.toLowerCase().includes(query)) ||
        (user.company && user.company.toLowerCase().includes(query))
      );
    });
    
    setFilteredUsers(filtered);
    setLoading(false);
  }, [favorites, searchQuery, isInitialized]);
  
  const handleSearch = (query: string) => {
    console.log('FavoritesPage - Searching favorites:', query);
    setSearchQuery(query);
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
      users={filteredUsers}
      loading={loading}
      error={null}
      hasMore={false}
      onSearch={handleSearch}
    />
  );
} 