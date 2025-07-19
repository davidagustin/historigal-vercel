'use client';

import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { EmptySearchReturn } from './EmptySearchReturn';
import { SearchItems } from './SearchItems';

interface SearchItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

interface SearchProps {
  resetInputBar: () => void;
  changeView: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputBarText: string;
  searchResults: SearchItem[];
  totalItems: number;
  pageCount: number;
  isLoading: boolean;
  performSearch: (query: string, page?: number) => Promise<void>;
}

export default function Search({ 
  resetInputBar, 
  changeView, 
  handleChange, 
  inputBarText, 
  searchResults, 
  totalItems, 
  pageCount, 
  isLoading, 
  performSearch 
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(inputBarText || "");
  const [currentPage, setCurrentPage] = useState(0);

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
    setCurrentPage(e.selected);
    window.scrollTo(0, 0);
  };

  // Determine if we should show empty state
  const showEmptyState = totalItems === 0 && !isLoading;

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
        ) : showEmptyState ? (
          <EmptySearchReturn searchQuery={searchQuery} />
        ) : (
          <div>
            <SearchItems 
              totalItemsInSearch={totalItems}
              results={searchResults}
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