import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './Pages/Home';
import Sign from './Pages/Sign';
import Register from './Pages/Register';
import Favorites from './components/Favorites';
import WatchNow from './Pages/WatchNow';
import Watched from './Pages/Watched';
import Search from './Pages/Search';
import { moviesData } from './data/movies'; // Import moviesData directly
import './App.css';
import './css/Netflix.css';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [allMovies, setAllMovies] = useState(moviesData); // Initialize with moviesData
  const [watchedItems, setWatchedItems] = useState([]);
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
    
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedWatched = localStorage.getItem('watchedItems');
    if (savedWatched) {
      setWatchedItems(JSON.parse(savedWatched));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Log to debug
    console.log('Favorites saved:', favorites);
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watchedItems', JSON.stringify(watchedItems));
  }, [watchedItems]);

  // Always dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleLogin = (email, redirectPath = '/') => {
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate(redirectPath);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleFavorite = (movieId) => {
    console.log('Toggling favorite:', movieId);
    setFavorites(prev => {
      const newFavorites = prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      console.log('New favorites:', newFavorites);
      return newFavorites;
    });
  };

  const updateWatched = (movieId, itemData) => {
    setWatchedItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === movieId);
      const newItem = {
        id: movieId,
        lastWatched: new Date().toISOString(),
        ...itemData
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }
      return [newItem, ...prev];
    });
  };

  return (
    <div className="netflix-app">
      <Nav 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={
          <Home 
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            updateAllMovies={setAllMovies}
          />
        } />
        
        <Route path="/home" element={
          <Home 
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            updateAllMovies={setAllMovies}
          />
        } />
        
        <Route path="/sign" element={
          <Sign onLogin={handleLogin} />
        } />
        
        <Route path="/register" element={
          <Register />
        } />
        
        <Route path="/favorites" element={
          <Favorites 
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            movies={allMovies} // Pass allMovies which contains moviesData
            onToggleFavorite={toggleFavorite}
          />
        } />
        
        <Route path="/watched" element={
          <Watched 
            isLoggedIn={isLoggedIn}
            watchedItems={watchedItems}
          />
        } />
        
        <Route path="/watch/:id" element={
          <WatchNow 
            isLoggedIn={isLoggedIn}
            updateWatched={updateWatched}
          />
        } />
        
        <Route path="/genre/:genre" element={
          <Home 
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            updateAllMovies={setAllMovies}
          />
        } />
        
        <Route path="/search" element={
          <Search 
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        } />
      </Routes>
    </div>
  );
}

export default AppWrapper;
