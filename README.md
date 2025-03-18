# GitHub Explorer

A web application that allows you to explore GitHub user profiles, built with Next.js and TypeScript.

## Features

- **User Exploration:** Intuitive interface for discovering GitHub profiles.
- **Real-time Search:** Optimized search system with debounce implementation.
- **Favorites Management:** Save your favorite profiles for quick access.
- **Detailed Profiles:** View complete information about each user and their repositories.
- **Offline Mode:** Mockup system to continue working without connection or when API limits are exceeded.
- **Reusable Components:** Architecture based on modular and extensible components.
- **Responsive Design:** Optimal experience on both mobile and desktop devices.
- **Comprehensive Testing:** Complete test coverage with Jest and React Testing Library.

## Technologies Used

- **Frontend:** Next.js with TypeScript
- **Styling:** CSS Modules with CSS variables
- **State Management:** Context API for favorites management
- **API:** GitHub API integration
- **Testing:** Jest and React Testing Library

## Project Structure

```
/src
  /core            # Core components and utilities
    /api           # API client and related services
    /components    # Reusable UI components
    /hooks         # Custom hooks for common functionality
    /utils         # Utilities and helpers
  /features        # Features organized by domain
    /users         # Everything related to users
      /components  # User-specific components
      /hooks       # Custom hooks
      /services    # API services
      /types       # TypeScript types
    /favorites     # Favorites-related functionality
      /context     # Favorites Context API implementation
  /pages           # Next.js pages
  /styles          # Global styles
  /__tests__       # Test files
```

## Reusable Components

The project includes several reusable UI components:

- **Avatar:** Components to display user avatars with multiple sizes.
- **Stats:** Statistics visualization with various variants (default, card, inline, small).
- **UserCard:** User card with relevant information.
- **UserProfile:** Complete user profile visualization.
- **SearchBar:** Reusable search component with debounce functionality.
- **EmptyState:** Component for showing empty state messages.

## Advanced Features

### Caching System

The application implements a robust caching system that:
- Reduces unnecessary API calls
- Improves performance by storing frequently accessed data
- Handles cache invalidation based on time and capacity

### Request Deduplication

The deduplication system prevents redundant API calls by:
- Tracking in-flight requests
- Sharing responses for identical requests
- Implementing cooldown periods for failed requests

### Error Handling

Comprehensive error handling with:
- Retry strategy for failed API calls
- Graceful fallback to mock data
- User-friendly error states

### Mock Data System

The application includes a robust mock data system that allows:
- Working without depending on the GitHub API during development
- Continuing to use the application when API limits are exceeded
- Generating dynamic profiles for any requested username

## Installation and Execution

1. Clone the repository:
   ```
   git clone https://github.com/your-username/github-explorer.git
   cd github-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. (Optional) Configure environment variables:
   Create a `.env.local` file and add your GitHub token to increase API limits:
   ```
   NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
   ```

4. Run in development mode:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Build the application
- `npm run start` - Start in production mode
- `npm run lint` - Run the linter
- `npm run test` - Run unit tests
- `npm run test -- --coverage` - Run tests with coverage reporting

## Testing

The project implements comprehensive testing with:
- Unit tests for all components and hooks
- Integration tests for context providers
- Mocking of external dependencies
- >95% code coverage

## Optimizations

- Memoized components to avoid unnecessary renders
- Debounced searches to reduce API calls
- Lazy loading of images with Next/Image
- Server-Side Rendering on detail pages
- Caching system for API responses
- Request deduplication to prevent duplicate calls

## Technical Considerations

- Implementation of error handling and loading states
- Fallback strategy to mock data when the API fails
- Scalable structure to facilitate functionality expansion

---

Developed as part of a technical challenge.
