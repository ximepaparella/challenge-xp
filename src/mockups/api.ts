import { User, GithubSearchResult, Repository } from '@/features/users/types';
import { getAllMockUsers, getMockUser, searchMockUsers } from './users';
import { getMockRepositories } from './repositories';

/**
 * Mock implementation of GitHub API for development when rate limits are reached
 */

/**
 * Simulates a delay to mimic network request
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock implementation of https://api.github.com/users
 * Returns a list of GitHub users
 */
export const getMockGithubUsers = async (): Promise<User[]> => {
  await delay(800); // Simulate network delay
  return getAllMockUsers();
};

/**
 * Mock implementation of https://api.github.com/search/users?q={term}
 * Searches for users matching the query
 */
export const searchMockGithubUsers = async (query: string): Promise<GithubSearchResult> => {
  await delay(1000); // Simulate network delay
  
  const users = searchMockUsers(query);
  
  return {
    total_count: users.length,
    incomplete_results: false,
    items: users
  };
};

/**
 * Mock implementation of https://api.github.com/users/{username}
 * Returns a single user's profile information - always returns a user (never null)
 */
export const getMockGithubUser = async (username: string): Promise<User> => {
  await delay(600); // Simulate network delay
  const user = getMockUser(username);
  // getMockUser now always returns a user object (using createFallbackUser when needed)
  return user as User;
};

/**
 * Mock implementation of https://api.github.com/users/{username}/repos
 * Returns repositories for a specific user
 */
export const getMockGithubUserRepositories = async (
  username: string, 
  page: number = 1, 
  perPage: number = 10
): Promise<Repository[]> => {
  await delay(800); // Simulate network delay
  
  const allRepos = getMockRepositories(username);
  
  // Calculate pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  
  return allRepos.slice(startIndex, endIndex);
}; 