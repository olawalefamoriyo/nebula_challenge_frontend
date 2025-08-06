import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../../../services/api';
import Message from '../../../components/layout/Message';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.username || !formData.password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        preferred_username: formData.username,
        password: formData.password
      };

      const registerResult = await registerUser(payload);
      
      if (registerResult.success) {
        setMessage({ text: 'Registration successful! Please check your email for verification code.', type: 'success' });

        setFormData({
          email: '',
          name: '',
          username: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          navigate('/verify-otp', {
            state: {
              userData: {
                username: formData.username,
                email: formData.email,
                name: formData.name
              }
            }
          });
        }, 2000);

      } else {
        setMessage({ text: registerResult.message || 'Registration failed', type: 'error' });
      }

    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>📝 Create Your Account</h1>
          <p>Join the Nebula Challenge and start competing!</p>
        </div>

        <div className="register-form-container">
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="input-field"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input-field password-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input-field password-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-register"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <div className="register-info">
            <h3>Why Register?</h3>
            <ul>
              <li>🏆 Compete in challenges</li>
              <li>🏅 Climb the leaderboard</li>
              <li>📊 Track your progress</li>
              <li>🎯 Set personal goals</li>
              <li>👥 Join the community</li>
            </ul>
            
            <div className="login-link">
              <p>Already have an account?</p>
              <Link to="/login" className="btn btn-secondary">
                🔐 Sign In
              </Link>
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

export default Register; 