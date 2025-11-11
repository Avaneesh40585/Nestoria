import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

// Helper function to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Reset error message
    setError('');
    setShowError(false);
    
    // Validate required fields - only location is mandatory
    if (!location.trim()) {
      setError('Please fill out this field.');
      setShowError(true);
      return;
    }
    
    // Validate date logic only if both dates are provided
    if (checkin && checkout && checkin >= checkout) {
      setError('Check-out date must be after check-in date');
      setShowError(true);
      return;
    }
    
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkin) params.append('checkin', formatLocalDate(checkin));
    if (checkout) params.append('checkout', formatLocalDate(checkout));

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            placeholder="Enter city or location..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (showError) {
                setShowError(false);
                setError('');
              }
            }}
            className={`search-input ${showError && !location.trim() ? 'input-error' : ''}`}
          />
          {showError && !location.trim() && (
            <div className="error-tooltip">
              <FaExclamationCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="search-input-group">
          <FaCalendarAlt className="input-icon" />
          <DatePicker
            selected={checkin}
            onChange={(date) => {
              setCheckin(date);
              // Reset error when user selects a date
              if (showError && date) {
                setShowError(false);
                setError('');
              }
            }}
            selectsStart
            startDate={checkin}
            endDate={checkout}
            minDate={new Date()}
            placeholderText="Check-in"
            className="search-input date-input"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="search-input-group">
          <FaCalendarAlt className="input-icon" />
          <DatePicker
            selected={checkout}
            onChange={(date) => {
              setCheckout(date);
              // Reset error when user selects a date
              if (showError && date) {
                setShowError(false);
                setError('');
              }
            }}
            selectsEnd
            startDate={checkin}
            endDate={checkout}
            minDate={checkin || new Date()}
            placeholderText="Check-out"
            className="search-input date-input"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <button type="submit" className="search-btn">
          <FaSearch /> Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;