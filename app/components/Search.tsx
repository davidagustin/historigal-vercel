'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { EmptySearchReturn } from './EmptySearchReturn';
import { SearchItems } from './SearchItems';

interface SearchProps {
  resetInputBar: () => void;
  changeView: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputBarText: string;
}

interface SearchItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

export default function Search({ resetInputBar, changeView, handleChange, inputBarText }: SearchProps) {
  const [totalItemsInSearch, setTotalItemsInSearch] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emptySearch, setEmptySearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const hasSearchedRef = useRef(false);

  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setEmptySearch(true);
      setSearchResult([]);
      setTotalItemsInSearch(0);
      setPageCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setEmptySearch(false);
    
    try {
      console.log('Searching for:', query, 'page:', page);
      
      // First, get total count
      const countResponse = await axios.get(`/api/events?description_like=${encodeURIComponent(query)}`);
      const totalItems = countResponse.data.length;
      const newPageCount = Math.ceil(totalItems / 10);
      
      console.log('Total items found:', totalItems, 'Page count:', newPageCount);
      
      setTotalItemsInSearch(totalItems);
      setPageCount(newPageCount);
      setCurrentPage(page - 1); // ReactPaginate uses 0-based indexing

      if (totalItems === 0) {
        setEmptySearch(true);
        setSearchResult([]);
      } else {
        // Get paginated results
        const paginatedResponse = await axios.get(
          `/api/events?description_like=${encodeURIComponent(query)}&_page=${page}&_limit=10`
        );
        
        console.log('Paginated results:', paginatedResponse.data.length);
        
        setEmptySearch(false);
        setSearchResult(paginatedResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setEmptySearch(true);
      setSearchResult([]);
      setTotalItemsInSearch(0);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize search when component mounts or when inputBarText changes
  useEffect(() => {
    // Only perform search if we haven't already searched for this query
    if (inputBarText && inputBarText.trim() && !hasSearchedRef.current) {
      setSearchQuery(inputBarText);
      performSearch(inputBarText, 1);
      hasSearchedRef.current = true;
    } else if (!inputBarText || !inputBarText.trim()) {
      setEmptySearch(true);
      setSearchResult([]);
      setTotalItemsInSearch(0);
      setPageCount(0);
      hasSearchedRef.current = false;
    }
  }, [inputBarText]); // Remove performSearch from dependencies

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBarText.trim()) {
      return;
    }
    setSearchQuery(inputBarText);
    performSearch(inputBarText, 1);
  };

  const handlePageClick = (e: { selected: number }) => {
    const newPage = e.selected + 1; // Convert to 1-based indexing
    console.log('Page clicked:', newPage);
    performSearch(searchQuery, newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className='searchInSearch'>
        <img 
          className='logoInSearch'
          src='/historigal.png'
          alt='Historigal Logo'
          onClick={() => {
            resetInputBar();
            changeView();
          }}
        />
        <form onSubmit={handleSubmit}>
          <input 
            className='inputBarInSearch'
            name='inputBarText'
            type='text'
            value={inputBarText}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Search Historigal"
          />
        </form>
      </div>
      <div className={'searchItems'}>
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '16px' }}>Loading...</div>
        ) : emptySearch ? (
          <EmptySearchReturn searchQuery={searchQuery} />
        ) : (
          <div>
            <SearchItems 
              totalItemsInSearch={totalItemsInSearch || 0}
              results={searchResult}
            />
            <img 
              className={'logoInSearchBottom'}
              src='/historigal.png'
              alt='Historigal Logo'
            />
            {pageCount > 1 && (
              <div>
                <ReactPaginate
                  initialPage={currentPage}
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={9}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={"greyFilling"} />
    </div>
  );
} 