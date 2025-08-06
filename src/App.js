import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/home/pages/Home';
import Register from './pages/auth/pages/Register';
import Login from './pages/auth/pages/Login';
import OTPVerification from './pages/auth/pages/OTPVerification';
import SubmitScore from './pages/score/pages/SubmitScore';
import Leaderboard from './pages/leaderboard/pages/Leaderboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('userData', userData);
        setUser(userData);
        if (userData.userId) {
          setUserId(userData.userId);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} setUserId={setUserId} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} setUserId={setUserId} />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/submit-score" element={<SubmitScore />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
