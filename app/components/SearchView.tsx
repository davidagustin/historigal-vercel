'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import SearchInput from './SearchInput';
import { parseCitations, formatCitation } from '../utils/citationParser';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™');
}

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
  const [allResults, setAllResults] = useState<EventItem[]>([]);
  const itemsPerPage = 20;

  const fetchResults = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events?description_like=${encodeURIComponent(searchQuery)}`);
      const allData: EventItem[] = await response.json();
      
      setAllResults(allData);
      
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageData = allData.slice(startIndex, endIndex);

      setResults({
        data: currentPageData,
        totalItems,
        totalPages,
        currentPage
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults({
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1
      });
      setAllResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = allResults.slice(startIndex, endIndex);
    
    setResults(prev => prev ? {
      ...prev,
      data: currentPageData,
      currentPage: page
    } : null);
  }, [allResults, itemsPerPage]);

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentPage(1);
      fetchResults(searchInput.trim());
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

  const renderPagination = () => {
    if (!results || results.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 5 : 7; // Fewer pages on mobile
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(results.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-t border-b border-gray-300 transition-all duration-200 ${
            currentPage === i
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < results.totalPages) {
      if (endPage < results.totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={results.totalPages}
          onClick={() => handlePageChange(results.totalPages)}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
        >
          {results.totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === results.totalPages}
        className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Image
                src="/historigal.png"
                alt="Historigal"
                width={120}
                height={44}
                className="cursor-pointer hover:opacity-80 transition-opacity w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
                onClick={onBackToHome}
              />
              <form onSubmit={handleNewSearch} className="flex-1 max-w-2xl">
                <SearchInput
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search historical events..."
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">Searching historical events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Image
              src="/historigal.png"
              alt="Historigal"
              width={120}
              height={44}
              className="cursor-pointer hover:opacity-80 transition-opacity w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
              onClick={onBackToHome}
            />
            <form onSubmit={handleNewSearch} className="flex-1 max-w-2xl">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search historical events..."
                className="w-full px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {results && (
          <>
            {/* Results Summary */}
            <div className="mb-6 sm:mb-8">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">
                About {results.totalItems.toLocaleString()} results
                {results.totalPages > 1 && (
                  <span className="ml-2 text-gray-500">
                    (showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, results.totalItems)} of {results.totalItems})
                  </span>
                )}
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>

            {/* Results List */}
            {results.data.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {results.data.map((item, index) => {
                  const { cleanText, citations } = parseCitations(item.description);
                  
                  return (
                    <article key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                      <div className="p-4 sm:p-6 lg:p-8">
                        {/* Date Badge */}
                        <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3 sm:mb-4">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(item.date)}
                        </div>

                        {/* Event Description */}
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 leading-relaxed mb-3 sm:mb-4 line-clamp-3 break-words">
                          {cleanText}
                        </h3>

                        {/* Category Information */}
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 flex-wrap">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="font-medium text-gray-700 break-words" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item.category2) }}></span>
                          {item.category1 && (
                            <>
                              <span className="mx-2 text-gray-400 flex-shrink-0">•</span>
                              <span className="break-words" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item.category1) }}></span>
                            </>
                          )}
                        </div>

                        {/* Citations */}
                        {citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="text-xs sm:text-sm text-gray-500 mb-2">Sources:</div>
                            <div className="space-y-1 sm:space-y-2">
                              {citations.map((citation, citationIndex) => (
                                <div key={citationIndex} className="text-xs sm:text-sm text-gray-600 flex items-start">
                                  <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                                  <div className="flex-1 min-w-0">
                                    <span className="break-words">{formatCitation(citation)}</span>
                                    {citation.url && (
                                      <a 
                                        href={citation.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 ml-1 underline whitespace-nowrap"
                                      >
                                        [Link]
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="max-w-md mx-auto">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    We couldn't find any historical events matching your search.
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500">
                    <p>Try:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Using different keywords</li>
                      <li>• Checking your spelling</li>
                      <li>• Using more general terms</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <nav className="flex items-center space-x-0.5 sm:space-x-1">
                  {renderPagination()}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 