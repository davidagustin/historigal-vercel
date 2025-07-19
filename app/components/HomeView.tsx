'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SearchInput from './SearchInput';

interface HomeViewProps {
  onSearch: (query: string) => void;
}

interface EventItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

export default function HomeView({ onSearch }: HomeViewProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/events?description_like=${encodeURIComponent(query)}&_limit=5`);
      const data: EventItem[] = await response.json();
      
      const uniqueSuggestions = [...new Set(
        data.slice(0, 5).map((item: EventItem) => item.description)
      )];
      
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the API call
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setShowSuggestions(false);
      onSearch(inputValue.trim());
    }
  };

  const handleLogoClick = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/historigal.png"
            alt="Historigal"
            width={275}
            height={100}
            className="mx-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
            priority
          />
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <SearchInput
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search historical events..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Search Button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="text-gray-900">{suggestion}</div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Search Tips */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Try searching for: "World War II", "Ancient Rome", "Industrial Revolution"
          </p>
        </div>
      </div>
    </div>
  );
} 