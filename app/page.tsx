'use client';

import { useState } from 'react';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'home' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchQuery('');
  };

  return (
    <main className="min-h-screen">
      {currentView === 'home' ? (
        <HomeView onSearch={handleSearch} />
      ) : (
        <SearchView 
          query={searchQuery} 
          onBackToHome={handleBackToHome}
        />
      )}
    </main>
  );
} 