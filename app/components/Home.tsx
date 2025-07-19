'use client';

import React, { useState } from 'react';

interface HomeProps {
  inputBarText: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeView: () => void;
}

export default function Home({ inputBarText, handleChange, changeView }: HomeProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBarText === "") {
      return;
    }
    changeView();
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
            placeholder={'Search Historigal'}
            autoComplete="off"
          />
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