import { useMemo } from 'react';
import { ApiClient } from '../api/ApiClient';

const getToken = (): string | null => {
  console.log('Intentando obtener token de GitHub');
  
  // Token en localStorage (cliente)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('github_token');
    console.log('Token de localStorage:', token ? 'Encontrado' : 'No encontrado');
  }
  
  // Intentar obtener el token de las variables de entorno
  if (!token) {
    token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || null;
    console.log('Token de variables de entorno:', token ? 'Encontrado' : 'No encontrado');
  }
  
  return token;
};

export function useApiClientInstance(): ApiClient {
  const apiClient = useMemo(() => {
    return new ApiClient({
      baseUrl: 'https://api.github.com',
      tokenProvider: getToken,
      onError: (error, endpoint) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`API Error (${endpoint}):`, error);
        }
      }
    });
  }, []);
  
  return apiClient;
} 