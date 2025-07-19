'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setSearchQuery(inputBarText);
    getData();
  }, [inputBarText]);

  const getData = async (pageNumber = 0) => {
    try {
      const results = await axios.get(`/api/events?description_like=${searchQuery}`);
      const totalItems = results.data.length;
      const newPageCount = Math.ceil(totalItems / 10);
      
      setTotalItemsInSearch(totalItems);
      setPageCount(newPageCount);
      setCurrentPage(pageNumber);

      const paginatedResults = await axios.get(`/api/events?description_like=${searchQuery}&_page=${pageNumber}&_limit=10`);
      
      if (paginatedResults.data.length === 0) {
        setEmptySearch(true);
        setSearchResult([]);
      } else {
        setEmptySearch(false);
        setSearchResult(paginatedResults.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setEmptySearch(true);
      setSearchResult([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBarText === "") {
      return;
    }
    setSearchQuery(inputBarText);
    setTotalItemsInSearch(null);
    setPageCount(0);
    setEmptySearch(true);
    setCurrentPage(0);
    getData();
  };

  const handlePageClick = (e: { selected: number }) => {
    getData(e.selected + 1);
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
          />
        </form>
      </div>
      <div className={'searchItems'}>
        {emptySearch ? (
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
          </div>
        )}
      </div>
      <div className={"greyFilling"} />
    </div>
  );
} 