import { useMemo } from 'react';
import { useApiClientInstance } from '@/core/hooks/useApiClientInstance';
import { GithubService } from '../services/GithubService';

/**
 * Hook para acceder al servicio de GitHub
 * @returns Una instancia del servicio de GitHub
 */
export function useGithubService(): GithubService {
  const apiClient = useApiClientInstance();
  
  // Creamos una única instancia del servicio por componente
  const githubService = useMemo(() => {
    return new GithubService(apiClient);
  }, [apiClient]);
  
  return githubService;
} 