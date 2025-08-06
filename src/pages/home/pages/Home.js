import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🚀 Welcome to Nebula Challenge</h1>
          <p className="hero-subtitle">
            {isLoggedIn 
              ? `Welcome back, ${user?.name || 'Player'}! Ready to compete?`
              : 'Compete with the best players, climb the leaderboard, and prove your skills!'
            }
          </p>
          
          {isLoggedIn && (
            <div className="user-welcome">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <div className="user-details">
                  <h3>{user?.name}</h3>
                  <p>@{user?.username}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                🚪 Logout
              </button>
            </div>
          )}

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="home-stat-label">Players</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="home-stat-label">Challenges</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="home-stat-label">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">
          {isLoggedIn ? 'What You Can Do' : 'What You Can Do'}
        </h2>
        <div className="features-grid">
          {isLoggedIn ? (
            <>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Submit Scores</h3>
                <p>Complete challenges and submit your best scores</p>
                <Link to="/submit-score" className="feature-link">
                  Submit Score →
                </Link>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏅</div>
                <h3>Leaderboard</h3>
                <p>See how you rank against other players</p>
                <Link to="/leaderboard" className="feature-link">
                  View Rankings →
                </Link>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Your Progress</h3>
                <p>Track your performance and achievements</p>
                <Link to="/leaderboard" className="feature-link">
                  View Progress →
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Register</h3>
                <p>Create your account and join the competition</p>
                <Link to="/register" className="feature-link">
                  Get Started →
                </Link>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>Sign In</h3>
                <p>Already have an account? Sign in to continue</p>
                <Link to="/login" className="feature-link">
                  Sign In →
                </Link>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏅</div>
                <h3>Leaderboard</h3>
                <p>See how you rank against other players</p>
                <Link to="/leaderboard" className="feature-link">
                  View Rankings →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          {isLoggedIn ? (
            <>
              <h2>Ready to Compete?</h2>
              <p>Keep pushing your limits and climb the leaderboard!</p>
              <div className="cta-buttons">
                <Link to="/submit-score" className="btn btn-primary">
                  🏆 Submit Score
                </Link>
                <Link to="/leaderboard" className="btn btn-secondary">
                  🏅 View Leaderboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>Ready to Compete?</h2>
              <p>Join thousands of players and start your journey to the top!</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">
                  🚀 Start Playing
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  🔐 Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 