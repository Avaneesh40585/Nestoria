import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerAPI, hostAPI } from '../services/api';
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const userType = location.state?.userType || 'customer';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    phone_number: '',
    gender: '',
    age: '',
    address: ''
  });

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

  const validateGender = (gender) => {
    if (!gender) return 'Please select your gender';
    if (!['Male', 'Female', 'Other'].includes(gender)) return 'Invalid gender selection';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldError = '';
    
    switch (name) {
      case 'phone_number':
        fieldError = validatePhone(value);
        break;
      case 'age':
        fieldError = validateAge(value);
        break;
      case 'gender':
        fieldError = validateGender(value);
        break;
      default:
        break;
    }
    
    if (fieldError) {
      setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const isFormValid = () => {
    const phoneError = validatePhone(formData.phone_number);
    const ageError = validateAge(formData.age);
    const genderError = validateGender(formData.gender);
    
    return !phoneError && !ageError && !genderError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData = {
        phone_number: formData.phone_number.trim(),
        gender: formData.gender,
        age: parseInt(formData.age),
        address: formData.address.trim() || ''
      };

      console.log('📤 Sending profile update...');
      console.log('User type:', userType);
      console.log('Update data:', updateData);
      console.log('Auth token exists:', !!localStorage.getItem('token'));

      let response;
      if (userType === 'customer') {
        response = await customerAPI.updateProfile(updateData);
      } else {
        response = await hostAPI.updateProfile(updateData);
      }

      console.log('✅ Profile update response:', response.data);
      console.log('✅ Profile completed successfully!');
      
      // Redirect based on user type
      if (userType === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Profile completion error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Complete Your Profile</h2>
          <p className="auth-subtitle">
            Please provide additional information to complete your registration
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Phone Number - Required */}
            <div className="form-group">
              <FaPhoneAlt className="form-icon" />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number (10 digits) *"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength="10"
                pattern="\d{10}"
                className={fieldErrors.phone_number ? 'input-error' : ''}
              />
              {fieldErrors.phone_number && (
                <span className="field-error">{fieldErrors.phone_number}</span>
              )}
            </div>

            {/* Gender and Age - Required */}
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
                  <option value="" disabled>Select Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.gender && (
                  <span className="field-error">{fieldErrors.gender}</span>
                )}
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  placeholder="Age *"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="18"
                  max="120"
                  className={fieldErrors.age ? 'input-error' : ''}
                />
                {fieldErrors.age && (
                  <span className="field-error">{fieldErrors.age}</span>
                )}
              </div>
            </div>

            {/* Address - Optional */}
            <div className="form-group">
              <FaMapMarkerAlt className="form-icon" />
              <input
                type="text"
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
            * Required fields
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
