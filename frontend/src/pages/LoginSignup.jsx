import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaGoogle } from 'react-icons/fa';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'host'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    gender: '',
    age: '',
    address: '',
    identity_no: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isLogin) {
        // Login
        if (userType === 'customer') {
          response = await authAPI.loginCustomer({
            email: formData.email,
            password: formData.password
          });
        } else {
          response = await authAPI.loginHost({
            email: formData.email,
            password: formData.password
          });
        }
      } else {
        // Registration
        if (userType === 'customer') {
          response = await authAPI.registerCustomer(formData);
        } else {
          response = await authAPI.registerHost(formData);
        }
      }

      login(response.data.token, response.data.user);
      
      if (userType === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google OAuth integration coming soon!');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? 'Login to continue' : 'Sign up to get started'}
          </p>

          <div className="user-type-selector">
            <button
              className={`type-btn ${userType === 'customer' ? 'active' : ''}`}
              onClick={() => setUserType('customer')}
            >
              Customer
            </button>
            <button
              className={`type-btn ${userType === 'host' ? 'active' : ''}`}
              onClick={() => setUserType('host')}
            >
              Host
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <FaUser className="form-icon" />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <FaPhone className="form-icon" />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <FaMapMarkerAlt className="form-icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="identity_no"
                    placeholder="Identity Number (Aadhaar/PAN)"
                    value={formData.identity_no}
                    onChange={handleChange}
                    required
                    maxLength="12"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <FaEnvelope className="form-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <FaLock className="form-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <FaGoogle className="google-icon" />
            Continue with Google
          </button>

          <p className="switch-auth">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
