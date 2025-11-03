import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRupeeSign, FaEye, FaBed, FaWifi, FaSwimmingPool, FaParking, FaDumbbell, FaUtensils, FaSpa, FaCoffee, FaTv, FaConciergeBell, FaShieldAlt, FaSnowflake, FaHotTub, FaTshirt, FaGlassMartini, FaQuoteLeft, FaUser } from 'react-icons/fa';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const [room, setRoom] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get check-in/check-out dates from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const checkinParam = searchParams.get('checkin');
  const checkoutParam = searchParams.get('checkout');

  // Validate room data
  const validateRoomData = (roomData) => {
    if (!roomData) return null;
    
    return {
      ...roomData,
      room_type: roomData.room_type?.trim() || 'Room Type Not Available',
      hotelname: roomData.hotelname?.trim() || 'Hotel Name Not Available',
      hoteladdress: roomData.hoteladdress?.trim() || 'Address Not Available',
      roomnumber: roomData.roomnumber?.trim() || 'Not Available',
      position_view: roomData.position_view?.trim() || 'Standard View',
      room_status: roomData.room_status?.trim() || 'Unknown',
      room_rating: roomData.room_rating || null,
      checkin_time: roomData.checkin_time?.trim() || 'Not Available',
      checkout_time: roomData.checkout_time?.trim() || 'Not Available',
      room_desc: roomData.room_desc?.trim() || '',
      cost_per_night: roomData.cost_per_night && !isNaN(roomData.cost_per_night) ? roomData.cost_per_night : null,
      room_review: roomData.room_review?.trim() || ''
    };
  };

  // Validate amenities array
  const validateAmenities = (amenitiesData) => {
    if (!Array.isArray(amenitiesData)) return [];
    
    return amenitiesData.filter(amenity => 
      amenity && 
      amenity.amenity_name && 
      amenity.amenity_name.trim()
    ).map(amenity => ({
      ...amenity,
      amenity_name: amenity.amenity_name.trim(),
      working_status: amenity.working_status !== undefined ? amenity.working_status : true
    }));
  };

  // Format description into paragraphs
  const formatDescription = (description) => {
    if (!description || !description.trim()) return [];
    
    // Split by newlines or sentence endings to create paragraphs
    const paragraphs = description
      .split(/\n\n|\n|\. (?=[A-Z])/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    return paragraphs;
  };

  // Format reviews into structured data
  const formatReviews = (reviewText) => {
    if (!reviewText || !reviewText.trim()) return [];
    
    const reviews = [];
    const lines = reviewText.split('\n').filter(line => line.trim());
    
    if (lines.length > 0) {
      reviews.push({
        id: 1,
        author: 'Guest Review',
        rating: room.room_rating || 4.0,
        date: 'Recent',
        comment: reviewText.trim()
      });
    }
    
    return reviews;
  };

  // Function to get appropriate icon for each amenity
  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    
    if (name.includes('wifi') || name.includes('wi-fi') || name.includes('internet')) return FaWifi;
    if (name.includes('room service') || name.includes('roomservice')) return FaConciergeBell;
    if (name.includes('laundry') || name.includes('laundary')) return FaTshirt;
    if (name.includes('bar') || name.includes('mini bar') || name.includes('minibar')) return FaGlassMartini;
    if (name.includes('pool') || name.includes('swimming')) return FaSwimmingPool;
    if (name.includes('parking') || name.includes('garage')) return FaParking;
    if (name.includes('gym') || name.includes('fitness')) return FaDumbbell;
    if (name.includes('restaurant') || name.includes('dining')) return FaUtensils;
    if (name.includes('spa') || name.includes('massage')) return FaSpa;
    if (name.includes('breakfast') || name.includes('coffee')) return FaCoffee;
    if (name.includes('tv') || name.includes('television')) return FaTv;
    if (name.includes('concierge')) return FaConciergeBell;
    if (name.includes('security') || name.includes('safe')) return FaShieldAlt;
    if (name.includes('ac') || name.includes('air condition')) return FaSnowflake;
    if (name.includes('jacuzzi') || name.includes('hot tub')) return FaHotTub;
    
    return FaConciergeBell; // Default icon
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomAPI.getDetails(id);
      
      // Validate and set data
      const validatedRoom = validateRoomData(response.data?.room);
      const validatedAmenities = validateAmenities(response.data?.amenities);
      
      if (!validatedRoom) {
        setError('Room data is incomplete or invalid');
        setRoom(null);
      } else {
        setRoom(validatedRoom);
      }
      
      setAmenities(validatedAmenities);
    } catch (error) {
      console.error('Error fetching room details:', error);
      setError(error.response?.data?.message || 'Failed to load room details. Please try again later.');
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      alert('Only customers can book rooms');
      return;
    }
    
    // Validate required booking data
    if (!room.cost_per_night || room.cost_per_night <= 0) {
      alert('Room price is not available. Please contact the hotel directly.');
      return;
    }
    
    navigate('/booking', { 
      state: { 
        roomId: room.roomid,
        roomType: room.room_type,
        hotelName: room.hotelname,
        costPerNight: room.cost_per_night
      } 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="error-container">
        <h2>Unable to Load Room</h2>
        <p>{error || 'Room not found or data is unavailable.'}</p>
        <button onClick={() => window.history.back()} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="room-details-page">
      <div className="container">
        <div className="room-details-card">
          <div className="room-header-section">
            <div>
              <h1>{room.room_type}</h1>
              <p className="hotel-name">{room.hotelname}</p>
              <p className="hotel-address">{room.hoteladdress}</p>
            </div>
            <div className="room-rating-badge">
              <FaStar className="star-icon" />
              <span>
                {room.room_rating && !isNaN(room.room_rating) 
                  ? parseFloat(room.room_rating).toFixed(1) 
                  : 'Not Rated'}
              </span>
            </div>
          </div>

          <div className="room-details-grid">
            <div className="room-main-info">
              <div className="info-section">
                <h2>Room Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Room Number:</strong>
                    <span>{room.roomnumber}</span>
                  </div>
                  <div className="info-item">
                    <strong>View:</strong>
                    <span>{room.position_view}</span>
                  </div>
                  <div className="info-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${room.room_status?.toLowerCase()}`}>
                      {room.room_status}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Check-in Time:</strong>
                    <span>{room.checkin_time}</span>
                  </div>
                  <div className="info-item">
                    <strong>Check-out Time:</strong>
                    <span>{room.checkout_time}</span>
                  </div>
                </div>
              </div>

              {room.room_desc && room.room_desc.trim() ? (
                <div className="info-section description-section">
                  <div className="section-header">
                    <h2>Room Description</h2>
                    <div className="header-divider"></div>
                  </div>
                  <div className="description-content">
                    {formatDescription(room.room_desc).map((paragraph, index) => (
                      <p key={index} className="description-paragraph">{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="info-section">
                  <h2>Description</h2>
                  <p className="no-data-message">No description available for this room.</p>
                </div>
              )}

              <div className="info-section">
                <h2>Room Amenities</h2>
                {amenities.length > 0 ? (
                  <div className="amenities-list">
                    {amenities.map((amenity) => {
                      const AmenityIcon = getAmenityIcon(amenity.amenity_name);
                      return (
                        <div key={amenity.amenityid} className="amenity-badge">
                          <AmenityIcon className="amenity-icon-small" />
                          <span>{amenity.amenity_name}</span>
                          {!amenity.working_status && (
                            <span className="not-working">(Not Working)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-data-message">No amenities information available for this room.</p>
                )}
              </div>

              {room.room_review && room.room_review.trim() ? (
                <div className="info-section reviews-section-room">
                  <div className="section-header">
                    <h2>Guest Reviews</h2>
                    <div className="header-divider"></div>
                  </div>
                  <div className="reviews-container">
                    {formatReviews(room.room_review).map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              <FaUser />
                            </div>
                            <div>
                              <h4 className="reviewer-name">{review.author}</h4>
                              <span className="review-date">{review.date}</span>
                            </div>
                          </div>
                          <div className="review-rating">
                            <FaStar className="review-star" />
                            <span className="rating-value">
                              {typeof review.rating === 'number' ? review.rating.toFixed(1) : review.rating}
                            </span>
                          </div>
                        </div>
                        <div className="review-body">
                          <FaQuoteLeft className="quote-icon quote-left" />
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="room-booking-card">
              <div className="price-section">
                <div className="price-label">Price per night</div>
                {room.cost_per_night && !isNaN(room.cost_per_night) && room.cost_per_night > 0 ? (
                  <>
                    <div className="price-amount">
                      <FaRupeeSign className="rupee-icon" />
                      {Math.floor(room.cost_per_night).toLocaleString()}
                    </div>
                    <div className="price-note">+ 18% GST</div>
                  </>
                ) : (
                  <div className="price-unavailable">
                    <p>Price Not Available</p>
                    <p className="contact-note">Please contact hotel for pricing</p>
                  </div>
                )}
              </div>

              <button 
                className="book-now-btn" 
                onClick={handleBookNow}
                disabled={
                  room.room_status?.toLowerCase() !== 'available' || 
                  !room.cost_per_night || 
                  room.cost_per_night <= 0
                }
              >
                {room.room_status?.toLowerCase() === 'available' 
                  ? (room.cost_per_night && room.cost_per_night > 0 ? 'Book Now' : 'Contact for Price') 
                  : 'Not Available'}
              </button>

              <div className="booking-info">
                <p>✓ Free cancellation up to 24 hours before check-in</p>
                <p>✓ Instant confirmation</p>
                <p>✓ Best price guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
