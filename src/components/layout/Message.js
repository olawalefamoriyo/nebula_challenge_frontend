import React, { useEffect } from 'react';
import '../styles/Message.css';

const Message = ({ message, type, onClose }) => {

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
          {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span className="message-text">{message}</span>
      </div>
      {onClose && (
        <button className="message-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Message; 