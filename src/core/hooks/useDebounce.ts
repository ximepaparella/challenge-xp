import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Retrasa la actualización de un valor por un tiempo específico
 * Útil para retrasar búsquedas mientras el usuario escribe
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar un temporizador para actualizar el valor después del retraso especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia o el componente se desmonta
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 