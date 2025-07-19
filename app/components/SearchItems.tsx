'use client';

import React from 'react';

interface SearchItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

interface SearchItemsProps {
  totalItemsInSearch: number;
  results: SearchItem[];
}

export function SearchItems({ totalItemsInSearch, results }: SearchItemsProps) {
  const searchItems = results.map((item, i) => {
    let searchText;
    let category1;

    if (item.category1 === undefined) {
      category1 = item.category1;
    } else {
      category1 = item.category1.toLowerCase();
    }

    if (item.description.length > 50) {
      searchText = item.description.slice(0, 49) + '...';
    } else {
      searchText = item.description;
    }

    return (
      <div className={"itemContainer"} key={i}>
        <div className={"titleSearchText"}>
          {searchText}
        </div>
        <div className={"itemGreenText"}>
          Date: {item.date} Category type {category1}: {item.category2}
        </div>
        <div className={"itemDescription"}>
          {item.description}
        </div>
      </div>
    );
  });

  return (
    <div className={'test'}>
      <div className={'totalItems'}>About {totalItemsInSearch} results</div>
      <div>
        {searchItems}
      </div>
    </div>
  );
} 