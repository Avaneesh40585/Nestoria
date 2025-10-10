import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRupeeSign, FaEye } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/room/${room.roomid}`);
  };

  return (
    <div className="room-card">
      <div className="room-header">
        <h4>{room.room_type}</h4>
        <div className="room-rating">
          <FaStar className="star-icon" />
          <span>{room.room_rating || 'N/A'}</span>
        </div>
      </div>

      <div className="room-info">
        <p><strong>Room Number:</strong> {room.roomnumber}</p>
        <p><strong>View:</strong> {room.position_view}</p>
        <p><strong>Status:</strong> 
          <span className={`status-badge ${room.room_status?.toLowerCase()}`}>
            {room.room_status}
          </span>
        </p>
      </div>

      {room.room_desc && (
        <p className="room-description">{room.room_desc}</p>
      )}

      <div className="room-footer">
        <div className="room-price">
          <FaRupeeSign className="rupee-icon" />
          <span className="price">{Math.floor(room.cost_per_night)}</span>
          <span className="per-night">/night</span>
        </div>
        <button className="view-room-btn" onClick={handleViewDetails}>
          <FaEye /> View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
