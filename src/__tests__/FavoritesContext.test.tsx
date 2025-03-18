import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '@/features/favorites/context/FavoritesContext';
import { GithubService } from '@/features/users/services/GithubService';
import { User } from '@/features/users/types';

// Mock GithubService
jest.mock('@/features/users/services/GithubService');

// Mock user data
const mockUser: User = {
  id: 1,
  login: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/testuser',
  name: 'Test User',
  company: 'Test Company',
  blog: 'https://testuser.com',
  location: 'Test Location',
  email: 'test@example.com',
  bio: 'Test Bio',
  twitter_username: 'testuser',
  public_repos: 10,
  public_gists: 5,
  followers: 100,
  following: 50,
  created_at: '2020-01-01',
  updated_at: '2023-01-01'
};

// Test component that uses the favorites context
const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  return (
    <div>
      <h1>Favorites: {favorites.length}</h1>
      <button onClick={() => addFavorite(mockUser)}>Add Favorite</button>
      <button onClick={() => removeFavorite(mockUser.login)}>Remove Favorite</button>
      <div data-testid="is-favorite">{isFavorite(mockUser.login).toString()}</div>
    </div>
  );
};

describe('FavoritesContext', () => {
  let mockGithubService: GithubService;

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instance
    mockGithubService = {
      searchUsers: jest.fn(),
      getUser: jest.fn().mockResolvedValue(mockUser),
      getUserRepos: jest.fn().mockResolvedValue([]),
      getUsers: jest.fn().mockResolvedValue([mockUser]),
      getUserFollowers: jest.fn().mockResolvedValue([]),
      getUserFollowing: jest.fn().mockResolvedValue([]),
      apiClient: {} as any
    } as unknown as GithubService;

    // Mock the constructor
    (GithubService as jest.MockedClass<typeof GithubService>).mockImplementation(() => mockGithubService);
  });

  it('should add a user to favorites', async () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Initially should have no favorites
    expect(screen.getByText('Favorites: 0')).toBeInTheDocument();
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');

    // Click the add favorite button
    fireEvent.click(screen.getByText('Add Favorite'));

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
    });

    // Wait for the isFavorite state to update
    await waitFor(() => {
      expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    });
  });

  it('should remove a user from favorites', async () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Add a favorite first
    fireEvent.click(screen.getByText('Add Favorite'));

    // Wait for the add operation to complete
    await waitFor(() => {
      expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
      expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    });

    // Remove the favorite
    fireEvent.click(screen.getByText('Remove Favorite'));

    // Wait for the remove operation to complete
    await waitFor(() => {
      expect(screen.getByText('Favorites: 0')).toBeInTheDocument();
      expect(screen.getByTestId('is-favorite').textContent).toBe('false');
    });
  });

  it('should persist favorites in localStorage', async () => {
    const { unmount } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Add a favorite
    fireEvent.click(screen.getByText('Add Favorite'));

    // Wait for the add operation to complete
    await waitFor(() => {
      expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
      expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    });

    // Unmount and remount to test persistence
    unmount();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Favorites should still be there
    await waitFor(() => {
      expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
      expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    });
  });
}); 