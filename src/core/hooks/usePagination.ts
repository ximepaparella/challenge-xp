import { useCallback, useState } from 'react';

interface PaginationOptions<T> {
  /** Página inicial para comenzar la paginación */
  initialPage?: number;
  /** Número de elementos por página */
  itemsPerPage?: number;
  /** Función para determinar el identificador único de un elemento */
  getItemId?: (item: T) => string | number;
}

interface UsePaginationProps<T> {
  /** Función que obtiene los elementos para una página específica */
  fetchItems: (page: number, itemsPerPage: number) => Promise<{
    items: T[];
    total?: number;
  }>;
  /** Opciones de configuración para la paginación */
  options?: PaginationOptions<T>;
}

/**
 * Hook que maneja la lógica de paginación para listas de datos.
 * Gestiona el estado de carga, errores y mantiene la lista de elementos.
 */
export function usePagination<T>({
  fetchItems,
  options = {}
}: UsePaginationProps<T>) {
  const {
    initialPage = 1,
    itemsPerPage = 10,
    getItemId = (item: T) => (item as { id: string | number }).id // Por defecto, usamos la propiedad id
  } = options;

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  /**
   * Reestablece la paginación con un nuevo conjunto de elementos
   */
  const reset = useCallback((newItems: T[], newTotal?: number) => {
    console.log(`usePagination.reset - Reiniciando con ${newItems.length} elementos${newTotal ? `, total: ${newTotal}` : ''}`);
    setItems(newItems);
    setCurrentPage(initialPage);
    setError(null);
    
    // Actualizar el total de elementos si se proporciona
    if (newTotal !== undefined) {
      setTotalItems(newTotal);
      // Si ya tenemos todos los elementos, no hay más para cargar
      setHasMore(newItems.length < newTotal);
    } else {
      // Si no conocemos el total, asumimos que hay más si tenemos una página completa
      setHasMore(newItems.length >= itemsPerPage);
    }
  }, [initialPage, itemsPerPage]);

  /**
   * Deduplicar elementos usando la función getItemId
   */
  const deduplicateItems = useCallback((currentItems: T[], newItems: T[]): T[] => {
    // Crear un mapa con los IDs de los elementos actuales
    const existingIds = new Set(currentItems.map(item => getItemId(item)));
    
    // Filtrar elementos nuevos que no existan ya
    const uniqueNewItems = newItems.filter(item => !existingIds.has(getItemId(item)));
    
    // Combinar los arrays
    return [...currentItems, ...uniqueNewItems];
  }, [getItemId]);

  /**
   * Carga la siguiente página de elementos
   */
  const loadMore = useCallback(async () => {
    console.log('usePagination.loadMore - Inicio', { currentPage, isLoading, hasMore });
    
    if (isLoading) {
      console.log('usePagination.loadMore - Ya está cargando, cancelando');
      return;
    }
    
    if (!hasMore) {
      console.log('usePagination.loadMore - No hay más elementos, cancelando');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      console.log(`usePagination.loadMore - Cargando página ${nextPage}`);
      
      const result = await fetchItems(nextPage, itemsPerPage);
      console.log(`usePagination.loadMore - Resultado obtenido, items: ${result.items.length}, total: ${result.total}`);
      
      // Verificar si realmente recibimos nuevos elementos
      if (result.items.length === 0) {
        console.log('usePagination.loadMore - No se recibieron nuevos elementos, estableciendo hasMore=false');
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      // Deduplicar elementos antes de actualizar
      const newItems = deduplicateItems(items, result.items);
      console.log(`usePagination.loadMore - Después de deduplicar: ${newItems.length} items (${newItems.length - items.length} nuevos)`);
      
      // Si después de deduplicar no hay elementos nuevos, probablemente no hay más para cargar
      if (newItems.length === items.length) {
        console.log('usePagination.loadMore - No hay elementos nuevos después de deduplicar, estableciendo hasMore=false');
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      // Actualizar la lista de elementos
      setItems(newItems);
      
      // Actualizar la página actual
      setCurrentPage(nextPage);
      
      // Actualizar si hay más elementos
      if (result.total !== undefined) {
        setTotalItems(result.total);
        // Usar la longitud total de items después de la actualización
        const moreAvailable = newItems.length < result.total;
        console.log(`usePagination.loadMore - Hay más elementos disponibles: ${moreAvailable} (${newItems.length}/${result.total})`);
        setHasMore(moreAvailable);
      } else {
        // Si no conocemos el total, asumimos que hay más si recibimos una página completa
        // Y si obtuvimos elementos únicos nuevos
        const uniqueNewItemsCount = newItems.length - items.length;
        const moreAvailable = uniqueNewItemsCount > 0 && result.items.length >= itemsPerPage;
        console.log(`usePagination.loadMore - Hay más elementos disponibles: ${moreAvailable} (basado en ${uniqueNewItemsCount} nuevos elementos)`);
        setHasMore(moreAvailable);
      }
    } catch (err) {
      console.error('usePagination.loadMore - Error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      console.log('usePagination.loadMore - Finalizado');
      setIsLoading(false);
    }
  }, [currentPage, fetchItems, hasMore, isLoading, itemsPerPage, items, deduplicateItems]);

  /**
   * Recarga la página actual
   */
  const reload = useCallback(async (initialItems?: T[]) => {
    console.log('usePagination.reload - Iniciando recarga');
    
    // Si se proporcionan elementos iniciales, simplemente actualizar el estado sin hacer petición
    if (initialItems && initialItems.length > 0) {
      console.log(`usePagination.reload - Usando ${initialItems.length} elementos proporcionados`);
      setItems(initialItems);
      setCurrentPage(initialPage);
      setError(null);
      
      // Si conocemos el total, actualizar hasMore
      if (initialItems.length < (totalItems || Infinity)) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      return;
    }
    
    // Si no hay elementos proporcionados, hacer una petición
    setIsLoading(true);
    setError(null);

    try {
      console.log('usePagination.reload - Cargando datos nuevos');
      const result = await fetchItems(initialPage, itemsPerPage);
      
      // Reestablecer los elementos
      setItems(result.items);
      setCurrentPage(initialPage);
      
      // Actualizar estado de paginación
      if (result.total !== undefined) {
        setTotalItems(result.total);
        setHasMore(result.items.length < result.total);
      } else {
        setHasMore(result.items.length >= itemsPerPage);
      }
    } catch (err) {
      console.error('usePagination.reload - Error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems, initialPage, itemsPerPage, totalItems]);

  return {
    // Estado
    items,
    currentPage,
    isLoading,
    error,
    hasMore,
    totalItems,
    
    // Acciones
    loadMore,
    reload,
    reset,
    
    // Setters (para control adicional desde componentes)
    setHasMore,
    setIsLoading,
    setError,
    setCurrentPage,
    setTotalItems,
    setItems
  };
} 