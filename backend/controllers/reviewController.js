
const pool = require('../config/database');

// Add review for hotel and room based on booking
const addReview = async (req, res) => {
  const { booking_id, hotel_review, hotel_rating, room_review, room_rating } = req.body;
  const customerId = req.user.id;

  try {
    // Verify the booking belongs to the customer
    const bookingCheck = await pool.query(
      `SELECT BookingID, HotelID, RoomID, Checkin_Date, Checkout_Date, Booking_Status
       FROM Booking
       WHERE BookingID = $1 AND CustomerID = $2`,
      [booking_id, customerId]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or does not belong to you' });
    }

    const booking = bookingCheck.rows[0];
    const hotelId = booking.hotelid;
    const roomId = booking.roomid;

    // Check if booking is cancelled
    if (!booking.booking_status) {
      return res.status(400).json({ error: 'Cannot review a cancelled booking' });
    }

    // Check if booking is eligible for review (Active or Completed, NOT Cancelled)
    const today = new Date();
    const checkinDate = new Date(booking.checkin_date);
    
    // Allow reviews only for Active (checked in) or Completed bookings
    const isActive = checkinDate <= today;
    
    if (!isActive) {
      return res.status(400).json({ error: 'You can only review after check-in or if booking is completed' });
    }

    // Update hotel review if provided
    if (hotel_review || hotel_rating) {
      // Check if review already exists
      const existingReview = await pool.query(
        'SELECT * FROM Customer_Hotel_Review WHERE CustomerID = $1 AND HotelID = $2',
        [customerId, hotelId]
      );

      if (existingReview.rows.length > 0) {
        // Update existing review
        await pool.query(
          `UPDATE Customer_Hotel_Review 
           SET Hotel_Review = $1, Hotel_Rating = $2, Review_Date = CURRENT_TIMESTAMP
           WHERE CustomerID = $3 AND HotelID = $4`,
          [hotel_review, hotel_rating, customerId, hotelId]
        );
      } else {
        // Insert new review
        await pool.query(
          `INSERT INTO Customer_Hotel_Review (CustomerID, HotelID, Hotel_Review, Hotel_Rating, Hotel_Score)
           VALUES ($1, $2, $3, $4, $5)`,
          [customerId, hotelId, hotel_review, hotel_rating, hotel_rating ? Math.round(hotel_rating * 2) : null]
        );
      }

      // Calculate and update average hotel rating
      // Note: If trigger.sql is installed, this is redundant but ensures ratings update even without triggers
      if (hotel_rating) {
        const avgResult = await pool.query(
          'SELECT AVG(Hotel_Rating) as avg_rating, COUNT(*) as review_count FROM Customer_Hotel_Review WHERE HotelID = $1 AND Hotel_Rating IS NOT NULL',
          [hotelId]
        );
        
        const avgRating = avgResult.rows[0]?.avg_rating;
        const reviewCount = avgResult.rows[0]?.review_count || 0;
        
        if (avgRating) {
          // Update Hotel Overall_Rating with average
          await pool.query(
            'UPDATE Hotel SET Overall_Rating = $1 WHERE HotelID = $2',
            [parseFloat(avgRating).toFixed(1), hotelId]
          );
        }
      }
    }

    // Update room review if provided
    if (room_review || room_rating) {
      // Check if review already exists
      const existingReview = await pool.query(
        'SELECT * FROM Customer_Room_Review WHERE CustomerID = $1 AND HotelID = $2 AND RoomID = $3',
        [customerId, hotelId, roomId]
      );

      if (existingReview.rows.length > 0) {
        // Update existing review
        await pool.query(
          `UPDATE Customer_Room_Review 
           SET Room_Review = $1, Room_Rating = $2, Review_Date = CURRENT_TIMESTAMP
           WHERE CustomerID = $3 AND HotelID = $4 AND RoomID = $5`,
          [room_review, room_rating, customerId, hotelId, roomId]
        );
      } else {
        // Insert new review
        await pool.query(
          `INSERT INTO Customer_Room_Review (CustomerID, HotelID, RoomID, Room_Review, Room_Rating, Room_Score)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [customerId, hotelId, roomId, room_review, room_rating, room_rating ? Math.round(room_rating * 2) : null]
        );
      }

      // Calculate and update average room rating
      // Note: If room triggers are installed, this is redundant but ensures ratings update
      if (room_rating) {
        const avgResult = await pool.query(
          'SELECT AVG(Room_Rating) as avg_rating, COUNT(*) as review_count FROM Customer_Room_Review WHERE HotelID = $1 AND RoomID = $2 AND Room_Rating IS NOT NULL',
          [hotelId, roomId]
        );
        
        const avgRating = avgResult.rows[0]?.avg_rating;
        const reviewCount = avgResult.rows[0]?.review_count || 0;
        
        if (avgRating) {
          // Update Room Overall_Rating with average
          await pool.query(
            'UPDATE Room SET Overall_Rating = $1 WHERE HotelID = $2 AND RoomID = $3',
            [parseFloat(avgRating).toFixed(1), hotelId, roomId]
          );
        }
      }
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      data: { hotelId, roomId }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to save review', details: error.message });
  }
};

// Get existing review for a specific booking
const getBookingReview = async (req, res) => {
  const { booking_id } = req.params;
  const customerId = req.user.id;

  try {
    // Verify the booking belongs to the customer
    const bookingCheck = await pool.query(
      `SELECT BookingID, HotelID, RoomID
       FROM Booking
       WHERE BookingID = $1 AND CustomerID = $2`,
      [booking_id, customerId]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingCheck.rows[0];

    // Get hotel review
    const hotelReviewResult = await pool.query(
      'SELECT Hotel_Review, Hotel_Rating FROM Customer_Hotel_Review WHERE CustomerID = $1 AND HotelID = $2',
      [customerId, booking.hotelid]
    );

    // Get room review
    const roomReviewResult = await pool.query(
      'SELECT Room_Review, Room_Rating FROM Customer_Room_Review WHERE CustomerID = $1 AND HotelID = $2 AND RoomID = $3',
      [customerId, booking.hotelid, booking.roomid]
    );

    const hotelReview = hotelReviewResult.rows.length > 0 ? {
      rating: hotelReviewResult.rows[0].hotel_rating,
      review: hotelReviewResult.rows[0].hotel_review
    } : null;

    const roomReview = roomReviewResult.rows.length > 0 ? {
      rating: roomReviewResult.rows[0].room_rating,
      review: roomReviewResult.rows[0].room_review
    } : null;

    res.json({
      data: {
        hotelReview,
        roomReview
      }
    });
  } catch (error) {
    console.error('Error fetching booking review:', error);
    res.status(500).json({ error: 'Failed to fetch review', details: error.message });
  }
};

module.exports = {
  addReview,
  getBookingReview
};
