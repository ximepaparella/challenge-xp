import { User, Repository, GithubSearchResult } from '@/features/users/types';

/**
 * Servicio para proporcionar datos simulados cuando se producen errores
 * o cuando se necesitan datos de prueba para desarrollo.
 */
export class MockDataService {
  /**
   * Genera un usuario simulado con datos aleatorios
   */
  private static generateMockUser(id: number): User {
    const login = `user_${id}`;
    return {
      login,
      id,
      avatar_url: `https://avatars.githubusercontent.com/u/${id}?v=4`,
      html_url: `https://github.com/${login}`,
      name: Math.random() > 0.5 ? `User ${id}` : null,
      company: Math.random() > 0.7 ? 'GitHub Inc.' : null,
      blog: Math.random() > 0.6 ? `https://${login}.github.io` : null,
      location: Math.random() > 0.6 ? ['San Francisco', 'New York', 'London', 'Tokyo'][Math.floor(Math.random() * 4)] : null,
      email: Math.random() > 0.8 ? `${login}@example.com` : null,
      bio: Math.random() > 0.6 ? `Bio for ${login}` : null,
      twitter_username: Math.random() > 0.7 ? login : null,
      public_repos: Math.floor(Math.random() * 50),
      public_gists: Math.floor(Math.random() * 20),
      followers: Math.floor(Math.random() * 1000),
      following: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000000).toISOString()
    };
  }

  /**
   * Genera un repositorio simulado con datos aleatorios
   */
  private static generateMockRepo(id: number, owner: string): Repository {
    const name = `repo_${id}`;
    return {
      id,
      name,
      full_name: `${owner}/${name}`,
      owner: {
        login: owner,
        avatar_url: `https://avatars.githubusercontent.com/u/${1000 + id}?v=4`,
        html_url: `https://github.com/${owner}`
      },
      html_url: `https://github.com/${owner}/${name}`,
      description: `This is a mock repository ${id}`,
      language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Rust', 'Go'][Math.floor(Math.random() * 7)],
      stargazers_count: Math.floor(Math.random() * 1000),
      forks_count: Math.floor(Math.random() * 500)
    };
  }

  /**
   * Devuelve un usuario simulado por nombre de usuario
   */
  static getMockUser(username: string): User {
    // Crear un número basado en el username para tener respuestas consistentes
    const idBase = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.generateMockUser(idBase);
  }

  /**
   * Devuelve una lista simulada de repositorios para un usuario
   */
  static getMockUserRepos(username: string, page = 1, perPage = 10): Repository[] {
    const repos = [];
    const startIndex = (page - 1) * perPage;
    
    for (let i = 0; i < perPage; i++) {
      repos.push(this.generateMockRepo(startIndex + i + 1, username));
    }
    
    return repos;
  }

  /**
   * Devuelve un resultado de búsqueda simulado
   */
  static getMockSearchResults(query: string, page = 1, perPage = 10): GithubSearchResult {
    // Si no hay query, devolvemos una lista de usuarios aleatorios
    if (!query.trim()) {
      const users = [];
      const startId = (page - 1) * perPage * 1000; // Utilizar un multiplicador grande para evitar colisiones
      
      for (let i = 0; i < perPage; i++) {
        users.push(this.generateMockUser(startId + i + 1));
      }
      
      return {
        total_count: 1000, // Simulamos que hay muchos resultados
        incomplete_results: false,
        items: users
      };
    }
    
    // Si hay query, generamos usuarios que coincidan con el patrón
    const totalResults = Math.min(100, Math.floor(Math.random() * 200));
    const availableResults = Math.max(0, totalResults - (page - 1) * perPage);
    const resultsToReturn = Math.min(perPage, availableResults);
    
    const users = [];
    // Usar un hash básico para la consulta para obtener IDs consistentes basados en la consulta
    const queryHash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startId = queryHash * 10000 + (page - 1) * perPage * 1000; // Asegurar IDs únicos entre páginas
    
    for (let i = 0; i < resultsToReturn; i++) {
      const user = this.generateMockUser(startId + i + 1);
      // Modificar el login para que coincida parcialmente con la query
      user.login = `${query}_user_${i + 1}`;
      users.push(user);
    }
    
    return {
      total_count: totalResults,
      incomplete_results: false,
      items: users
    };
  }

  /**
   * Devuelve una lista simulada de usuarios (paginada)
   */
  static getMockUsers(since = 0, perPage = 10): User[] {
    const users = [];
    const startId = since * 1000; // Usar un multiplicador grande para evitar colisiones
    
    for (let i = 0; i < perPage; i++) {
      users.push(this.generateMockUser(startId + i + 1));
    }
    
    return users;
  }
} 