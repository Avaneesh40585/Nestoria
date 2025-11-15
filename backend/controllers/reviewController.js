
const pool = require('../config/database');

// Add review for hotel and room based on booking
const addReview = async (req, res) => {
  const { booking_id, hotel_review, hotel_rating, room_review, room_rating } = req.body;
  const customerId = req.user.id;

  console.log('Review submission request:', {
    booking_id,
    customerId,
    hotel_review: hotel_review ? 'provided' : 'null',
    hotel_rating,
    room_review: room_review ? 'provided' : 'null',
    room_rating
  });

  try {
    // Verify the booking belongs to the customer
    const bookingCheck = await pool.query(
      `SELECT BookingID, HotelID, RoomID, Checkin_Date, Checkout_Date, Booking_Status
       FROM Booking
       WHERE BookingID = $1 AND CustomerID = $2`,
      [booking_id, customerId]
    );

    if (bookingCheck.rows.length === 0) {
      console.log('Booking not found for:', booking_id, customerId);
      return res.status(404).json({ error: 'Booking not found or does not belong to you' });
    }

    const booking = bookingCheck.rows[0];
    const hotelId = booking.hotelid;
    const roomId = booking.roomid;

    console.log('Booking details:', { hotelId, roomId, booking_status: booking.booking_status });

    // Check if booking is cancelled
    if (!booking.booking_status) {
      return res.status(400).json({ error: 'Cannot review a cancelled booking' });
    }

    // Allow reviews for all confirmed bookings (removed date restriction)

    // Update hotel review if provided (only if there's actual content)
    if ((hotel_review && hotel_review.trim()) || (hotel_rating && hotel_rating > 0)) {
      // Check if review already exists
      const existingReview = await pool.query(
        'SELECT * FROM Customer_Hotel_Review WHERE CustomerID = $1 AND HotelID = $2',
        [customerId, hotelId]
      );

      // Calculate Hotel_Score from rating (convert 1-5 to score out of 100)
      const hotelScore = hotel_rating && hotel_rating > 0 ? Math.round(hotel_rating * 20) : 0;
      const reviewText = hotel_review && hotel_review.trim() ? hotel_review.trim() : '';
      const reviewRating = hotel_rating && hotel_rating > 0 ? hotel_rating : 0;

      console.log('Hotel review data:', { hotelScore, reviewText, reviewRating });

      if (existingReview.rows.length > 0) {
        // Update existing review
        await pool.query(
          `UPDATE Customer_Hotel_Review 
           SET Hotel_Review = COALESCE(NULLIF($1, ''), Hotel_Review), 
               Hotel_Rating = CASE WHEN $2 > 0 THEN $2 ELSE Hotel_Rating END,
               Hotel_Score = CASE WHEN $3 > 0 THEN $3 ELSE Hotel_Score END,
               Review_Date = CURRENT_TIMESTAMP
           WHERE CustomerID = $4 AND HotelID = $5`,
          [reviewText, reviewRating, hotelScore, customerId, hotelId]
        );
        console.log('Hotel review updated');
      } else {
        // Insert new review - only if we have rating or text
        if (reviewRating > 0 || reviewText) {
          await pool.query(
            `INSERT INTO Customer_Hotel_Review (CustomerID, HotelID, Hotel_Review, Hotel_Rating, Hotel_Score)
             VALUES ($1, $2, $3, $4, $5)`,
            [customerId, hotelId, reviewText || 'No comment', reviewRating || 3, hotelScore || 60]
          );
          console.log('Hotel review inserted');
        }
      }

      // Calculate and update average hotel rating
      if (hotel_rating) {
        const avgResult = await pool.query(
          'SELECT AVG(Hotel_Rating) as avg_rating FROM Customer_Hotel_Review WHERE HotelID = $1 AND Hotel_Rating IS NOT NULL',
          [hotelId]
        );
        
        const avgRating = avgResult.rows[0]?.avg_rating;
        if (avgRating) {
          await pool.query(
            'UPDATE Hotel SET Overall_Rating = $1 WHERE HotelID = $2',
            [parseFloat(avgRating).toFixed(1), hotelId]
          );
        }
      }
    }

    // Update room review if provided (only if there's actual content)
    if ((room_review && room_review.trim()) || (room_rating && room_rating > 0)) {
      // Check if review already exists
      const existingReview = await pool.query(
        'SELECT * FROM Customer_Room_Review WHERE CustomerID = $1 AND HotelID = $2 AND RoomID = $3',
        [customerId, hotelId, roomId]
      );

      // Calculate Room_Score from rating (convert 1-5 to score out of 100)
      const roomScore = room_rating && room_rating > 0 ? Math.round(room_rating * 20) : 0;
      const reviewText = room_review && room_review.trim() ? room_review.trim() : '';
      const reviewRating = room_rating && room_rating > 0 ? room_rating : 0;

      console.log('Room review data:', { roomScore, reviewText, reviewRating });

      if (existingReview.rows.length > 0) {
        // Update existing review
        await pool.query(
          `UPDATE Customer_Room_Review 
           SET Room_Review = COALESCE(NULLIF($1, ''), Room_Review), 
               Room_Rating = CASE WHEN $2 > 0 THEN $2 ELSE Room_Rating END,
               Room_Score = CASE WHEN $3 > 0 THEN $3 ELSE Room_Score END,
               Review_Date = CURRENT_TIMESTAMP
           WHERE CustomerID = $4 AND HotelID = $5 AND RoomID = $6`,
          [reviewText, reviewRating, roomScore, customerId, hotelId, roomId]
        );
        console.log('Room review updated');
      } else {
        // Insert new review - only if we have rating or text
        if (reviewRating > 0 || reviewText) {
          await pool.query(
            `INSERT INTO Customer_Room_Review (CustomerID, HotelID, RoomID, Room_Review, Room_Rating, Room_Score)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [customerId, hotelId, roomId, reviewText || 'No comment', reviewRating || 3, roomScore || 60]
          );
          console.log('Room review inserted');
        }
      }

      // Calculate and update average room rating
      if (room_rating) {
        const avgResult = await pool.query(
          'SELECT AVG(Room_Rating) as avg_rating FROM Customer_Room_Review WHERE HotelID = $1 AND RoomID = $2 AND Room_Rating IS NOT NULL',
          [hotelId, roomId]
        );
        
        const avgRating = avgResult.rows[0]?.avg_rating;
        if (avgRating) {
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
    console.log('Review saved successfully for booking:', booking_id);
  } catch (error) {
    console.error('Error adding review:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint
    });
    res.status(500).json({ 
      error: 'Failed to save review', 
      details: error.message,
      hint: error.detail || 'Please check your input and try again'
    });
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
