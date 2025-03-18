import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { useDebounce } from '@/core/hooks';
import SearchBarView from './SearchBarView';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * Componente contenedor para SearchBar
 * Se encarga de la lógica de estado y el debounce para la búsqueda
 */
const SearchBar = (props: SearchBarProps) => {
  const { onSearch, placeholder } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 800); // Aumentado a 800ms para reducir peticiones
  const lastSearchedTermRef = useRef('');
  
  // Para prevenir la búsqueda inicial vacía
  const isInitialMountRef = useRef(true);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Solo buscar si el término ha cambiado
    if (searchTerm !== lastSearchedTermRef.current) {
      console.log('SearchBar - Búsqueda manual:', searchTerm);
      lastSearchedTermRef.current = searchTerm;
      onSearch(searchTerm); // Immediately search without waiting for debounce
    }
  };

  // Call onSearch when debounced value changes
  useEffect(() => {
    // Evitar la primera búsqueda automática
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    // Solo buscar si el término ha cambiado después del debounce y tiene contenido
    if (debouncedSearchTerm !== lastSearchedTermRef.current) {
      console.log('SearchBar - Búsqueda por debounce:', debouncedSearchTerm);
      lastSearchedTermRef.current = debouncedSearchTerm;
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // Renderiza el componente de presentación con las props necesarias
  return (
    <SearchBarView
      searchTerm={searchTerm}
      placeholder={placeholder}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchBar; 