import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../../services/api';
import Message from '../../../components/layout/Message';
import '../styles/Login.css';

const Login = ({ setUser, setUserId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await loginUser(formData);
      
      if (result.success) {
        const userData = {
          username: result.data.username,
          name: result.data.name,
          email: result.data.email,
          accessToken: result.data.accessToken,
          idToken: result.data.idToken,
          refreshToken: result.data.refreshToken,
          userId: result.data.userId
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setUserId(userData.userId);

        setMessage({ text: 'Login successful! Welcome back!', type: 'success' });

        setTimeout(() => {
          navigate('/');
        }, 1000);

      } else {
        setMessage({ text: result.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      if (error.message === 'UserNotConfirmedException') {
        setMessage({ 
          text: 'Your account is not verified. Please check your email for verification code.', 
          type: 'warning' 
        });
        
        setTimeout(() => {
          navigate('/verify-otp', {
            state: {
              userData: {
                username: formData.username
              }
            }
          });
        }, 2000);
      } else {
        setMessage({ text: error.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Welcome Back</h1>
          <p>Sign in to your Nebula Challenge account</p>
        </div>

        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="input-field"
                placeholder="Enter your username"
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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="btn btn-login"
              disabled={loading}
            >
              {loading ? 'Signing In...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="login-info">
            <h3>Don't have an account?</h3>
            <p>Join the Nebula Challenge and start competing!</p>
            <Link to="/register" className="btn btn-secondary">
              📝 Create Account
            </Link>
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

export default Login; 