'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchView from '../components/SearchView';
import HomeView from '../components/HomeView';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // If no query, show home page
  if (!query) {
    return <HomeView onSearch={handleSearch} />;
  }

  return (
    <SearchView 
      query={query} 
      onBackToHome={handleBackToHome}
    />
  );
} 