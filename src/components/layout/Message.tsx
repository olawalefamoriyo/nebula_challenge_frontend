import React, { useEffect } from 'react';
import '../styles/Message.css';

interface MessageProps {
	message: string;
	type: 'success' | 'error' | 'info' | string;
	onClose?: () => void;
}

const Message: React.FC<MessageProps> = ({ message, type, onClose }) => {
	useEffect(() => {
		if (message && onClose) {
			const timer = setTimeout(() => {
				onClose();
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [message, onClose]);

	if (!message) return null;

	return (
		<div className={`message ${type}-message`}>
			<div className="message-content">
				<span className="message-icon">
					{type === 'success' ? '\u2705' : type === 'error' ? '\u274c' : '\u2139\ufe0f'}
				</span>
				<span className="message-text">{message}</span>
			</div>
			{onClose && (
				<button className="message-close" onClick={onClose}>
					{'\u2715'}
				</button>
			)}
		</div>
	);
};

export default Message;
