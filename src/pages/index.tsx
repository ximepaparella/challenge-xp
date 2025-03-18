import { useUserList } from '@/features/users/hooks';
import { useFavorites } from '@/features/favorites/hooks';
import HomeView from '@/components/Home/HomeView';

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
