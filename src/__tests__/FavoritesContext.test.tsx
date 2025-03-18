import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '@/features/favorites';
import { GithubUser } from '@/types/github';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the favorites context
const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const mockUser: GithubUser = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    url: 'https://api.github.com/users/testuser',
    html_url: 'https://github.com/testuser',
    followers_url: '',
    following_url: '',
    gists_url: '',
    starred_url: '',
    subscriptions_url: '',
    organizations_url: '',
    repos_url: '',
    events_url: '',
    received_events_url: '',
    type: 'User',
    site_admin: false,
    gravatar_id: '',
    node_id: '',
  };

  return (
    <div>
      <h1>Favorites: {favorites.length}</h1>
      <button onClick={() => addFavorite(mockUser)}>Add Favorite</button>
      <button onClick={() => removeFavorite('testuser')}>Remove Favorite</button>
      <div data-testid="is-favorite">{isFavorite('testuser').toString()}</div>
    </div>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should add a user to favorites', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Initially no favorites
    expect(screen.getByText('Favorites: 0')).toBeInTheDocument();
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');

    // Add a favorite
    fireEvent.click(screen.getByText('Add Favorite'));

    // Now we should have one favorite
    expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
    expect(screen.getByTestId('is-favorite').textContent).toBe('true');
  });

  it('should remove a user from favorites', () => {
    // Set initial state with one favorite
    window.localStorage.setItem(
      'favorites',
      JSON.stringify([
        {
          id: 1,
          login: 'testuser',
          avatar_url: 'https://example.com/avatar.png',
          url: 'https://api.github.com/users/testuser',
          html_url: 'https://github.com/testuser',
          type: 'User',
          site_admin: false,
          gravatar_id: '',
          node_id: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
        },
      ])
    );

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Initially one favorite
    expect(screen.getByText('Favorites: 1')).toBeInTheDocument();
    expect(screen.getByTestId('is-favorite').textContent).toBe('true');

    // Remove the favorite
    fireEvent.click(screen.getByText('Remove Favorite'));

    // Now we should have no favorites
    expect(screen.getByText('Favorites: 0')).toBeInTheDocument();
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');
  });
}); 