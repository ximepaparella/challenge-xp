import { ApiClient } from '@/core/api/ApiClient';
import { MockDataService } from '@/core/services/MockDataService';
import { User, Repository, GithubSearchResult } from '@/features/users/types';

/**
 * Service for interacting with the GitHub API
 */
export class GithubService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Gets a user's details by username
   * @param username - GitHub username to fetch
   * @returns User data
   */
  async getUser(username: string): Promise<User> {
    try {
      const user = await this.apiClient.get<User>(`/users/${username}`);
      return user;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return MockDataService.getMockUser(username);
    }
  }

  /**
   * Gets a user's repositories
   * @param username - GitHub username
   * @param page - Page number for pagination
   * @param perPage - Number of items per page
   * @returns Array of repositories
   */
  async getUserRepos(username: string, page = 1, perPage = 10): Promise<Repository[]> {
    try {
      return await this.apiClient.get<Repository[]>(
        `/users/${username}/repos`,
        { params: { page, per_page: perPage, sort: 'updated' } }
      );
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return MockDataService.getMockUserRepos(username, page, perPage);
    }
  }

  /**
   * Gets a paginated list of users
   * @param since - User ID to start listing from
   * @param perPage - Number of users per page
   * @returns Array of users
   */
  async getUsers(since = 0, perPage = 10): Promise<User[]> {
    try {
      const users = await this.apiClient.get<User[]>(
        '/users',
        { params: { since, per_page: perPage } }
      );
      return users;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`GitHub API error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return MockDataService.getMockUsers(since, perPage);
    }
  }

  /**
   * Searches for GitHub users
   * @param query - Search query string
   * @param page - Page number
   * @param perPage - Number of results per page
   * @returns Search results
   */
  async searchUsers(query: string, page = 1, perPage = 10): Promise<GithubSearchResult> {
    // If the query is empty, get regular users
    if (!query.trim()) {
      try {
        // For empty searches, we calculate the starting index
        // to ensure that each page has different users
        // The index is calculated by multiplying the page number by the page size
        // minus the page size to get the start of each page (0, 10, 20, etc.)
        const sincePage = (page * perPage) - perPage;
        
        const users = await this.getUsers(sincePage, perPage);
        return {
          items: users,
          total_count: 1000, // A large number to simulate the total
          incomplete_results: false
        };
      } catch (err) {
        return MockDataService.getMockSearchResults('', page, perPage);
      }
    }

    // Normal case: search users with the query
    try {
      // Use the GitHub search API, specifying page and items per page
      const result = await this.apiClient.get<GithubSearchResult>(
        '/search/users',
        { params: { q: query, page, per_page: perPage } }
      );
      return result;
    } catch (err) {
      // Check if it's a rate limit error
      const isRateLimitError = err instanceof Error && 
        err.message.includes('rate limit');
      
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
   * Gets a user's followers
   * @param username - GitHub username
   * @param page - Page number
   * @param perPage - Number of followers per page
   * @returns Array of followers
   */
  async getUserFollowers(username: string, page = 1, perPage = 10): Promise<User[]> {
    try {
      return await this.apiClient.get<User[]>(
        `/users/${username}/followers`,
        { params: { page, per_page: perPage } }
      );
    } catch {
      // In case of error, return an empty array
      return [];
    }
  }

  /**
   * Gets users that a specific user follows
   * @param username - GitHub username
   * @param page - Page number
   * @param perPage - Number of following per page
   * @returns Array of users being followed
   */
  async getUserFollowing(username: string, page = 1, perPage = 10): Promise<User[]> {
    try {
      return await this.apiClient.get<User[]>(
        `/users/${username}/following`,
        { params: { page, per_page: perPage } }
      );
    } catch {
      // In case of error, return an empty array
      return [];
    }
  }
} 