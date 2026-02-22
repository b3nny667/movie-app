import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { FaClock, FaTv } from 'react-icons/fa';

const API_URL = "http://www.omdbapi.com/?apikey=eb36c47c";

const WatchNow = ({ isLoggedIn, updateWatched }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/sign', { 
        state: { 
          from: `/watch/${id}`,
          message: "Please sign in to watch movies" 
        } 
      });
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}&i=${id}&plot=full`);
        const data = await response.json();
        
        if (data.Response === "True") {
          setMovie({
            ...data,
            trailerId: data.imdbID || "dQw4w9WgXcQ"
          });
          const savedProgress = localStorage.getItem(`progress_${id}`);
          setProgress(savedProgress ? parseInt(savedProgress) : 0);
        } else {
          setError(data.Error || "Movie not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!movie) fetchMovieDetails();
    else setLoading(false);
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
            poster: movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.jpg",
            year: movie.Year,
            type: movie.Type,
            minutesLeft,
            progress: newProgress,
            lastWatched: new Date().toISOString()
          });
        }
        
        return newProgress;
      });
      setLastUpdate(Date.now());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(timer);
  }, [movie, isLoggedIn, updateWatched, id]);

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="empty" style={{ minHeight: "80vh" }}>
        <h2>Loading movie data...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="empty" style={{ minHeight: "80vh" }}>
        <h2>{error || "Movie not available"}</h2>
        <button className="home-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="watch-now-page">
      <div className="watch-now-container">
        <div className="movie-card-section">
          <img 
            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.jpg"} 
            alt={movie.Title} 
            className="watch-now-poster"
            onError={(e) => e.target.src = "/placeholder-movie.jpg"}
          />
          <div className="movie-meta">
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Type:</strong> {movie.Type}</p>
            <p><strong>Rating:</strong> {movie.imdbRating || "N/A"}</p>
            <p><strong>Runtime:</strong> {movie.Runtime || "N/A"}</p>
            <p><strong>Genre:</strong> {movie.Genre || "N/A"}</p>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p>Watched: {progress}%</p>
            </div>
          </div>
        </div>

        <div className="trailer-description-section">
          <div className="trailer-frame">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${movie.trailerId}`}
              title={`${movie.Title} Trailer`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <div className="movie-description">
            <h2>{movie.Title}</h2>
            <p><strong>Plot:</strong> {movie.Plot || "No description available."}</p>
            {movie.Actors && <p><strong>Cast:</strong> {movie.Actors}</p>}
            {movie.Director && <p><strong>Director:</strong> {movie.Director}</p>}
            {movie.Writer && <p><strong>Writer:</strong> {movie.Writer}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchNow;
