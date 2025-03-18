/**
 * Helper function to get a color for a programming language
 * @param language - The programming language name
 * @returns A hex color code for the language
 */
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Go: '#00ADD8',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Shell: '#89e051',
    Dart: '#00B4AB',
    Perl: '#0298c3',
    Scala: '#c22d40',
    Haskell: '#5e5086',
    R: '#198CE7',
    Lua: '#000080',
    Vue: '#2c3e50',
    Elm: '#60B5CC',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
  };

  return colors[language] || '#858585'; // Default color if language not found
} 