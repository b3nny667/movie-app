import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NetflixCard from './NetflixCard';
import { FaFire } from 'react-icons/fa';

const Favorites = ({ isLoggedIn, favorites, movies, onToggleFavorite }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Favorites page - Received favorites:', favorites);
    console.log('Favorites page - Received movies:', movies);
    
    // Filter movies that are in favorites
    const filtered = movies.filter(movie => 
      movie && movie.imdbID && favorites.includes(movie.imdbID)
    );
    
    console.log('Filtered favorite movies:', filtered);
    setFavoriteMovies(filtered);
  }, [favorites, movies]);

  if (!isLoggedIn) {
    return (
      <div className="empty-state">
        <FaFire className="empty-flame" />
        <h2>Please log in to view favorites</h2>
        <button onClick={() => navigate('/sign')} className="home-button">
          Sign In
        </button>
      </div>
    );
  }

  if (favoriteMovies.length === 0) {
    return (
      <div className="empty-state">
        <FaFire className="empty-flame" />
        <h2>No favorites yet</h2>
        <p>Click the + button or thumbs up icon on movies to add them to your favorites</p>
        <button onClick={() => navigate('/')} className="home-button">
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>
          <FaFire className="header-flame" /> Your Favorites <FaFire className="header-flame" />
        </h1>
        <p className="favorites-count">{favoriteMovies.length} movie{favoriteMovies.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="movies-grid">
        {favoriteMovies.map((movie) => (
          <NetflixCard
            key={movie.imdbID}
            movie={movie}
            isLoggedIn={isLoggedIn}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onClick={() => navigate(`/watch/${movie.imdbID}`, { state: { movie } })}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
