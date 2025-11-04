
const pool = require('../config/database');

// Add review for hotel and room based on booking
const addReview = async (req, res) => {
  const { booking_id, hotel_review, hotel_rating, room_review, room_rating } = req.body;
  const customerId = req.user.id;

  try {
    // Verify the booking belongs to the customer
    const bookingCheck = await pool.query(
      `SELECT b.bookingid, b.roomid, r.hotelid, b.checkin_date, b.checkout_date, b.booking_status
       FROM booking b
       JOIN room r ON b.roomid = r.roomid
       WHERE b.bookingid = $1 AND b.customerid = $2`,
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

    // Get customer name
    const customerName = await pool.query(
      'SELECT full_name FROM customer WHERE customerid = $1',
      [customerId]
    );

    // Update hotel review if provided
    if (hotel_review || hotel_rating) {
      // Get existing reviews
      const hotelResult = await pool.query(
        'SELECT reviews FROM hotel WHERE hotelid = $1',
        [hotelId]
      );
      
      const existingReviews = hotelResult.rows[0]?.reviews || '';
      const reviewsArray = existingReviews.split('\n').filter(r => r.trim());
      
      // Create new review entry
      const newReviewEntry = JSON.stringify({
        customer: customerName.rows[0].full_name,
        rating: hotel_rating,
        review: hotel_review,
        date: new Date().toISOString(),
        bookingId: booking_id
      });
      
      // Check if this customer already reviewed this hotel for this booking
      let reviewUpdated = false;
      const updatedReviewsArray = reviewsArray.map(reviewStr => {
        try {
          const review = JSON.parse(reviewStr);
          // Replace review if same customer and same booking
          if (review.customer === customerName.rows[0].full_name && review.bookingId === booking_id) {
            reviewUpdated = true;
            return newReviewEntry;
          }
          return reviewStr;
        } catch (e) {
          return reviewStr; // Keep old format reviews as-is
        }
      });
      
      // If no existing review was updated, add as new review
      if (!reviewUpdated) {
        updatedReviewsArray.push(newReviewEntry);
      }
      
      const updatedReviews = updatedReviewsArray.join('\n');
      
      await pool.query(
        'UPDATE hotel SET reviews = $1 WHERE hotelid = $2',
        [updatedReviews.trim(), hotelId]
      );

      // Calculate and update average hotel rating
      if (hotel_rating) {
        const allReviews = updatedReviewsArray;
        let totalRating = 0;
        let ratingCount = 0;
        
        allReviews.forEach(reviewStr => {
          try {
            const review = JSON.parse(reviewStr);
            if (review.rating) {
              totalRating += parseFloat(review.rating);
              ratingCount++;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        });
        
        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : null;
        
        if (avgRating) {
          await pool.query(
            'UPDATE hotel SET overallrating = $1 WHERE hotelid = $2',
            [avgRating, hotelId]
          );
        }
      }
    }

    // Update room review if provided
    if (room_review || room_rating) {
      // Get existing reviews
      const roomResult = await pool.query(
        'SELECT room_review FROM room WHERE roomid = $1',
        [roomId]
      );
      
      const existingReviews = roomResult.rows[0]?.room_review || '';
      const reviewsArray = existingReviews.split('\n').filter(r => r.trim());
      
      // Create new review entry
      const newReviewEntry = JSON.stringify({
        customer: customerName.rows[0].full_name,
        rating: room_rating,
        review: room_review,
        date: new Date().toISOString(),
        bookingId: booking_id
      });
      
      // Check if this customer already reviewed this room for this booking
      let reviewUpdated = false;
      const updatedReviewsArray = reviewsArray.map(reviewStr => {
        try {
          const review = JSON.parse(reviewStr);
          // Replace review if same customer and same booking
          if (review.customer === customerName.rows[0].full_name && review.bookingId === booking_id) {
            reviewUpdated = true;
            return newReviewEntry;
          }
          return reviewStr;
        } catch (e) {
          return reviewStr; // Keep old format reviews as-is
        }
      });
      
      // If no existing review was updated, add as new review
      if (!reviewUpdated) {
        updatedReviewsArray.push(newReviewEntry);
      }
      
      const updatedReviews = updatedReviewsArray.join('\n');
      
      await pool.query(
        'UPDATE room SET room_review = $1 WHERE roomid = $2',
        [updatedReviews.trim(), roomId]
      );

      // Calculate and update average room rating
      if (room_rating) {
        const allReviews = updatedReviewsArray;
        let totalRating = 0;
        let ratingCount = 0;
        
        allReviews.forEach(reviewStr => {
          try {
            const review = JSON.parse(reviewStr);
            if (review.rating) {
              totalRating += parseFloat(review.rating);
              ratingCount++;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        });
        
        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : null;
        
        if (avgRating) {
          await pool.query(
            'UPDATE room SET room_rating = $1 WHERE roomid = $2',
            [avgRating, roomId]
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
      `SELECT b.bookingid, b.roomid, r.hotelid
       FROM booking b
       JOIN room r ON b.roomid = r.roomid
       WHERE b.bookingid = $1 AND b.customerid = $2`,
      [booking_id, customerId]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingCheck.rows[0];
    const customerName = await pool.query(
      'SELECT full_name FROM customer WHERE customerid = $1',
      [customerId]
    );

    // Get hotel reviews
    const hotelResult = await pool.query(
      'SELECT reviews FROM hotel WHERE hotelid = $1',
      [booking.hotelid]
    );

    // Get room reviews
    const roomResult = await pool.query(
      'SELECT room_review FROM room WHERE roomid = $1',
      [booking.roomid]
    );

    let hotelReview = null;
    let roomReview = null;

    // Parse hotel reviews to find this customer's review
    if (hotelResult.rows[0]?.reviews) {
      const reviewsArray = hotelResult.rows[0].reviews.split('\n').filter(r => r.trim());
      reviewsArray.forEach(reviewStr => {
        try {
          const review = JSON.parse(reviewStr);
          if (review.customer === customerName.rows[0].full_name && review.bookingId == booking_id) {
            hotelReview = {
              rating: review.rating,
              review: review.review
            };
          }
        } catch (e) {
          // Skip invalid JSON
        }
      });
    }

    // Parse room reviews to find this customer's review
    if (roomResult.rows[0]?.room_review) {
      const reviewsArray = roomResult.rows[0].room_review.split('\n').filter(r => r.trim());
      reviewsArray.forEach(reviewStr => {
        try {
          const review = JSON.parse(reviewStr);
          if (review.customer === customerName.rows[0].full_name && review.bookingId == booking_id) {
            roomReview = {
              rating: review.rating,
              review: review.review
            };
          }
        } catch (e) {
          // Skip invalid JSON
        }
      });
    }

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
