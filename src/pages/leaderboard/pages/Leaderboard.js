import React, { useState, useEffect } from 'react';
import { getLeaderboard, deleteLeaderboard } from '../../../services/api';
import Message from '../../../components/layout/Message';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchLeaderboard = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);
    
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
      if (!showLoading) {
        setMessage({ text: 'Leaderboard updated!', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRefresh = () => {
    fetchLeaderboard(false);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteLeaderboard();
      setMessage({ text: 'All scores deleted successfully!', type: 'success' });
      setLeaderboard([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-content">
            <h1>🏅 Leaderboard</h1>
            <p>See who's leading the competition and climb the ranks!</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-refresh"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '🔄 Updating...' : '🔄 Refresh'}
            </button>
            {leaderboard.length > 0 && (
              <button 
                className="btn btn-delete"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
              >
                {deleting ? '🗑️ Deleting...' : '🗑️ Delete All'}
              </button>
            )}
          </div>
        </div>

        <div className="leaderboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h3>No Scores Yet</h3>
              <p>Be the first to submit a score and claim the top spot!</p>
            </div>
          ) : (
            <>
              <div className="leaderboard-stats">
                <div className="stat-card">
                  <span className="stat-number">{leaderboard.length}</span>
                  <span className="stat-label">Total Players</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {leaderboard.length > 0 ? Math.max(...leaderboard.map(item => item.score)) : 0}
                  </span>
                  <span className="stat-label">Highest Score</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, item) => sum + item.score, 0) / leaderboard.length) : 0}
                  </span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>

              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="header-rank">Rank</div>
                  <div className="header-player">Player</div>
                  <div className="header-score">Score</div>
                </div>
                
                <div className="table-body">
                  {leaderboard.map((item, index) => (
                    <div 
                      key={index} 
                      className={`leaderboard-row ${getRankClass(index + 1)}`}
                    >
                      <div className="row-rank">
                        <span className="rank-icon">{getRankIcon(index + 1)}</span>
                        <span className="rank-number">#{index + 1}</span>
                      </div>
                      <div className="row-player">
                        <span className="player-username">{item.user_name}</span>
                      </div>
                      <div className="row-score">
                        <span className="score-value">{item.score}</span>
                        <span className="score-label">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Delete All Scores</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete all scores from the leaderboard?</p>
              <p className="warning-text">⚠️ This action cannot be undone!</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-confirm-delete"
                onClick={handleDeleteAll}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Message 
        message={message.text} 
        type={message.type} 
        onClose={() => setMessage({ text: '', type: '' })}
      />
    </div>
  );
};

export default Leaderboard; 