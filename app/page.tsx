'use client';

import { useRouter } from 'next/navigation';
import HomeView from './components/HomeView';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="min-h-screen">
      <HomeView onSearch={handleSearch} />
    </main>
  );
} 