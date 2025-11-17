import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { signInWithGoogle } from '../config/firebase';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaMapMarkerAlt, FaGoogle } from 'react-icons/fa';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'host'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
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

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    if (name.trim().length > 150) return 'Name must not exceed 150 characters';
    if (!/^[a-zA-Z\s.]+$/.test(name)) return 'Name can only contain letters, spaces, and dots';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (email.length > 100) return 'Email must not exceed 100 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 100) return 'Password must not exceed 100 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateAge = (age) => {
    if (!age) return 'Age is required';
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 18) return 'You must be at least 18 years old';
    if (ageNum > 120) return 'Please enter a valid age';
    return '';
  };

  const validateAddress = (address) => {
    if (!address.trim()) return 'Address is required';
    if (address.trim().length < 10) return 'Address must be at least 10 characters';
    if (address.trim().length > 255) return 'Address must not exceed 255 characters';
    return '';
  };

  const validateIdentity = (identity) => {
    if (!identity.trim()) return 'Identity number is required';
    const cleaned = identity.trim().replace(/\s/g, '');
    if (cleaned.length !== 12) return 'Identity number must be exactly 12 digits';
    if (!/^\d{12}$/.test(cleaned)) return 'Identity number must contain only digits';
    return '';
  };

  const validateGender = (gender) => {
    if (!gender) return 'Please select your gender';
    if (!['Male', 'Female', 'Other'].includes(gender)) return 'Invalid gender selection';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        return validateFullName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'phone_number':
        return validatePhone(value);
      case 'age':
        return validateAge(value);
      case 'address':
        return validateAddress(value);
      case 'identity_no':
        return validateIdentity(value);
      case 'gender':
        return validateGender(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear general error
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!isLogin) {
      const fieldError = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Check if all signup fields are filled and valid
  const isSignupFormValid = () => {
    if (isLogin) return true; // For login, we don't need all fields
    
    // Check if all required fields are filled
    const requiredFields = ['full_name', 'email', 'password', 'phone_number', 'gender', 'age', 'address', 'identity_no'];
    const allFieldsFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    
    if (!allFieldsFilled) return false;
    
    // Check if any field has validation errors
    const hasErrors = requiredFields.some(field => {
      const error = validateField(field, formData[field]);
      return error !== '';
    });
    
    return !hasErrors;
  };

  // Check if login fields are filled and valid
  const isLoginFormValid = () => {
    if (!isLogin) return true; // For signup, use different validation
    
    // Check if email and password are filled
    if (!formData.email || !formData.email.trim()) return false;
    if (!formData.password || !formData.password.trim()) return false;
    
    // Validate email format
    const emailError = validateEmail(formData.email);
    if (emailError) return false;
    
    return true;
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
        // Registration - clean data before sending
        const cleanedData = {
          ...formData,
          full_name: formData.full_name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone_number.trim(),
          age: parseInt(formData.age),
          address: formData.address.trim(),
          identity_no: formData.identity_no.trim().replace(/\s/g, '')
        };
        
        if (userType === 'customer') {
          response = await authAPI.registerCustomer(cleanedData);
        } else {
          response = await authAPI.registerHost(cleanedData);
        }
      }

      const responseData = response.data.data || response.data;
      login(responseData.token, responseData.user);
      
      if (userType === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Starting Google sign-in...');
      
      // Sign in with Google using Firebase
      const googleResult = await signInWithGoogle();
      
      if (!googleResult.success) {
        console.error('❌ Google sign-in failed:', googleResult.error);
        setError(googleResult.error || 'Google sign-in failed');
        return;
      }

      console.log('✅ Google sign-in successful, user:', googleResult.user.email);
      console.log('🔐 Sending token to backend...');
      console.log('Token length:', googleResult.token.length);

      // Send Firebase token to backend for verification and user creation
      let response;
      try {
        if (userType === 'customer') {
          response = await authAPI.googleAuthCustomer({ firebaseToken: googleResult.token });
        } else {
          response = await authAPI.googleAuthHost({ firebaseToken: googleResult.token });
        }
      } catch (backendError) {
        console.error('❌ Backend authentication failed:', backendError);
        const errorMsg = backendError.response?.data?.error || backendError.message;
        const errorDetails = backendError.response?.data?.details;
        setError(`Authentication failed: ${errorMsg}${errorDetails ? ' - ' + errorDetails : ''}`);
        return;
      }

      const responseData = response.data.data || response.data;
      login(responseData.token, responseData.user);
    
      console.log('✅ Google authentication successful!');
    
      // Check if user needs to complete profile (new user from Google)
      const needsProfileCompletion = !responseData.user.phone_number || 
                                   responseData.user.phone_number === '' ||
                                   responseData.user.phone_number === null;
    
      if (needsProfileCompletion) {
        console.log('📝 Redirecting to profile completion...');
        // Redirect to profile completion
        navigate('/complete-profile', { state: { userType } });
      } else {
        console.log('✅ Profile complete, redirecting to dashboard...');
        // Profile already complete, redirect to dashboard/home
        if (userType === 'host') {
          navigate('/host/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('❌ Unexpected Google auth error:', err);
      setError(err.response?.data?.error || err.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
                    onBlur={handleBlur}
                    required
                    className={fieldErrors.full_name ? 'input-error' : ''}
                  />
                  {fieldErrors.full_name && <span className="field-error">{fieldErrors.full_name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={fieldErrors.gender ? 'input-error' : ''}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.gender && <span className="field-error">{fieldErrors.gender}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      min="18"
                      max="120"
                      className={fieldErrors.age ? 'input-error' : ''}
                    />
                    {fieldErrors.age && <span className="field-error">{fieldErrors.age}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <FaPhoneAlt className="form-icon" />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength="10"
                    pattern="\d{10}"
                    className={fieldErrors.phone_number ? 'input-error' : ''}
                  />
                  {fieldErrors.phone_number && <span className="field-error">{fieldErrors.phone_number}</span>}
                </div>

                <div className="form-group">
                  <FaMapMarkerAlt className="form-icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address (min 10 characters)"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={fieldErrors.address ? 'input-error' : ''}
                  />
                  {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="identity_no"
                    placeholder="Identity Number (12 digits - Aadhaar/PAN)"
                    value={formData.identity_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength="12"
                    pattern="\d{12}"
                    className={fieldErrors.identity_no ? 'input-error' : ''}
                  />
                  {fieldErrors.identity_no && <span className="field-error">{fieldErrors.identity_no}</span>}
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
                onBlur={handleBlur}
                required
                className={fieldErrors.email ? 'input-error' : ''}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <FaLock className="form-icon" />
              <input
                type="password"
                name="password"
                placeholder={isLogin ? "Password" : "Password (min 6 chars, 1 upper, 1 lower, 1 number)"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength="6"
                className={fieldErrors.password ? 'input-error' : ''}
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || (isLogin ? !isLoginFormValid() : !isSignupFormValid())}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            <FaGoogle className="google-icon" />
            {loading ? 'Signing in...' : 'Continue with Google'}
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
