import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hotel/${hotel.hotelid}`);
  };

  return (
    <div className="hotel-card" onClick={handleClick}>
      <div className="hotel-image">
        <img src={hotel.hotelimg || 'https://via.placeholder.com/400x250'} alt={hotel.hotelname} />
        <div className="hotel-rating">
          <FaStar className="star-icon" />
          <span>{hotel.overallrating || 'N/A'}</span>
        </div>
      </div>
      
      <div className="hotel-details">
        <h3 className="hotel-name">{hotel.hotelname}</h3>
        <p className="hotel-location">
          <FaMapMarkerAlt className="location-icon" />
          {hotel.hoteladdress}
        </p>
        
        {hotel.hoteldesc && (
          <p className="hotel-description">
            {hotel.hoteldesc.substring(0, 100)}...
          </p>
        )}
        
        <div className="hotel-footer">
          <div className="hotel-price">
            <span className="price-label">Starting from</span>
            <span className="price-amount">
              <FaRupeeSign className="rupee-icon-small" />
              {hotel.min_price ? Math.floor(hotel.min_price) : 'N/A'}
              <span className="per-night">/night</span>
            </span>
          </div>
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
