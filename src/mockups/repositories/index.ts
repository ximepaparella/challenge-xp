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
      },
      html_url: 'https://github.com/johndoe/react-component-library',
      description: 'A comprehensive library of React components with TypeScript support',
      fork: false,
      url: 'https://api.github.com/repos/johndoe/react-component-library',
      created_at: '2021-03-15T12:45:30Z',
      updated_at: '2023-07-22T09:12:45Z',
      pushed_at: '2023-07-20T14:23:12Z',
      homepage: 'https://johndoe-components.dev',
      size: 5842,
      stargazers_count: 764,
      watchers_count: 764,
      language: 'TypeScript',
      forks_count: 122,
      open_issues_count: 18,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['react', 'typescript', 'ui-components', 'design-system'],
      visibility: 'public',
    },
    {
      id: 102,
      name: 'node-api-boilerplate',
      full_name: 'johndoe/node-api-boilerplate',
      owner: {
        login: 'johndoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
      html_url: 'https://github.com/johndoe/node-api-boilerplate',
      description: 'Production-ready Node.js API boilerplate with Express, TypeScript, and MongoDB',
      fork: false,
      url: 'https://api.github.com/repos/johndoe/node-api-boilerplate',
      created_at: '2020-11-05T18:24:11Z',
      updated_at: '2023-06-12T08:45:36Z',
      pushed_at: '2023-06-10T17:12:08Z',
      homepage: null,
      size: 3721,
      stargazers_count: 532,
      watchers_count: 532,
      language: 'TypeScript',
      forks_count: 98,
      open_issues_count: 12,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['node', 'express', 'typescript', 'api', 'mongodb'],
      visibility: 'public',
    },
    {
      id: 103,
      name: 'nextjs-blog-starter',
      full_name: 'johndoe/nextjs-blog-starter',
      owner: {
        login: 'johndoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
      html_url: 'https://github.com/johndoe/nextjs-blog-starter',
      description: 'A feature-rich Next.js starter for blogs with MDX, Tailwind, and more',
      fork: false,
      url: 'https://api.github.com/repos/johndoe/nextjs-blog-starter',
      created_at: '2022-01-18T10:12:15Z',
      updated_at: '2023-08-05T11:22:33Z',
      pushed_at: '2023-08-01T15:34:27Z',
      homepage: 'https://nextjs-blog-starter.vercel.app',
      size: 4281,
      stargazers_count: 891,
      watchers_count: 891,
      language: 'TypeScript',
      forks_count: 143,
      open_issues_count: 8,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['nextjs', 'blog', 'mdx', 'tailwindcss', 'typescript'],
      visibility: 'public',
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
      },
      html_url: 'https://github.com/janedoe/css-animation-library',
      description: 'A collection of reusable CSS animations and transitions for modern web interfaces',
      fork: false,
      url: 'https://api.github.com/repos/janedoe/css-animation-library',
      created_at: '2021-06-22T14:32:18Z',
      updated_at: '2023-05-11T09:14:22Z',
      pushed_at: '2023-05-10T16:45:19Z',
      homepage: 'https://janedoe-animations.netlify.app',
      size: 2874,
      stargazers_count: 672,
      watchers_count: 672,
      language: 'CSS',
      forks_count: 86,
      open_issues_count: 14,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['css', 'animations', 'web-design', 'transitions'],
      visibility: 'public',
    },
    {
      id: 202,
      name: 'react-design-system',
      full_name: 'janedoe/react-design-system',
      owner: {
        login: 'janedoe',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
      html_url: 'https://github.com/janedoe/react-design-system',
      description: 'A comprehensive design system for React applications with accessibility built-in',
      fork: false,
      url: 'https://api.github.com/repos/janedoe/react-design-system',
      created_at: '2022-02-14T11:24:32Z',
      updated_at: '2023-07-18T13:45:12Z',
      pushed_at: '2023-07-15T10:12:08Z',
      homepage: 'https://janedoe-design.vercel.app',
      size: 6254,
      stargazers_count: 1432,
      watchers_count: 1432,
      language: 'TypeScript',
      forks_count: 218,
      open_issues_count: 27,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['react', 'design-system', 'accessibility', 'ui-components'],
      visibility: 'public',
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
      },
      html_url: 'https://github.com/alexsmith/kubernetes-best-practices',
      description: 'A collection of Kubernetes best practices, patterns, and configurations for production environments',
      fork: false,
      url: 'https://api.github.com/repos/alexsmith/kubernetes-best-practices',
      created_at: '2020-08-12T09:14:22Z',
      updated_at: '2023-09-05T14:22:18Z',
      pushed_at: '2023-09-01T11:34:56Z',
      homepage: 'https://k8s-practices.dev',
      size: 7842,
      stargazers_count: 3254,
      watchers_count: 3254,
      language: 'Go',
      forks_count: 578,
      open_issues_count: 42,
      license: {
        key: 'apache-2.0',
        name: 'Apache License 2.0',
        url: 'https://api.github.com/licenses/apache-2.0',
      },
      topics: ['kubernetes', 'devops', 'cloud-native', 'infrastructure'],
      visibility: 'public',
    },
    {
      id: 302,
      name: 'terraform-modules',
      full_name: 'alexsmith/terraform-modules',
      owner: {
        login: 'alexsmith',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
      },
      html_url: 'https://github.com/alexsmith/terraform-modules',
      description: 'Reusable Terraform modules for AWS, GCP, and Azure infrastructure',
      fork: false,
      url: 'https://api.github.com/repos/alexsmith/terraform-modules',
      created_at: '2021-04-18T15:24:32Z',
      updated_at: '2023-08-22T10:45:12Z',
      pushed_at: '2023-08-20T13:22:45Z',
      homepage: null,
      size: 5421,
      stargazers_count: 1876,
      watchers_count: 1876,
      language: 'HCL',
      forks_count: 342,
      open_issues_count: 28,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['terraform', 'aws', 'gcp', 'azure', 'infrastructure-as-code'],
      visibility: 'public',
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
      },
      html_url: 'https://github.com/sarahdev/machine-learning-cookbook',
      description: 'A collection of ML recipes and techniques for data science projects',
      fork: false,
      url: 'https://api.github.com/repos/sarahdev/machine-learning-cookbook',
      created_at: '2021-01-15T10:24:32Z',
      updated_at: '2023-06-22T14:45:12Z',
      pushed_at: '2023-06-20T13:22:45Z',
      homepage: 'https://ml-cookbook.dev',
      size: 8742,
      stargazers_count: 2543,
      watchers_count: 2543,
      language: 'Python',
      forks_count: 486,
      open_issues_count: 32,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['machine-learning', 'data-science', 'python', 'tensorflow', 'pytorch'],
      visibility: 'public',
    },
    {
      id: 402,
      name: 'nlp-transformers',
      full_name: 'sarahdev/nlp-transformers',
      owner: {
        login: 'sarahdev',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
      },
      html_url: 'https://github.com/sarahdev/nlp-transformers',
      description: 'Natural Language Processing with transformer models and practical applications',
      fork: false,
      url: 'https://api.github.com/repos/sarahdev/nlp-transformers',
      created_at: '2022-03-18T09:14:22Z',
      updated_at: '2023-07-05T14:22:18Z',
      pushed_at: '2023-07-01T11:34:56Z',
      homepage: null,
      size: 6254,
      stargazers_count: 1876,
      watchers_count: 1876,
      language: 'Python',
      forks_count: 324,
      open_issues_count: 24,
      license: {
        key: 'apache-2.0',
        name: 'Apache License 2.0',
        url: 'https://api.github.com/licenses/apache-2.0',
      },
      topics: ['nlp', 'transformers', 'machine-learning', 'huggingface', 'bert'],
      visibility: 'public',
    }
  ],
  'mikecoder': [
    {
      id: 501,
      name: 'game-engine-cpp',
      full_name: 'mikecoder/game-engine-cpp',
      owner: {
        login: 'mikecoder',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
      },
      html_url: 'https://github.com/mikecoder/game-engine-cpp',
      description: 'A high-performance 3D game engine written in modern C++',
      fork: false,
      url: 'https://api.github.com/repos/mikecoder/game-engine-cpp',
      created_at: '2020-05-18T09:14:22Z',
      updated_at: '2023-08-05T14:22:18Z',
      pushed_at: '2023-08-01T11:34:56Z',
      homepage: 'https://mikecoder-engine.dev',
      size: 12845,
      stargazers_count: 4321,
      watchers_count: 4321,
      language: 'C++',
      forks_count: 654,
      open_issues_count: 48,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['game-engine', 'cpp', 'graphics', 'opengl', 'vulkan', '3d-rendering'],
      visibility: 'public',
    },
    {
      id: 502,
      name: 'shader-collection',
      full_name: 'mikecoder/shader-collection',
      owner: {
        login: 'mikecoder',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
      },
      html_url: 'https://github.com/mikecoder/shader-collection',
      description: 'A collection of GLSL shaders for modern graphics effects',
      fork: false,
      url: 'https://api.github.com/repos/mikecoder/shader-collection',
      created_at: '2021-07-12T15:24:32Z',
      updated_at: '2023-06-22T10:45:12Z',
      pushed_at: '2023-06-20T13:22:45Z',
      homepage: 'https://shader-gallery.vercel.app',
      size: 4587,
      stargazers_count: 2165,
      watchers_count: 2165,
      language: 'GLSL',
      forks_count: 315,
      open_issues_count: 22,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
      },
      topics: ['shaders', 'glsl', 'webgl', 'graphics', 'rendering'],
      visibility: 'public',
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
  const repos = [];
  const common_topics = ['javascript', 'typescript', 'react', 'vue', 'node', 'python', 'go', 'rust', 'aws', 'docker'];
  
  // Create a main personal website/portfolio repo
  repos.push({
    id: generateId(`${username}-website`),
    name: `${username}.github.io`,
    full_name: `${username}/${username}.github.io`,
    owner: {
      login: username,
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70)}?v=4`,
    },
    html_url: `https://github.com/${username}/${username}.github.io`,
    description: `Personal website and developer portfolio for ${username}`,
    fork: false,
    url: `https://api.github.com/repos/${username}/${username}.github.io`,
    created_at: getRandomDate(2020),
    updated_at: getRandomDate(2023),
    pushed_at: getRandomDate(2023, true),
    homepage: `https://${username}.github.io`,
    size: 1842 + (username.length * 100),
    stargazers_count: 12 + (username.length % 30),
    watchers_count: 12 + (username.length % 30),
    language: 'JavaScript',
    forks_count: 3 + (username.length % 10),
    open_issues_count: 2,
    license: {
      key: 'mit',
      name: 'MIT License',
      url: 'https://api.github.com/licenses/mit',
    },
    topics: ['portfolio', 'website', 'github-pages'],
    visibility: 'public',
  });
  
  // Create a main project repo
  repos.push({
    id: generateId(`${username}-project`),
    name: getProjectName(username),
    full_name: `${username}/${getProjectName(username)}`,
    owner: {
      login: username,
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70)}?v=4`,
    },
    html_url: `https://github.com/${username}/${getProjectName(username)}`,
    description: `A modern web application built with React and Node.js`,
    fork: false,
    url: `https://api.github.com/repos/${username}/${getProjectName(username)}`,
    created_at: getRandomDate(2021),
    updated_at: getRandomDate(2023),
    pushed_at: getRandomDate(2023, true),
    homepage: null,
    size: 4267,
    stargazers_count: 45 + (username.length * 2),
    watchers_count: 45 + (username.length * 2),
    language: 'TypeScript',
    forks_count: 12 + (username.length % 15),
    open_issues_count: 5,
    license: {
      key: 'mit',
      name: 'MIT License',
      url: 'https://api.github.com/licenses/mit',
    },
    topics: shuffleAndTake(common_topics, 4).concat(['web-app']),
    visibility: 'public',
  });
  
  // Create a utility library
  repos.push({
    id: generateId(`${username}-utils`),
    name: `${username}-utils`,
    full_name: `${username}/${username}-utils`,
    owner: {
      login: username,
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70)}?v=4`,
    },
    html_url: `https://github.com/${username}/${username}-utils`,
    description: `A collection of utility functions and helpers for JavaScript projects`,
    fork: false,
    url: `https://api.github.com/repos/${username}/${username}-utils`,
    created_at: getRandomDate(2022),
    updated_at: getRandomDate(2023),
    pushed_at: getRandomDate(2023, true),
    homepage: null,
    size: 854,
    stargazers_count: 28 + (username.length % 20),
    watchers_count: 28 + (username.length % 20),
    language: 'JavaScript',
    forks_count: 8,
    open_issues_count: 3,
    license: {
      key: 'mit',
      name: 'MIT License',
      url: 'https://api.github.com/licenses/mit',
    },
    topics: ['utilities', 'javascript', 'helpers'],
    visibility: 'public',
  });
  
  return repos;
};

/**
 * Helper to generate a deterministic ID based on a string
 */
const generateId = (str: string): number => {
  return 1000000 + Math.abs(str.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0) % 900000);
};

/**
 * Helper to generate a project name based on username
 */
const getProjectName = (username: string): string => {
  const projectTypes = ['app', 'hub', 'space', 'flow', 'plus', 'pro', 'system', 'kit'];
  const randomIndex = Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % projectTypes.length;
  return `${username}-${projectTypes[randomIndex]}`;
};

/**
 * Helper to generate a random date within a year
 */
const getRandomDate = (year: number, recent = false): string => {
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime();
  const end = recent 
    ? new Date().getTime() 
    : new Date(`${year}-12-31T23:59:59Z`).getTime();
  
  const randomTimestamp = start + (Math.random() * (end - start));
  return new Date(randomTimestamp).toISOString();
};

/**
 * Helper to shuffle an array and take N elements
 */
const shuffleAndTake = (array: string[], count: number): string[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 