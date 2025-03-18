import Head from 'next/head';
import { User } from '@/features/users/types';
import SearchBar from '@/core/components/SearchBar';
import UserGrid from '@/features/users/components/UserGrid';
import styles from '@/styles/Home.module.css';

export interface HomeViewProps {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
}

/**
 * Presentation component for the main page
 * Only responsible for rendering and contains no business logic
 */
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
        <title>Buscar usuarios | GitHub Explorer</title>
        <meta name="description" content="Buscar usuarios y sus repositorios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Buscar usuarios</h1>
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

export default HomeView; 