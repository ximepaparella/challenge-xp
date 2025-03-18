import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from '@/core/components';

// Mock the debounce hook to avoid waiting in tests
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return the value immediately without debouncing
}));

describe('SearchBar', () => {
  it('should call onSearch when input changes', () => {
    const mockOnSearch = jest.fn();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Buscar usuarios de GitHub...');
    
    // Type in the search input
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Since we mocked the debounce hook, onSearch should be called immediately
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });
  
  it('should render with the correct placeholder', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByPlaceholderText('Buscar usuarios de GitHub...');
    expect(input).toBeInTheDocument();
  });
  
  it('should have the correct accessibility attributes', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByLabelText('Buscar usuarios');
    expect(input).toBeInTheDocument();
  });
}); 