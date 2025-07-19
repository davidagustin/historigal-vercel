'use client';

import React, { useState } from 'react';
import Home from './Home';
import Search from './Search';

export default function App() {
  const [view, setView] = useState<'home' | 'search'>('home');
  const [inputBarText, setInputBarText] = useState("");

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
        />
      )}
    </div>
  );
} 