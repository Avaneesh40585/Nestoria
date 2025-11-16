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

    // Location filter (case-insensitive pattern matching)
    if (location) {
      // Use ILIKE for case-insensitive pattern matching (simpler and more reliable)
      query += ` AND h.Hotel_Address ILIKE $${paramIndex}`;
      // Use % wildcards for partial matching
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Rating filter
    if (minRating) {
      query += ` AND h.Overall_Rating >= $${paramIndex}`;
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

    query += ' ORDER BY h.Overall_Score DESC NULLS LAST, h.Overall_Rating DESC';

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

// Get hotel details (optimized to fetch all data in fewer queries)
exports.getHotelDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch hotel, amenities, rooms, and reviews in parallel
    const [hotelQuery, amenitiesQuery, roomsQuery, reviewsQuery] = await Promise.all([
      pool.query('SELECT * FROM Hotel WHERE HotelID = $1', [id]),
      pool.query(
        `SELECT a.AmenityID, a.Amenity_Name, ha.Is_Available, ha.Additional_Info
         FROM Amenities a
         INNER JOIN Hotel_Amenities ha ON a.AmenityID = ha.AmenityID
         WHERE ha.HotelID = $1`,
        [id]
      ),
      pool.query(
        'SELECT * FROM Room WHERE HotelID = $1 ORDER BY Overall_Score DESC NULLS LAST, Overall_Rating DESC, Cost_Per_Night',
        [id]
      ),
      pool.query(
        `SELECT chr.Hotel_Review, chr.Hotel_Rating, chr.Review_Date, c.Full_Name
         FROM Customer_Hotel_Review chr
         INNER JOIN Customer c ON chr.CustomerID = c.CustomerID
         WHERE chr.HotelID = $1
         ORDER BY chr.Review_Date DESC`,
        [id]
      )
    ]);

    if (hotelQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json({
      hotel: hotelQuery.rows[0],
      amenities: amenitiesQuery.rows,
      rooms: roomsQuery.rows,
      reviews: reviewsQuery.rows
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
      'SELECT * FROM Hotel ORDER BY Overall_Score DESC NULLS LAST, Overall_Rating DESC'
    );
    res.json({ hotels: result.rows });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Create hotel (Host only)
exports.createHotel = async (req, res) => {
  const client = await pool.connect();
  try {
    const hostId = req.user.id;
    const {
      hotel_name,
      hotel_address,
      hotel_desc,
      checkin_time,
      checkout_time,
      receptionist_number,
      hotel_img,
      amenities
    } = req.body;

    console.log('🏨 Creating hotel for host:', hostId);
    console.log('📝 Hotel data:', {
      hotel_name,
      hotel_address,
      hotel_desc,
      checkin_time,
      checkout_time,
      receptionist_number,
      hotel_img: hotel_img ? `${hotel_img.substring(0, 50)}...` : 'No image',
      amenities
    });

    // Validate required fields
    if (!hotel_name || !hotel_address) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'Hotel name and address are required',
        details: 'Missing required fields'
      });
    }

    // Verify host exists in database
    const hostCheck = await client.query('SELECT * FROM Host WHERE HostID = $1', [hostId]);
    if (hostCheck.rows.length === 0) {
      console.error('❌ Host not found in database:', hostId);
      return res.status(401).json({
        error: 'Session expired or invalid',
        details: 'Please log out and log back in. Your host account may have been removed or recreated.',
        code: 'HOST_NOT_FOUND'
      });
    }

    console.log('✅ Host verified:', hostId);

    await client.query('BEGIN');

    // Generate HotelID
    const hotelCountResult = await client.query('SELECT COUNT(*) as count FROM Hotel');
    const hotelCount = parseInt(hotelCountResult.rows[0].count) + 1;
    const hotelId = `AADHTEL${String(hotelCount).padStart(3, '0')}`;

    console.log('🆔 Generated HotelID:', hotelId);

    const result = await client.query(
      `INSERT INTO Hotel (HotelID, HostID, Hotel_Name, Hotel_Address, Hotel_Description, Checkin_Time, 
       Checkout_Time, Receptionist_Number, Hotel_Img, Overall_Rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0.0) RETURNING *`,
      [hotelId, hostId, hotel_name, hotel_address, hotel_desc, checkin_time, checkout_time, 
       receptionist_number, hotel_img]
    );

    console.log('✅ Hotel inserted into database');

    // Insert amenities if provided
    if (amenities && amenities.length > 0) {
      console.log('Creating hotel with amenities:', amenities);
      for (const amenityId of amenities) {
        await client.query(
          'INSERT INTO Hotel_Amenities (HotelID, AmenityID, Is_Available, Additional_Info) VALUES ($1, $2, $3, $4)',
          [hotelId, amenityId, true, '24/7']
        );
      }
    }

    await client.query('COMMIT');

    console.log('✅ Hotel created successfully:', hotelId);

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating hotel:', error);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  } finally {
    client.release();
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const hostId = req.user.id;
    const {
      hotel_name,
      hotel_address,
      hotel_desc,
      checkin_time,
      checkout_time,
      receptionist_number,
      hotel_img,
      amenities
    } = req.body;

    // Verify ownership
    const ownershipCheck = await client.query(
      'SELECT * FROM Hotel WHERE HotelID = $1 AND HostID = $2',
      [id, hostId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this hotel' });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE Hotel SET 
       Hotel_Name = $1, Hotel_Address = $2, Hotel_Description = $3, Checkin_Time = $4,
       Checkout_Time = $5, Receptionist_Number = $6, Hotel_Img = $7
       WHERE HotelID = $8 RETURNING *`,
      [hotel_name, hotel_address, hotel_desc, checkin_time, checkout_time,
       receptionist_number, hotel_img, id]
    );

    // Update amenities if provided
    if (amenities !== undefined) {
      console.log('Updating hotel amenities:', amenities);
      // Delete existing amenities
      await client.query('DELETE FROM Hotel_Amenities WHERE HotelID = $1', [id]);
      
      // Insert new amenities
      if (amenities.length > 0) {
        for (const amenityId of amenities) {
          await client.query(
            'INSERT INTO Hotel_Amenities (HotelID, AmenityID, Is_Available, Additional_Info) VALUES ($1, $2, $3, $4)',
            [id, amenityId, true, '24/7']
          );
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Hotel updated successfully',
      hotel: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel', details: error.message });
  } finally {
    client.release();
  }
};

// Delete hotel (optimized ownership check and delete)
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    // Verify ownership and delete in single query
    const result = await pool.query(
      'DELETE FROM Hotel WHERE HotelID = $1 AND HostID = $2 RETURNING HotelID',
      [id, hostId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this hotel' });
    }

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

// Get platform statistics for About Us page
exports.getPlatformStats = async (req, res) => {
  try {
    // Get total hotels count
    const hotelsCountQuery = await pool.query('SELECT COUNT(*) as count FROM Hotel');
    const totalHotels = parseInt(hotelsCountQuery.rows[0].count);

    // Get total customers count
    const customersCountQuery = await pool.query('SELECT COUNT(*) as count FROM Customer');
    const totalCustomers = parseInt(customersCountQuery.rows[0].count);

    // Get average hotel rating (rounded to 1 decimal)
    const avgRatingQuery = await pool.query(
      'SELECT ROUND(AVG(Overall_Rating)::numeric, 1) as avg_rating FROM Hotel WHERE Overall_Rating > 0'
    );
    const avgRating = parseFloat(avgRatingQuery.rows[0].avg_rating) || 0;

    // Get unique cities count from hotel addresses
    const citiesQuery = await pool.query(
      `SELECT COUNT(DISTINCT 
        CASE 
          WHEN Hotel_Address LIKE '%Chennai%' THEN 'Chennai'
          WHEN Hotel_Address LIKE '%Hyderabad%' THEN 'Hyderabad'
          WHEN Hotel_Address LIKE '%Mumbai%' THEN 'Mumbai'
          WHEN Hotel_Address LIKE '%Delhi%' THEN 'Delhi'
          WHEN Hotel_Address LIKE '%Bangalore%' THEN 'Bangalore'
          WHEN Hotel_Address LIKE '%Bengaluru%' THEN 'Bangalore'
          WHEN Hotel_Address LIKE '%Kolkata%' THEN 'Kolkata'
          WHEN Hotel_Address LIKE '%Pune%' THEN 'Pune'
          WHEN Hotel_Address LIKE '%Ahmedabad%' THEN 'Ahmedabad'
          WHEN Hotel_Address LIKE '%Jaipur%' THEN 'Jaipur'
          WHEN Hotel_Address LIKE '%Kochi%' THEN 'Kochi'
          WHEN Hotel_Address LIKE '%Goa%' THEN 'Goa'
        END
      ) as cities_count FROM Hotel WHERE Hotel_Address IS NOT NULL`
    );
    const citiesCovered = parseInt(citiesQuery.rows[0].cities_count) || 0;

    res.json({
      totalHotels,
      totalCustomers,
      avgRating,
      citiesCovered
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
  }
};
