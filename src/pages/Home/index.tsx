import { useUserList } from '@/features/users/hooks';
import { useFavorites } from '@/features/favorites/hooks';
import HomeView from './HomeView';

/**
 * Componente contenedor para la página principal
 * Se encarga de la lógica de negocio y proporciona los datos al componente de presentación
 */
const Home = () => {
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
};

export default Home; 