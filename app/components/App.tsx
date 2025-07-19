'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Home from './Home';
import Search from './Search';

interface SearchItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

export default function App() {
  const [view, setView] = useState<'home' | 'search'>('home');
  const [inputBarText, setInputBarText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalItems(0);
      setPageCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Searching for:', query, 'page:', page);
      
      // First, get total count
      const countResponse = await axios.get(`/api/events?description_like=${encodeURIComponent(query)}`);
      const totalItemsCount = countResponse.data.length;
      const newPageCount = Math.ceil(totalItemsCount / 10);
      
      console.log('Total items found:', totalItemsCount, 'Page count:', newPageCount);
      
      setTotalItems(totalItemsCount);
      setPageCount(newPageCount);

      if (totalItemsCount === 0) {
        setSearchResults([]);
      } else {
        // Get paginated results
        const paginatedResponse = await axios.get(
          `/api/events?description_like=${encodeURIComponent(query)}&_page=${page}&_limit=10`
        );
        
        console.log('Paginated results:', paginatedResponse.data.length);
        setSearchResults(paginatedResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
      setTotalItems(0);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetInputBar = () => {
    setInputBarText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'inputBarText') {
      setInputBarText(value);
    }
  };

  const changeView = () => {
    setView(view === 'home' ? 'search' : 'home');
  };

  // Perform initial search when switching to search view
  useEffect(() => {
    if (view === 'search' && inputBarText && inputBarText.trim()) {
      performSearch(inputBarText, 1);
    }
  }, [view, inputBarText, performSearch]);

  return (
    <div>
      {view === 'home' ? (
        <Home 
          changeView={changeView}
          handleChange={handleChange}
          inputBarText={inputBarText}
        />
      ) : (
        <Search 
          resetInputBar={resetInputBar}
          changeView={changeView}
          handleChange={handleChange}
          inputBarText={inputBarText}
          searchResults={searchResults}
          totalItems={totalItems}
          pageCount={pageCount}
          isLoading={isLoading}
          performSearch={performSearch}
        />
      )}
    </div>
  );
} 