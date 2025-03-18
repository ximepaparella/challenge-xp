import Head from 'next/head';
import { User } from '@/features/users/types';
import { useUserList } from '@/features/users/hooks';
import { useFavorites } from '@/features/favorites/hooks';
import SearchBar from '@/core/components/SearchBar';
import UserGrid from '@/features/users/components/UserGrid';
import styles from '@/styles/Home.module.css';

// Componente de presentación
interface HomeViewProps {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
}

const HomeView = ({
  users,
  loading,
  error,
  hasMore,
  onSearch,
  onLoadMore
}: HomeViewProps) => {
  return (
    <>
      <Head>
        <title>Buscar Usuarios | GitHub Explorer</title>
        <meta name="description" content="Buscar usuarios de GitHub y sus repositorios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Buscador de usuarios de GitHub</h1>
          <SearchBar onSearch={onSearch} placeholder="Buscar usuarios..." />
        </header>

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
export default function HomePage() {
  const { favorites } = useFavorites();
  
  const {
    users,
    loading,
    searchUsers,
    loadMoreUsers,
    hasMore,
    error
  } = useUserList({ favorites, showFavorites: false });

  const handleSearch = (query: string) => {
    searchUsers(query);
  };

  // Pasar props al componente de presentación
  return (
    <HomeView
      users={users}
      loading={loading}
      error={error ? error.message : null}
      hasMore={hasMore}
      onSearch={handleSearch}
      onLoadMore={loadMoreUsers}
    />
  );
}
