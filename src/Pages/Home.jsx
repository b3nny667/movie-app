import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "../App.css";

const API_URL = "http://www.omdbapi.com/?apikey=eb36c47c";

const Home = ({ isLoggedIn, favorites, onToggleFavorite, updateAllMovies }) => {
  const [searchParams] = useSearchParams();
  const genreQuery = searchParams.get("genre");
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  
  const topMovies = [
    { 
      imdbID: "tt0111161", 
      Title: "The Shawshank Redemption", 
      Year: "1994",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
      Plot: "Two imprisoned men bond over a number of years...",
      Genre: "Drama",
      Runtime: "142 min",
      Director: "Frank Darabont",
      Actors: "Tim Robbins, Morgan Freeman",
      imdbRating: "9.3",
      trailerId: "6hB3S9bIaco"
    },
    { 
      imdbID: "tt0068646", 
      Title: "The Godfather", 
      Year: "1972",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      Plot: "The aging patriarch of an organized crime dynasty...",
      Genre: "Crime, Drama",
      Runtime: "175 min",
      Director: "Francis Ford Coppola",
      Actors: "Marlon Brando, Al Pacino",
      imdbRating: "9.2",
      trailerId: "sY1S34973zA"
    },
    { 
      imdbID: "tt0071562", 
      Title: "The Godfather Part II", 
      Year: "1974",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      Plot: "The early life and career of Vito Corleone...",
      Genre: "Crime, Drama",
      Runtime: "202 min",
      Director: "Francis Ford Coppola",
      Actors: "Al Pacino, Robert De Niro",
      imdbRating: "9.0",
      trailerId: "9O1Iy9od7-A"
    },
    { 
      imdbID: "tt0468569", 
      Title: "The Dark Knight", 
      Year: "2008",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      Plot: "When the menace known as the Joker wreaks havoc...",
      Genre: "Action, Crime, Drama",
      Runtime: "152 min",
      Director: "Christopher Nolan",
      Actors: "Christian Bale, Heath Ledger",
      imdbRating: "9.0",
      trailerId: "EXeTwQWrcwY"
    },
    { 
      imdbID: "tt0050083", 
      Title: "12 Angry Men", 
      Year: "1957",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg",
      Plot: "A jury holdout attempts to prevent a miscarriage...",
      Genre: "Crime, Drama",
      Runtime: "96 min",
      Director: "Sidney Lumet",
      Actors: "Henry Fonda, Lee J. Cobb",
      imdbRating: "9.0",
      trailerId: "TEN-2uTi2c0"
    },
    { 
      imdbID: "tt0108052", 
      Title: "Schindler's List", 
      Year: "1993",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      Plot: "In German-occupied Poland during World War II...",
      Genre: "Biography, Drama, History",
      Runtime: "195 min",
      Director: "Steven Spielberg",
      Actors: "Liam Neeson, Ralph Fiennes",
      imdbRating: "9.0",
      trailerId: "gG22XNhtnoY"
    },
    { 
      imdbID: "tt0167260", 
      Title: "The Lord of the Rings: The Return of the King", 
      Year: "2003",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      Plot: "Gandalf and Aragorn lead the World of Men...",
      Genre: "Adventure, Fantasy",
      Runtime: "201 min",
      Director: "Peter Jackson",
      Actors: "Elijah Wood, Viggo Mortensen",
      imdbRating: "9.0",
      trailerId: "r5X-hFf6Bwo"
    },
    { 
      imdbID: "tt0110912", 
      Title: "Pulp Fiction", 
      Year: "1994",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      Plot: "The lives of two mob hitmen, a boxer...",
      Genre: "Crime, Drama",
      Runtime: "154 min",
      Director: "Quentin Tarantino",
      Actors: "John Travolta, Uma Thurman",
      imdbRating: "8.9",
      trailerId: "s7EdQ4FqbhY"
    },
    { 
      imdbID: "tt0120737", 
      Title: "The Lord of the Rings: The Fellowship of the Ring", 
      Year: "2001",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
      Plot: "A meek Hobbit from the Shire and eight companions...",
      Genre: "Adventure, Fantasy",
      Runtime: "178 min",
      Director: "Peter Jackson",
      Actors: "Elijah Wood, Ian McKellen",
      imdbRating: "8.8",
      trailerId: "V75dMMIW2B4"
    },
    { 
      imdbID: "tt0137523", 
      Title: "Fight Club", 
      Year: "1999",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
      Plot: "An insomniac office worker and a devil-may-care soapmaker...",
      Genre: "Drama",
      Runtime: "139 min",
      Director: "David Fincher",
      Actors: "Brad Pitt, Edward Norton",
      imdbRating: "8.8",
      trailerId: "qtRKdVHc-cE"
    }
  ];

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (currentIndex + 1) % topMovies.length;
        setCurrentIndex(nextIndex);
        const scrollAmount = nextIndex * 220;
        carouselRef.current.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, topMovies.length]);

  const handleCarouselClick = (movie) => {
    navigate(`/watch/${movie.imdbID}`, { state: { movie } });
  };

  const scrollPrev = () => {
    const newIndex = (currentIndex - 1 + topMovies.length) % topMovies.length;
    setCurrentIndex(newIndex);
    carouselRef.current.scrollTo({
      left: newIndex * 220,
      behavior: 'smooth'
    });
  };

  const scrollNext = () => {
    const newIndex = (currentIndex + 1) % topMovies.length;
    setCurrentIndex(newIndex);
    carouselRef.current.scrollTo({
      left: newIndex * 220,
      behavior: 'smooth'
    });
  };

  const handleSearch = (title) => {
    if (!title.trim()) return;
    setSearchTerm(title);
    searchMovies(title);
  };

  const searchMovies = async (title) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}&s=${title}`);
      
      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();
      
      if (data.Response === "True") {
        const moviesWithDetails = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const detailsResponse = await fetch(`${API_URL}&i=${movie.imdbID}`);
              const details = await detailsResponse.json();
              return { ...movie, ...details };
            } catch {
              return movie;
            }
          })
        );
        setMovies(moviesWithDetails);
        updateAllMovies(moviesWithDetails);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found");
      }
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genreQuery) {
      searchMovies(genreQuery);
    } else {
      searchMovies("batman");
    }
  }, [genreQuery]);

  return (
    <div className="app">
      {/* Top Movies Carousel */}
      <div className="top-movies-section">
        <h2 className="section-title">Top 10 Movies This Week</h2>
        <div className="carousel-container">
          <button className="carousel-button left" onClick={scrollPrev}>
            &lt;
          </button>
          <div className="movies-carousel" ref={carouselRef}>
            {topMovies.map((movie, index) => (
              <div 
                key={movie.imdbID} 
                className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleCarouselClick(movie)}
              >
                <img 
                  src={movie.Poster} 
                  alt={movie.Title}
                  className="carousel-poster"
                />
                <div className="carousel-title">{movie.Title}</div>
              </div>
            ))}
          </div>
          <button className="carousel-button right" onClick={scrollNext}>
            &gt;
          </button>
        </div>
      </div>

      {/* searchi*/}
      <div className="search" style={{ 
        width: '65%', 
        maxWidth: '500px', 
        margin: '1.5rem auto',
        padding: '0',
        height: '40px',
        boxShadow: 'none' 
      }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
          placeholder="Search for movies"
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            border: 'none',
            fontSize: '0.9rem',
            height: '100%'
          }}
        />
        <div 
          onClick={() => handleSearch(searchTerm)} 
          style={{ 
            marginLeft: '-30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#f9d3b4" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Movie Results */}
      {loading ? (
        <div className="empty">
          <h2>Loading movies...</h2>
        </div>
      ) : error ? (
        <div className="empty">
          <h2>{error}</h2>
          <button className="home-button" onClick={() => searchMovies("batman")}>
            Go to Home Page
          </button>
        </div>
      ) : movies.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              isLoggedIn={isLoggedIn}
              isFavorite={favorites.includes(movie.imdbID)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
          <button className="home-button" onClick={() => searchMovies("batman")}>
            Go to Home Page
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
