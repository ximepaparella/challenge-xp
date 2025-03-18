// User component prop types
export interface UserCardProps {
  user: User;
}

export interface UserGridProps {
  users: User[];
  loading: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
}

export interface GithubSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
}

export interface User {
  login: string;
  id: number;
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

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
} 