'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SearchInput from './SearchInput';

interface SearchViewProps {
  query: string;
  onBackToHome: () => void;
}

interface EventItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

interface SearchResults {
  data: EventItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export default function SearchView({ query, onBackToHome }: SearchViewProps) {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(query);

  const fetchResults = async (searchQuery: string, page: number = 1) => {
    setIsLoading(true);
    try {
      // First get total count
      const countResponse = await fetch(`/api/events?description_like=${encodeURIComponent(searchQuery)}`);
      const allData: EventItem[] = await countResponse.json();
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / 10);

      // Then get paginated results
      const response = await fetch(`/api/events?description_like=${encodeURIComponent(searchQuery)}&_page=${page}&_limit=10`);
      const data: EventItem[] = await response.json();

      setResults({
        data,
        totalItems,
        totalPages,
        currentPage: page
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults({
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query, 1);
  }, [query]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchResults(query, page);
  };

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchResults(searchInput.trim(), 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/historigal.png"
                alt="Historigal"
                width={97}
                height={36}
                className="cursor-pointer hover:opacity-80"
                onClick={onBackToHome}
              />
              <form onSubmit={handleNewSearch} className="flex-1 max-w-2xl">
                <SearchInput
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search historical events..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/historigal.png"
              alt="Historigal"
              width={97}
              height={36}
              className="cursor-pointer hover:opacity-80"
              onClick={onBackToHome}
            />
            <form onSubmit={handleNewSearch} className="flex-1 max-w-2xl">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search historical events..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {results && (
          <>
            {/* Results Summary */}
            <div className="mb-6 text-gray-600">
              About {results.totalItems.toLocaleString()} results
            </div>

            {/* Results List */}
            {results.data.length > 0 ? (
              <div className="space-y-6">
                {results.data.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-green-600 mb-1">
                      {formatDate(item.date)}
                    </div>
                    <h3 className="text-lg font-medium text-blue-600 hover:underline cursor-pointer mb-2">
                      {item.description}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Category: {item.category2}
                      {item.category1 && ` • ${item.category1}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try different keywords or check your spelling.
                </p>
              </div>
            )}

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded ${
                          currentPage === page
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === results.totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 