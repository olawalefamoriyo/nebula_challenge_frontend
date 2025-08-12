import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

interface HeaderProps {
	user: any;
	setUser: (user: any) => void;
	setUserId: (id: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setUser, setUserId }) => {
	const location = useLocation();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		setIsLoggedIn(!!user);
	}, [user]);

	const handleLogout = () => {
		localStorage.removeItem('user');
		setUser(null);
		setUserId(null);
		setIsLoggedIn(false);
	};

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<header className="header">
			<div className="header-container">
				<div className="logo">
					<Link to="/">
						<h1>🚀 Nebula Challenge</h1>
					</Link>
				</div>
				<nav className="nav">
					<Link
						to="/"
						className={`nav-link ${isActive('/') ? 'active' : ''}`}
					>
						🏠 Home
					</Link>
					{!isLoggedIn ? (
						<>
							<Link
								to="/register"
								className={`nav-link ${isActive('/register') ? 'active' : ''}`}
							>
								📝 Register
							</Link>
							<Link
								to="/login"
								className={`nav-link ${isActive('/login') ? 'active' : ''}`}
							>
								🔐 Login
							</Link>
						</>
					) : (
						<>
							<Link
								to="/submit-score"
								className={`nav-link ${isActive('/submit-score') ? 'active' : ''}`}
							>
								🏆 Submit Score
							</Link>
							<Link
								to="/leaderboard"
								className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
							>
								🏅 Leaderboard
							</Link>
							<button className="nav-link btn-logout" onClick={handleLogout}>
								🚪 Logout
							</button>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
