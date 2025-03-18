import { useCallback, useMemo, useRef } from 'react';

interface PendingRequests {
  [key: string]: Promise<unknown>;
}

interface RequestTimestamps {
  [key: string]: number;
}

interface UseDeduplicationOptions {
  /** Tiempo de cooldown entre peticiones duplicadas (ms) */
  cooldownTime?: number;
}

/**
 * Hook que proporciona funcionalidad para deduplicar peticiones a la API
 * y gestionar periodos de cooldown para evitar sobrecarga.
 */
export function useDeduplication({ cooldownTime = 2000 }: UseDeduplicationOptions = {}) {
  // Referencias para los registros de peticiones en curso y tiempos
  const pendingRequestsRef = useRef<PendingRequests>({});
  const lastRequestTimestampsRef = useRef<RequestTimestamps>({});

  // Garantizamos que los objetos no cambian entre renders
  const pendingRequests = useMemo(() => pendingRequestsRef.current, []);
  const lastRequestTimestamps = useMemo(() => lastRequestTimestampsRef.current, []);

  /**
   * Verifica si hay una solicitud en curso para la clave especificada
   */
  const hasPendingRequest = useCallback((requestKey: string): boolean => {
    return !!pendingRequests[requestKey];
  }, [pendingRequests]);

  /**
   * Verifica si estamos en un período de cooldown para la clave especificada
   */
  const isInCooldown = useCallback((requestKey: string): boolean => {
    const lastRequestTime = lastRequestTimestamps[requestKey] || 0;
    const now = Date.now();
    return now - lastRequestTime < cooldownTime;
  }, [cooldownTime, lastRequestTimestamps]);

  /**
   * Ejecuta una función con deduplicación para evitar llamadas simultáneas
   */
  const executeWithDeduplication = useCallback(async <T,>(
    requestKey: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    console.log(`useDeduplication.executeWithDeduplication - Inicio [${requestKey}]`);
    
    // Si ya hay una petición en curso para esta clave, devolver la promesa existente
    if (requestKey in pendingRequests) {
      console.log(`useDeduplication.executeWithDeduplication - Petición en curso, reutilizando [${requestKey}]`);
      return pendingRequests[requestKey] as Promise<T>;
    }

    // Verificar si estamos en período de cooldown
    if (isInCooldown(requestKey)) {
      console.log(`useDeduplication.executeWithDeduplication - En cooldown [${requestKey}]`);
      throw new Error(`Request on cooldown for: ${requestKey}`);
    }

    // Ejecutar la solicitud y almacenar la promesa
    try {
      console.log(`useDeduplication.executeWithDeduplication - Ejecutando nueva petición [${requestKey}]`);
      // Crear una promesa y almacenarla
      const promise = requestFn();
      pendingRequests[requestKey] = promise;
      
      // Registrar el tiempo de esta solicitud
      lastRequestTimestamps[requestKey] = Date.now();
      
      // Esperar por el resultado
      const result = await promise;
      console.log(`useDeduplication.executeWithDeduplication - Petición completada [${requestKey}]`);
      return result;
    } catch (error) {
      console.error(`useDeduplication.executeWithDeduplication - Error [${requestKey}]:`, error);
      throw error;
    } finally {
      // Limpiar la referencia una vez completada (éxito o error)
      console.log(`useDeduplication.executeWithDeduplication - Limpiando referencia [${requestKey}]`);
      delete pendingRequests[requestKey];
    }
  }, [isInCooldown, lastRequestTimestamps, pendingRequests]);

  /**
   * Limpia manualmente las referencias a una petición específica
   */
  const clearRequest = useCallback((requestKey: string): void => {
    delete pendingRequests[requestKey];
  }, [pendingRequests]);

  /**
   * Limpia todos los registros de peticiones
   */
  const clearAllRequests = useCallback((): void => {
    Object.keys(pendingRequests).forEach(key => {
      delete pendingRequests[key];
    });
  }, [pendingRequests]);

  return {
    executeWithDeduplication,
    hasPendingRequest,
    isInCooldown,
    clearRequest,
    clearAllRequests
  };
} 