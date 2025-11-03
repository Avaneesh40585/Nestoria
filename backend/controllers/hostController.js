const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Get host profile
exports.getProfile = async (req, res) => {
  try {
    const hostId = req.user.id;

    const result = await pool.query(
      'SELECT HostID, Full_name, Email, PhoneNumber, Gender, Age, Address, Identity_No FROM Host WHERE HostID = $1',
      [hostId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Host not found' });
    }

    res.json({ host: result.rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
};

// Update host profile
exports.updateProfile = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { full_name, phone_number, gender, age, address } = req.body;

    const result = await pool.query(
      `UPDATE Host SET 
       Full_name = $1, PhoneNumber = $2, Gender = $3, Age = $4, Address = $5
       WHERE HostID = $6 RETURNING HostID, Full_name, Email, PhoneNumber, Gender, Age, Address, Identity_No`,
      [full_name, phone_number, gender, age, address, hostId]
    );

    res.json({
      message: 'Profile updated successfully',
      host: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const hostId = req.user.id;

    // Get total hotels
    const hotelsResult = await pool.query(
      'SELECT COUNT(*) as total_hotels FROM Hotel WHERE HostID = $1',
      [hostId]
    );

    // Get total rooms
    const roomsResult = await pool.query(
      `SELECT COUNT(*) as total_rooms FROM Room r
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE h.HostID = $1`,
      [hostId]
    );

    // Get total bookings
    const bookingsResult = await pool.query(
      `SELECT COUNT(*) as total_bookings FROM Booking b
       JOIN Room r ON b.RoomID = r.RoomID
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE h.HostID = $1 AND b.booking_status = TRUE`,
      [hostId]
    );

    // Get total revenue
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(b.final_amount), 0) as total_revenue FROM Booking b
       JOIN Room r ON b.RoomID = r.RoomID
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE h.HostID = $1 AND b.booking_status = TRUE`,
      [hostId]
    );

    res.json({
      total_hotels: hotelsResult.rows[0].total_hotels,
      total_rooms: roomsResult.rows[0].total_rooms,
      total_bookings: bookingsResult.rows[0].total_bookings,
      total_revenue: parseFloat(revenueResult.rows[0].total_revenue)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
};
