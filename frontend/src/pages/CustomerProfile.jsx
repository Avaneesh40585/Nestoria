import React, { useState, useEffect } from 'react';
import { customerAPI, bookingAPI, reviewAPI } from '../services/api';
import { FaUser, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaHotel, FaStar } from 'react-icons/fa';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    hotel_rating: 0,
    hotel_review: '',
    room_rating: 0,
    room_review: ''
  });

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

  // Function to determine booking status
  const getBookingStatus = (booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkinDate = new Date(booking.checkin_date);
    checkinDate.setHours(0, 0, 0, 0);
    
    const checkoutDate = new Date(booking.checkout_date);
    checkoutDate.setHours(0, 0, 0, 0);

    // If booking is cancelled
    if (!booking.booking_status) {
      return { status: 'Cancelled', className: 'cancelled' };
    }

    // If check-in date is in the future - Booked
    if (checkinDate > today) {
      return { status: 'Booked', className: 'booked' };
    }

    // If currently staying (today is between check-in and check-out) - Active
    if (checkinDate <= today && checkoutDate > today) {
      return { status: 'Active', className: 'active' };
    }

    // If check-out date has passed - Completed
    if (checkoutDate <= today) {
      return { status: 'Completed', className: 'completed' };
    }

    return { status: 'Active', className: 'active' };
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

  const handleOpenReview = async (booking) => {
    setCurrentBooking(booking);
    
    // First, try to load saved draft from localStorage
    const savedDraft = localStorage.getItem(`review_draft_${booking.bookingid}`);
    
    // Then, try to fetch existing submitted review from backend
    try {
      const response = await reviewAPI.getBookingReview(booking.bookingid);
      const { hotelReview, roomReview } = response.data;
      
      // If there's a submitted review, use it (override draft)
      if (hotelReview || roomReview) {
        setReviewData({
          hotel_rating: hotelReview?.rating || 0,
          hotel_review: hotelReview?.review || '',
          room_rating: roomReview?.rating || 0,
          room_review: roomReview?.review || ''
        });
      } else if (savedDraft) {
        // If no submitted review but there's a draft, use the draft
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setReviewData(parsedDraft);
        } catch (e) {
          setReviewData({
            hotel_rating: 0,
            hotel_review: '',
            room_rating: 0,
            room_review: ''
          });
        }
      } else {
        // No submitted review and no draft, start fresh
        setReviewData({
          hotel_rating: 0,
          hotel_review: '',
          room_rating: 0,
          room_review: ''
        });
      }
    } catch (error) {
      // If fetching fails, try to use draft
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setReviewData(parsedDraft);
        } catch (e) {
          setReviewData({
            hotel_rating: 0,
            hotel_review: '',
            room_rating: 0,
            room_review: ''
          });
        }
      } else {
        setReviewData({
          hotel_rating: 0,
          hotel_review: '',
          room_rating: 0,
          room_review: ''
        });
      }
    }
    
    setShowReviewModal(true);
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
    setCurrentBooking(null);
    // Don't clear reviewData here - keep it for potential re-opening
  };

  const handleReviewChange = (field, value) => {
    const updatedData = {
      ...reviewData,
      [field]: value
    };
    setReviewData(updatedData);
    
    // Save to localStorage whenever user types
    if (currentBooking) {
      localStorage.setItem(`review_draft_${currentBooking.bookingid}`, JSON.stringify(updatedData));
    }
  };

  const handleSubmitReview = async () => {
    if (reviewData.hotel_rating === 0 && reviewData.room_rating === 0) {
      alert('Please provide at least one rating');
      return;
    }

    if (!reviewData.hotel_review && !reviewData.room_review) {
      alert('Please write at least one review');
      return;
    }

    try {
      await reviewAPI.addReview({
        booking_id: currentBooking.bookingid,
        hotel_rating: reviewData.hotel_rating || null,
        hotel_review: reviewData.hotel_review || null,
        room_rating: reviewData.room_rating || null,
        room_review: reviewData.room_review || null
      });
      
      // Clear the saved draft from localStorage after successful submission
      localStorage.removeItem(`review_draft_${currentBooking.bookingid}`);
      
      alert('Review submitted successfully!');
      
      // Clear the form
      setReviewData({
        hotel_rating: 0,
        hotel_review: '',
        room_rating: 0,
        room_review: ''
      });
      
      handleCloseReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
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
                {bookings.map((booking) => {
                  const bookingStatus = getBookingStatus(booking);
                  const canCancel = booking.booking_status && bookingStatus.status === 'Booked';
                  const canReview = booking.booking_status && (bookingStatus.status === 'Active' || bookingStatus.status === 'Completed');
                  
                  return (
                    <div key={booking.bookingid} className="booking-card">
                      <div className="booking-header">
                        <h3>
                          <FaHotel /> {booking.hotelname}
                        </h3>
                        <span className={`booking-status ${bookingStatus.className}`}>
                          {bookingStatus.status}
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

                      <div className="booking-actions">
                        {canCancel && (
                          <button 
                            className="cancel-booking-btn"
                            onClick={() => handleCancelBooking(booking.bookingid)}
                          >
                            Cancel Booking
                          </button>
                        )}
                        {canReview && (
                          <button 
                            className="review-btn"
                            onClick={() => handleOpenReview(booking)}
                          >
                            <FaStar /> Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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

      {/* Review Modal */}
      {showReviewModal && currentBooking && (
        <div className="review-modal-overlay" onClick={handleCloseReview}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write Your Review</h2>
              <button className="close-modal-btn" onClick={handleCloseReview}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              <div className="review-section">
                <h3><FaHotel /> Hotel Review - {currentBooking.hotelname}</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${reviewData.hotel_rating >= star ? 'filled' : ''}`}
                      onClick={() => handleReviewChange('hotel_rating', star)}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience with this hotel..."
                  value={reviewData.hotel_review}
                  onChange={(e) => handleReviewChange('hotel_review', e.target.value)}
                  rows="4"
                />
              </div>

              <div className="review-section">
                <h3>Room Review - {currentBooking.room_type}</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${reviewData.room_rating >= star ? 'filled' : ''}`}
                      onClick={() => handleReviewChange('room_rating', star)}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience with this room..."
                  value={reviewData.room_review}
                  onChange={(e) => handleReviewChange('room_review', e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseReview}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
