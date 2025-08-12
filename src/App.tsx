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
import websocketClient from './services/websocket';
import Message from './components/layout/Message';

const App: React.FC = () => {
	const [user, setUser] = useState<any>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [wsConnected, setWsConnected] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			try {
				const userData = JSON.parse(storedUser);
				setUser(userData);
				if (userData.userId) {
					setUserId(userData.userId);
				}
			} catch (error) {
				localStorage.removeItem('user');
			}
		}
		websocketClient.connect(
			(data: any) => {
				if (data && data.type === 'highScore') {
					alert(data.data?.message || 'High score notification!');
				}
			},
			() => setWsConnected(true)
		);
		return () => {
			websocketClient.disconnect();
		};
	}, []);

	return (
		<Router>
			<div className="App">
				<Header user={user} setUser={setUser} setUserId={setUserId} />
				{wsConnected && (
					<Message
						message="WebSocket connected"
						type="success"
						onClose={() => setWsConnected(false)}
					/>
				)}
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
};

export default App;
