import { Repository } from '@/features/users/types';

/**
 * Mock repositories data for development when GitHub API rate limits are reached
 */
export const mockRepositories: { [username: string]: Repository[] } = {
  'johndoe': [
    {
      id: 101,
      name: 'react-component-library',
      full_name: 'johndoe/react-component-library',
      owner: {
        login: 'johndoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        html_url: 'https://github.com/johndoe'
      },
      html_url: 'https://github.com/johndoe/react-component-library',
      description: 'A comprehensive library of React components with TypeScript support',
      language: 'TypeScript',
      stargazers_count: 764,
      forks_count: 122
    },
    {
      id: 102,
      name: 'node-api-boilerplate',
      full_name: 'johndoe/node-api-boilerplate',
      owner: {
        login: 'johndoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        html_url: 'https://github.com/johndoe'
      },
      html_url: 'https://github.com/johndoe/node-api-boilerplate',
      description: 'Production-ready Node.js API boilerplate with Express, TypeScript, and MongoDB',
      language: 'TypeScript',
      stargazers_count: 532,
      forks_count: 98
    },
    {
      id: 103,
      name: 'nextjs-blog-starter',
      full_name: 'johndoe/nextjs-blog-starter',
      owner: {
        login: 'johndoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        html_url: 'https://github.com/johndoe'
      },
      html_url: 'https://github.com/johndoe/nextjs-blog-starter',
      description: 'A feature-rich Next.js starter for blogs with MDX, Tailwind, and more',
      language: 'TypeScript',
      stargazers_count: 891,
      forks_count: 143
    }
  ],
  'janedoe': [
    {
      id: 201,
      name: 'css-animation-library',
      full_name: 'janedoe/css-animation-library',
      owner: {
        login: 'janedoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        html_url: 'https://github.com/janedoe'
      },
      html_url: 'https://github.com/janedoe/css-animation-library',
      description: 'A collection of reusable CSS animations and transitions for modern web interfaces',
      language: 'CSS',
      stargazers_count: 672,
      forks_count: 86
    },
    {
      id: 202,
      name: 'react-design-system',
      full_name: 'janedoe/react-design-system',
      owner: {
        login: 'janedoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        html_url: 'https://github.com/janedoe'
      },
      html_url: 'https://github.com/janedoe/react-design-system',
      description: 'A comprehensive design system for React applications with accessibility built-in',
      language: 'TypeScript',
      stargazers_count: 1432,
      forks_count: 218
    }
  ],
  'alexsmith': [
    {
      id: 301,
      name: 'kubernetes-best-practices',
      full_name: 'alexsmith/kubernetes-best-practices',
      owner: {
        login: 'alexsmith',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        html_url: 'https://github.com/alexsmith'
      },
      html_url: 'https://github.com/alexsmith/kubernetes-best-practices',
      description: 'A collection of Kubernetes best practices, patterns, and configurations for production environments',
      language: 'Go',
      stargazers_count: 3254,
      forks_count: 578
    },
    {
      id: 302,
      name: 'terraform-modules',
      full_name: 'alexsmith/terraform-modules',
      owner: {
        login: 'alexsmith',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        html_url: 'https://github.com/alexsmith'
      },
      html_url: 'https://github.com/alexsmith/terraform-modules',
      description: 'Reusable Terraform modules for AWS, GCP, and Azure infrastructure',
      language: 'HCL',
      stargazers_count: 1876,
      forks_count: 342
    }
  ],
  'sarahdev': [
    {
      id: 401,
      name: 'machine-learning-cookbook',
      full_name: 'sarahdev/machine-learning-cookbook',
      owner: {
        login: 'sarahdev',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
        html_url: 'https://github.com/sarahdev'
      },
      html_url: 'https://github.com/sarahdev/machine-learning-cookbook',
      description: 'A collection of ML recipes and techniques for data science projects',
      language: 'Python',
      stargazers_count: 2543,
      forks_count: 486
    }
  ]
};

/**
 * Get repositories for a user - if the user isn't in our mock data,
 * create some default repositories for them
 */
export const getMockRepositories = (username: string): Repository[] => {
  // If we have predefined repositories for this user, return those
  if (mockRepositories[username]) {
    return mockRepositories[username];
  }
  
  // Otherwise, create fallback repositories
  return createFallbackRepositories(username);
};

/**
 * Creates fallback repositories for users not in our mock data
 */
export const createFallbackRepositories = (username: string): Repository[] => {
  const projectName = getProjectName(username);
  const id = generateId(username);
  
  return [
    {
      id,
      name: projectName,
      full_name: `${username}/${projectName}`,
      owner: {
        login: username,
        avatar_url: `https://avatars.githubusercontent.com/u/${id}?v=4`,
        html_url: `https://github.com/${username}`
      },
      html_url: `https://github.com/${username}/${projectName}`,
      description: `A sample project by ${username}`,
      language: 'TypeScript',
      stargazers_count: Math.floor(Math.random() * 100),
      forks_count: Math.floor(Math.random() * 20)
    }
  ];
};

/**
 * Helper to generate a deterministic ID based on a string
 */
const generateId = (str: string): number => {
  return Math.abs(str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
};

/**
 * Helper to generate a project name based on username
 */
const getProjectName = (username: string): string => {
  const names = ['awesome-project', 'cool-app', 'web-app', 'api-service', 'utils-lib'];
  const index = Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % names.length;
  return names[index];
}; 