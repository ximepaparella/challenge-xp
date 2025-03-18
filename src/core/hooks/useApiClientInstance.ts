import { useMemo } from 'react';
import { ApiClient } from '../api/ApiClient';

const getToken = (): string | null => {
  
  // Token in localStorage (client)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('github_token');
  }
  
 // Try to get the token from the environment variables
  if (!token) {
    token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || null;
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