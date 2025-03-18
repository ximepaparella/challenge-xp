import { User, Repository, GithubSearchResult } from '@/features/users/types';

/**
 * Service for providing simulated data when errors occur
 * or when test data is needed for development.
 */
export class MockDataService {
  /**
   * Generates a simulated user with random data
   * @param id - User ID to generate
   * @returns Mock user object
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
   * Generates a simulated repository with random data
   * @param id - Repository ID
   * @param owner - Repository owner username
   * @returns Mock repository object
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
   * Returns a simulated user by username
   * @param username - GitHub username to simulate
   * @returns Mock user object
   */
  static getMockUser(username: string): User {
    // Create a number based on the username to have consistent responses
    const idBase = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.generateMockUser(idBase);
  }

  /**
   * Returns a simulated list of repositories for a user
   * @param username - GitHub username
   * @param page - Page number
   * @param perPage - Repositories per page
   * @returns Array of mock repositories
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
   * Returns a simulated search result
   * @param query - Search query
   * @param page - Page number
   * @param perPage - Results per page
   * @returns Mock search results
   */
  static getMockSearchResults(query: string, page = 1, perPage = 10): GithubSearchResult {
    // If there's no query, return a list of random users
    if (!query.trim()) {
      const users = [];
      const startId = (page - 1) * perPage * 1000; // Use a large multiplier to avoid collisions
      
      for (let i = 0; i < perPage; i++) {
        users.push(this.generateMockUser(startId + i + 1));
      }
      
      return {
        total_count: 1000, // Simulate that there are many results
        incomplete_results: false,
        items: users
      };
    }
    
    // If there's a query, generate users that match the pattern
    const totalResults = Math.min(100, Math.floor(Math.random() * 200));
    const availableResults = Math.max(0, totalResults - (page - 1) * perPage);
    const resultsToReturn = Math.min(perPage, availableResults);
    
    const users = [];
    // Use a basic hash for the query to get consistent IDs based on the query
    const queryHash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startId = queryHash * 10000 + (page - 1) * perPage * 1000; // Ensure unique IDs between pages
    
    for (let i = 0; i < resultsToReturn; i++) {
      const user = this.generateMockUser(startId + i + 1);
      // Modify the login to partially match the query
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
   * Returns a simulated list of users (paginated)
   * @param since - User ID to start listing from
   * @param perPage - Users per page
   * @returns Array of mock users
   */
  static getMockUsers(since = 0, perPage = 10): User[] {
    const users = [];
    const startId = since * 1000; // Use a large multiplier to avoid collisions
    
    for (let i = 0; i < perPage; i++) {
      users.push(this.generateMockUser(startId + i + 1));
    }
    
    return users;
  }
} 