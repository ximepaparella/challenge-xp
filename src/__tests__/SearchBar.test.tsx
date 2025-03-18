import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '@/core/components/SearchBar';

jest.useFakeTimers();

// Mock the debounce hook to avoid waiting in tests
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return the value immediately without debouncing
}));

describe('SearchBar', () => {
  it('should call onSearch when input changes', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search GitHub users...');
    
    // Type in the search input
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Fast-forward timers
    jest.runAllTimers();
    
    // Check if onSearch was called with the input value
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });
  
  it('should render with the correct placeholder', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByPlaceholderText('Search GitHub users...');
    expect(input).toBeInTheDocument();
  });
  
  it('should have the correct accessibility attributes', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByLabelText('Search GitHub users...');
    expect(input).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
}); 