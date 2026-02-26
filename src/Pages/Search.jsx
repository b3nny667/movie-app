import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NetflixCard from '../components/NetflixCard';
import { moviesData, searchMovies } from '../data/movies';
import { FaFire } from 'react-icons/fa';

const Search = ({ isLoggedIn, favorites, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Marvel', 'DC', 'Netflix']);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search
  const handleSearch = (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    saveRecentSearch(term);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const searchResults = searchMovies(term);
      setResults(searchResults);
      setLoading(false);
    }, 300);
  };

  // Handle search input change
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (term.trim()) {
        handleSearch(term);
      } else {
        setResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  // Handle movie click
  const handleMovieClick = (movie) => {
    navigate(`/watch/${movie.imdbID}`, { state: { movie } });
  };

  // Handle recent search click
  const handleRecentClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  return (
    <div className="search-page">
      <div className="search-header">
       <h1>
  <FaFire className="title-flame" /> Search Movies & TV Shows
</h1>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by title, genre, or actor..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch}>
              ✕
            </button>
          )}
          <button className="search-submit" onClick={() => handleSearch(searchTerm)}>
            Search
          </button>
        </div>
      </div>

      {!searchTerm ? (
        // Search suggestions when no search term
        <div className="search-suggestions">
          {recentSearches.length > 0 && (
            <div className="suggestion-section">
              <h3>Recent Searches</h3>
              <div className="suggestion-tags">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    className="suggestion-tag"
                    onClick={() => handleRecentClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="suggestion-section">
            <h3>Popular Searches</h3>
            <div className="suggestion-tags">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  className="suggestion-tag"
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch(term);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="suggestion-section">
            <h3>Browse by Genre</h3>
            <div className="suggestion-tags">
              <button className="suggestion-tag" onClick={() => navigate('/genre/action')}>Action</button>
              <button className="suggestion-tag" onClick={() => navigate('/genre/comedy')}>Comedy</button>
              <button className="suggestion-tag" onClick={() => navigate('/genre/drama')}>Drama</button>
              <button className="suggestion-tag" onClick={() => navigate('/genre/horror')}>Horror</button>
              <button className="suggestion-tag" onClick={() => navigate('/genre/sci-fi')}>Sci-Fi</button>
            </div>
          </div>
        </div>
      ) : (
        // Search results
        <div className="search-results">
          <div className="results-header">
            <h2>{results.length} Results found for "{searchTerm}"</h2>
            {results.length > 0 && (
              <span className="results-count">
                Showing {results.length} of {results.length} movies
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="movies-grid">
              {results.map(movie => (
                <NetflixCard
                  key={movie.imdbID}
                  movie={movie}
                  isLoggedIn={isLoggedIn}
                  isFavorite={favorites.includes(movie.imdbID)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No movies found</h3>
              <p>We couldn't find any movies matching "{searchTerm}"</p>
              <div className="no-results-suggestions">
                <h4>Suggestions:</h4>
                <ul>
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try searching by genre</li>
                </ul>
              </div>
              <button className="home-button" onClick={clearSearch}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;