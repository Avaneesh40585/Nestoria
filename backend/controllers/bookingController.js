const pool = require('../config/database');
const crypto = require('crypto');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      room_id,
      checkin_date,
      checkout_date,
      base_amount,
      tax_amount,
      final_amount
    } = req.body;

    // Check room availability
    const availabilityCheck = await pool.query(
      `SELECT COUNT(*) as booking_count
       FROM Booking
       WHERE RoomID = $1
       AND booking_status = TRUE
       AND (
         (checkin_date <= $2 AND checkout_date > $2)
         OR (checkin_date < $3 AND checkout_date >= $3)
         OR (checkin_date >= $2 AND checkout_date <= $3)
       )`,
      [room_id, checkin_date, checkout_date]
    );

    if (availabilityCheck.rows[0].booking_count !== '0') {
      return res.status(400).json({ error: 'Room not available for selected dates' });
    }

    // Get a receptionist for the hotel
    const receptionistQuery = await pool.query(
      `SELECT e.EmployeeID FROM Employee e
       JOIN Room r ON e.HotelID = r.HotelID
       WHERE r.RoomID = $1 AND e.Role = 'Receptionist' AND e.Status = 'active'
       LIMIT 1`,
      [room_id]
    );

    const receptionistId = receptionistQuery.rows.length > 0 
      ? receptionistQuery.rows[0].employeeid 
      : null;

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create booking
    const result = await pool.query(
      `INSERT INTO Booking (CustomerID, RoomID, ReceptionistID, TransactionID, 
       checkin_date, checkout_date, base_amount, tax_amount, final_amount, booking_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE) RETURNING *`,
      [customerId, room_id, receptionistId, transactionId, checkin_date, checkout_date,
       base_amount, tax_amount, final_amount]
    );

    // Update customer total bookings
    await pool.query(
      'UPDATE Customer SET TotalBookings = TotalBookings + 1 WHERE CustomerID = $1',
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

// Get customer bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, r.RoomNumber, r.Room_type, h.HotelName, h.HotelAddress, h.HotelImg
       FROM Booking b
       JOIN Room r ON b.RoomID = r.RoomID
       JOIN Hotel h ON r.HotelID = h.HotelID
       WHERE b.CustomerID = $1
       ORDER BY b.booking_date DESC`,
      [customerId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, r.*, h.HotelName, h.HotelAddress, h.Checkin_time, h.Checkout_time,
       c.Full_name as customer_name, c.Email as customer_email, c.PhoneNumber as customer_phone
       FROM Booking b
       JOIN Room r ON b.RoomID = r.RoomID
       JOIN Hotel h ON r.HotelID = h.HotelID
       JOIN Customer c ON b.CustomerID = c.CustomerID
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

// Get host bookings (all bookings for host's hotels)
exports.getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, r.RoomNumber, r.Room_type, h.HotelName, 
       c.Full_name as customer_name, c.Email as customer_email, c.PhoneNumber as customer_phone
       FROM Booking b
       JOIN Room r ON b.RoomID = r.RoomID
       JOIN Hotel h ON r.HotelID = h.HotelID
       JOIN Customer c ON b.CustomerID = c.CustomerID
       WHERE h.HostID = $1
       ORDER BY b.booking_date DESC`,
      [hostId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    // Verify ownership
    const ownershipCheck = await pool.query(
      'SELECT * FROM Booking WHERE BookingID = $1 AND CustomerID = $2',
      [id, customerId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    await pool.query(
      'UPDATE Booking SET booking_status = FALSE WHERE BookingID = $1',
      [id]
    );

    // Update customer total bookings
    await pool.query(
      'UPDATE Customer SET TotalBookings = TotalBookings - 1 WHERE CustomerID = $1',
      [customerId]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
};
