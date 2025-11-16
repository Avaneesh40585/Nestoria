const pool = require('../config/database');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      room_id,
      checkin_date,
      checkout_date,
      base_amount,
      tax_amount
    } = req.body;

    // Check room availability (optimized query)
    const availabilityCheck = await pool.query(
      `SELECT EXISTS(
         SELECT 1
         FROM Booking
         WHERE RoomID = $1 AND HotelID = (SELECT HotelID FROM Room WHERE RoomID = $1)
         AND Booking_Status = TRUE
         AND (
           (Checkin_Date <= $2 AND Checkout_Date > $2)
           OR (Checkin_Date < $3 AND Checkout_Date >= $3)
           OR (Checkin_Date >= $2 AND Checkout_Date <= $3)
         )
       ) as is_booked`,
      [room_id, checkin_date, checkout_date]
    );

    if (availabilityCheck.rows[0].is_booked) {
      return res.status(400).json({ error: 'Room not available for selected dates' });
    }

    // Get hotel ID for the room
    const hotelQuery = await pool.query(
      'SELECT HotelID FROM Room WHERE RoomID = $1',
      [room_id]
    );
    
    if (hotelQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const hotelId = hotelQuery.rows[0].hotelid;

    // Create booking
    const result = await pool.query(
      `INSERT INTO Booking (CustomerID, HotelID, RoomID, 
       Checkin_Date, Checkout_Date, Base_Amount, Tax_Amount, Booking_Status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) RETURNING *`,
      [customerId, hotelId, room_id, checkin_date, checkout_date,
       base_amount, tax_amount]
    );

    console.log('✅ Booking created successfully:', {
      bookingId: result.rows[0].bookingid,
      customerId,
      hotelId,
      roomId: room_id
    });

    // Update customer total bookings
    await pool.query(
      'UPDATE Customer SET Total_Bookings = Total_Bookings + 1 WHERE CustomerID = $1',
      [customerId]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};

// Get customer bookings (optimized column selection)
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    
    console.log('📋 Fetching bookings for customer:', customerId);

    const result = await pool.query(
      `SELECT 
         b.BookingID, b.CustomerID, b.RoomID, b.HotelID,
         b.Checkin_Date, b.Checkout_Date, b.Booking_Date,
         b.Base_Amount, b.Tax_Amount, 
         (b.Base_Amount + b.Tax_Amount) as final_amount,
         b.Booking_Status,
         r.RoomID as roomnumber, r.Room_Type, 
         h.Hotel_Name as hotelname, h.Hotel_Address, h.Hotel_Img
       FROM Booking b
       INNER JOIN Room r ON b.RoomID = r.RoomID AND b.HotelID = r.HotelID
       INNER JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE b.CustomerID = $1
       ORDER BY b.Booking_Date DESC`,
      [customerId]
    );

    console.log(`✅ Found ${result.rows.length} bookings for customer ${customerId}`);
    if (result.rows.length > 0) {
      console.log('Latest booking:', {
        id: result.rows[0].bookingid,
        hotel: result.rows[0].hotelname,
        amount: result.rows[0].final_amount
      });
    }

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Get booking details (optimized with explicit columns)
exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const result = await pool.query(
      `SELECT 
         b.BookingID, b.CustomerID, b.RoomID, b.HotelID,
         b.Checkin_Date, b.Checkout_Date, b.Booking_Date,
         b.Base_Amount, b.Tax_Amount, b.Booking_Status,
         r.RoomID as room_number, r.Room_Type, r.Room_Description, r.Cost_Per_Night,
         r.Position_View, r.Room_Status, r.Overall_Rating,
         h.HotelID, h.Hotel_Name, h.Hotel_Address, h.Checkin_Time, h.Checkout_Time,
         c.Full_Name as customer_name, c.Email as customer_email, c.Phone_Number as customer_phone
       FROM Booking b
       INNER JOIN Room r ON b.RoomID = r.RoomID AND b.HotelID = r.HotelID
       INNER JOIN Hotel h ON r.HotelID = h.HotelID
       INNER JOIN Customer c ON b.CustomerID = c.CustomerID
       WHERE b.BookingID = $1 AND b.CustomerID = $2`,
      [id, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Failed to fetch booking details', details: error.message });
  }
};

// Get host bookings (optimized column selection)
exports.getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;

    const result = await pool.query(
      `SELECT 
         b.BookingID, b.CustomerID, b.RoomID, b.HotelID,
         b.Checkin_Date, b.Checkout_Date, b.Booking_Date,
         b.Base_Amount, b.Tax_Amount, b.Booking_Status,
         r.RoomID as room_number, r.Room_Type,
         h.HotelID, h.Hotel_Name,
         c.Full_Name as customer_name, c.Email as customer_email, c.Phone_Number as customer_phone
       FROM Booking b
       INNER JOIN Room r ON b.RoomID = r.RoomID AND b.HotelID = r.HotelID
       INNER JOIN Hotel h ON r.HotelID = h.HotelID
       INNER JOIN Customer c ON b.CustomerID = c.CustomerID
       WHERE h.HostID = $1
       ORDER BY b.Booking_Date DESC`,
      [hostId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Cancel booking (optimized ownership check)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    // Verify ownership and update in single query
    const result = await pool.query(
      'UPDATE Booking SET Booking_Status = FALSE WHERE BookingID = $1 AND CustomerID = $2 RETURNING BookingID',
      [id, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Update customer total bookings
    await pool.query(
      'UPDATE Customer SET Total_Bookings = Total_Bookings - 1 WHERE CustomerID = $1',
      [customerId]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
};
