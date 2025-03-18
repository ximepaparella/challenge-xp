import { useUserList } from '@/features/users/hooks';
import { useFavorites } from '@/features/favorites/hooks';
import { HomeView } from '@/features/home/components';

// Main container component
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

  // Pass props to the presentation component
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
