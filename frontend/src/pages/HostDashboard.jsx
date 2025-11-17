import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hostAPI, hotelAPI, bookingAPI } from '../services/api';
import { uploadHotelImage } from '../services/uploadAPI';
import { FaHotel, FaBed, FaCalendarCheck, FaRupeeSign, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

// Helper function to format date as DD/MM/YYYY
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HostDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({});
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [loading, setLoading] = useState(true);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [hotelFieldErrors, setHotelFieldErrors] = useState({});
  const [availableHotelAmenities] = useState([
    { id: 1, name: 'Wi-Fi' },
    { id: 2, name: 'Swimming Pool' },
    { id: 3, name: 'Gym' },
    { id: 4, name: 'Spa' },
    { id: 5, name: 'Restaurant' },
    { id: 7, name: 'Parking' },
    { id: 8, name: 'Conference Room' },
    { id: 9, name: 'Airport Shuttle' },
    { id: 11, name: 'Bar' }
  ]);
  const [hotelForm, setHotelForm] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_desc: '',
    checkin_time: '14:00',
    checkout_time: '11:00',
    receptionist_number: '',
    hotel_img: '',
    amenities: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, hotelsRes, bookingsRes] = await Promise.all([
        hostAPI.getDashboardStats(),
        hotelAPI.getHostHotels(),
        bookingAPI.getHostBookings()
      ]);

      setStats(statsRes.data);
      
      // Fetch amenities for each hotel
      const hotelsWithAmenities = await Promise.all(
        (hotelsRes.data.hotels || []).map(async (hotel) => {
          try {
            const hotelDetails = await hotelAPI.getDetails(hotel.hotelid);
            const amenityIds = hotelDetails.data.amenities ? hotelDetails.data.amenities.map(a => a.amenityid) : [];
            return { ...hotel, amenities: amenityIds };
          } catch (error) {
            console.error(`Error fetching amenities for hotel ${hotel.hotelid}:`, error);
            return { ...hotel, amenities: [] };
          }
        })
      );
      
      console.log('🏨 Hotels with amenities:', hotelsWithAmenities);
      hotelsWithAmenities.forEach((hotel, index) => {
        console.log(`Hotel ${index + 1}: ${hotel.hotel_name}`);
        console.log(`  - hotel_img:`, hotel.hotel_img);
        console.log(`  - Has image:`, !!hotel.hotel_img);
      });
      
      setHotels(hotelsWithAmenities);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      
      // Upload image to Supabase if file is selected
      if (imageFile) {
        console.log('📤 Uploading hotel image to Supabase...');
        console.log('📄 File details:', {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        });
        
        try {
          const uploadResult = await uploadHotelImage(imageFile);
          console.log('📥 Upload result:', uploadResult);
          imageUrl = uploadResult.url;
          console.log('✅ Image uploaded, URL:', imageUrl);
          console.log('🔍 URL length:', imageUrl.length);
          console.log('🔍 URL starts with:', imageUrl.substring(0, 50));
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          console.error('❌ Full error details:', uploadError.response?.data);
          
          const errorMsg = uploadError.response?.data?.error || uploadError.message || 'Unknown error';
          const errorDetails = uploadError.response?.data?.details || '';
          const fullErrorMsg = errorDetails ? `${errorMsg}\n\nDetails: ${errorDetails}` : errorMsg;
          
          alert('Failed to upload image:\n' + fullErrorMsg + '\n\nPlease check:\n1. Supabase credentials are set in Render backend\n2. Bucket exists and is public\n3. Backend logs for more details');
          return; // Stop if image upload fails
        }
      }
      
      // Create hotel with Supabase image URL
      const hotelData = {
        ...hotelForm,
        hotel_img: imageUrl
      };
      
      console.log('🏨 Creating hotel with data:', hotelData);
      
      const response = await hotelAPI.create(hotelData);
      console.log('✅ Hotel created successfully:', response.data);
      
      const newHotelId = response.data.hotel.hotelid;
      
      const viewRooms = window.confirm('Hotel added successfully! Would you like to manage rooms for this hotel now?');
      
      setShowAddHotel(false);
      setHotelForm({
        hotel_name: '',
        hotel_address: '',
        hotel_desc: '',
        checkin_time: '14:00',
        checkout_time: '11:00',
        receptionist_number: '',
        hotel_img: '',
        amenities: []
      });
      setImageFile(null);
      setImagePreview('');
      setHotelFieldErrors({});
      fetchDashboardData();
      
      if (viewRooms) {
        navigate(`/host/add-rooms?hotelId=${newHotelId}`);
      }
    } catch (error) {
      console.error('❌ Error adding hotel:', error);
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data);
      
      const errorData = error.response?.data;
      let errorMessage = errorData?.error || errorData?.details || error.message || 'Unknown error';
      
      // Check for specific error codes
      if (errorData?.code === 'HOST_NOT_FOUND' || error.response?.status === 401) {
        errorMessage = 'Your session has expired or your account needs to be refreshed. Please log out and log back in.';
        
        // Auto-redirect to login after showing error
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
        }, 3000);
      }
      
      alert('Failed to add hotel: ' + errorMessage);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await hotelAPI.delete(hotelId);
        alert('Hotel deleted successfully');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('Failed to delete hotel');
      }
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotelId(hotel.hotelid);
    setEditForm({
      hotel_name: hotel.hotel_name,
      hotel_address: hotel.hotel_address,
      hotel_desc: hotel.hotel_description,
      checkin_time: hotel.checkin_time,
      checkout_time: hotel.checkout_time,
      receptionist_number: hotel.receptionist_number,
      hotel_img: hotel.hotel_img,
      amenities: hotel.amenities || []
    });
    // Set preview if there's an existing image
    if (hotel.hotel_img) {
      setEditImagePreview(hotel.hotel_img);
    }
  };

  const handleSaveEdit = async (hotelId) => {
    try {
      let updatedData = { ...editForm };
      
      // Upload new image to Supabase if file is selected
      if (editImageFile) {
        console.log('📤 Uploading updated hotel image to Supabase...');
        const uploadResult = await uploadHotelImage(editImageFile);
        updatedData.hotel_img = uploadResult.url;
        console.log('✅ Image uploaded:', uploadResult.url);
      }
      
      console.log('Updating hotel with data:', updatedData);
      await hotelAPI.update(hotelId, updatedData);
      alert('Hotel updated successfully!');
      setEditingHotelId(null);
      setEditImageFile(null);
      setEditImagePreview('');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating hotel:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to update hotel';
      alert(`Failed to update hotel: ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingHotelId(null);
    setEditForm({});
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const toggleHotelAmenity = (amenityId) => {
    const amenities = hotelForm.amenities || [];
    if (amenities.includes(amenityId)) {
      setHotelForm({...hotelForm, amenities: amenities.filter(id => id !== amenityId)});
    } else {
      setHotelForm({...hotelForm, amenities: [...amenities, amenityId]});
    }
  };

  const toggleEditHotelAmenity = (amenityId) => {
    const amenities = editForm.amenities || [];
    if (amenities.includes(amenityId)) {
      setEditForm({...editForm, amenities: amenities.filter(id => id !== amenityId)});
    } else {
      setEditForm({...editForm, amenities: [...amenities, amenityId]});
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setEditImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview('');
  };

  // Validation functions for Add Hotel form
  const validateHotelName = (value) => {
    if (!value || value.trim() === '') {
      return 'Hotel name is required';
    }
    return '';
  };

  const validateHotelAddress = (value) => {
    if (!value || value.trim() === '') {
      return 'Hotel address is required';
    }
    return '';
  };

  const validateCheckinTime = (value) => {
    if (!value || value === '') {
      return 'Check-in time is required';
    }
    return '';
  };

  const validateCheckoutTime = (value) => {
    if (!value || value === '') {
      return 'Check-out time is required';
    }
    return '';
  };

  const validateContactNumber = (value) => {
    if (!value || value.trim() === '') {
      return 'Contact number is required';
    }
    // Must contain only 10 digits
    if (!/^[0-9]{10}$/.test(value.trim())) {
      return 'Contact number must contain exactly 10 digits';
    }
    return '';
  };

  const handleHotelFieldBlur = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'hotel_name':
        error = validateHotelName(value);
        break;
      case 'hotel_address':
        error = validateHotelAddress(value);
        break;
      case 'checkin_time':
        error = validateCheckinTime(value);
        break;
      case 'checkout_time':
        error = validateCheckoutTime(value);
        break;
      case 'contact_receptionist':
        error = validateContactNumber(value);
        break;
      default:
        break;
    }
    
    if (error) {
      setHotelFieldErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleHotelFieldChange = (field, value) => {
    setHotelForm({...hotelForm, [field]: value});
    
    // Clear error for this field when user starts typing
    if (hotelFieldErrors[field]) {
      const newErrors = { ...hotelFieldErrors };
      delete newErrors[field];
      setHotelFieldErrors(newErrors);
    }
  };

  const isHotelFormValid = () => {
    // Check all required fields are filled
    const requiredFieldsFilled = (
      hotelForm.hotel_name && hotelForm.hotel_name.trim() !== '' &&
      hotelForm.hotel_address && hotelForm.hotel_address.trim() !== '' &&
      hotelForm.checkin_time && hotelForm.checkin_time !== '' &&
      hotelForm.checkout_time && hotelForm.checkout_time !== '' &&
      hotelForm.contact_receptionist && hotelForm.contact_receptionist.trim() !== ''
    );
    
    if (!requiredFieldsFilled) return false;
    
    // Check if there are any validation errors
    const hasErrors = Object.keys(hotelFieldErrors).length > 0;
    if (hasErrors) return false;
    
    // Validate all required fields
    const validHotelName = validateHotelName(hotelForm.hotel_name) === '';
    const validAddress = validateHotelAddress(hotelForm.hotel_address) === '';
    const validCheckinTime = validateCheckinTime(hotelForm.checkin_time) === '';
    const validCheckoutTime = validateCheckoutTime(hotelForm.checkout_time) === '';
    const validContactNumber = validateContactNumber(hotelForm.contact_receptionist) === '';
    
    return validHotelName && validAddress && validCheckinTime && validCheckoutTime && validContactNumber;
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="host-dashboard-page">
      <div className="container">
        <h1 className="page-title">Host Dashboard</h1>

        <div className="dashboard-tabs">
          <div className="tabs-left">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              My Hotels
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </div>
          {activeTab === 'hotels' && (
            <button className="add-hotel-btn" onClick={() => {
              setShowAddHotel(!showAddHotel);
              setHotelFieldErrors({});
              setImageFile(null);
              setImagePreview('');
            }}>
              <FaPlus /> {showAddHotel ? 'Hide Form' : 'Add New Hotel'}
            </button>
          )}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <FaHotel className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Hotels</h3>
                  <p className="stat-number">{stats.total_hotels || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaBed className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Rooms</h3>
                  <p className="stat-number">{stats.total_rooms || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaCalendarCheck className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">{stats.total_bookings || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <FaRupeeSign className="stat-icon" />
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">₹{Math.floor(stats.total_revenue || 0)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'hotels' && (
          <div className="hotels-management">
            <div className="section-header">
              <h2>My Hotels</h2>
              {showAddHotel && (
                <div className="header-form-actions">
                  <button 
                    type="submit" 
                    className="save-form-btn" 
                    onClick={handleAddHotel}
                    disabled={!isHotelFormValid()}
                    style={{
                      opacity: !isHotelFormValid() ? 0.5 : 1,
                      cursor: !isHotelFormValid() ? 'not-allowed' : 'pointer',
                      backgroundColor: !isHotelFormValid() ? '#6c757d' : ''
                    }}
                  >
                    <FaSave /> Save
                  </button>
                  <button type="button" className="cancel-form-btn" onClick={() => {
                    setShowAddHotel(false);
                    setHotelFieldErrors({});
                    setImageFile(null);
                    setImagePreview('');
                  }}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>

            {showAddHotel && (
              <div className="add-hotel-form">
                <h3>Add New Hotel</h3>
                <div className="form-grid" id="hotel-form-fields">
                    <div className="form-group">
                      <label>Hotel Name *</label>
                      <input
                        type="text"
                        value={hotelForm.hotel_name}
                        onChange={(e) => handleHotelFieldChange('hotel_name', e.target.value)}
                        onBlur={(e) => handleHotelFieldBlur('hotel_name', e.target.value)}
                        style={{
                          border: hotelFieldErrors.hotel_name ? '2px solid #dc3545' : '1px solid #ced4da'
                        }}
                        required
                      />
                      {hotelFieldErrors.hotel_name && (
                        <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          {hotelFieldErrors.hotel_name}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        value={hotelForm.hotel_address}
                        onChange={(e) => handleHotelFieldChange('hotel_address', e.target.value)}
                        onBlur={(e) => handleHotelFieldBlur('hotel_address', e.target.value)}
                        style={{
                          border: hotelFieldErrors.hotel_address ? '2px solid #dc3545' : '1px solid #ced4da'
                        }}
                        required
                      />
                      {hotelFieldErrors.hotel_address && (
                        <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          {hotelFieldErrors.hotel_address}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={hotelForm.hotel_desc}
                        onChange={(e) => setHotelForm({...hotelForm, hotel_desc: e.target.value})}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-in Time *</label>
                      <input
                        type="time"
                        value={hotelForm.checkin_time}
                        onChange={(e) => handleHotelFieldChange('checkin_time', e.target.value)}
                        onBlur={(e) => handleHotelFieldBlur('checkin_time', e.target.value)}
                        style={{
                          border: hotelFieldErrors.checkin_time ? '2px solid #dc3545' : '1px solid #ced4da'
                        }}
                      />
                      {hotelFieldErrors.checkin_time && (
                        <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          {hotelFieldErrors.checkin_time}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Check-out Time *</label>
                      <input
                        type="time"
                        value={hotelForm.checkout_time}
                        onChange={(e) => handleHotelFieldChange('checkout_time', e.target.value)}
                        onBlur={(e) => handleHotelFieldBlur('checkout_time', e.target.value)}
                        style={{
                          border: hotelFieldErrors.checkout_time ? '2px solid #dc3545' : '1px solid #ced4da'
                        }}
                      />
                      {hotelFieldErrors.checkout_time && (
                        <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          {hotelFieldErrors.checkout_time}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Receptionist Number *</label>
                      <input
                        type="tel"
                        value={hotelForm.contact_receptionist}
                        onChange={(e) => handleHotelFieldChange('contact_receptionist', e.target.value)}
                        onBlur={(e) => handleHotelFieldBlur('contact_receptionist', e.target.value)}
                        placeholder="e.g., 9876543210"
                        style={{
                          border: hotelFieldErrors.contact_receptionist ? '2px solid #dc3545' : '1px solid #ced4da'
                        }}
                      />
                      {hotelFieldErrors.contact_receptionist && (
                        <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          {hotelFieldErrors.contact_receptionist}
                        </span>
                      )}
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Hotel Image *</label>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div style={{ marginBottom: '15px', position: 'relative' }}>
                          <img 
                            src={imagePreview} 
                            alt="Hotel preview" 
                            style={{ 
                              width: '100%', 
                              maxHeight: '300px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '1px solid #ced4da'
                            }} 
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
                      {/* File Upload */}
                      <div>
                        <label 
                          htmlFor="hotel-image-upload"
                          style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#000',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            border: '1px solid #DAA520'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          📁 Choose Image from Files
                        </label>
                        <input
                          id="hotel-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#6c757d' }}>
                            {imageFile ? `Selected: ${imageFile.name}` : 'No file chosen'}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginTop: '5px' }}>
                          Max file size: 5MB. Supported formats: JPG, PNG, GIF
                        </span>
                      </div>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Hotel Amenities</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {availableHotelAmenities.map((amenity) => (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => toggleHotelAmenity(amenity.id)}
                            style={{
                              padding: '8px 16px',
                              border: (hotelForm.amenities || []).includes(amenity.id) ? '2px solid #FFD700' : '2px solid #333333',
                              background: (hotelForm.amenities || []).includes(amenity.id) ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : '#2a2a2a',
                              color: (hotelForm.amenities || []).includes(amenity.id) ? '#000' : '#ffffff',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!(hotelForm.amenities || []).includes(amenity.id)) {
                                e.target.style.borderColor = '#FFD700';
                                e.target.style.backgroundColor = '#3a3a3a';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!(hotelForm.amenities || []).includes(amenity.id)) {
                                e.target.style.borderColor = '#333333';
                                e.target.style.backgroundColor = '#2a2a2a';
                              }
                            }}
                          >
                            {amenity.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            )}

            <div className="hotels-list">
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel.hotelid} className="hotel-item">
                    {editingHotelId === hotel.hotelid ? (
                      <div className="edit-hotel-form">
                        <div className="form-header">
                          <h3>Edit Hotel</h3>
                          <div className="edit-actions">
                            <button className="save-btn" onClick={() => handleSaveEdit(hotel.hotelid)}>
                              <FaSave /> Save
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Hotel Name</label>
                            <input
                              type="text"
                              value={editForm.hotel_name || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_name: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address</label>
                            <input
                              type="text"
                              value={editForm.hotel_address || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_address: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={editForm.hotel_desc || ''}
                              onChange={(e) => setEditForm({...editForm, hotel_desc: e.target.value})}
                              rows="3"
                            />
                          </div>
                          <div className="form-group">
                            <label>Check-in Time</label>
                            <input
                              type="time"
                              value={editForm.checkin_time || ''}
                              onChange={(e) => setEditForm({...editForm, checkin_time: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Check-out Time</label>
                            <input
                              type="time"
                              value={editForm.checkout_time || ''}
                              onChange={(e) => setEditForm({...editForm, checkout_time: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Receptionist Number</label>
                            <input
                              type="tel"
                              value={editForm.contact_receptionist || ''}
                              onChange={(e) => setEditForm({...editForm, contact_receptionist: e.target.value})}
                            />
                          </div>
                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Hotel Image</label>
                            
                            {/* Image Preview */}
                            {editImagePreview && (
                              <div style={{ marginBottom: '15px', position: 'relative' }}>
                                <img 
                                  src={editImagePreview} 
                                  alt="Hotel preview" 
                                  style={{ 
                                    width: '100%', 
                                    maxHeight: '300px', 
                                    objectFit: 'cover', 
                                    borderRadius: '8px',
                                    border: '1px solid #ced4da'
                                  }} 
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveEditImage}
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                            
                            {/* File Upload */}
                            <div>
                              <label 
                                htmlFor="edit-hotel-image-upload"
                                style={{
                                  display: 'inline-block',
                                  padding: '10px 20px',
                                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                  color: '#000',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  transition: 'all 0.2s ease',
                                  border: '1px solid #DAA520'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
                                  e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.boxShadow = 'none';
                                  e.target.style.transform = 'translateY(0)';
                                }}
                              >
                                📁 Choose Image from Files
                              </label>
                              <input
                                id="edit-hotel-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageFileChange}
                                style={{ display: 'none' }}
                              />
                              <div style={{ marginTop: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#6c757d' }}>
                                  {editImageFile ? `Selected: ${editImageFile.name}` : (editImagePreview ? 'Current image' : 'No file chosen')}
                                </span>
                              </div>
                              <span style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginTop: '5px' }}>
                                Max file size: 5MB. Supported formats: JPG, PNG, GIF
                              </span>
                            </div>
                          </div>
                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Hotel Amenities</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {availableHotelAmenities.map((amenity) => (
                                <button
                                  key={amenity.id}
                                  type="button"
                                  onClick={() => toggleEditHotelAmenity(amenity.id)}
                                  style={{
                                    padding: '8px 16px',
                                    border: (editForm.amenities || []).includes(amenity.id) ? '2px solid #FFD700' : '2px solid #333333',
                                    background: (editForm.amenities || []).includes(amenity.id) ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : '#2a2a2a',
                                    color: (editForm.amenities || []).includes(amenity.id) ? '#000' : '#ffffff',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    outline: 'none'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!(editForm.amenities || []).includes(amenity.id)) {
                                      e.target.style.borderColor = '#FFD700';
                                      e.target.style.backgroundColor = '#3a3a3a';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!(editForm.amenities || []).includes(amenity.id)) {
                                      e.target.style.borderColor = '#333333';
                                      e.target.style.backgroundColor = '#2a2a2a';
                                    }
                                  }}
                                >
                                  {amenity.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {hotel.hotel_img && (
                          <div style={{ marginBottom: '15px' }}>
                            <img 
                              src={hotel.hotel_img} 
                              alt={hotel.hotel_name}
                              style={{ 
                                width: '100%', 
                                height: '200px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '1px solid #ced4da'
                              }}
                              onLoad={() => console.log('✅ Hotel image loaded:', hotel.hotel_img)}
                              onError={(e) => {
                                console.error('❌ Hotel image failed to load:', hotel.hotel_img);
                                console.error('Image element:', e.target);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="hotel-item-header">
                          <h3>{hotel.hotel_name}</h3>
                          <div className="hotel-actions">
                            <button 
                              className="add-rooms-btn" 
                              onClick={() => navigate(`/host/add-rooms?hotelId=${hotel.hotelid}`)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <FaBed /> My Rooms
                            </button>
                            <button className="edit-icon-btn" onClick={() => handleEditHotel(hotel)}>
                              <FaEdit />
                            </button>
                            <button 
                              className="delete-icon-btn"
                              onClick={() => handleDeleteHotel(hotel.hotelid)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <p><strong>Address:</strong> {hotel.hotel_address}</p>
                        <p><strong>Rating:</strong> {hotel.overall_rating || 'Not rated yet'}</p>
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                            <strong>Amenities:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                              {hotel.amenities.map(amenityId => {
                                const amenity = availableHotelAmenities.find(a => a.id === amenityId);
                                return amenity ? (
                                  <span 
                                    key={amenityId}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                      color: '#000',
                                      borderRadius: '6px',
                                      fontSize: '0.85rem',
                                      fontWeight: '500',
                                      border: '1px solid #DAA520'
                                    }}
                                  >
                                    {amenity.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data">No hotels added yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-management">
            <h2>Recent Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Hotel</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingid}>
                        <td>{booking.bookingid}</td>
                        <td>{booking.customer_name}</td>
                        <td>{booking.hotelname}</td>
                        <td>{booking.roomnumber}</td>
                        <td>{formatDisplayDate(booking.checkin_date)}</td>
                        <td>{formatDisplayDate(booking.checkout_date)}</td>
                        <td>₹{Math.floor(booking.final_amount)}</td>
                        <td>
                          <span className={`status-badge ${booking.booking_status ? 'active' : 'cancelled'}`}>
                            {booking.booking_status ? 'Active' : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No bookings yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
