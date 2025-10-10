import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRupeeSign, FaEye, FaBed, FaWifi } from 'react-icons/fa';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const [room, setRoom] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await roomAPI.getDetails(id);
      setRoom(response.data.room);
      setAmenities(response.data.amenities);
    } catch (error) {
      console.error('Error fetching room details:', error);
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
    return <div className="loading-container">Loading room details...</div>;
  }

  if (!room) {
    return <div className="error-container">Room not found</div>;
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
              <span>{room.room_rating || 'N/A'}</span>
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
                    <span>{room.checkin_time || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <strong>Check-out Time:</strong>
                    <span>{room.checkout_time || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {room.room_desc && (
                <div className="info-section">
                  <h2>Description</h2>
                  <p>{room.room_desc}</p>
                </div>
              )}

              <div className="info-section">
                <h2>Room Amenities</h2>
                {amenities.length > 0 ? (
                  <div className="amenities-list">
                    {amenities.map((amenity) => (
                      <div key={amenity.amenityid} className="amenity-badge">
                        <FaWifi className="amenity-icon-small" />
                        <span>{amenity.amenity_name}</span>
                        {!amenity.working_status && (
                          <span className="not-working">(Not Working)</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No amenities listed</p>
                )}
              </div>

              {room.room_review && (
                <div className="info-section">
                  <h2>Guest Reviews</h2>
                  <p className="review-text">{room.room_review}</p>
                </div>
              )}
            </div>

            <div className="room-booking-card">
              <div className="price-section">
                <div className="price-label">Price per night</div>
                <div className="price-amount">
                  <FaRupeeSign className="rupee-icon" />
                  {Math.floor(room.cost_per_night)}
                </div>
                <div className="price-note">+ 18% GST</div>
              </div>

              <button 
                className="book-now-btn" 
                onClick={handleBookNow}
                disabled={room.room_status?.toLowerCase() !== 'available'}
              >
                {room.room_status?.toLowerCase() === 'available' ? 'Book Now' : 'Not Available'}
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
