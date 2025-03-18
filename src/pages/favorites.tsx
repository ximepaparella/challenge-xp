import Head from 'next/head';
import { User } from '@/features/users/types';
import { useFavorites } from '@/features/favorites/hooks';
import SearchBar from '@/core/components/SearchBar';
import UserGrid from '@/features/users/components/UserGrid';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

// Presentation component
interface FavoritesViewProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onSearch: (query: string) => void;
}

const FavoritesView = ({
  users,
  loading,
  error,
  onSearch
}: FavoritesViewProps) => {
  return (
    <>
      <Head>
        <title>Favorites | GitHub Explorer</title>
        <meta name="description" content="Explore users and click the heart icon to add them to your favorites!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>My favorites</h1>
          <SearchBar onSearch={onSearch} placeholder="Search in favorites..." />
        </header>

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

// Main container component
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
    setSearchQuery(query);
  };

  if (!isInitialized || isFavoritesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  // Pass props to the presentation component
  return (
    <FavoritesView
      users={filteredUsers}
      loading={loading}
      error={null}
      onSearch={handleSearch}
    />
  );
} 