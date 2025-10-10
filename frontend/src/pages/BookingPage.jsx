import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api.js';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaRupeeSign, FaCheckCircle } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Defensive destructure to avoid undefined errors
  const state = location.state || {};
  const roomId = state.roomId || null;
  const roomType = state.roomType || '';
  const hotelName = state.hotelName || '';
  const costPerNight = state.costPerNight || 0;

  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Show error if navigation is direct and no room info is present
  if (!roomId || !costPerNight) {
    return (
      <div className="error-container">
        <h2>Invalid Booking Request</h2>
        <p>Please select a room first</p>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = checkoutDate.getTime() - checkinDate.getTime();
    const diffDays = Math.ceil(diffTime / oneDay);
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateAmounts = () => {
    const nights = calculateNights();
    const baseAmount = nights * parseFloat(costPerNight);
    const taxAmount = baseAmount * 0.18; // 18% GST
    const finalAmount = baseAmount + taxAmount;
    return {
      nights,
      baseAmount: baseAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      finalAmount: finalAmount.toFixed(2)
    };
  };

  const handleBooking = async () => {
    if (!checkinDate || !checkoutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }
    if (checkinDate >= checkoutDate) {
      setError('Check-out date must be after check-in date');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const amounts = calculateAmounts();
      const bookingData = {
        room_id: roomId,
        checkin_date: checkinDate.toISOString().slice(0, 10),
        checkout_date: checkoutDate.toISOString().slice(0, 10),
        base_amount: parseFloat(amounts.baseAmount),
        tax_amount: parseFloat(amounts.taxAmount),
        final_amount: parseFloat(amounts.finalAmount)
      };
      await bookingAPI.create(bookingData);
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amounts = calculateAmounts();

  if (showConfirmation) {
    return (
      <div className="booking-confirmation">
        <div className="confirmation-card">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your booking has been successfully confirmed.</p>
          <p>Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>
        <div className="booking-grid">
          <div className="booking-form-section">
            <div className="hotel-info-card">
              <h3>{hotelName}</h3>
              <p className="room-type">{roomType}</p>
              <div className="price-info">
                <FaRupeeSign />
                <span>{Math.floor(costPerNight)}</span>
                <span className="per-night">/night</span>
              </div>
            </div>
            <div className="date-selection-card">
              <h3>Select Dates</h3>
              {error && <div className="error-message">{error}</div>}
              <div className="date-picker-group">
                <label>
                  <FaCalendarAlt /> Check-in Date
                </label>
                <DatePicker
                  selected={checkinDate}
                  onChange={(date) => setCheckinDate(date)}
                  minDate={new Date()}
                  placeholderText="Select check-in date"
                  className="date-input"
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              <div className="date-picker-group">
                <label>
                  <FaCalendarAlt /> Check-out Date
                </label>
                <DatePicker
                  selected={checkoutDate}
                  onChange={(date) => setCheckoutDate(date)}
                  minDate={checkinDate ? new Date(checkinDate.getTime() + 24*60*60*1000) : new Date()}
                  placeholderText="Select check-out date"
                  className="date-input"
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              {amounts.nights > 0 && (
                <div className="nights-info">
                  <strong>{amounts.nights}</strong> night{amounts.nights > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <div className="booking-summary-section">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              <div className="summary-row">
                <span>Base Amount ({amounts.nights} nights)</span>
                <span><FaRupeeSign className="rupee-small" />{amounts.baseAmount}</span>
              </div>
              <div className="summary-row">
                <span>Tax & Service Charge (18%)</span>
                <span><FaRupeeSign className="rupee-small" />{amounts.taxAmount}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span><FaRupeeSign className="rupee-small" />{amounts.finalAmount}</span>
              </div>
              <button 
                className="confirm-booking-btn" 
                onClick={handleBooking}
                disabled={loading || !checkinDate || !checkoutDate}
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>
              <div className="booking-terms">
                <p>✓ Secure payment processing</p>
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation up to 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
