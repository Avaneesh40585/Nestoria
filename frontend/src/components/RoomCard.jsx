import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRupeeSign, FaEye } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Validate and provide defaults for room data
  const roomType = room?.room_type?.trim() || 'Standard Room';
  const roomNumber = room?.roomnumber?.trim() || 'N/A';
  const roomView = room?.position_view?.trim() || 'Standard View';
  const roomStatus = room?.room_status?.trim() || 'Unknown';
  const roomRating = room?.room_rating;
  const roomDesc = room?.room_desc?.trim();
  const costPerNight = room?.cost_per_night;
  const roomId = room?.roomid;

  const handleViewDetails = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  // Format rating
  const formatRating = (rating) => {
    if (!rating || isNaN(rating)) return 'N/A';
    return parseFloat(rating).toFixed(1);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || isNaN(price) || price <= 0) return 'N/A';
    return Math.floor(price).toLocaleString();
  };

  // Don't render if room data is invalid
  if (!room || !roomId) {
    return null;
  }

  return (
    <div className="room-card">
      <div className="room-header">
        <h4>{roomType}</h4>
        <div className="room-rating">
          <FaStar className="star-icon" />
          <span>{formatRating(roomRating)}</span>
        </div>
      </div>

      <div className="room-info">
        <p><strong>Room Number:</strong> {roomNumber}</p>
        <p><strong>View:</strong> {roomView}</p>
        <p><strong>Status:</strong> 
          <span className={`status-badge ${roomStatus.toLowerCase()}`}>
            {roomStatus}
          </span>
        </p>
      </div>

      {roomDesc && roomDesc.length > 0 && (
        <p className="room-description">
          {roomDesc.length > 100 
            ? `${roomDesc.substring(0, 100).trim()}...` 
            : roomDesc}
        </p>
      )}

      <div className="room-footer">
        <div className="room-price">
          <FaRupeeSign className="rupee-icon-display" />
          <span className="price">{formatPrice(costPerNight)}</span>
          <span className="per-night">/night</span>
        </div>
        <button 
          className="view-room-btn" 
          onClick={handleViewDetails}
          disabled={!roomId}
        >
          <FaEye /> View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
