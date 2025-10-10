import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaWifi, FaSwimmingPool } from 'react-icons/fa';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    setLoading(true);
    try {
      const response = await hotelAPI.getDetails(id);
      setHotel(response.data.hotel);
      setAmenities(response.data.amenities);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading hotel details...</div>;
  }

  if (!hotel) {
    return <div className="error-container">Hotel not found</div>;
  }

  return (
    <div className="hotel-details-page">
      <div className="hotel-hero">
        <img 
          src={hotel.hotelimg || 'https://via.placeholder.com/1200x400'} 
          alt={hotel.hotelname}
          className="hotel-hero-image"
        />
        <div className="hotel-hero-overlay">
          <div className="container">
            <h1 className="hotel-title">{hotel.hotelname}</h1>
            <div className="hotel-meta">
              <span className="hotel-rating">
                <FaStar /> {hotel.overallrating || 'N/A'}
              </span>
              <span className="hotel-location">
                <FaMapMarkerAlt /> {hotel.hoteladdress}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hotel-info-section">
          <div className="hotel-description">
            <h2>About This Hotel</h2>
            <p>{hotel.hoteldesc || 'No description available'}</p>
          </div>

          <div className="hotel-sidebar">
            <div className="info-card">
              <h3>Hotel Information</h3>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <strong>Check-in:</strong> {hotel.checkin_time || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <strong>Check-out:</strong> {hotel.checkout_time || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <strong>Contact:</strong> {hotel.contactreceptionist || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="amenities-section">
          <h2>Amenities</h2>
          {amenities.length > 0 ? (
            <div className="amenities-grid">
              {amenities.map((amenity) => (
                <div key={amenity.amenityid} className="amenity-item">
                  <FaWifi className="amenity-icon" />
                  <div>
                    <h4>{amenity.amenity_name}</h4>
                    <p className="amenity-hours">{amenity.availability_hrs}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No amenities listed</p>
          )}
        </div>

        <div className="rooms-section">
          <h2>Available Rooms</h2>
          {rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room.roomid} room={room} />
              ))}
            </div>
          ) : (
            <p>No rooms available</p>
          )}
        </div>

        {hotel.reviews && (
          <div className="reviews-section">
            <h2>Reviews</h2>
            <p>{hotel.reviews}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
