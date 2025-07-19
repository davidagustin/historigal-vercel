'use client';

import React, { useState, useEffect } from 'react';

interface HomeProps {
  inputBarText: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeView: () => void;
}

interface SearchSuggestion {
  description: string;
  date: string;
}

export default function Home({ inputBarText, handleChange, changeView }: HomeProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate suggestions based on input
  useEffect(() => {
    if (inputBarText.length >= 2) {
      generateSuggestions(inputBarText);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputBarText]);

  const generateSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events?description_like=${encodeURIComponent(query)}&_limit=5`);
      const data = await response.json();
      setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBarText === "") {
      return;
    }
    setShowSuggestions(false);
    changeView();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Update the input with the selected suggestion
    const event = {
      target: {
        name: 'inputBarText',
        value: suggestion.description
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
    setShowSuggestions(false);
    changeView();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className='searchInHome'>
      <img 
        className='logoInHome'
        src='/historigal.png'
        alt='Historigal Logo'
      />
      <form className='form'>
        <div style={{ position: 'relative' }}>
          <input 
            className='inputBarHome'
            name='inputBarText'
            type='search'
            value={inputBarText}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={'Search Historigal'}
            autoComplete="off"
          />
          {showSuggestions && (
            <div className="autocomplete-dropdown">
              {isLoading ? (
                <div className="suggestion-item">Loading...</div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-text">
                      {suggestion.description.length > 60 
                        ? suggestion.description.substring(0, 60) + '...'
                        : suggestion.description
                      }
                    </div>
                    <div className="suggestion-date">{suggestion.date}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <input 
          className='submitButton'
          type="submit"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
} 