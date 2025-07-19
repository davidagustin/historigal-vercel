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
      setIsLoading(true);
      const response = await fetch(`/api/events?description_like=${encodeURIComponent(query)}&_limit=5`);
      const data: EventItem[] = await response.json();
      
      const uniqueSuggestions = [...new Set(
        data.slice(0, 5).map((item: EventItem) => item.description)
      )];
      
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Logo Section */}
          <div className="text-center mb-8 sm:mb-12">
            <Image
              src="/historigal.png"
              alt="Historigal"
              width={275}
              height={100}
              className="mx-auto cursor-pointer hover:opacity-80 transition-opacity w-48 sm:w-64 md:w-72 lg:w-80 h-auto"
              onClick={handleLogoClick}
              priority
            />
          </div>

          {/* Search Section */}
          <div className="search-container">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <SearchInput
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Search historical events..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md transition-shadow"
                />
                
                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium"
                >
                  Search
                </button>
              </div>

              {/* Autocomplete Suggestions - Google-like styling */}
              {showSuggestions && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="px-4 py-3 text-gray-500 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                      Searching...
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="text-gray-900 truncate text-sm sm:text-base">{suggestion}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Search Tips */}
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Try searching for:{" "}
              <span className="text-blue-600 font-medium">"World War II"</span>,{" "}
              <span className="text-blue-600 font-medium">"Ancient Rome"</span>,{" "}
              <span className="text-blue-600 font-medium">"Industrial Revolution"</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm">
        <p>Search through thousands of historical events</p>
      </footer>
    </div>
  );
} 