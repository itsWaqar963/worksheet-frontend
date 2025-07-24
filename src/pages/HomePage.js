import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Integrate search/filter logic here
    alert(`Searching for: ${search} with filter: ${filter}`);
  };

  return (
    <div
      className="ai-homepage"
      style={{
        minHeight: '100vh',
        background: '#f6f5ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '40px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: '#7b6ef6',
          marginBottom: '2.5rem',
          letterSpacing: 1,
        }}
      >
        BBWORKSHEETS
      </h1>
      <form
        onSubmit={handleSearch}
        style={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', marginBottom: 24 }}>
          <input
            type="text"
            placeholder="✨ Search worksheets here..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1.2rem 1.5rem',
              border: '2px solid #a89af7',
              borderRadius: 12,
              fontSize: '1.3rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(123,110,246,0.07)',
              marginBottom: 0,
              fontWeight: 500,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <button
            type="button"
            onClick={() => handleFilter('tags')}
            style={{
              background: filter === 'tags' ? '#7b6ef6' : '#ecebfc',
              color: filter === 'tags' ? '#fff' : '#7b6ef6',
              border: 'none',
              borderRadius: 32,
              padding: '0.9rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Tags
          </button>
          <button
            type="button"
            onClick={() => handleFilter('category')}
            style={{
              background: filter === 'category' ? '#7b6ef6' : '#ecebfc',
              color: filter === 'category' ? '#fff' : '#7b6ef6',
              border: 'none',
              borderRadius: 32,
              padding: '0.9rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Category
          </button>
          <button
            type="button"
            onClick={() => handleFilter('latest')}
            style={{
              background: filter === 'latest' ? '#7b6ef6' : '#ecebfc',
              color: filter === 'latest' ? '#fff' : '#7b6ef6',
              border: 'none',
              borderRadius: 32,
              padding: '0.9rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Latest Uploads
          </button>
        </div>
        <button
          type="submit"
          style={{
            background: '#7b6ef6',
            color: '#fff',
            border: 'none',
            borderRadius: 18,
            padding: '1.1rem 3.5rem',
            fontSize: '1.3rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(123,110,246,0.09)',
            cursor: 'pointer',
            marginTop: 0,
          }}
        >
          Search Worksheet
        </button>
      </form>
    </div>
  );
};

export default HomePage; 