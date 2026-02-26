import React, { useState } from 'react';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown, FaFire } from 'react-icons/fa';

const NetflixCard = ({ movie, isLoggedIn, isFavorite, onToggleFavorite, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const rating = parseFloat(movie.imdbRating) || 0;
  const isHot = rating >= 8.5;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Please login to add to favorites');
      return;
    }
    
    // Call the toggle function
    onToggleFavorite(movie.imdbID);
    
    // Show feedback
    setToastMessage(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Please login to like movies');
      return;
    }
    
    // Toggle like state
    setLiked(!liked);
    
    // Also add to favorites when liked (if not already favorite)
    if (!isFavorite) {
      onToggleFavorite(movie.imdbID);
      setToastMessage('Added to favorites');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const posterUrl = !imageError && movie.Poster && movie.Poster !== "N/A"
    ? movie.Poster
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop";

  const getYear = () => {
    if (movie.Year && movie.Year.includes('-')) {
      return movie.Year.split('-')[0];
    }
    return movie.Year || 'N/A';
  };

  return (
    <>
      <div className="netflix-card" onClick={onClick}>
        {isHot && <div className="card-flame-effect" />}
        
        <img
          src={posterUrl}
          alt={movie.Title}
          className="card-poster"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        <div className="card-overlay">
          <h3 className="card-title">{movie.Title}</h3>
          <div className="card-meta">
            <span>{getYear()}</span>
            <span>{movie.Runtime || 'N/A'}</span>
          </div>
          
          <div className="flame-meter">
            {[...Array(5)].map((_, i) => (
              <FaFire
                key={i}
                style={{
                  color: i < Math.floor(rating / 2) ? '#ff6b6b' : '#3d3d3d',
                  fontSize: '1.2rem'
                }}
              />
            ))}
          </div>
          
          <div className="card-actions">
            <button className="card-action-btn" aria-label="Play">
              <FaPlay />
            </button>
            
            <button 
              className={`card-action-btn ${isFavorite ? 'favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <FaCheck /> : <FaPlus />}
            </button>
            
            <button 
              className={`card-action-btn like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLikeClick}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <FaThumbsUp />
            </button>
            
            <button className="card-action-btn" aria-label="More info">
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="favorite-toast">
          <FaFire className="toast-flame" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default NetflixCard;