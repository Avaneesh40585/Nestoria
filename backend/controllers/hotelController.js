const pool = require('../config/database');

// Search hotels with filters
exports.searchHotels = async (req, res) => {
  try {
    const { location, checkin, checkout, minPrice, maxPrice, minRating } = req.query;

    let query = `
      SELECT DISTINCT h.*, 
             (SELECT MIN(r.Cost_per_night) FROM Room r WHERE r.HotelID = h.HotelID) as min_price
      FROM Hotel h
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Location filter (case-insensitive)
    if (location) {
      query += ` AND h.HotelAddress ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Rating filter
    if (minRating) {
      query += ` AND h.OverallRating >= $${paramIndex}`;
      params.push(minRating);
      paramIndex++;
    }

    // Check room availability if dates provided
    if (checkin && checkout) {
      query += `
        AND EXISTS (
          SELECT 1 FROM Room r
          WHERE r.HotelID = h.HotelID
          AND r.Room_Status = 'Available'
          AND NOT EXISTS (
            SELECT 1 FROM Booking b
            WHERE b.RoomID = r.RoomID
            AND b.booking_status = TRUE
            AND (
              (b.checkin_date <= $${paramIndex} AND b.checkout_date > $${paramIndex})
              OR (b.checkin_date < $${paramIndex + 1} AND b.checkout_date >= $${paramIndex + 1})
              OR (b.checkin_date >= $${paramIndex} AND b.checkout_date <= $${paramIndex + 1})
            )
          )
        )
      `;
      params.push(checkin, checkout);
      paramIndex += 2;
    }

    query += ' ORDER BY h.OverallRating DESC';

    const result = await pool.query(query, params);

    // Filter by price range if specified
    let hotels = result.rows;
    if (minPrice || maxPrice) {
      hotels = hotels.filter(hotel => {
        const price = parseFloat(hotel.min_price);
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    res.json({ hotels, count: hotels.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

// Get hotel details
exports.getHotelDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const hotelQuery = await pool.query(
      'SELECT * FROM Hotel WHERE HotelID = $1',
      [id]
    );

    if (hotelQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const hotel = hotelQuery.rows[0];

    // Get amenities
    const amenitiesQuery = await pool.query(
      `SELECT a.*, har.Availability_hrs
       FROM Amenities a
       JOIN Hotel_Amenities_Relation har ON a.AmenityID = har.AmenityID
       WHERE har.HotelID = $1`,
      [id]
    );

    // Get rooms
    const roomsQuery = await pool.query(
      'SELECT * FROM Room WHERE HotelID = $1 ORDER BY Cost_per_night',
      [id]
    );

    res.json({
      hotel,
      amenities: amenitiesQuery.rows,
      rooms: roomsQuery.rows
    });
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ error: 'Failed to fetch hotel details', details: error.message });
  }
};

// Get all hotels (admin/listing)
exports.getAllHotels = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Hotel ORDER BY OverallRating DESC'
    );
    res.json({ hotels: result.rows });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Create hotel (Host only)
exports.createHotel = async (req, res) => {
  try {
    const hostId = req.user.id;
    const {
      hotel_name,
      hotel_address,
      hotel_desc,
      checkin_time,
      checkout_time,
      contact_receptionist,
      hotel_img
    } = req.body;

    const result = await pool.query(
      `INSERT INTO Hotel (HostID, HotelName, HotelAddress, Hoteldesc, Checkin_time, 
       Checkout_time, ContactReceptionist, HotelImg, OverallRating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0.0) RETURNING *`,
      [hostId, hotel_name, hotel_address, hotel_desc, checkin_time, checkout_time, 
       contact_receptionist, hotel_img]
    );

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;
    const {
      hotel_name,
      hotel_address,
      hotel_desc,
      checkin_time,
      checkout_time,
      contact_receptionist,
      hotel_img
    } = req.body;

    // Verify ownership
    const ownershipCheck = await pool.query(
      'SELECT * FROM Hotel WHERE HotelID = $1 AND HostID = $2',
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this hotel' });
    }

    const result = await pool.query(
      `UPDATE Hotel SET 
       HotelName = $1, HotelAddress = $2, Hoteldesc = $3, Checkin_time = $4,
       Checkout_time = $5, ContactReceptionist = $6, HotelImg = $7
       WHERE HotelID = $8 RETURNING *`,
      [hotel_name, hotel_address, hotel_desc, checkin_time, checkout_time,
       contact_receptionist, hotel_img, id]
    );

    res.json({
      message: 'Hotel updated successfully',
      hotel: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel', details: error.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    // Verify ownership
    const ownershipCheck = await pool.query(
      'SELECT * FROM Hotel WHERE HotelID = $1 AND HostID = $2',
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this hotel' });
    }

    await pool.query('DELETE FROM Hotel WHERE HotelID = $1', [id]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
  }
};

// Get hotels by host
exports.getHostHotels = async (req, res) => {
  try {
    const hostId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM Hotel WHERE HostID = $1 ORDER BY HotelID DESC',
      [hostId]
    );

    res.json({ hotels: result.rows });
  } catch (error) {
    console.error('Error fetching host hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};
