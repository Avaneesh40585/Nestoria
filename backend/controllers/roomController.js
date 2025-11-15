const pool = require('../config/database');

// Get room details (optimized with parallel queries)
exports.getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the room to get the HotelID
    const roomQuery = await pool.query(
      `SELECT r.*, h.Hotel_Name, h.Hotel_Address, h.Checkin_Time, h.Checkout_Time
       FROM Room r
       INNER JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE r.RoomID = $1`,
      [id]
    );

    if (roomQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Now get amenities using the HotelID from the room
    const hotelId = roomQuery.rows[0].hotelid;
    const amenitiesQuery = await pool.query(
      `SELECT a.AmenityID, a.Amenity_Name, ra.Is_Available, ra.Additional_Info
       FROM Amenities a
       INNER JOIN Room_Amenities ra ON a.AmenityID = ra.AmenityID
       WHERE ra.HotelID = $1 AND ra.RoomID = $2`,
      [hotelId, id]
    );

    res.json({
      room: roomQuery.rows[0],
      amenities: amenitiesQuery.rows
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Failed to fetch room details', details: error.message });
  }
};

// Check room availability (optimized with EXISTS)
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin, checkout } = req.query;

    const result = await pool.query(
      `SELECT EXISTS(
         SELECT 1
         FROM Booking
         WHERE RoomID = $1
         AND booking_status = TRUE
         AND (
           (checkin_date <= $2 AND checkout_date > $2)
           OR (checkin_date < $3 AND checkout_date >= $3)
           OR (checkin_date >= $2 AND checkout_date <= $3)
         )
       ) as is_booked`,
      [id, checkin, checkout]
    );

    const isAvailable = !result.rows[0].is_booked;

    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability', details: error.message });
  }
};

// Create room (Host only)
exports.createRoom = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      hotel_id,
      room_number,
      room_type,
      room_desc,
      cost_per_night,
      position_view,
      room_status,
      amenities
    } = req.body;

    const hostId = req.user.id;

    // Verify hotel ownership
    const ownershipCheck = await client.query(
      'SELECT * FROM Hotel WHERE HotelID = $1 AND HostID = $2',
      [hotel_id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to add rooms to this hotel' });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO Room (HotelID, RoomID, Room_Type, Room_Description, Cost_Per_Night, 
       Position_View, Room_Status, Overall_Rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0.0) RETURNING *`,
      [hotel_id, room_number, room_type, room_desc, cost_per_night, position_view, room_status]
    );

    const roomId = result.rows[0].roomid;

    // Insert amenities if provided
    if (amenities && amenities.length > 0) {
      console.log('Creating room with amenities:', amenities);
      for (const amenityId of amenities) {
        await client.query(
          'INSERT INTO Room_Amenities (HotelID, RoomID, AmenityID, Is_Available, Additional_Info) VALUES ($1, $2, $3, $4, $5)',
          [hotel_id, roomId, amenityId, true, 'Available']
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Room created successfully',
      room: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room', details: error.message });
  } finally {
    client.release();
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      room_number,
      room_type,
      room_desc,
      cost_per_night,
      position_view,
      room_status,
      amenities
    } = req.body;

    const hostId = req.user.id;

    // Verify ownership through hotel
    const ownershipCheck = await client.query(
      `SELECT r.* FROM Room r
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE r.RoomID = $1 AND h.HostID = $2`,
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this room' });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE Room SET 
       RoomID = $1, Room_Type = $2, Room_Description = $3, Cost_Per_Night = $4,
       Position_View = $5, Room_Status = $6
       WHERE HotelID = $7 AND RoomID = $8 RETURNING *`,
      [room_number, room_type, room_desc, cost_per_night, position_view, room_status, ownershipCheck.rows[0].hotelid, id]
    );

    // Update amenities if provided
    if (amenities !== undefined) {
      console.log('Updating room amenities:', amenities);
      // Delete existing amenities
      await client.query('DELETE FROM Room_Amenities WHERE HotelID = $1 AND RoomID = $2', [ownershipCheck.rows[0].hotelid, id]);
      
      // Insert new amenities
      if (amenities.length > 0) {
        for (const amenityId of amenities) {
          await client.query(
            'INSERT INTO Room_Amenities (HotelID, RoomID, AmenityID, Is_Available, Additional_Info) VALUES ($1, $2, $3, $4, $5)',
            [ownershipCheck.rows[0].hotelid, id, amenityId, true, 'Available']
          );
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Room updated successfully',
      room: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room', details: error.message });
  } finally {
    client.release();
  }
};

// Delete room (optimized ownership check and delete)
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    // Verify ownership through hotel and delete in single query
    const result = await pool.query(
      `DELETE FROM Room r
       USING Hotel h
       WHERE r.HotelID = h.HotelID
       AND r.RoomID = $1 
       AND h.HostID = $2
       RETURNING r.RoomID`,
      [id, hostId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this room' });
    }

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
