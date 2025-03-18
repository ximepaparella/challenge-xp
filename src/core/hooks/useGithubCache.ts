import { useCallback, useMemo, useEffect } from 'react';

// Configuración de caché
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos por defecto
const MAX_CACHE_ITEMS = 50; // Incrementado el máximo número de items en caché
const CACHE_CLEANUP_INTERVAL = 30000; // 30 segundos entre limpiezas

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface CacheState {
  [key: string]: CacheItem<unknown>;
}

/**
 * Hook que proporciona funciones para manejar el caché de los datos de GitHub.
 * Permite almacenar y recuperar datos con un tiempo de expiración.
 */
export function useGithubCache(expirationTime = DEFAULT_CACHE_DURATION) { // Vuelto a 5 minutos
  // Utilizamos useMemo para garantizar que el objeto de caché es el mismo entre renderizaciones
  const cache = useMemo<CacheState>(() => ({}), []);
  
  // Limpia entradas antiguas del caché
  const cleanCache = useCallback(() => {
    const now = Date.now();
    const keys = Object.keys(cache);
    
    if (keys.length === 0) return; // No hacer nada si el caché está vacío
    
    console.log(`useGithubCache.cleanCache - Limpiando caché, ${keys.length} entradas`);
    
    // Eliminar entradas expiradas
    let expiredCount = 0;
    keys.forEach(key => {
      const item = cache[key];
      if (now - item.timestamp > expirationTime) {
        console.log(`useGithubCache.cleanCache - Eliminando entrada expirada: ${key}`);
        delete cache[key];
        expiredCount++;
      }
    });
    
    // Solo si hay demasiadas entradas después de eliminar las expiradas
    if (expiredCount === 0 && keys.length > MAX_CACHE_ITEMS) {
      console.log(`useGithubCache.cleanCache - Demasiadas entradas (${keys.length}), eliminando antiguas`);
      
      const sortedEntries = keys
        .map(key => cache[key])
        .sort((a, b) => a.timestamp - b.timestamp);
      
      const toRemove = sortedEntries.slice(0, sortedEntries.length - MAX_CACHE_ITEMS);
      toRemove.forEach(item => {
        console.log(`useGithubCache.cleanCache - Eliminando entrada antigua: ${item.key}`);
        delete cache[item.key];
      });
    }
  }, [cache, expirationTime]);
  
  // Limpia el caché periódicamente, pero con menos frecuencia
  useEffect(() => {
    // Usamos un intervalo fijo más largo, independiente del tiempo de expiración
    const interval = setInterval(cleanCache, CACHE_CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, [cleanCache]);

  /**
   * Obtiene datos del caché si existen y no han expirado
   */
  const getCachedData = useCallback(<T>(key: string): T | null => {
    const cachedItem = cache[key];
    if (!cachedItem) return null;
    
    const now = Date.now();
    const isExpired = now - cachedItem.timestamp > expirationTime;
    
    if (isExpired) {
      console.log(`useGithubCache.getCachedData - Caché expirado para: ${key}`);
      delete cache[key];
      return null;
    }
    
    console.log(`useGithubCache.getCachedData - Usando caché para: ${key}`);
    return cachedItem.data as T;
  }, [cache, expirationTime]);

  /**
   * Almacena datos en el caché con la marca de tiempo actual
   */
  const setCachedData = useCallback(<T>(key: string, data: T): void => {
    console.log(`useGithubCache.setCachedData - Guardando en caché: ${key}`);
    cache[key] = {
      data,
      timestamp: Date.now(),
      key
    };
    
    // Limpiar caché si tenemos muchísimas entradas
    if (Object.keys(cache).length > MAX_CACHE_ITEMS * 1.5) {
      cleanCache();
    }
  }, [cache, cleanCache]);

  /**
   * Elimina un elemento específico del caché
   */
  const removeCachedData = useCallback((key: string): void => {
    delete cache[key];
  }, [cache]);

  /**
   * Limpia todo el caché
   */
  const clearCache = useCallback((): void => {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }, [cache]);

  return {
    getCachedData,
    setCachedData,
    removeCachedData,
    clearCache
  };
} 