const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Get host profile
exports.getProfile = async (req, res) => {
  try {
    const hostId = req.user.id;

    const result = await pool.query(
      'SELECT HostID, Full_Name, Email, Phone_Number, Gender, Age, Address FROM Host WHERE HostID = $1',
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

    console.log('📝 Updating host profile:', hostId);
    console.log('Data received:', { full_name, phone_number, gender, age, address });

    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (full_name !== undefined) {
      updates.push(`Full_Name = $${paramCounter}`);
      values.push(full_name);
      paramCounter++;
    }
    if (phone_number !== undefined) {
      updates.push(`Phone_Number = $${paramCounter}`);
      values.push(phone_number);
      paramCounter++;
    }
    if (gender !== undefined) {
      updates.push(`Gender = $${paramCounter}`);
      values.push(gender);
      paramCounter++;
    }
    if (age !== undefined) {
      updates.push(`Age = $${paramCounter}`);
      values.push(age);
      paramCounter++;
    }
    if (address !== undefined) {
      updates.push(`Address = $${paramCounter}`);
      values.push(address);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(hostId);
    const query = `UPDATE Host SET ${updates.join(', ')} WHERE HostID = $${paramCounter} RETURNING HostID, Full_Name, Email, Phone_Number, Gender, Age, Address`;

    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);

    console.log('✅ Profile updated successfully');

    res.json({
      message: 'Profile updated successfully',
      host: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

// Get dashboard statistics (optimized with single query using CTEs)
exports.getDashboardStats = async (req, res) => {
  try {
    const hostId = req.user.id;

    // Combine all stats in single query using CTEs
    const result = await pool.query(
      `WITH hotel_stats AS (
        SELECT COUNT(*) as total_hotels
        FROM Hotel 
        WHERE HostID = $1
      ),
      room_stats AS (
        SELECT COUNT(*) as total_rooms
        FROM Room r
        INNER JOIN Hotel h ON r.HotelID = h.HotelID
        WHERE h.HostID = $1
      ),
      booking_stats AS (
        SELECT 
          COUNT(*) as total_bookings,
          COALESCE(SUM(b.Base_Amount + b.Tax_Amount), 0) as total_revenue
        FROM Booking b
        INNER JOIN Room r ON b.RoomID = r.RoomID AND b.HotelID = r.HotelID
        INNER JOIN Hotel h ON r.HotelID = h.HotelID
        WHERE h.HostID = $1 AND b.Booking_Status = TRUE
      )
      SELECT 
        (SELECT total_hotels FROM hotel_stats) as total_hotels,
        (SELECT total_rooms FROM room_stats) as total_rooms,
        (SELECT total_bookings FROM booking_stats) as total_bookings,
        (SELECT total_revenue FROM booking_stats) as total_revenue`,
      [hostId]
    );

    const stats = result.rows[0];
    res.json({
      total_hotels: parseInt(stats.total_hotels),
      total_rooms: parseInt(stats.total_rooms),
      total_bookings: parseInt(stats.total_bookings),
      total_revenue: parseFloat(stats.total_revenue)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
};
