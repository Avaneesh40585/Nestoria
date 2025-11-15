import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const HotelCard = ({ hotel, checkinDate, checkoutDate }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    // Build URL with date params if they exist
    let url = `/hotel/${hotel.hotelid}`;
    if (checkinDate || checkoutDate) {
      const params = new URLSearchParams();
      if (checkinDate) params.append('checkin', checkinDate);
      if (checkoutDate) params.append('checkout', checkoutDate);
      url += `?${params.toString()}`;
    }
    navigate(url);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    handleClick();
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = 'https://via.placeholder.com/400x250?text=Hotel+Image';
    }
  };

  // Format rating to one decimal place
  const formatRating = (rating) => {
    if (!rating || rating === 'N/A') return 'N/A';
    return parseFloat(rating).toFixed(1);
  };

  return (
    <div className="hotel-card" onClick={handleClick}>
      <div className="hotel-image">
        <img 
          src={imageError ? 'https://via.placeholder.com/400x250?text=Hotel+Image' : (hotel.hotel_img || 'https://via.placeholder.com/400x250?text=Hotel+Image')} 
          alt={hotel.hotel_name || 'Hotel'} 
          onError={handleImageError}
        />
        <div className="hotel-rating">
          <FaStar className="star-icon" />
          <span>{formatRating(hotel.overall_rating)}</span>
        </div>
      </div>
      
      <div className="hotel-details">
        <h3 className="hotel-name">{hotel.hotel_name || 'Hotel Name'}</h3>
        <p className="hotel-location">
          <span>{hotel.hotel_address || 'Location not available'}</span>
        </p>
        
        {hotel.hotel_description && hotel.hotel_description.trim() && (
          <p className="hotel-description">
            {hotel.hotel_description.length > 120 
              ? `${hotel.hotel_description.substring(0, 120).trim()}...` 
              : hotel.hotel_description}
          </p>
        )}
        
        <div className="hotel-footer">
          <div className="hotel-price">
            <span className="price-label">Starting from</span>
            <div className="price-amount">
              <FaRupeeSign className="rupee-icon-small" />
              <span>{hotel.min_price ? Math.floor(hotel.min_price).toLocaleString() : 'N/A'}</span>
              <span className="per-night">/night</span>
            </div>
          </div>
          <button 
            className="view-details-btn"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;