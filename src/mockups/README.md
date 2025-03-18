# GitHub API Mockups

This directory contains mock data and API implementations for local development when GitHub API rate limits are reached.

## Purpose

GitHub's API has rate limits that can be quickly exhausted during development. When this happens, the application will automatically fall back to these mock implementations to allow continued development and testing without interruption.

## How It Works

1. When the GitHub API returns a 403 (rate limit exceeded) or 401 (unauthorized) response, the application detects this and automatically switches to using mock data.
2. Mock data is also used as a fallback for network errors or other API failures.
3. The mock system adds random delays to API calls to simulate network latency for a more realistic experience.
4. If a requested username isn't in our predefined mock data, the system **automatically generates** realistic fallback data for that username, ensuring the application always has data to work with.

## Available Mock Endpoints

The mock system provides fallback implementations for these GitHub API endpoints:

- `GET /users` - List GitHub users
- `GET /users/{username}` - Get a specific user's profile
- `GET /users/{username}/repos` - Get repositories for a specific user
- `GET /search/users?q={query}` - Search for users matching a query

## Mock Data Structure

- `users/index.ts` - Contains mock user profiles and functions to generate fallback users
- `repositories/index.ts` - Contains mock repository data and functions to generate fallback repositories
- `api.ts` - Implements the mock API services with simulated network delays

## Dynamic Fallback Data

A key feature of this mock system is the ability to generate dynamic fallback data for any requested username:

- For users not in our predefined list, the system generates a realistic user profile
- Repository data is also dynamically generated for these users
- The generated data is deterministic based on the username, so the same username will always generate the same mock data

## Using Mock Data Explicitly

While the system automatically falls back to mock data when needed, you can also explicitly use mock data by importing from the mockups directly:

```typescript
import { getMockGithubUser } from '@/mockups/api';

// Get a mock user profile for any username
const user = await getMockGithubUser('any-username-here');
```

## Extending Mock Data

To add more predefined mock users or repositories:

1. Add new user objects to the `mockUsers` array in `users/index.ts`
2. Add repositories for the new user in the `mockRepositories` object in `repositories/index.ts`

Remember to keep the data structure consistent with the GitHub API schemas. 