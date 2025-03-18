import { useCallback, useRef, useState, useEffect } from 'react';

interface RetryOptions {
  /** Número máximo de intentos de reintento */
  maxRetryAttempts?: number;
  /** Intervalo base para el backoff exponencial (ms) */
  baseRetryInterval?: number;
  /** Intervalo máximo para el backoff (ms) */
  maxRetryInterval?: number;
  /** Callback que se ejecuta cuando se inicia un reintento */
  onRetry?: (attempt: number, error: Error, backoffTime: number) => void;
}

interface RetryState {
  /** Conteo de errores de red consecutivos */
  errorCount: number;
  /** Timestamp del último error */
  lastErrorTimestamp: number;
  /** Error actual (si hay alguno) */
  error: Error | null;
  /** Si estamos en periodo de cooldown */
  isInCooldown: boolean;
}

/**
 * Hook que proporciona una estrategia de reintento con backoff exponencial
 * para peticiones a la API que fallan.
 */
export function useRetryStrategy({
  maxRetryAttempts = 3,
  baseRetryInterval = 1000,
  maxRetryInterval = 30000,
  onRetry
}: RetryOptions = {}) {
  // Estado para manejar el estado de reintento
  const [retryState, setRetryState] = useState<RetryState>({
    errorCount: 0,
    lastErrorTimestamp: 0,
    error: null,
    isInCooldown: false
  });
  
  // Referencias para manejar timeouts
  const retryTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  /**
   * Limpia todos los timeouts pendientes
   */
  const cleanup = useCallback((): void => {
    retryTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    retryTimeoutsRef.current = [];
  }, []);
  
  /**
   * Calcula el tiempo de backoff basado en el número de intentos
   */
  const calculateBackoffTime = useCallback((errorCount: number): number => {
    // Backoff exponencial con jitter para evitar thundering herd
    const expBackoff = baseRetryInterval * Math.pow(2, Math.min(errorCount - 1, 10));
    const jitter = Math.random() * 0.3 * expBackoff; // 30% jitter
    return Math.min(expBackoff + jitter, maxRetryInterval);
  }, [baseRetryInterval, maxRetryInterval]);
  
  /**
   * Maneja un error y potencialmente programa un reintento
   */
  const handleError = useCallback((error: Error, skipRetry = false): void => {
    cleanup(); // Limpiar timeouts anteriores
    
    setRetryState(prev => {
      const newErrorCount = prev.errorCount + 1;
      const now = Date.now();
      
      // No reintentar si se solicita explícitamente o si hemos excedido los intentos
      if (!skipRetry && newErrorCount <= maxRetryAttempts) {
        // Calcular el tiempo de backoff
        const backoffTime = calculateBackoffTime(newErrorCount);
        
        // Notificar del reintento si hay un callback
        if (onRetry) {
          onRetry(newErrorCount, error, backoffTime);
        }
        
        // Programar el fin del período de cooldown
        const timeoutId = setTimeout(() => {
          setRetryState(prev => ({
            ...prev,
            isInCooldown: false
          }));
        }, backoffTime);
        
        // Guardar el timeout para limpieza
        retryTimeoutsRef.current = [timeoutId];
      }
      
      return {
        errorCount: newErrorCount,
        lastErrorTimestamp: now,
        error,
        isInCooldown: true
      };
    });
  }, [cleanup, calculateBackoffTime, maxRetryAttempts, onRetry]);
  
  /**
   * Reinicia el estado de reintento
   */
  const resetRetryState = useCallback((): void => {
    cleanup();
    setRetryState({
      errorCount: 0,
      lastErrorTimestamp: 0,
      error: null,
      isInCooldown: false
    });
  }, [cleanup]);
  
  /**
   * Ejecuta una función con reintentos automáticos
   */
  const executeWithRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    attempt = 0
  ): Promise<T> => {
    try {
      const result = await fn();
      // Éxito, reiniciar el estado de error
      resetRetryState();
      return result;
    } catch (error) {
      // Manejar el error
      const actualError = error instanceof Error ? error : new Error(String(error));
      
      // Si todavía tenemos intentos disponibles, reintentar
      if (attempt < maxRetryAttempts) {
        const backoffTime = calculateBackoffTime(attempt + 1);
        
        if (onRetry) {
          onRetry(attempt + 1, actualError, backoffTime);
        }
        
        // Esperar antes de reintentar
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, backoffTime);
          retryTimeoutsRef.current.push(timeoutId);
        });
        
        // Reintentar
        return executeWithRetry(fn, attempt + 1);
      }
      
      // Sin más reintentos, actualizar estado y propagar el error
      handleError(actualError, true);
      throw actualError;
    }
  }, [calculateBackoffTime, handleError, maxRetryAttempts, onRetry, resetRetryState]);
  
  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Retornar el estado y las funciones
  return {
    retryState,
    handleError,
    resetRetryState,
    executeWithRetry
  };
} 