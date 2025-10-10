import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import HotelCard from '../components/HotelCard';
import FilterBar from '../components/FilterBar';
import { FaFilter, FaTimes } from 'react-icons/fa';

const HotelsList = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: ''
  });

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {
        location: searchParams.get('location'),
        checkin: searchParams.get('checkin'),
        checkout: searchParams.get('checkout')
      };

      const response = await hotelAPI.search(params);
      setHotels(response.data.hotels);
      setFilteredHotels(response.data.hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    if (filters.minPrice) {
      filtered = filtered.filter(hotel => 
        parseFloat(hotel.min_price) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(hotel => 
        parseFloat(hotel.min_price) <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(hotel => 
        parseFloat(hotel.overallrating) >= parseFloat(filters.minRating)
      );
    }

    setFilteredHotels(filtered);
    setShowFilters(false);
  };

  if (loading) {
    return <div className="loading-container">Loading hotels...</div>;
  }

  return (
    <div className="hotels-list-page">
      <div className="page-header">
        <h1>Available Hotels</h1>
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <FaTimes /> : <FaFilter />}
          {showFilters ? ' Close Filters' : ' Show Filters'}
        </button>
      </div>

      <div className="hotels-content">
        {showFilters && (
          <div className="filters-sidebar">
            <FilterBar 
              filters={filters} 
              setFilters={setFilters} 
              onApply={applyFilters}
            />
          </div>
        )}

        <div className="hotels-grid-container">
          {filteredHotels.length > 0 ? (
            <>
              <p className="results-count">{filteredHotels.length} hotels found</p>
              <div className="hotels-grid">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.hotelid} hotel={hotel} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <h3>No hotels found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsList;
