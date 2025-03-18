import { ChangeEvent, FormEvent } from 'react';
import styles from './SearchBar.module.css';

export interface SearchBarViewProps {
  searchTerm: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

/**
 * Componente de presentación pura para la barra de búsqueda
 * Se encarga únicamente del renderizado, sin manejar lógica de estado
 */
const SearchBarView = ({ 
  searchTerm, 
  placeholder = 'Search GitHub users...', 
  onChange, 
  onSubmit 
}: SearchBarViewProps) => {
  return (
    <div className={styles.searchContainer}>
      <form 
        className={styles.searchInputWrapper}
        role="search"
        onSubmit={onSubmit}
      >
        <label htmlFor="search-input" className="sr-only">
          {placeholder}
        </label>
        <input
          id="search-input"
          type="search"
          placeholder={placeholder}
          className={styles.searchInput}
          value={searchTerm}
          onChange={onChange}
          aria-label={placeholder}
        />
        <div className={styles.searchIcon} aria-hidden="true">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <button 
          type="submit" 
          className={styles.searchButton}
          aria-label="Search"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBarView; 