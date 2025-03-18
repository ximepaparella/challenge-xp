# GitHub API Integration Documentation

This document provides a comprehensive overview of how the GitHub Explorer application integrates with the GitHub API, including endpoints used, authentication methods, and our service layer implementation.

## GitHub API Overview

The application integrates with the following GitHub API endpoints:

| Endpoint | Description | Used For |
|----------|-------------|----------|
| `GET /users` | List GitHub users | Initial user listing and pagination |
| `GET /search/users?q={query}` | Search for users | User search functionality |
| `GET /users/{username}` | Get a single user | User profile details |
| `GET /users/{username}/repos` | List a user's repositories | User repositories display |
| `GET /users/{username}/followers` | List a user's followers | User followers display |
| `GET /users/{username}/following` | List who a user follows | User following display |

## Authentication

The application supports two methods for GitHub API authentication:

1. **Personal Access Token (PAT)**: 
   - Stored in environment variable `NEXT_PUBLIC_GITHUB_TOKEN`
   - Or stored in localStorage under key `github_token`
   - Provides higher rate limits (5000 requests/hour vs 60 requests/hour unauthenticated)

2. **Unauthenticated Requests**:
   - Used as fallback when no token is available
   - Subject to lower rate limits
   - May trigger the application to switch to mock data when limits are exceeded

## Service Layer

The GithubService class encapsulates all GitHub API interactions, providing a clean interface for the rest of the application.

### GithubService Interface

```typescript
interface GithubService {
  searchUsers(query: string, page?: number, perPage?: number): Promise<GithubSearchResult>;
  getUser(username: string): Promise<User>;
  getUserRepos(username: string): Promise<Repository[]>;
  getUsers(since?: number, perPage?: number): Promise<User[]>;
  getUserFollowers(username: string): Promise<User[]>;
  getUserFollowing(username: string): Promise<User[]>;
}
```

### Implementation Details

The GithubService is implemented with the following features:

#### Error Handling

- Catches and processes HTTP errors
- Falls back to mock data when API limits are exceeded or network errors occur
- Provides informative error messages for debugging

#### Caching

- Integrates with the application's caching system
- Avoids redundant API calls for frequently accessed data
- Improves performance and reduces API usage

#### Request Deduplication

- Prevents duplicate calls for the same data
- Shares responses for identical concurrent requests
- Manages cooldown periods for failed requests

### Usage Example

```typescript
// Initialization
const githubService = new GithubService(apiClient);

// Searching users
const searchResults = await githubService.searchUsers('react', 1, 10);
// Returns { items: User[], total_count: number, incomplete_results: boolean }

// Getting a specific user
const user = await githubService.getUser('octocat');
// Returns User object with detailed profile information

// Getting user repositories
const repos = await githubService.getUserRepos('octocat');
// Returns array of Repository objects
```

## Rate Limiting and Fallback Strategy

The GitHub API has rate limits that can affect application functionality:

- **Authenticated**: 5,000 requests per hour
- **Unauthenticated**: 60 requests per hour

### Rate Limit Handling

The application implements several strategies to handle rate limits:

1. **Caching**: Reduces the number of API calls by reusing previously fetched data
2. **Deduplication**: Prevents redundant API calls for the same data
3. **Mock Data Fallback**: Switches to mock data when rate limits are exceeded
4. **Exponential Backoff**: Retries failed requests with increasing delays
5. **User Feedback**: Informs the user when rate limits are affecting functionality

### Mock Data System

When API limits are exceeded or network errors occur, the application falls back to a mock data system that:

- Provides realistic stand-in data for development and testing
- Allows the application to function even when API access is limited
- Generates dynamic profiles for any requested username

## GitHub API Type Definitions

The application uses TypeScript interfaces to define the structure of GitHub API responses:

```typescript
interface User {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
  topics: string[];
}

interface GithubSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
}
```

## Error Handling

The service layer implements comprehensive error handling:

- **Network Errors**: Detected and handled with appropriate user feedback
- **Rate Limiting**: Detected via HTTP 403 responses with specific headers
- **Not Found**: Handled gracefully for non-existent users
- **Service Unavailable**: Implements retry logic with exponential backoff
- **Unexpected Errors**: Caught and logged with appropriate abstractions 