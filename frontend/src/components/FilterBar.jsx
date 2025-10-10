import React from 'react';
import { FaStar, FaRupeeSign } from 'react-icons/fa';

const FilterBar = ({ filters, setFilters, onApply }) => {
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handleReset = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minRating: ''
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <div className="price-input-group">
            <FaRupeeSign className="rupee-icon" />
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handlePriceChange}
              className="filter-input"
            />
          </div>
          <span className="price-separator">-</span>
          <div className="price-input-group">
            <FaRupeeSign className="rupee-icon" />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        <div className="rating-filters">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              className={`rating-btn ${filters.minRating === rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating)}
            >
              <FaStar className="star-icon" /> {rating}+
            </button>
          ))}
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-reset" onClick={handleReset}>Reset</button>
        <button className="btn-apply" onClick={onApply}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterBar;
