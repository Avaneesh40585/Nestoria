import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import HotelCard from '../components/HotelCard';
import FilterBar from '../components/FilterBar';
import { FaExclamationCircle } from 'react-icons/fa';

const HotelsList = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteringInProgress, setFilteringInProgress] = useState(false);
  const [showFilterAlert, setShowFilterAlert] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: '',
    location: '',
    area: ''
  });
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState('');

  // Get check-in/check-out dates from URL params to pass through
  const checkinDate = searchParams.get('checkin');
  const checkoutDate = searchParams.get('checkout');

  // Store searched location from URL params (but don't pre-fill the filter)
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam && !initialLocationSet) {
      setSearchedLocation(locationParam);
      setInitialLocationSet(true);
    }
  }, [searchParams, initialLocationSet]);

  // Auto-apply filter when location is searched from URL and hotels are loaded
  useEffect(() => {
    if (initialLocationSet && hotels.length > 0 && searchedLocation) {
      // Apply the location filter with whole-word matching
      const searchRegex = new RegExp(`\\b${searchedLocation}\\b`, 'i');
      const filtered = hotels.filter(hotel => 
        searchRegex.test(hotel.hotel_address || '')
      );
      setFilteredHotels(filtered);
    }
  }, [initialLocationSet, hotels, searchedLocation]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        location: searchParams.get('location'),
        checkin: searchParams.get('checkin'),
        checkout: searchParams.get('checkout')
      };

      const response = await hotelAPI.search(params);
      const hotelsData = response.data.hotels || [];
      setHotels(hotelsData);
      setFilteredHotels(hotelsData);
      
      // Extract unique areas from hotel addresses
      if (hotelsData.length > 0) {
        const areas = hotelsData
          .map(hotel => {
            const address = hotel.hotel_address || '';
            // Extract the first part before comma (usually the area)
            const areaPart = address.split(',')[0].trim();
            return areaPart;
          })
          .filter((area, index, self) => area && self.indexOf(area) === index); // Remove duplicates and empty values
        
        setAvailableAreas(areas);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
      setFilteredHotels([]);
      setAvailableAreas([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const applyFilters = () => {
    // Check if any filter is selected
    const hasFilters = filters.minPrice || filters.maxPrice || filters.minRating || filters.location || filters.area;
    
    if (!hasFilters) {
      setShowFilterAlert(true);
      return;
    }
    
    setFilteringInProgress(true);
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      let filtered = [...hotels];

      if (filters.location) {
        // Use whole-word matching with regex for better search accuracy
        const locationRegex = new RegExp(`\\b${filters.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        filtered = filtered.filter(hotel => 
          locationRegex.test(hotel.hotel_address || '')
        );
      }

      if (filters.area) {
        // Use whole-word matching for area filter as well
        const areaRegex = new RegExp(`\\b${filters.area.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        filtered = filtered.filter(hotel => 
          areaRegex.test(hotel.hotel_address || '')
        );
      }

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
          parseFloat(hotel.overall_rating) >= parseFloat(filters.minRating)
        );
      }

      setFilteredHotels(filtered);
      setFilteringInProgress(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilteringInProgress(true);
    
    setTimeout(() => {
      setFilters({
        minPrice: '',
        maxPrice: '',
        minRating: '',
        location: '',
        area: ''
      });
      
      // If there was an initial search location, re-apply it
      // Otherwise, show all hotels
      if (searchedLocation && hotels.length > 0) {
        const searchRegex = new RegExp(`\\b${searchedLocation}\\b`, 'i');
        const filtered = hotels.filter(hotel => 
          searchRegex.test(hotel.hotel_address || '')
        );
        setFilteredHotels(filtered);
      } else {
        setFilteredHotels(hotels);
      }
      
      setFilteringInProgress(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="hotels-list-page">
        <div className="loading-container">
          <div>Loading hotels...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hotels-list-page">
      {/* Filter Alert Modal */}
      {showFilterAlert && (
        <div className="modal-overlay" onClick={() => setShowFilterAlert(false)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-icon-container">
              <FaExclamationCircle className="alert-icon" />
            </div>
            <h3>No Filter Selected</h3>
            <p>Please select at least one filter before applying.</p>
            <button 
              className="btn-modal-ok" 
              onClick={() => setShowFilterAlert(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Available Hotels</h1>
      </div>

      <div className="hotels-content">
        <div className="filters-sidebar">
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            onApply={applyFilters}
            onReset={resetFilters}
            availableAreas={availableAreas}
            searchedLocation={searchedLocation}
          />
        </div>

        <div className="hotels-grid-container">
          {filteringInProgress && (
            <div className="filtering-overlay">
              <div className="filtering-spinner">
                <div className="spinner"></div>
                <p>Applying filters...</p>
              </div>
            </div>
          )}
          
          <div className={filteringInProgress ? 'results-faded' : ''}>
            {filteredHotels && filteredHotels.length > 0 ? (
              <>
                <p className="results-count">{filteredHotels.length} hotels found</p>
                <div className="hotels-grid">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.hotelid} hotel={hotel} checkinDate={checkinDate} checkoutDate={checkoutDate} />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <h3>No hotels found</h3>
                {hotels.length === 0 ? (
                  <>
                    <p>No hotels available in this location for the selected dates.</p>
                    <p>Try searching for a different location or dates.</p>
                  </>
                ) : (
                  <>
                    <p>Try adjusting your filters or search criteria</p>
                    <button 
                      className="btn-reset-filters" 
                      onClick={resetFilters}
                      style={{
                        marginTop: '15px',
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        border: '1px solid #DAA520',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(255, 215, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 8px rgba(255, 215, 0, 0.3)';
                      }}
                    >
                      Reset Filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsList;
