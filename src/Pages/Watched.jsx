// Pages/Watched.jsx
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Film, Tv, Calendar, ArrowLeft, Eye } from 'lucide-react';

const Watched = ({ isLoggedIn, watchedItems }) => {
  const navigate = useNavigate();

  const sortedWatchedItems = [...watchedItems]
    .filter(item => item?.progress > 0)
    .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="empty-state">
          <Eye className="empty-state-icon" size={64} />
          <h3 className="empty-state-title">Sign in to view history</h3>
          <p className="empty-state-text">
            Track your watched movies and continue where you left off
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/sign', { state: { from: '/watched' } })}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (sortedWatchedItems.length === 0) {
    return (
      <div className="container" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="empty-state">
          <Clock className="empty-state-icon" size={64} />
          <h3 className="empty-state-title">No watched history</h3>
          <p className="empty-state-text">
            Start watching movies to build your history
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          style={{ padding: '0.5rem' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="section-title" style={{ margin: 0 }}>
          Your Watch History
        </h1>
      </div>

      <div className="movies-grid">
        {sortedWatchedItems.map((item) => (
          <Link
            key={item.id}
            to={`/watch/${item.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="movie-card">
              <div className="movie-poster">
                <img 
                  src={item.poster} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.jpg';
                  }}
                />
                
                {/* Progress Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 2
                }}>
                  {item.progress >= 90 ? (
                    <>
                      <span>✓ Completed</span>
                    </>
                  ) : (
                    <>
                      <span>{Math.round(item.progress)}% watched</span>
                      {item.type === 'movie' && item.minutesLeft && (
                        <span>{Math.round(item.minutesLeft)} min left</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="movie-info">
                <h3 className="movie-title">{item.title}</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}>
                    {item.type === 'movie' ? <Film size={14} /> : <Tv size={14} />}
                    {item.type}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}>
                    <Calendar size={14} />
                    {new Date(item.lastWatched).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Watched;
