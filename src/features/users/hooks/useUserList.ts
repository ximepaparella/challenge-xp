import { useCallback, useEffect, useRef, useState } from 'react';
import { User, GithubSearchResult } from '../types';
import { useGithubService } from './useGithubService';
import { useGithubCache, useDeduplication, useRetryStrategy, usePagination } from '@/core/hooks';

interface UseUserListProps {
  favorites?: User[];
  showFavorites?: boolean;
}

interface UseUserListReturn {
  users: User[];
  loading: boolean;
  searchUsers: (query: string) => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  hasMore: boolean;
  error: Error | null;
}

/**
 * Hook para administrar la lista de usuarios de GitHub
 */
export function useUserList({
  favorites = [],
  showFavorites = false
}: UseUserListProps = {}): UseUserListReturn {
  // Estado para controlar la consulta de búsqueda
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Referencias para seguimiento del estado del componente
  const isMountedRef = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Bandera para controlar si ya se ha realizado la carga inicial
  const isFirstMountRef = useRef(true);
  
  // Hooks refactorizados
  const githubService = useGithubService();
  const cache = useGithubCache();
  const deduplication = useDeduplication();
  const retryStrategy = useRetryStrategy({
    maxRetryAttempts: 2,
    onRetry: (attempt, error, backoffTime) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Retrying after error (attempt ${attempt}) in ${backoffTime}ms: ${error.message}`);
      }
    }
  });
  
  // Función para buscar usuarios basada en el servicio de Github
  const fetchUsers = useCallback(async (
    query: string, 
    page: number,
    itemsPerPage: number
  ): Promise<GithubSearchResult> => {
    console.log('useUserList.fetchUsers - Inicio', { query, page, itemsPerPage });
    
    // Crear una clave única para esta solicitud (sin timestamp para poder reutilizar el caché)
    const cacheKey = `users_${query}_${page}_${itemsPerPage}`;
    console.log(`useUserList.fetchUsers - Usando clave de caché: ${cacheKey}`);
    
    // Verificar caché primero (para todas las páginas)
    const cachedData = cache.getCachedData<GithubSearchResult>(cacheKey);
    if (cachedData) {
      console.log(`useUserList.fetchUsers - Usando datos en caché para: ${cacheKey}`);
      return cachedData;
    }
    
    try {
      console.log('useUserList.fetchUsers - Obteniendo datos frescos');
      // Intentar obtener los datos con deduplicación
      const result = await deduplication.executeWithDeduplication<GithubSearchResult>(
        cacheKey,
        async () => {
          console.log('useUserList.fetchUsers - Ejecutando búsqueda real');
          // Si estamos mostrando favoritos, filtrarlos en lugar de llamar a la API
          if (showFavorites) {
            console.log('useUserList.fetchUsers - Usando favoritos filtrados');
            const filteredFavorites = favorites.filter(user => 
              !query || user.login.toLowerCase().includes(query.toLowerCase())
            );
            
            return {
              total_count: filteredFavorites.length,
              incomplete_results: false,
              items: filteredFavorites
            };
          }
          
          // Caso estándar: buscar usuarios a través del servicio
          console.log('useUserList.fetchUsers - Llamando a githubService.searchUsers');
          return await githubService.searchUsers(query, page, itemsPerPage);
        }
      );
      
      // Guardar el resultado en caché
      console.log(`useUserList.fetchUsers - Guardando resultado en caché (${result.items.length} items)`);
      cache.setCachedData(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('useUserList.fetchUsers - Error:', error);
      // Si estamos en cooldown, devolver un resultado vacío
      if (deduplication.isInCooldown(cacheKey)) {
        console.log('useUserList.fetchUsers - En cooldown, devolviendo resultado vacío');
        return { 
          items: [], 
          total_count: 0, 
          incomplete_results: true 
        };
      }
      
      // Propagar el error para que el hook de paginación lo maneje
      throw error;
    }
  }, [cache, deduplication, favorites, githubService, showFavorites]);
  
  // Inicializar el hook de paginación con nuestra función de búsqueda
  const pagination = usePagination<User>({
    fetchItems: async (page, itemsPerPage) => {
      try {
        const result = await fetchUsers(searchQuery, page, itemsPerPage);
        return {
          items: result.items,
          total: result.total_count
        };
      } catch (error) {
        // Manejar el error con nuestra estrategia de reintentos
        retryStrategy.handleError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    options: {
      initialPage: 1,
      itemsPerPage: 10,
      getItemId: (user: User) => user.id
    }
  });
  
  // Función para buscar usuarios (expuesta al componente)
  const searchUsers = useCallback(async (query: string) => {
    console.log(`useUserList.searchUsers - Buscando: "${query}"`);
    
    // Limpiar cualquier tiempo de espera anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Actualizar la consulta de búsqueda
    setSearchQuery(query);
    
    // Indicar que estamos cargando
    pagination.setIsLoading(true);
    
    try {
      // Si es una consulta vacía y estamos mostrando favoritos, simplemente mostrar todos
      if (showFavorites && query.trim() === '') {
        console.log('useUserList.searchUsers - Mostrando favoritos directamente');
        pagination.reset(favorites, favorites.length);
        return;
      }
      
      // Iniciar la búsqueda desde la página 1
      const result = await fetchUsers(query, 1, 10);
      
      // Actualizar la paginación con los resultados
      pagination.reset(result.items, result.total_count);
    } catch (error) {
      // Los errores ya son manejados por fetchUsers y pagination
      pagination.setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      pagination.setIsLoading(false);
    }
  }, [favorites, fetchUsers, pagination, showFavorites]);
  
  // Manejar la carga inicial
  useEffect(() => {
    // Solo hacer la carga inicial en el primer montaje y si no estamos mostrando favoritos
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      
      if (!showFavorites) {
        console.log('useUserList.useEffect - Carga inicial de usuarios');
        searchUsers('');
      } else {
        // Si estamos en la página de favoritos, usar los favoritos pasados sin hacer petición
        console.log('useUserList.useEffect - Cargando favoritos', favorites.length);
        pagination.reset(favorites, favorites.length);
      }
    }
    
    // Limpiar al desmontar
    return () => {
      console.log('useUserList.useEffect - Limpiando');
      isMountedRef.current = false;
      const currentTimeout = searchTimeoutRef.current;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      retryStrategy.cleanup();
    };
  }, [favorites, pagination, retryStrategy, searchUsers, showFavorites]);
  
  // Devolver los valores necesarios
  return {
    users: pagination.items,
    loading: pagination.isLoading,
    hasMore: pagination.hasMore,
    loadMoreUsers: pagination.loadMore,
    searchUsers,
    error: pagination.error || retryStrategy.retryState.error
  };
} 