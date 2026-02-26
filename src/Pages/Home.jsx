import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NetflixCard from '../components/NetflixCard';
import { moviesData, getMoviesByGenre } from '../data/movies';

const Home = ({ isLoggedIn, favorites, onToggleFavorite }) => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [displayMovies, setDisplayMovies] = useState([]);
  const [sortBy, setSortBy] = useState('highest');
  
  // Movie category states
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [trending, setTrending] = useState([]);
  
  // Refs for carousels
  const actionRef = useRef(null);
  const comedyRef = useRef(null);
  const dramaRef = useRef(null);
  const horrorRef = useRef(null);
  const scifiRef = useRef(null);
  const tvRef = useRef(null);
  const trendingRef = useRef(null);
  
  const navigate = useNavigate();

  // Initialize data
  useEffect(() => {
    // Get top movies for featured section
    const topRated = [...moviesData]
      .filter(m => m.Type === 'movie')
      .sort((a, b) => {
        const ratingA = parseFloat(a.imdbRating) || 0;
        const ratingB = parseFloat(b.imdbRating) || 0;
        return ratingB - ratingA;
      })
      .slice(0, 10);
    setFeaturedMovies(topRated);

    // Categorize movies
    setActionMovies(getMoviesByGenre('action').slice(0, 20));
    setComedyMovies(getMoviesByGenre('comedy').slice(0, 20));
    setDramaMovies(getMoviesByGenre('drama').slice(0, 20));
    setHorrorMovies(getMoviesByGenre('horror').slice(0, 20));
    setScifiMovies(getMoviesByGenre('sci-fi').slice(0, 20));
    setTvShows(moviesData.filter(m => m.Type === 'series').slice(0, 20));
    
    // Trending (random selection of popular movies)
    const shuffled = [...moviesData].sort(() => 0.5 - Math.random());
    setTrending(shuffled.slice(0, 20));
    
    setDisplayMovies(moviesData);
  }, []);

  // Auto-rotate featured movies every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After animation starts, update the index
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setNextIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition time
      
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  // Update next index when current changes
  useEffect(() => {
    setNextIndex((currentIndex + 1) % featuredMovies.length);
  }, [currentIndex, featuredMovies.length]);

  // Filter by genre
  useEffect(() => {
    if (selectedGenre === 'all') {
      setDisplayMovies(moviesData);
    } else if (selectedGenre === 'tvshows') {
      setDisplayMovies(moviesData.filter(m => m.Type === 'series'));
    } else {
      setDisplayMovies(getMoviesByGenre(selectedGenre));
    }
  }, [selectedGenre]);

  const scrollRow = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/watch/${movie.imdbID}`, { state: { movie } });
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    // Sort the featured movies
    const sorted = [...featuredMovies].sort((a, b) => {
      const ratingA = parseFloat(a.imdbRating) || 0;
      const ratingB = parseFloat(b.imdbRating) || 0;
      return sort === 'highest' ? ratingB - ratingA : ratingA - ratingB;
    });
    setFeaturedMovies(sorted);
    setCurrentIndex(0);
    setNextIndex(1);
  };

  const genres = [
    { id: 'all', name: 'All Movies' },
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'horror', name: 'Horror' },
    { id: 'sci-fi', name: 'Sci-Fi' },
    { id: 'tvshows', name: 'TV Shows' }
  ];

  if (!featuredMovies.length) {
    return (
      <div className="movie-rows">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="movie-row">
            <div className="row-header">
              <div className="skeleton-card" style={{ width: '200px', height: '30px' }} />
            </div>
            <div className="row-content">
              <div className="movie-row-carousel">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className="skeleton-card" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const currentMovie = featuredMovies[currentIndex];
  const nextMovie = featuredMovies[nextIndex];

  return (
    <>
      {/* Hero Section with Vertical Carousel */}
      <div className="hero-vertical-section">
        <div className="hero-vertical-container">
          {/* Main Featured Movie */}
          <div className="hero-main">
            <div className={`hero-main-content ${isTransitioning ? 'slide-up' : ''}`}>
              <div className="hero-main-poster">
                <img 
                  src={currentMovie?.Poster !== "N/A" ? currentMovie?.Poster : "https://via.placeholder.com/600x900?text=No+Poster"} 
                  alt={currentMovie?.Title}
                  onError={(e) => e.target.src = "https://via.placeholder.com/600x900?text=No+Poster"}
                />
                <div className="hero-main-rating">
                  <span className="rating-star">★</span>
                  <span className="rating-value">{currentMovie?.imdbRating || 'N/A'}</span>
                  {currentMovie?.Runtime && <span className="rating-hd">HD</span>}
                </div>
              </div>
              
              <div className="hero-main-info">
                <h1 className="hero-main-title">{currentMovie?.Title}</h1>
                <p className="hero-main-description">{currentMovie?.Plot || 'No description available.'}</p>
                <button 
                  className="hero-main-watch"
                  onClick={() => handleMovieClick(currentMovie)}
                >
                  Watch now
                </button>
              </div>
            </div>
          </div>

          {/* Next Movies Preview */}
          <div className="hero-next">
            <div className="hero-next-header">
              <h3>Coming up next</h3>
              <div className="hero-next-timer">
                <span className="timer-dot"></span>
                <span>in 7s</span>
              </div>
            </div>
            
            <div className="hero-next-list">
              {/* Next Movie (will slide up) */}
              <div className={`hero-next-item ${isTransitioning ? 'slide-up' : ''}`}>
                <div className="hero-next-poster">
                  <img 
                    src={nextMovie?.Poster !== "N/A" ? nextMovie?.Poster : "https://via.placeholder.com/100x150?text=No+Poster"} 
                    alt={nextMovie?.Title}
                    onError={(e) => e.target.src = "https://via.placeholder.com/100x150?text=No+Poster"}
                  />
                </div>
                <div className="hero-next-info">
                  <h4>{nextMovie?.Title}</h4>
                  <p>{nextMovie?.Plot?.substring(0, 60)}...</p>
                  <div className="hero-next-meta">
                    <span className="next-rating">★ {nextMovie?.imdbRating || 'N/A'}</span>
                    <span className="next-year">{nextMovie?.Year}</span>
                  </div>
                </div>
              </div>

              {/* Additional upcoming movies (static) */}
              {featuredMovies.slice(nextIndex + 1, nextIndex + 4).map((movie, idx) => (
                <div key={movie.imdbID} className="hero-next-item static">
                  <div className="hero-next-poster small">
                    <img 
                      src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/80x120?text=No+Poster"} 
                      alt={movie.Title}
                      onError={(e) => e.target.src = "https://via.placeholder.com/80x120?text=No+Poster"}
                    />
                  </div>
                  <div className="hero-next-info compact">
                    <h4>{movie.Title}</h4>
                    <div className="hero-next-meta">
                      <span className="next-rating">★ {movie.imdbRating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-next-controls">
              <button className="hero-next-btn" onClick={() => handleSortChange('highest')}>
                Highest Rated
              </button>
              <button className="hero-next-btn" onClick={() => handleSortChange('lowest')}>
                Lowest Rated
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Genre Sidebar */}
      <div className="main-content">
        {/* Genre Sidebar */}
        <div className="genres-sidebar">
          <h3>Browse by Genre</h3>
          <ul className="genre-list">
            {genres.map(genre => (
              <li
                key={genre.id}
                className={selectedGenre === genre.id ? 'active' : ''}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Movie Rows Container */}
        <div className="movie-rows-container" id="movies-section">
          {/* Trending Row */}
          <MovieRow
            title="Trending Now"
            movies={trending}
            carouselRef={trendingRef}
            onScrollLeft={() => scrollRow(trendingRef, 'left')}
            onScrollRight={() => scrollRow(trendingRef, 'right')}
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onMovieClick={handleMovieClick}
          />

          {/* Action Movies */}
          {actionMovies.length > 0 && (
            <MovieRow
              title="Action Movies"
              movies={actionMovies}
              carouselRef={actionRef}
              onScrollLeft={() => scrollRow(actionRef, 'left')}
              onScrollRight={() => scrollRow(actionRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* Comedy Movies */}
          {comedyMovies.length > 0 && (
            <MovieRow
              title="Comedy Movies"
              movies={comedyMovies}
              carouselRef={comedyRef}
              onScrollLeft={() => scrollRow(comedyRef, 'left')}
              onScrollRight={() => scrollRow(comedyRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* Drama Movies */}
          {dramaMovies.length > 0 && (
            <MovieRow
              title="Drama Movies"
              movies={dramaMovies}
              carouselRef={dramaRef}
              onScrollLeft={() => scrollRow(dramaRef, 'left')}
              onScrollRight={() => scrollRow(dramaRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* Horror Movies */}
          {horrorMovies.length > 0 && (
            <MovieRow
              title="Horror Movies"
              movies={horrorMovies}
              carouselRef={horrorRef}
              onScrollLeft={() => scrollRow(horrorRef, 'left')}
              onScrollRight={() => scrollRow(horrorRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* Sci-Fi Movies */}
          {scifiMovies.length > 0 && (
            <MovieRow
              title="Sci-Fi Movies"
              movies={scifiMovies}
              carouselRef={scifiRef}
              onScrollLeft={() => scrollRow(scifiRef, 'left')}
              onScrollRight={() => scrollRow(scifiRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* TV Shows */}
          {tvShows.length > 0 && (
            <MovieRow
              title="TV Shows"
              movies={tvShows}
              carouselRef={tvRef}
              onScrollLeft={() => scrollRow(tvRef, 'left')}
              onScrollRight={() => scrollRow(tvRef, 'right')}
              isLoggedIn={isLoggedIn}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

// Movie Row Component
const MovieRow = ({ 
  title, 
  movies, 
  carouselRef, 
  onScrollLeft, 
  onScrollRight, 
  isLoggedIn, 
  favorites, 
  onToggleFavorite,
  onMovieClick 
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [carouselRef]);

  return (
    <div className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-controls">
          <button 
            className="row-btn" 
            onClick={onScrollLeft}
            disabled={!showLeftArrow}
            style={{ opacity: showLeftArrow ? 1 : 0.3 }}
          >
            ‹
          </button>
          <button 
            className="row-btn" 
            onClick={onScrollRight}
            disabled={!showRightArrow}
            style={{ opacity: showRightArrow ? 1 : 0.3 }}
          >
            ›
          </button>
        </div>
      </div>
      <div className="row-content">
        <div className="movie-row-carousel" ref={carouselRef}>
          {movies.map((movie) => (
            <NetflixCard
              key={movie.imdbID}
              movie={movie}
              isLoggedIn={isLoggedIn}
              isFavorite={favorites.includes(movie.imdbID)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => onMovieClick(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
