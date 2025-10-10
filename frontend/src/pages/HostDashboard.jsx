import React, { useState, useEffect } from 'react';
import { hostAPI, hotelAPI, roomAPI, bookingAPI } from '../services/api';
import { FaHotel, FaBed, FaCalendarCheck, FaRupeeSign, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const HostDashboard = () => {
  const [stats, setStats] = useState({});
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_desc: '',
    checkin_time: '14:00',
    checkout_time: '11:00',
    contact_receptionist: '',
    hotel_img: ''
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
      setHotels(hotelsRes.data.hotels);
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
      await hotelAPI.create(hotelForm);
      alert('Hotel added successfully!');
      setShowAddHotel(false);
      setHotelForm({
        hotel_name: '',
        hotel_address: '',
        hotel_desc: '',
        checkin_time: '14:00',
        checkout_time: '11:00',
        contact_receptionist: '',
        hotel_img: ''
      });
      fetchDashboardData();
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

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="host-dashboard-page">
      <div className="container">
        <h1 className="page-title">Host Dashboard</h1>

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

            <div className="dashboard-tabs">
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
          </>
        )}

        {activeTab === 'hotels' && (
          <div className="hotels-management">
            <div className="section-header">
              <h2>My Hotels</h2>
              <button className="add-btn" onClick={() => setShowAddHotel(!showAddHotel)}>
                <FaPlus /> Add New Hotel
              </button>
            </div>

            {showAddHotel && (
              <div className="add-hotel-form">
                <h3>Add New Hotel</h3>
                <form onSubmit={handleAddHotel}>
                  <div className="form-grid">
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
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Hotel</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowAddHotel(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="hotels-list">
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel.hotelid} className="hotel-item">
                    <div className="hotel-item-header">
                      <h3>{hotel.hotelname}</h3>
                      <div className="hotel-actions">
                        <button className="edit-icon-btn">
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
