import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhoneAlt, FaWifi, FaSwimmingPool, FaParking, FaDumbbell, FaUtensils, FaSpa, FaCoffee, FaTv, FaConciergeBell, FaShieldAlt, FaSnowflake, FaHotTub, FaTshirt, FaGlassMartini, FaQuoteLeft, FaUser } from 'react-icons/fa';

// Helper function to format date as DD/MM/YYYY
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedReviews, setParsedReviews] = useState([]);

  // Get check-in/check-out dates from URL params to pass to room details
  const searchParams = new URLSearchParams(window.location.search);
  const checkinParam = searchParams.get('checkin');
  const checkoutParam = searchParams.get('checkout');

  // Function to scroll to reviews section
  const scrollToReviews = () => {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      alert('No reviews available yet for this hotel.');
    }
  };

  // Validate hotel data
  const validateHotelData = (hotelData) => {
    if (!hotelData) return null;
    
    return {
      ...hotelData,
      hotel_name: hotelData.hotel_name?.trim() || 'Hotel Name Not Available',
      hotel_address: hotelData.hotel_address?.trim() || 'Address Not Available',
      hotel_description: hotelData.hotel_description?.trim() || 'No description available for this hotel.',
      hotel_img: hotelData.hotel_img?.trim() || 'https://via.placeholder.com/1200x400?text=Hotel+Image',
      overall_rating: hotelData.overall_rating || null,
      checkin_time: hotelData.checkin_time?.trim() || 'Not Available',
      checkout_time: hotelData.checkout_time?.trim() || 'Not Available',
      receptionist_number: hotelData.receptionist_number?.trim() || 'Contact information not available'
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
      is_available: amenity.is_available !== undefined ? amenity.is_available : true,
      additional_info: amenity.additional_info?.trim() || '24/7'
    }));
  };

  // Validate rooms array
  const validateRooms = (roomsData) => {
    if (!Array.isArray(roomsData)) return [];
    
    return roomsData.filter(room => room && room.roomid).map(room => ({
      ...room,
      room_type: room.room_type?.trim() || 'Standard Room',
      roomid: room.roomid?.trim() || 'N/A',
      position_view: room.position_view?.trim() || 'Standard View',
      room_status: room.room_status?.trim() || 'Unknown',
      cost_per_night: room.cost_per_night && !isNaN(room.cost_per_night) ? room.cost_per_night : null,
      overall_rating: room.overall_rating || null,
      room_description: room.room_description?.trim() || ''
    }));
  };

  // Format description into paragraphs
  const formatDescription = (description) => {
    if (!description || !description.trim()) return [];
    
    // Split by newlines or double spaces to create paragraphs
    const paragraphs = description
      .split(/\n\n|\n|\. (?=[A-Z])/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    return paragraphs;
  };

  // Format reviews into structured data
  const formatReviews = (reviewText) => {
    if (!reviewText || !reviewText.trim()) return [];
    
    // Try to parse reviews if they're in a structured format
    // Otherwise, treat as a single review
    const reviews = [];
    const lines = reviewText.split('\n').filter(line => line.trim());
    
    if (lines.length > 0) {
      // Simple format: create review cards from the text
      reviews.push({
        id: 1,
        author: 'Guest Review',
        rating: hotel.overall_rating || 4.0,
        date: 'Recent',
        comment: reviewText.trim()
      });
    }
    
    return reviews;
  };
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
    fetchHotelDetails();
  }, [id]);

  // Parse reviews when hotel data changes
  useEffect(() => {
    if (hotel?.reviews) {
      const reviewsArray = hotel.reviews.split('\n').filter(r => r.trim());
      const parsed = [];
      
      reviewsArray.forEach((reviewStr, index) => {
        try {
          // Try to parse as JSON first (new format)
          const jsonReview = JSON.parse(reviewStr);
          parsed.push(jsonReview);
        } catch (e) {
          // If not JSON, treat as old text format
          // Check if it's in "Name: [Rating: X/5] text" format
          const oldFormatMatch = reviewStr.match(/^(.+?):\s*\[Rating:\s*(\d+)\/5\]\s*(.+)$/);
          if (oldFormatMatch) {
            parsed.push({
              customer: oldFormatMatch[1].trim(),
              rating: parseInt(oldFormatMatch[2]),
              review: oldFormatMatch[3].trim(),
              date: new Date().toISOString()
            });
          } else {
            // Plain text review without rating
            parsed.push({
              customer: 'Guest',
              rating: hotel.overall_rating || 4,
              review: reviewStr.trim(),
              date: new Date().toISOString()
            });
          }
        }
      });
      
      setParsedReviews(parsed);
    } else {
      setParsedReviews([]);
    }
  }, [hotel]);

  const fetchHotelDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hotelAPI.getDetails(id);
      
      // Validate and set data
      const validatedHotel = validateHotelData(response.data?.hotel);
      const validatedAmenities = validateAmenities(response.data?.amenities);
      const validatedRooms = validateRooms(response.data?.rooms);
      
      if (!validatedHotel) {
        setError('Hotel data is incomplete or invalid');
        setHotel(null);
      } else {
        setHotel(validatedHotel);
      }
      
      setAmenities(validatedAmenities);
      setRooms(validatedRooms);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      setError(error.response?.data?.message || 'Failed to load hotel details. Please try again later.');
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="error-container">
        <h2>Unable to Load Hotel</h2>
        <p>{error || 'Hotel not found or data is unavailable.'}</p>
        <button onClick={() => window.history.back()} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="hotel-details-page">
      <div className="hotel-hero">
        <img 
          src={hotel.hotel_img || 'https://via.placeholder.com/1200x400'} 
          alt={hotel.hotel_name}
          className="hotel-hero-image"
        />
        <div className="hotel-hero-overlay">
          <div className="container">
            <h1 className="hotel-title">{hotel.hotel_name}</h1>
            <div className="hotel-meta">
              <span className="hotel-rating">
                <FaStar /> 
                {hotel.overall_rating && !isNaN(hotel.overall_rating) 
                  ? parseFloat(hotel.overall_rating).toFixed(1) 
                  : 'Not Rated'}
              </span>
              <span className="hotel-location">
                <FaMapMarkerAlt /> {hotel.hotel_address}
              </span>
              <button className="see-reviews-btn" onClick={scrollToReviews}>
                <FaStar /> See Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hotel-info-section">
          <div className="hotel-description-section">
            <div className="section-header">
              <h2>About This Hotel</h2>
              <div className="header-divider"></div>
            </div>
            <div className="description-content">
              {formatDescription(hotel.hotel_description).map((paragraph, index) => (
                <p key={index} className="description-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="hotel-sidebar">
            <div className="info-card">
              <h3>Hotel Information</h3>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <strong>Check-in:</strong> {hotel.checkin_time}
                </div>
              </div>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <strong>Check-out:</strong> {hotel.checkout_time}
                </div>
              </div>
              <div className="info-item">
                <FaPhoneAlt className="info-icon" />
                <div>
                  <strong>Contact:</strong> {hotel.receptionist_number}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="amenities-section">
          <h2>Amenities</h2>
          {amenities.length > 0 ? (
            <div className="amenities-grid">
              {amenities.map((amenity) => {
                const AmenityIcon = getAmenityIcon(amenity.amenity_name);
                return (
                  <div key={amenity.amenityid} className="amenity-item">
                    <AmenityIcon className="amenity-icon" />
                    <div>
                      <h4>{amenity.amenity_name}</h4>
                      <p className="amenity-hours">
                        {amenity.additional_info || 'Available 24/7'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data-message">No amenities information available for this hotel.</p>
          )}
        </div>

        <div className="rooms-section">
          <h2>Available Rooms</h2>
          {rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room.roomid} room={room} checkinDate={checkinParam} checkoutDate={checkoutParam} />
              ))}
            </div>
          ) : (
            <p className="no-data-message">No rooms are currently available at this hotel.</p>
          )}
        </div>

        {parsedReviews.length > 0 ? (
          <div className="reviews-section">
            <div className="section-header">
              <h2>Guest Reviews ({parsedReviews.length})</h2>
              <div className="header-divider"></div>
            </div>
            <div className="reviews-container">
              {parsedReviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <FaUser />
                      </div>
                      <div>
                        <h4 className="reviewer-name">{review.customer}</h4>
                        <span className="review-date">
                          {formatDisplayDate(review.date)}
                        </span>
                      </div>
                    </div>
                    <div className="review-rating">
                      <FaStar className="review-star" />
                      <span className="rating-value">{review.rating}/5</span>
                    </div>
                  </div>
                  <div className="review-body">
                    <FaQuoteLeft className="quote-icon quote-left" />
                    <p className="review-comment">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="reviews-section">
            <div className="section-header">
              <h2>Guest Reviews</h2>
              <div className="header-divider"></div>
            </div>
            <p className="no-data-message">No reviews yet. Be the first to review this hotel!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
