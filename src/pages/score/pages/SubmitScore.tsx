import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitScore } from '../../../services/api';
import Message from '../../../components/layout/Message';
import '../styles/SubmitScore.css';

interface User {
	name?: string;
	username?: string;
	[key: string]: any;
}

interface MessageState {
	text: string;
	type: string;
}

const SubmitScore: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<{ score: string }>({ score: '' });
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const userData = localStorage.getItem('user');
		if (userData) {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
		} else {
			navigate('/login');
		}
	}, [navigate]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const validateForm = (): boolean => {
		if (!formData.score) {
			setMessage({ text: 'Please enter your score', type: 'error' });
			return false;
		}
		const score = parseInt(formData.score);
		if (isNaN(score) || score < 0) {
			setMessage({ text: 'Please enter a valid positive score', type: 'error' });
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateForm()) return;
		setLoading(true);
		try {
			const payload = { score: parseInt(formData.score) };
			await submitScore(payload);
			setMessage({ text: 'Score submitted successfully! Check the leaderboard to see your ranking!', type: 'success' });
			setFormData({ score: '' });
			setTimeout(() => {
				navigate('/leaderboard');
			}, 2000);
		} catch (error: any) {
			setMessage({ text: error.message, type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return (
			<div className="submit-score-page">
				<div className="submit-score-container">
					<div className="loading">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="submit-score-page">
			<div className="submit-score-container">
				<div className="submit-score-header">
					<h1>🏆 Submit Your Score</h1>
					<p>Share your achievement and compete with others!</p>
				</div>
				<div className="submit-score-form-container">
					<form onSubmit={handleSubmit} className="submit-score-form">
						<div className="user-info-display">
							<h3>Submitting as: {user.name || user.username}</h3>
							<p>Username: {user.username}</p>
						</div>
						<div className="form-group">
							<label htmlFor="score">Score</label>
							<input
								type="number"
								id="score"
								name="score"
								className="input-field"
								placeholder="Enter your score"
								value={formData.score}
								onChange={handleInputChange}
								min="0"
								required
							/>
						</div>
						<button 
							type="submit" 
							className="btn btn-submit"
							disabled={loading}
						>
							{loading ? 'Submitting...' : '🏆 Submit Score'}
						</button>
					</form>
					<div className="submit-score-info">
						<h3>How It Works</h3>
						<div className="info-steps">
							<div className="step">
								<div className="step-number">1</div>
								<div className="step-content">
									<h4>Complete Challenge</h4>
									<p>Finish any Nebula Challenge and get your score</p>
								</div>
							</div>
							<div className="step">
								<div className="step-number">2</div>
								<div className="step-content">
									<h4>Submit Score</h4>
									<p>Enter your score and submit your achievement</p>
								</div>
							</div>
							<div className="step">
								<div className="step-number">3</div>
								<div className="step-content">
									<h4>Check Ranking</h4>
									<p>See where you rank on the leaderboard</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Message 
				message={message.text} 
				type={message.type} 
				onClose={() => setMessage({ text: '', type: '' })}
			/>
		</div>
	);
};

export default SubmitScore;
