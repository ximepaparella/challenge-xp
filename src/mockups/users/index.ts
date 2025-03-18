import { User } from '@/features/users/types';

export const mockUsers: User[] = [
  {
    login: 'johndoe',
    id: 1,
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    name: 'John Doe',
    company: 'Acme Corp',
    blog: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    email: 'john@example.com',
    bio: 'Full-stack developer with a passion for React and Node.js. Building innovative solutions for the web.',
    public_repos: 65,
    public_gists: 30,
    followers: 1200,
    following: 75,
    twitter_username: 'johndoedev',
    html_url: 'https://github.com/johndoe',
    created_at: '2012-01-15T15:36:42Z',
    updated_at: '2023-08-20T10:15:30Z',
  },
  {
    login: 'janedoe',
    id: 2,
    avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
    name: 'Jane Doe',
    company: 'TechStart Inc.',
    blog: 'https://janedoe.io',
    location: 'New York, NY',
    email: 'jane@example.com',
    bio: 'Frontend specialist focusing on React and modern CSS. UX enthusiast and design systems architect.',
    public_repos: 48,
    public_gists: 12,
    followers: 850,
    following: 120,
    twitter_username: 'janedoedev',
    html_url: 'https://github.com/janedoe',
    created_at: '2013-05-10T09:24:37Z',
    updated_at: '2023-09-15T14:27:45Z',
  },
  {
    login: 'alexsmith',
    id: 3,
    avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
    name: 'Alex Smith',
    company: 'DevOps Unlimited',
    blog: 'https://alexsmith.tech',
    location: 'Seattle, WA',
    email: 'alex@example.com',
    bio: 'DevOps engineer and cloud architect. Passionate about automation, Kubernetes, and scalable infrastructure.',
    public_repos: 92,
    public_gists: 25,
    followers: 1500,
    following: 45,
    twitter_username: 'alexsmithtech',
    html_url: 'https://github.com/alexsmith',
    created_at: '2011-09-22T17:12:08Z',
    updated_at: '2023-10-05T08:36:19Z',
  },
  {
    login: 'sarahdev',
    id: 4,
    avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
    name: 'Sarah Johnson',
    company: 'AI Research Lab',
    blog: 'https://sarahjohnson.dev',
    location: 'Boston, MA',
    email: 'sarah@example.com',
    bio: 'Machine learning researcher and Python developer. Working on NLP and computer vision projects.',
    public_repos: 37,
    public_gists: 8,
    followers: 920,
    following: 102,
    twitter_username: 'sarahaidev',
    html_url: 'https://github.com/sarahdev',
    created_at: '2014-03-17T11:45:22Z',
    updated_at: '2023-11-12T19:22:51Z',
  },
  {
    login: 'mikecoder',
    id: 5,
    avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
    name: 'Mike Wilson',
    company: 'GameDev Studios',
    blog: 'https://mikewilson.games',
    location: 'Los Angeles, CA',
    email: 'mike@example.com',
    bio: 'Game developer and C++ expert. Creating immersive worlds and optimized rendering engines.',
    public_repos: 54,
    public_gists: 17,
    followers: 730,
    following: 68,
    twitter_username: 'mikegamedev',
    html_url: 'https://github.com/mikecoder',
    created_at: '2013-11-02T22:18:37Z',
    updated_at: '2023-10-28T12:41:09Z',
  },
];

export const getMockUser = (username: string): User | null => {
  // First try to find an exact match in our mock users
  const mockUser = mockUsers.find(user => user.login === username);
  if (mockUser) {
    return mockUser;
  }
  
  // If no exact match, create a fallback mock user with the requested username
  return createFallbackUser(username);
};

/**
 * Creates a fallback mock user for any username not in our standard mock data
 */
export const createFallbackUser = (username: string): User => {
  // Create a deterministic avatar based on the username
  const avatarId = Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70);
  
  return {
    login: username,
    id: 1000000 + avatarId,
    avatar_url: `https://avatars.githubusercontent.com/u/${avatarId}?v=4`,
    name: capitalizeUsername(username),
    company: 'Open Source Contributor',
    blog: `https://${username}.dev`,
    location: 'Worldwide',
    email: `${username}@example.com`,
    bio: `Software developer and open source enthusiast. This is a fallback mock profile for "${username}".`,
    public_repos: 42,
    public_gists: 15,
    followers: 250,
    following: 75,
    twitter_username: username,
    html_url: `https://github.com/${username}`,
    created_at: '2012-06-15T15:36:42Z',
    updated_at: '2023-10-20T10:15:30Z',
  };
};

/**
 * Capitalize username for nicer display in fallback profiles
 */
const capitalizeUsername = (username: string): string => {
  // Try to split by common separators and capitalize each part
  if (username.includes('-') || username.includes('_')) {
    return username
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
  // If no common separator, try to intelligently split camelCase
  if (/[A-Z]/.test(username)) {
    return username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  }
  
  // Default: just capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1);
};

export const getAllMockUsers = (): User[] => {
  return mockUsers;
};

export const searchMockUsers = (query: string): User[] => {
  const lowerCaseQuery = query.toLowerCase();
  
  // Search in our predefined mock users
  const foundUsers = mockUsers.filter(user => 
    user.login.toLowerCase().includes(lowerCaseQuery) || 
    (user.name && user.name.toLowerCase().includes(lowerCaseQuery)) ||
    (user.company && user.company.toLowerCase().includes(lowerCaseQuery)) ||
    (user.location && user.location.toLowerCase().includes(lowerCaseQuery))
  );
  
  // If we have results, return them
  if (foundUsers.length > 0) {
    return foundUsers;
  }
  
  // If no results, create a fallback user that matches the query
  return [createFallbackUser(query)];
}; 