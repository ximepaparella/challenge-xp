import { apiFetch } from '@/core/api/client';
import { User, Repository, GithubSearchResult } from '../types';
import { 
  getMockGithubUsers, 
  searchMockGithubUsers,
  getMockGithubUser,
  getMockGithubUserRepositories
} from '@/mockups/api';

// Constantes para cuando no se use apiFetch
// const BASE_URL = 'https://api.github.com';

// Helper para headers cuando no se use apiFetch
// const getHeaders = (): Record<string, string> => {
//   if (TOKEN) {
//     return {
//       Authorization: `token ${TOKEN}`,
//       'Content-Type': 'application/json',
//     };
//   }
//   return {
//     'Content-Type': 'application/json',
//   };
// };

/**
 * Service for GitHub API operations with fallback to mock data when rate limited
 */
export const GithubService = {
  /**
   * Fetch user profile by username
   */
  getUser: async (username: string): Promise<User> => {
    try {
      const user = await apiFetch<User>(`users/${username}`);
      if (!user) {
        throw new Error(`User ${username} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user ${username}:`, error);
      const mockUser = await getMockGithubUser(username);
      if (mockUser) {
        return mockUser;
      }
      throw new Error(`User ${username} not found`);
    }
  },
  
  /**
   * Fetch user repositories
   */
  getUserRepos: async (username: string, page = 1, perPage = 10): Promise<Repository[]> => {
    try {
      return await apiFetch<Repository[]>(`users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`);
    } catch (error) {
      console.error(`Error fetching repositories for user ${username}:`, error);
      return getMockGithubUserRepositories(username, page, perPage);
    }
  },
  
  /**
   * Get all users (paginated)
   */
  getUsers: async (since = 0, perPage = 10): Promise<User[]> => {
    try {
      return await apiFetch<User[]>(`users?since=${since}&per_page=${perPage}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      return getMockGithubUsers();
    }
  },
  
  /**
   * Search users by query
   * If query is empty, falls back to regular users endpoint
   */
  searchUsers: async (query: string, page = 1, perPage = 10): Promise<GithubSearchResult> => {
    try {
      if (!query.trim()) {
        // For empty queries, use the regular users endpoint
        const users = await GithubService.getUsers(page > 1 ? (page - 1) * perPage : 0, perPage);
        
        // Format the response like a search result
        return {
          total_count: 1000, // GitHub doesn't provide a total, estimate high
          incomplete_results: false,
          items: users
        };
      }
      
      // For non-empty queries, use the search endpoint
      return await apiFetch<GithubSearchResult>(
        `search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
      );
    } catch (error) {
      console.error(`Error searching users with query "${query}":`, error);
      return searchMockGithubUsers(query);
    }
  }
};

/**
 * Fetches a user's profile data from the GitHub API (Alternative implementation)
 * Falls back to mock data when rate limited (403 response)
 * @param username - The GitHub username to fetch
 * @returns Promise with user data
 * @deprecated Use GithubService.getUser instead
 */
export const getUserProfile = async (username: string): Promise<User> => {
  try {
    return await GithubService.getUser(username);
  } catch (error) {
    // For compatibility
    const mockUser = await getMockGithubUser(username);
    if (mockUser) {
      return mockUser;
    }
    throw error;
  }
};

/**
 * Fetches a user's repositories from the GitHub API (Alternative implementation)
 * Falls back to mock data when rate limited (403 response)
 * @param username - The GitHub username to fetch repositories for
 * @param page - Page number for pagination
 * @param perPage - Number of repositories per page
 * @returns Promise with array of repositories
 * @deprecated Use GithubService.getUserRepos instead
 */
export const getUserRepositories = async (
  username: string,
  page = 1,
  perPage = 10
): Promise<Repository[]> => {
  return GithubService.getUserRepos(username, page, perPage);
}; 