import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaBars, FaTimes, FaFire } from 'react-icons/fa';

function Nav({ isLoggedIn, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.email ? user.email.split('@')[0] : 'Guest';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenreClick = (genre) => {
    navigate(`/?genre=${genre}`);
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    navigate('/search');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`netflix-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="netflix-logo">
          <FaFire className="logo-flame" /> FLAME
        </Link>
        
        <ul className={`nav-list-horizontal ${mobileMenuOpen ? 'open' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li className="nav-item dropdown">
            <span className="nav-button">Genres ▾</span>
            <ul className="dropdown-content">
              <li onClick={() => handleGenreClick('Action')}>Action</li>
              <li onClick={() => handleGenreClick('Comedy')}>Comedy</li>
              <li onClick={() => handleGenreClick('Drama')}>Drama</li>
              <li onClick={() => handleGenreClick('Horror')}>Horror</li>
              <li onClick={() => handleGenreClick('Sci-Fi')}>Sci-Fi</li>
              <li onClick={() => handleGenreClick('TV Shows')}>TV Shows</li>
            </ul>
          </li>

          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
                  Favorites
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/watched" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
                  Watched
                </Link>
              </li>

              <li className="nav-item dropdown">
                <span className="nav-button">{username} ▾</span>
                <ul className="dropdown-content">
                  <li>Account</li>
                  <li>Profile</li>
                  <li>Settings</li>
                  <li onClick={onLogout}>Sign Out</li>
                </ul>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sign" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="nav-right">
        <FaSearch className="nav-icon" onClick={handleSearchClick} />
        {isLoggedIn && <FaBell className="nav-icon" />}
        {isLoggedIn && (
          <div className="user-avatar" onClick={() => navigate('/watched')}>
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
