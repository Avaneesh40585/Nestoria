import React, { useState, useEffect } from 'react';
import { customerAPI, bookingAPI } from '../services/api';
import { FaUser, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaHotel } from 'react-icons/fa';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await customerAPI.getProfile();
      setProfile(response.data.customer);
      setFormData(response.data.customer);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await customerAPI.updateProfile({
        full_name: formData.full_name,
        phone_number: formData.phonenumber,
        gender: formData.gender,
        age: parseInt(formData.age),
        address: formData.address
      });
      setProfile(response.data.customer);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancel(bookingId);
        fetchBookings();
        alert('Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="customer-profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="card-header">
              <h2><FaUser /> Personal Information</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <FaSave /> Save
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
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
                      value={formData.full_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                      >
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
                        value={formData.age || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="info-row">
                    <strong>Full Name:</strong>
                    <span>{profile?.full_name}</span>
                  </div>
                  <div className="info-row">
                    <strong>Email:</strong>
                    <span>{profile?.email}</span>
                  </div>
                  <div className="info-row">
                    <strong>Phone:</strong>
                    <span>{profile?.phonenumber || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <strong>Gender:</strong>
                    <span>{profile?.gender || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <strong>Age:</strong>
                    <span>{profile?.age || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <strong>Address:</strong>
                    <span>{profile?.address || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <strong>Total Bookings:</strong>
                    <span className="badge">{profile?.totalbookings || 0}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bookings-section">
            <h2><FaCalendarAlt /> My Bookings</h2>

            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.bookingid} className="booking-card">
                    <div className="booking-header">
                      <h3>
                        <FaHotel /> {booking.hotelname}
                      </h3>
                      <span className={`booking-status ${booking.booking_status ? 'active' : 'cancelled'}`}>
                        {booking.booking_status ? 'Active' : 'Cancelled'}
                      </span>
                    </div>

                    <div className="booking-details">
                      <p><strong>Room:</strong> {booking.roomnumber} - {booking.room_type}</p>
                      <p><strong>Check-in:</strong> {new Date(booking.checkin_date).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(booking.checkout_date).toLocaleDateString()}</p>
                      <p><strong>Total Amount:</strong> ₹{Math.floor(booking.final_amount)}</p>
                      <p><strong>Transaction ID:</strong> {booking.transactionid}</p>
                      <p className="booking-date">
                        Booked on: {new Date(booking.booking_date).toLocaleString()}
                      </p>
                    </div>

                    {booking.booking_status && new Date(booking.checkin_date) > new Date() && (
                      <button 
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(booking.bookingid)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <p>No bookings yet</p>
                <a href="/hotels" className="browse-btn">Browse Hotels</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
