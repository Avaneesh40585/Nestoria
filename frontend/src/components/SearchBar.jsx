import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkin) params.append('checkin', checkin.toISOString().split('T')[0]);
    if (checkout) params.append('checkout', checkout.toISOString().split('T')[0]);

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
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-input-group">
          <FaCalendarAlt className="input-icon" />
          <DatePicker
            selected={checkin}
            onChange={(date) => setCheckin(date)}
            selectsStart
            startDate={checkin}
            endDate={checkout}
            minDate={new Date()}
            placeholderText="Check-in"
            className="search-input date-input"
          />
        </div>

        <div className="search-input-group">
          <FaCalendarAlt className="input-icon" />
          <DatePicker
            selected={checkout}
            onChange={(date) => setCheckout(date)}
            selectsEnd
            startDate={checkin}
            endDate={checkout}
            minDate={checkin || new Date()}
            placeholderText="Check-out"
            className="search-input date-input"
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
