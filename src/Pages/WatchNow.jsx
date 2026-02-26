// Pages/WatchNow.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Film, Users, Award, ChevronLeft } from 'lucide-react';
import { getMovieById } from '../data/movies';

const WatchNow = ({ isLoggedIn, updateWatched }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/sign', { 
        state: { from: `/watch/${id}` }
      });
      return;
    }

    if (!movie) {
      const foundMovie = getMovieById(id);
      if (foundMovie) {
        setMovie(foundMovie);
        const savedProgress = localStorage.getItem(`progress_${id}`);
        setProgress(savedProgress ? parseInt(savedProgress) : 0);
      }
    }
    setLoading(false);
  }, [id, isLoggedIn, navigate, movie]);

  useEffect(() => {
    if (!movie || !isLoggedIn) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        localStorage.setItem(`progress_${id}`, newProgress.toString());
        
        if (newProgress % 5 === 0 || newProgress === 100) {
          const totalMinutes = parseInt(movie.Runtime?.replace(' min', '')) || 120;
          const minutesLeft = Math.max(0, totalMinutes - Math.floor(totalMinutes * (newProgress/100)));
          
          updateWatched(id, {
            title: movie.Title,
            poster: movie.Poster,
            year: movie.Year,
            type: movie.Type,
            minutesLeft,
            progress: newProgress
          });
        }
        
        return newProgress;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [movie, isLoggedIn, updateWatched, id]);

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="watch-page">
        <div className="skeleton" style={{ height: '70vh' }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="watch-page">
        <div className="empty-state">
          <Film size={64} />
          <h3>Movie not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      {/* Hero Section */}
      <div 
        className="watch-hero"
        style={{
          backgroundImage: `url(${movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.jpg"})`
        }}
      >
        <div className="watch-hero-overlay">
          <div className="watch-hero-content">
            <button 
              className="back-btn"
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <h1 className="watch-hero-title">{movie.Title}</h1>
            <div className="watch-hero-meta">
              <span className="watch-hero-rating">
                <Star size={18} fill="#ffd700" color="#ffd700" />
                {movie.imdbRating || 'N/A'}
              </span>
              <span className="watch-hero-year">{movie.Year}</span>
              <span className="watch-hero-runtime">{movie.Runtime || 'N/A'}</span>
              <span className="watch-hero-type">{movie.Type}</span>
            </div>
            <p className="watch-hero-overview">{movie.Plot}</p>
            <div className="watch-buttons">
              <button className="watch-btn" style={{ background: 'white', color: 'black' }}>
                <Play size={20} fill="currentColor" />
                Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {movie.trailerId && (
        <div className="watch-trailer-section">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Trailer</h2>
          <div className="watch-trailer">
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerId}`}
              title={`${movie.Title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="watch-details" style={{ padding: '0 4% 2rem' }}>
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="progress-container">
            <h3>Your Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{progress}% watched</p>
          </div>
        )}

        {/* Cast */}
        {movie.Actors && (
          <div className="watch-detail-section">
            <h3 className="watch-detail-title">
              <Users size={18} style={{ marginRight: '0.5rem' }} />
              Cast
            </h3>
            <div className="watch-cast">
              {movie.Actors.split(', ').map((actor, index) => (
                <div key={index} className="cast-item">
                  {actor}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {movie.Director && (
            <div className="watch-detail-section">
              <h3 className="watch-detail-title">
                <Award size={18} style={{ marginRight: '0.5rem' }} />
                Director
              </h3>
              <p>{movie.Director}</p>
            </div>
          )}
          
          {movie.Writer && (
            <div className="watch-detail-section">
              <h3 className="watch-detail-title">Writer</h3>
              <p>{movie.Writer}</p>
            </div>
          )}

          {movie.Genre && (
            <div className="watch-detail-section">
              <h3 className="watch-detail-title">
                <Film size={18} style={{ marginRight: '0.5rem' }} />
                Genre
              </h3>
              <p>{movie.Genre}</p>
            </div>
          )}

          {movie.Country && (
            <div className="watch-detail-section">
              <h3 className="watch-detail-title">Country</h3>
              <p>{movie.Country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchNow;
