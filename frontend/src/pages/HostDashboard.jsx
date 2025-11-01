import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hostAPI, hotelAPI, roomAPI, bookingAPI } from '../services/api';
import { FaHotel, FaBed, FaCalendarCheck, FaRupeeSign, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const HostDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({});
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [loading, setLoading] = useState(true);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [availableHotelAmenities] = useState([
    { id: 1, name: 'Wi-Fi' },
    { id: 2, name: 'Swimming Pool' },
    { id: 3, name: 'Gym' },
    { id: 4, name: 'Spa' },
    { id: 5, name: 'Restaurant' },
    { id: 7, name: 'Parking' },
    { id: 8, name: 'Conference Room' },
    { id: 9, name: 'Airport Shuttle' },
    { id: 11, name: 'Bar' }
  ]);
  const [hotelForm, setHotelForm] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_desc: '',
    checkin_time: '14:00',
    checkout_time: '11:00',
    contact_receptionist: '',
    hotel_img: '',
    amenities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, hotelsRes, bookingsRes] = await Promise.all([
        hostAPI.getDashboardStats(),
        hotelAPI.getHostHotels(),
        bookingAPI.getHostBookings()
      ]);

      setStats(statsRes.data);
      
      // Fetch amenities for each hotel
      const hotelsWithAmenities = await Promise.all(
        (hotelsRes.data.hotels || []).map(async (hotel) => {
          try {
            const hotelDetails = await hotelAPI.getDetails(hotel.hotelid);
            const amenityIds = hotelDetails.data.amenities ? hotelDetails.data.amenities.map(a => a.amenityid) : [];
            return { ...hotel, amenities: amenityIds };
          } catch (error) {
            console.error(`Error fetching amenities for hotel ${hotel.hotelid}:`, error);
            return { ...hotel, amenities: [] };
          }
        })
      );
      
      setHotels(hotelsWithAmenities);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const response = await hotelAPI.create(hotelForm);
      const newHotelId = response.data.hotel.hotelid;
      
      const viewRooms = window.confirm('Hotel added successfully! Would you like to manage rooms for this hotel now?');
      
      setShowAddHotel(false);
      setHotelForm({
        hotel_name: '',
        hotel_address: '',
        hotel_desc: '',
        checkin_time: '14:00',
        checkout_time: '11:00',
        contact_receptionist: '',
        hotel_img: '',
        amenities: []
      });
      fetchDashboardData();
      
      if (viewRooms) {
        navigate(`/host/add-rooms?hotelId=${newHotelId}`);
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Failed to add hotel');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await hotelAPI.delete(hotelId);
        alert('Hotel deleted successfully');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('Failed to delete hotel');
      }
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotelId(hotel.hotelid);
    setEditForm({
      hotel_name: hotel.hotelname,
      hotel_address: hotel.hoteladdress,
      hotel_desc: hotel.hoteldesc,
      checkin_time: hotel.checkin_time,
      checkout_time: hotel.checkout_time,
      contact_receptionist: hotel.contactreceptionist,
      hotel_img: hotel.hotelimg,
      amenities: hotel.amenities || []
    });
  };

  const handleSaveEdit = async (hotelId) => {
    try {
      await hotelAPI.update(hotelId, editForm);
      alert('Hotel updated successfully!');
      setEditingHotelId(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Failed to update hotel');
    }
  };

  const handleCancelEdit = () => {
    setEditingHotelId(null);
    setEditForm({});
  };

  const toggleHotelAmenity = (amenityId) => {
    const amenities = hotelForm.amenities || [];
    if (amenities.includes(amenityId)) {
      setHotelForm({...hotelForm, amenities: amenities.filter(id => id !== amenityId)});
    } else {
      setHotelForm({...hotelForm, amenities: [...amenities, amenityId]});
    }
  };

  const toggleEditHotelAmenity = (amenityId) => {
    const amenities = editForm.amenities || [];
    if (amenities.includes(amenityId)) {
      setEditForm({...editForm, amenities: amenities.filter(id => id !== amenityId)});
    } else {
      setEditForm({...editForm, amenities: [...amenities, amenityId]});
    }
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="host-dashboard-page">
      <div className="container">
        <h1 className="page-title">Host Dashboard</h1>

        <div className="dashboard-tabs">
          <div className="tabs-left">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              My Hotels
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </div>
          {activeTab === 'hotels' && (
            <button className="add-hotel-btn" onClick={() => setShowAddHotel(!showAddHotel)}>
              <FaPlus /> {showAddHotel ? 'Hide Form' : 'Add New Hotel'}
            </button>
          )}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <FaHotel className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Hotels</h3>
                  <p className="stat-number">{stats.total_hotels || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaBed className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Rooms</h3>
                  <p className="stat-number">{stats.total_rooms || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaCalendarCheck className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">{stats.total_bookings || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaRupeeSign className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">₹{Math.floor(stats.total_revenue || 0)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'hotels' && (
          <div className="hotels-management">
            <div className="section-header">
              <h2>My Hotels</h2>
              {showAddHotel && (
                <div className="header-form-actions">
                  <button type="submit" className="save-form-btn" onClick={handleAddHotel}>
                    <FaSave /> Save
                  </button>
                  <button type="button" className="cancel-form-btn" onClick={() => setShowAddHotel(false)}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>

            {showAddHotel && (
              <div className="add-hotel-form">
                <h3>Add New Hotel</h3>
                <div className="form-grid" id="hotel-form-fields">
                    <div className="form-group">
                      <label>Hotel Name *</label>
                      <input
                        type="text"
                        value={hotelForm.hotel_name}
                        onChange={(e) => setHotelForm({...hotelForm, hotel_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        value={hotelForm.hotel_address}
                        onChange={(e) => setHotelForm({...hotelForm, hotel_address: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={hotelForm.hotel_desc}
                        onChange={(e) => setHotelForm({...hotelForm, hotel_desc: e.target.value})}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-in Time</label>
                      <input
                        type="time"
                        value={hotelForm.checkin_time}
                        onChange={(e) => setHotelForm({...hotelForm, checkin_time: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-out Time</label>
                      <input
                        type="time"
                        value={hotelForm.checkout_time}
                        onChange={(e) => setHotelForm({...hotelForm, checkout_time: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        type="tel"
                        value={hotelForm.contact_receptionist}
                        onChange={(e) => setHotelForm({...hotelForm, contact_receptionist: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Hotel Image URL</label>
                      <input
                        type="url"
                        value={hotelForm.hotel_img}
                        onChange={(e) => setHotelForm({...hotelForm, hotel_img: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Hotel Amenities</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {availableHotelAmenities.map((amenity) => (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => toggleHotelAmenity(amenity.id)}
                            style={{
                              padding: '8px 16px',
                              border: (hotelForm.amenities || []).includes(amenity.id) ? '2px solid #007bff' : '2px solid #ced4da',
                              backgroundColor: (hotelForm.amenities || []).includes(amenity.id) ? '#007bff' : '#fff',
                              color: (hotelForm.amenities || []).includes(amenity.id) ? '#fff' : '#333',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                          >
                            {amenity.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            )}

            <div className="hotels-list">
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel.hotelid} className="hotel-item">
                    {editingHotelId === hotel.hotelid ? (
                      <div className="edit-hotel-form">
                        <div className="form-header">
                          <h3>Edit Hotel</h3>
                          <div className="edit-actions">
                            <button className="save-btn" onClick={() => handleSaveEdit(hotel.hotelid)}>
                              <FaSave /> Save
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Hotel Name</label>
                            <input
                              type="text"
                              value={editForm.hotel_name || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_name: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address</label>
                            <input
                              type="text"
                              value={editForm.hotel_address || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_address: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={editForm.hotel_desc || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_desc: e.target.value})}
                              rows="3"
                            />
                          </div>
                          <div className="form-group">
                            <label>Check-in Time</label>
                            <input
                              type="time"
                              value={editForm.checkin_time || ''}
                              onChange={(e) => setEditForm({...editForm, checkin_time: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Check-out Time</label>
                            <input
                              type="time"
                              value={editForm.checkout_time || ''}
                              onChange={(e) => setEditForm({...editForm, checkout_time: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Contact Number</label>
                            <input
                              type="tel"
                              value={editForm.contact_receptionist || ''}
                              onChange={(e) => setEditForm({...editForm, contact_receptionist: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Hotel Image URL</label>
                            <input
                              type="url"
                              value={editForm.hotel_img || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_img: e.target.value})}
                            />
                          </div>
                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Hotel Amenities</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {availableHotelAmenities.map((amenity) => (
                                <button
                                  key={amenity.id}
                                  type="button"
                                  onClick={() => toggleEditHotelAmenity(amenity.id)}
                                  style={{
                                    padding: '8px 16px',
                                    border: (editForm.amenities || []).includes(amenity.id) ? '2px solid #007bff' : '2px solid #ced4da',
                                    backgroundColor: (editForm.amenities || []).includes(amenity.id) ? '#007bff' : '#fff',
                                    color: (editForm.amenities || []).includes(amenity.id) ? '#fff' : '#333',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    outline: 'none'
                                  }}
                                >
                                  {amenity.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="hotel-item-header">
                          <h3>{hotel.hotelname}</h3>
                          <div className="hotel-actions">
                            <button 
                              className="add-rooms-btn" 
                              onClick={() => navigate(`/host/add-rooms?hotelId=${hotel.hotelid}`)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <FaBed /> My Rooms
                            </button>
                            <button className="edit-icon-btn" onClick={() => handleEditHotel(hotel)}>
                              <FaEdit />
                            </button>
                            <button 
                              className="delete-icon-btn"
                              onClick={() => handleDeleteHotel(hotel.hotelid)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <p>{hotel.hoteladdress}</p>
                        <p>Rating: {hotel.overallrating || 'N/A'}</p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data">No hotels added yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-management">
            <h2>Recent Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Hotel</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingid}>
                        <td>{booking.bookingid}</td>
                        <td>{booking.customer_name}</td>
                        <td>{booking.hotelname}</td>
                        <td>{booking.roomnumber}</td>
                        <td>{new Date(booking.checkin_date).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkout_date).toLocaleDateString()}</td>
                        <td>₹{Math.floor(booking.final_amount)}</td>
                        <td>
                          <span className={`status-badge ${booking.booking_status ? 'active' : 'cancelled'}`}>
                            {booking.booking_status ? 'Active' : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No bookings yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
