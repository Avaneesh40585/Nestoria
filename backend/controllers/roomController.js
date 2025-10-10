const pool = require('../config/database');

// Get room details
exports.getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const roomQuery = await pool.query(
      `SELECT r.*, h.HotelName, h.HotelAddress, h.Checkin_time, h.Checkout_time
       FROM Room r
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE r.RoomID = $1`,
      [id]
    );

    if (roomQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomQuery.rows[0];

    // Get room amenities
    const amenitiesQuery = await pool.query(
      `SELECT a.*, rar.Working_Status
       FROM Amenities a
       JOIN Room_Amenities_Relation rar ON a.AmenityID = rar.AmenityID
       WHERE rar.RoomID = $1`,
      [id]
    );

    res.json({
      room,
      amenities: amenitiesQuery.rows
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Failed to fetch room details', details: error.message });
  }
};

// Check room availability
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin, checkout } = req.query;

    const result = await pool.query(
      `SELECT COUNT(*) as booking_count
       FROM Booking
       WHERE RoomID = $1
       AND booking_status = TRUE
       AND (
         (checkin_date <= $2 AND checkout_date > $2)
         OR (checkin_date < $3 AND checkout_date >= $3)
         OR (checkin_date >= $2 AND checkout_date <= $3)
       )`,
      [id, checkin, checkout]
    );

    const isAvailable = result.rows[0].booking_count === '0';

    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability', details: error.message });
  }
};

// Create room (Host only)
exports.createRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      room_number,
      room_type,
      room_desc,
      cost_per_night,
      position_view,
      room_status
    } = req.body;

    const hostId = req.user.id;

    // Verify hotel ownership
    const ownershipCheck = await pool.query(
      'SELECT * FROM Hotel WHERE HotelID = $1 AND HostID = $2',
      [hotel_id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to add rooms to this hotel' });
    }

    const result = await pool.query(
      `INSERT INTO Room (HotelID, RoomNumber, Room_type, Room_desc, Cost_per_night, 
       Position_view, Room_Status, Room_Rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0.0) RETURNING *`,
      [hotel_id, room_number, room_type, room_desc, cost_per_night, position_view, room_status]
    );

    res.status(201).json({
      message: 'Room created successfully',
      room: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room', details: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      room_number,
      room_type,
      room_desc,
      cost_per_night,
      position_view,
      room_status
    } = req.body;

    const hostId = req.user.id;

    // Verify ownership through hotel
    const ownershipCheck = await pool.query(
      `SELECT r.* FROM Room r
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE r.RoomID = $1 AND h.HostID = $2`,
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this room' });
    }

    const result = await pool.query(
      `UPDATE Room SET 
       RoomNumber = $1, Room_type = $2, Room_desc = $3, Cost_per_night = $4,
       Position_view = $5, Room_Status = $6
       WHERE RoomID = $7 RETURNING *`,
      [room_number, room_type, room_desc, cost_per_night, position_view, room_status, id]
    );

    res.json({
      message: 'Room updated successfully',
      room: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room', details: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    // Verify ownership through hotel
    const ownershipCheck = await pool.query(
      `SELECT r.* FROM Room r
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE r.RoomID = $1 AND h.HostID = $2`,
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this room' });
    }

    await pool.query('DELETE FROM Room WHERE RoomID = $1', [id]);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room', details: error.message });
  }
};

// Get rooms by hotel
exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const result = await pool.query(
      'SELECT * FROM Room WHERE HotelID = $1 ORDER BY Cost_per_night',
      [hotelId]
    );

    res.json({ rooms: result.rows });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
  }
};
