import { ApiClient } from '@/core/api/ApiClient';
import { MockDataService } from '@/core/services/MockDataService';
import { User, Repository, GithubSearchResult } from '@/features/users/types';

/**
 * Servicio para interactuar con la API de GitHub
 */
export class GithubService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Obtiene los detalles de un usuario por su nombre de usuario
   */
  async getUser(username: string): Promise<User> {
    console.log(`GithubService.getUser - Obteniendo usuario: ${username}`);
    try {
      const user = await this.apiClient.get<User>(`/users/${username}`);
      console.log(`GithubService.getUser - Usuario obtenido: ${user.login}`);
      return user;
    } catch (error) {
      console.error(`GithubService.getUser - Error obteniendo usuario: ${username}`, error);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('Falling back to mock data...');
      }
      return MockDataService.getMockUser(username);
    }
  }

  /**
   * Obtiene los repositorios de un usuario
   */
  async getUserRepos(username: string, page = 1, perPage = 10): Promise<Repository[]> {
    try {
      return await this.apiClient.get<Repository[]>(
        `/users/${username}/repos`,
        { params: { page, per_page: perPage, sort: 'updated' } }
      );
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('Falling back to mock data...');
      }
      return MockDataService.getMockUserRepos(username, page, perPage);
    }
  }

  /**
   * Obtiene una lista paginada de usuarios
   */
  async getUsers(since = 0, perPage = 10): Promise<User[]> {
    console.log(`GithubService.getUsers - Obteniendo usuarios desde: ${since}, perPage: ${perPage}`);
    try {
      const users = await this.apiClient.get<User[]>(
        '/users',
        { params: { since, per_page: perPage } }
      );
      console.log(`GithubService.getUsers - Usuarios obtenidos: ${users.length}`);
      return users;
    } catch (error) {
      console.error('GithubService.getUsers - Error obteniendo usuarios:', error);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('Falling back to mock data...');
      }
      return MockDataService.getMockUsers(since, perPage);
    }
  }

  /**
   * Busca usuarios en GitHub
   */
  async searchUsers(query: string, page = 1, perPage = 10): Promise<GithubSearchResult> {
    console.log('GithubService.searchUsers - Inicio', { query, page, perPage });
    
    // Si la consulta está vacía, obtener usuarios regulares
    if (!query.trim()) {
      console.log('GithubService.searchUsers - Consulta vacía, obteniendo usuarios regulares');
      try {
        // Para búsquedas vacías, calculamos el índice de inicio para 
        // asegurar que cada página tiene usuarios diferentes
        // El índice se calcula multiplicando el número de página por el tamaño de página
        // y restando el tamaño de página para obtener el inicio de cada página (0, 10, 20, etc.)
        const sincePage = (page * perPage) - perPage;
        console.log(`GithubService.searchUsers - Calculando índice de inicio: ${sincePage}`);
        
        const users = await this.getUsers(sincePage, perPage);
        console.log(`GithubService.searchUsers - Usuarios obtenidos: ${users.length}`);
        return {
          items: users,
          total_count: 1000, // Un número grande para simular el total
          incomplete_results: false
        };
      } catch (error) {
        console.error('GithubService.searchUsers - Error obteniendo usuarios regulares:', error);
        return MockDataService.getMockSearchResults('', page, perPage);
      }
    }

    // Caso normal: buscar usuarios con la consulta
    console.log(`GithubService.searchUsers - Buscando usuarios con query: "${query}", página: ${page}`);
    try {
      // Usar la API de búsqueda de GitHub, especificando la página y elementos por página
      const result = await this.apiClient.get<GithubSearchResult>(
        '/search/users',
        { params: { q: query, page, per_page: perPage } }
      );
      console.log(`GithubService.searchUsers - Resultados de búsqueda obtenidos: ${result.items.length} de ${result.total_count}`);
      return result;
    } catch (error) {
      console.error('GithubService.searchUsers - Error buscando usuarios:', error);
      
      // Verificar si es un error de límite de tasa
      const isRateLimitError = error instanceof Error && 
        error.message.includes('rate limit');
      
      if (process.env.NODE_ENV !== 'production') {
        if (isRateLimitError) {
          console.warn('GitHub API rate limit exceeded. Using mock data instead.');
        } else {
          console.warn('Error fetching from GitHub API. Falling back to mock data.');
        }
      }
      
      return MockDataService.getMockSearchResults(query, page, perPage);
    }
  }

  /**
   * Obtiene los seguidores de un usuario
   */
  async getUserFollowers(username: string, page = 1, perPage = 10): Promise<User[]> {
    try {
      return await this.apiClient.get<User[]>(
        `/users/${username}/followers`,
        { params: { page, per_page: perPage } }
      );
    } catch (error) {
      // En caso de error, devolver un array vacío
      return [];
    }
  }

  /**
   * Obtiene los usuarios que sigue un usuario
   */
  async getUserFollowing(username: string, page = 1, perPage = 10): Promise<User[]> {
    try {
      return await this.apiClient.get<User[]>(
        `/users/${username}/following`,
        { params: { page, per_page: perPage } }
      );
    } catch (error) {
      // En caso de error, devolver un array vacío
      return [];
    }
  }
} 