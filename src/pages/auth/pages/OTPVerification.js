import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../../services/api';
import Message from '../../../components/layout/Message';
import '../styles/OTPVerification.css';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [countdown, setCountdown] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = location.state?.userData || JSON.parse(localStorage.getItem('pendingVerification') || '{}');
    if (data.username) {
      setUserData(data);
      localStorage.setItem('pendingVerification', JSON.stringify(data));
    } else {
      navigate('/register');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const validateForm = () => {
    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit verification code', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !userData) return;

    setLoading(true);
    try {
      const result = await verifyOTP({
        username: userData.username,
        code: otp
      });

      if (result.success) {
        setMessage({ text: 'Email verified successfully! You can now login.', type: 'success' });
        
        localStorage.removeItem('pendingVerification');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ text: result.message || 'Verification failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userData) return;

    setResendLoading(true);
    try {
      const result = await resendOTP(userData.username);
      
      if (result.success) {
        setMessage({ text: 'Verification code resent successfully!', type: 'success' });
        setCountdown(60);
      } else {
        setMessage({ text: result.message || 'Failed to resend code', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setResendLoading(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <div className="otp-header">
          <h1>📧 Verify Your Email</h1>
          <p>We've sent a verification code to your email</p>
        </div>

        <div className="otp-form-container">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <h3>{userData.name || userData.username}</h3>
              <p>{userData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                name="otp"
                className="input-field otp-input"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                required
                autoFocus
              />
              <small className="otp-hint">
                Enter the 6-digit code sent to your email
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-verify"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : '✅ Verify Email'}
            </button>
          </form>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              className="btn btn-resend"
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading 
                ? 'Sending...' 
                : countdown > 0 
                  ? `Resend in ${countdown}s` 
                  : '🔄 Resend Code'
              }
            </button>
          </div>

          <div className="otp-info">
            <h3>What's Next?</h3>
            <ul>
              <li>✅ Check your email for the verification code</li>
              <li>📝 Enter the 6-digit code above</li>
              <li>🔐 Once verified, you can login to your account</li>
              <li>🏆 Start competing in Nebula Challenge!</li>
            </ul>
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

export default OTPVerification; 