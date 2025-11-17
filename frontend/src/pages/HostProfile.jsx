import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hostAPI } from '../services/api';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './HostProfile.css';

const HostProfile = () => {
  const { } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await hostAPI.getProfile();
      setProfile(response.data.host);
      setFormData(response.data.host);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Map form data to match backend expected fields
      const updateData = {
        full_name: formData.Full_name || formData.full_name,
        phone_number: formData.PhoneNumber || formData.phone_number,
        gender: formData.Gender || formData.gender,
        age: formData.Age || formData.age,
        address: formData.Address || formData.address
      };
      
      const response = await hostAPI.updateProfile(updateData);
      setProfile(response.data.host);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading && !profile) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="host-profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-card">
          <div className="card-header">
            <h2><FaUser /> Personal Information</h2>
            {!isEditing ? (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  <FaSave /> Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.Full_name || formData.full_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile?.Email || profile?.email || ''}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.PhoneNumber || formData.phone_number || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.Gender || formData.gender || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.Age || formData.age || ''}
                      onChange={handleInputChange}
                      min="18"
                      max="120"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.Address || formData.address || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="info-row">
                  <strong>Full Name:</strong>
                  <span>{profile?.Full_name || profile?.full_name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>Email:</strong>
                  <span>{profile?.Email || profile?.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>Phone:</strong>
                  <span>{profile?.PhoneNumber || profile?.phone_number || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>Gender:</strong>
                  <span>{profile?.Gender || profile?.gender || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>Age:</strong>
                  <span>{profile?.Age || profile?.age || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>Address:</strong>
                  <span>{profile?.Address || profile?.address || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;