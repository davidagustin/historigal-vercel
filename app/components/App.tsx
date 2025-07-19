'use client';

import React, { useState, useCallback, useRef } from 'react';
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
  
  // Use ref to prevent multiple simultaneous API calls
  const isSearchingRef = useRef(false);

  const performSearch = useCallback(async (query: string, page: number = 1) => {
    console.log(`🔍 performSearch called with query: "${query}", page: ${page}`);
    console.log(`🔍 Current view: ${view}, isLoading: ${isLoading}, isSearchingRef: ${isSearchingRef.current}`);
    
    // Prevent multiple simultaneous searches
    if (isSearchingRef.current) {
      console.log('🔍 Search already in progress, skipping');
      return;
    }
    
    if (!query.trim()) {
      console.log('🔍 Empty query, clearing results');
      setSearchResults([]);
      setTotalItems(0);
      setPageCount(0);
      setIsLoading(false);
      return;
    }

    console.log('🔍 Setting loading to true and isSearchingRef to true');
    setIsLoading(true);
    isSearchingRef.current = true;
    
    try {
      console.log(`🔍 Making API call for count: /api/events?description_like=${encodeURIComponent(query)}`);
      
      // First, get total count
      const countResponse = await axios.get(`/api/events?description_like=${encodeURIComponent(query)}`);
      const totalItemsCount = countResponse.data.length;
      const newPageCount = Math.ceil(totalItemsCount / 10);
      
      console.log(`🔍 Count response: ${totalItemsCount} items, ${newPageCount} pages`);
      
      setTotalItems(totalItemsCount);
      setPageCount(newPageCount);

      if (totalItemsCount === 0) {
        console.log('🔍 No results found, clearing search results');
        setSearchResults([]);
      } else {
        console.log(`🔍 Making API call for paginated results: /api/events?description_like=${encodeURIComponent(query)}&_page=${page}&_limit=10`);
        
        // Get paginated results
        const paginatedResponse = await axios.get(
          `/api/events?description_like=${encodeURIComponent(query)}&_page=${page}&_limit=10`
        );
        
        console.log(`🔍 Paginated response: ${paginatedResponse.data.length} items`);
        setSearchResults(paginatedResponse.data);
      }
    } catch (error) {
      console.error('🔍 Error fetching data:', error);
      setSearchResults([]);
      setTotalItems(0);
      setPageCount(0);
    } finally {
      console.log('🔍 Setting loading to false and isSearchingRef to false');
      setIsLoading(false);
      isSearchingRef.current = false;
    }
  }, []); // Empty dependency array to prevent recreation

  const resetInputBar = useCallback(() => {
    console.log('🔍 resetInputBar called');
    setInputBarText("");
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'inputBarText') {
      console.log(`🔍 handleChange: ${value}`);
      setInputBarText(value);
    }
  }, []);

  const changeView = useCallback(() => {
    console.log(`🔍 changeView called, current view: ${view}`);
    
    if (view === 'home') {
      // Switching to search view
      console.log('🔍 Switching to search view');
      setView('search');
      // Perform initial search only if we have text - use setTimeout to avoid dependency issues
      if (inputBarText && inputBarText.trim()) {
        console.log(`🔍 Scheduling initial search for: "${inputBarText}"`);
        setTimeout(() => {
          performSearch(inputBarText, 1);
        }, 0);
      }
    } else {
      // Switching back to home view
      console.log('🔍 Switching to home view');
      setView('home');
      setSearchResults([]);
      setTotalItems(0);
      setPageCount(0);
      setIsLoading(false);
      isSearchingRef.current = false;
    }
  }, [view, inputBarText]); // Removed performSearch from dependencies

  console.log(`🔍 App render - view: ${view}, inputBarText: "${inputBarText}", isLoading: ${isLoading}`);

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