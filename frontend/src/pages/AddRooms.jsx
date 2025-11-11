import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hotelAPI, roomAPI } from '../services/api';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AddRooms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingRooms, setExistingRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [availableAmenities] = useState([
    { id: 1, name: 'Wi-Fi' },
    { id: 13, name: 'Air Conditioning' },
    { id: 14, name: 'TV' },
    { id: 15, name: 'Mini Bar' },
    { id: 6, name: 'Room Service' },
    { id: 10, name: 'Laundry' }
  ]);
  const [rooms, setRooms] = useState([{
    room_number: '',
    room_type: '',
    room_desc: '',
    cost_per_night: '',
    position_view: '',
    room_status: 'Available',
    amenities: [] // Array of amenity IDs
  }]);

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails();
    } else {
      navigate('/host/dashboard');
    }
    // Clear field errors on mount
    setFieldErrors({});
  }, [hotelId]);

  const fetchHotelDetails = async () => {
    try {
      const response = await hotelAPI.getDetails(hotelId);
      setHotel(response.data.hotel);
      
      // Fetch rooms with their amenities
      const roomsData = response.data.rooms || [];
      
      // For each room, fetch its amenities
      const roomsWithAmenities = await Promise.all(
        roomsData.map(async (room) => {
          try {
            const roomDetails = await roomAPI.getDetails(room.roomid);
            const amenityIds = roomDetails.data.amenities ? roomDetails.data.amenities.map(a => a.amenityid) : [];
            return { ...room, amenities: amenityIds };
          } catch (error) {
            console.error(`Error fetching amenities for room ${room.roomid}:`, error);
            return { ...room, amenities: [] };
          }
        })
      );
      
      setExistingRooms(roomsWithAmenities);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      alert('Failed to load hotel details');
      navigate('/host/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addRoomForm = () => {
    setRooms([...rooms, {
      room_number: '',
      room_type: '',
      room_desc: '',
      cost_per_night: '',
      position_view: '',
      room_status: 'Available',
      amenities: []
    }]);
    // Clear field errors when adding a new room
    setFieldErrors({});
  };

  // Validation functions
  const validateRoomNumber = (value) => {
    if (!value || value.trim() === '') {
      return 'Room number is required';
    }
    // Only allow numbers
    if (!/^[0-9]+$/.test(value.trim())) {
      return 'Room number must contain only numbers';
    }
    return '';
  };

  const validateRoomType = (value) => {
    if (!value || value === '') {
      return 'Please select a room type';
    }
    return '';
  };

  const validateCostPerNight = (value) => {
    if (!value || value === '') {
      return 'Cost per night is required';
    }
    if (isNaN(value)) {
      return 'Cost must be a valid number';
    }
    const cost = parseFloat(value);
    if (cost <= 0) {
      return 'Cost must be greater than 0';
    }
    if (cost > 1000000) {
      return 'Cost seems too high. Please check the value';
    }
    return '';
  };

  const validatePositionView = (value) => {
    if (!value || value === '') {
      return 'Please select a position/view';
    }
    return '';
  };

  const validateRoomStatus = (value) => {
    if (!value || value === '') {
      return 'Please select a room status';
    }
    return '';
  };

  const removeRoomForm = (index) => {
    if (rooms.length > 1) {
      const updatedRooms = rooms.filter((_, i) => i !== index);
      setRooms(updatedRooms);
      // Clear field errors when removing a room
      setFieldErrors({});
    }
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[index]?.[field]) {
      const newErrors = { ...fieldErrors };
      if (newErrors[index]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
        setFieldErrors(newErrors);
      }
    }
  };

  const handleRoomBlur = (index, field, value) => {
    let error = '';
    
    switch (field) {
      case 'room_number':
        error = validateRoomNumber(value);
        break;
      case 'room_type':
        error = validateRoomType(value);
        break;
      case 'cost_per_night':
        error = validateCostPerNight(value);
        break;
      case 'position_view':
        error = validatePositionView(value);
        break;
      case 'room_status':
        error = validateRoomStatus(value);
        break;
      default:
        break;
    }
    
    if (error) {
      setFieldErrors(prev => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          [field]: error
        }
      }));
    }
  };

  const toggleAmenity = (index, amenityId) => {
    const updatedRooms = [...rooms];
    const amenities = updatedRooms[index].amenities || [];
    
    if (amenities.includes(amenityId)) {
      // Remove amenity
      updatedRooms[index].amenities = amenities.filter(id => id !== amenityId);
    } else {
      // Add amenity
      updatedRooms[index].amenities = [...amenities, amenityId];
    }
    
    setRooms(updatedRooms);
  };

  const toggleEditAmenity = (amenityId) => {
    const amenities = editForm.amenities || [];
    
    if (amenities.includes(amenityId)) {
      // Remove amenity
      setEditForm({...editForm, amenities: amenities.filter(id => id !== amenityId)});
    } else {
      // Add amenity
      setEditForm({...editForm, amenities: [...amenities, amenityId]});
    }
  };

  // Check if a room form has all required fields filled and no errors
  const isRoomFormValid = (room, index) => {
    // Check if all required fields are filled
    const allFilled = (
      room.room_number && room.room_number.trim() !== '' &&
      room.room_type && room.room_type !== '' &&
      room.cost_per_night && room.cost_per_night !== '' &&
      room.position_view && room.position_view !== '' &&
      room.room_status && room.room_status !== ''
    );
    
    // Check if there are any validation errors for this room
    const hasErrors = fieldErrors[index] && Object.keys(fieldErrors[index]).length > 0;
    
    // Also validate all fields to ensure data is correct
    const validRoomNumber = validateRoomNumber(room.room_number) === '';
    const validCost = validateCostPerNight(room.cost_per_night) === '';
    
    return allFilled && !hasErrors && validRoomNumber && validCost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate all rooms have required fields
      for (const room of rooms) {
        if (!room.room_number || !room.cost_per_night) {
          alert('Please fill in Room Number and Cost per Night for all rooms');
          return;
        }
      }

      // Create all rooms
      const createPromises = rooms.map(room => 
        roomAPI.create({
          hotel_id: hotelId,
          room_number: room.room_number,
          room_type: room.room_type,
          room_desc: room.room_desc,
          cost_per_night: parseFloat(room.cost_per_night),
          position_view: room.position_view,
          room_status: room.room_status
        })
      );

      await Promise.all(createPromises);
      alert(`${rooms.length} room(s) added successfully!`);
      
      // Reset form and hide add section
      setRooms([{
        room_number: '',
        room_type: '',
        room_desc: '',
        cost_per_night: '',
        position_view: '',
        room_status: 'Available'
      }]);
      setShowAddForm(false);
      fetchHotelDetails();
    } catch (error) {
      console.error('Error creating rooms:', error);
      alert('Failed to create rooms. Please try again.');
    }
  };

  const handleSaveIndividualRoom = async (index) => {
    const room = rooms[index];

    try {
      await roomAPI.create({
        hotel_id: hotelId,
        room_number: room.room_number,
        room_type: room.room_type,
        room_desc: room.room_desc,
        cost_per_night: parseFloat(room.cost_per_night),
        position_view: room.position_view,
        room_status: room.room_status,
        amenities: room.amenities || []
      });
      
      alert('Room added successfully!');
      
      // Clear all errors after successful save
      setFieldErrors({});
      
      // Hide the add form after successful save
      setShowAddForm(false);
      
      // Remove the saved room from the array
      const updatedRooms = rooms.filter((_, i) => i !== index);
      if (updatedRooms.length === 0) {
        setRooms([{
          room_number: '',
          room_type: '',
          room_desc: '',
          cost_per_night: '',
          position_view: '',
          room_status: 'Available'
        }]);
      } else {
        setRooms(updatedRooms);
      }
      
      fetchHotelDetails();
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room.roomid);
    setEditForm({
      room_number: room.roomnumber,
      room_type: room.room_type,
      room_desc: room.room_desc,
      cost_per_night: room.cost_per_night,
      position_view: room.position_view,
      room_status: room.room_status,
      amenities: room.amenities || []
    });
  };

  const handleSaveEdit = async (roomId) => {
    try {
      await roomAPI.update(roomId, editForm);
      alert('Room updated successfully!');
      setEditingRoomId(null);
      fetchHotelDetails();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room');
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditForm({});
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomAPI.delete(roomId);
        alert('Room deleted successfully');
        fetchHotelDetails();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="add-rooms-page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>My Rooms - {hotel?.hotelname}</h1>
          <button 
            className="back-btn" 
            onClick={() => navigate('/host/dashboard', { state: { activeTab: 'hotels' } })}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Add New Room Button and Form Section */}
        {existingRooms.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Rooms</h2>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px'
              }}
            >
              <FaPlus /> {showAddForm ? 'Hide Form' : 'Add New Room'}
            </button>
          </div>
        )}

        {/* Add New Rooms Form - Shows above existing rooms */}
        {showAddForm && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2>Add New Room</h2>
            </div>
            <form onSubmit={handleSubmit}>
          {rooms.map((room, index) => (
            <div key={index} className="room-form-card" style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              marginBottom: '20px', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Room {index + 1}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveIndividualRoom(index)}
                    disabled={!isRoomFormValid(room, index)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: !isRoomFormValid(room, index) ? '#cccccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: !isRoomFormValid(room, index) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px',
                      fontWeight: '500',
                      opacity: !isRoomFormValid(room, index) ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Number *</label>
                  <input
                    type="text"
                    value={room.room_number}
                    onChange={(e) => handleRoomChange(index, 'room_number', e.target.value)}
                    onBlur={(e) => handleRoomBlur(index, 'room_number', e.target.value)}
                    placeholder="e.g., 101 or 205"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: fieldErrors[index]?.room_number ? '2px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none'
                    }}
                  />
                  {fieldErrors[index]?.room_number && (
                    <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors[index].room_number}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Type *</label>
                  <select
                    value={room.room_type}
                    onChange={(e) => handleRoomChange(index, 'room_type', e.target.value)}
                    onBlur={(e) => handleRoomBlur(index, 'room_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: fieldErrors[index]?.room_type ? '2px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none',
                      appearance: 'auto'
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Family">Family</option>
                  </select>
                  {fieldErrors[index]?.room_type && (
                    <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors[index].room_type}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Cost per Night (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={room.cost_per_night}
                    onChange={(e) => handleRoomChange(index, 'cost_per_night', e.target.value)}
                    onBlur={(e) => handleRoomBlur(index, 'cost_per_night', e.target.value)}
                    placeholder="e.g., 2500"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: fieldErrors[index]?.cost_per_night ? '2px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none'
                    }}
                  />
                  {fieldErrors[index]?.cost_per_night && (
                    <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors[index].cost_per_night}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Position/View *</label>
                  <select
                    value={room.position_view}
                    onChange={(e) => handleRoomChange(index, 'position_view', e.target.value)}
                    onBlur={(e) => handleRoomBlur(index, 'position_view', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: fieldErrors[index]?.position_view ? '2px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none',
                      appearance: 'auto'
                    }}
                  >
                    <option value="">Select View</option>
                    <option value="City View">City View</option>
                    <option value="Sea View">Sea View</option>
                    <option value="Garden View">Garden View</option>
                    <option value="Mountain View">Mountain View</option>
                    <option value="Pool View">Pool View</option>
                    <option value="No View">No View</option>
                  </select>
                  {fieldErrors[index]?.position_view && (
                    <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors[index].position_view}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Status *</label>
                  <select
                    value={room.room_status}
                    onChange={(e) => handleRoomChange(index, 'room_status', e.target.value)}
                    onBlur={(e) => handleRoomBlur(index, 'room_status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: fieldErrors[index]?.room_status ? '2px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none',
                      appearance: 'auto'
                    }}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  {fieldErrors[index]?.room_status && (
                    <span style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors[index].room_status}
                    </span>
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#333' }}>Room Amenities</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(index, amenity.id)}
                        style={{
                          padding: '8px 16px',
                          border: (room.amenities || []).includes(amenity.id) ? '2px solid #007bff' : '2px solid #ced4da',
                          backgroundColor: (room.amenities || []).includes(amenity.id) ? '#007bff' : '#fff',
                          color: (room.amenities || []).includes(amenity.id) ? '#fff' : '#333',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!(room.amenities || []).includes(amenity.id)) {
                            e.target.style.borderColor = '#007bff';
                            e.target.style.backgroundColor = '#f0f8ff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!(room.amenities || []).includes(amenity.id)) {
                            e.target.style.borderColor = '#ced4da';
                            e.target.style.backgroundColor = '#fff';
                          }
                        }}
                      >
                        {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Description</label>
                  <textarea
                    value={room.room_desc}
                    onChange={(e) => handleRoomChange(index, 'room_desc', e.target.value)}
                    rows="3"
                    placeholder="Describe the room features..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.15s ease-in-out',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </form>
      </>
      )}

        {/* Existing Rooms List Section */}
        {existingRooms.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            {existingRooms.map((room) => (
              <div key={room.roomid} className="room-form-card" style={{ 
                backgroundColor: '#fff', 
                padding: '20px', 
                marginBottom: '20px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                {editingRoomId === room.roomid ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3>Edit Room {room.roomnumber}</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(room.roomid)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Number</label>
                        <input
                          type="text"
                          value={editForm.room_number || ''}
                          onChange={(e) => setEditForm({...editForm, room_number: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Type</label>
                        <select
                          value={editForm.room_type || ''}
                          onChange={(e) => setEditForm({...editForm, room_type: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none',
                            appearance: 'auto'
                          }}
                        >
                          <option value="">Select Type</option>
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Suite">Suite</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Family">Family</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Cost per Night (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.cost_per_night || ''}
                          onChange={(e) => setEditForm({...editForm, cost_per_night: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Position/View</label>
                        <select
                          value={editForm.position_view || ''}
                          onChange={(e) => setEditForm({...editForm, position_view: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none',
                            appearance: 'auto'
                          }}
                        >
                          <option value="">Select View</option>
                          <option value="City View">City View</option>
                          <option value="Sea View">Sea View</option>
                          <option value="Garden View">Garden View</option>
                          <option value="Mountain View">Mountain View</option>
                          <option value="Pool View">Pool View</option>
                          <option value="No View">No View</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Status</label>
                        <select
                          value={editForm.room_status || ''}
                          onChange={(e) => setEditForm({...editForm, room_status: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none',
                            appearance: 'auto'
                          }}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#333' }}>Room Amenities</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {availableAmenities.map((amenity) => (
                            <button
                              key={amenity.id}
                              type="button"
                              onClick={() => toggleEditAmenity(amenity.id)}
                              style={{
                                padding: '8px 16px',
                                border: (editForm.amenities || []).includes(amenity.id) ? '2px solid #007bff' : '2px solid #ced4da',
                                backgroundColor: (editForm.amenities || []).includes(amenity.id) ? '#007bff' : '#fff',
                                color: (editForm.amenities || []).includes(amenity.id) ? '#fff' : '#333',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!(editForm.amenities || []).includes(amenity.id)) {
                                  e.target.style.borderColor = '#007bff';
                                  e.target.style.backgroundColor = '#f0f8ff';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!(editForm.amenities || []).includes(amenity.id)) {
                                  e.target.style.borderColor = '#ced4da';
                                  e.target.style.backgroundColor = '#fff';
                                }
                              }}
                            >
                              {amenity.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Room Description</label>
                        <textarea
                          value={editForm.room_desc || ''}
                          onChange={(e) => setEditForm({...editForm, room_desc: e.target.value})}
                          rows="3"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '14px',
                            transition: 'border-color 0.15s ease-in-out',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3>Room {room.roomnumber}</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleEditRoom(room)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.roomid)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                      <div>
                        <strong>Type:</strong> {room.room_type || 'N/A'}
                      </div>
                      <div>
                        <strong>Cost per Night:</strong> ₹{room.cost_per_night || 'N/A'}
                      </div>
                      <div>
                        <strong>View:</strong> {room.position_view || 'N/A'}
                      </div>
                      <div>
                        <strong>Status:</strong> <span style={{ 
                          padding: '6px 14px', 
                          borderRadius: '20px', 
                          backgroundColor: room.room_status === 'Available' ? '#d1fae5' : '#fee2e2',
                          color: room.room_status === 'Available' ? '#065f46' : '#991b1b',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          width: 'fit-content'
                        }}>{room.room_status || 'N/A'}</span>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong>Description:</strong> {room.room_desc || 'No description'}
                      </div>
                      <div>
                        <strong>Rating:</strong> {room.room_rating || 'Not rated'}
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong>Amenities:</strong>
                        {room.amenities && room.amenities.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                            {room.amenities.map((amenityId) => {
                              const amenity = availableAmenities.find(a => a.id === amenityId);
                              return amenity ? (
                                <span
                                  key={amenityId}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#e7f3ff',
                                    color: '#0066cc',
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    border: '1px solid #b3d9ff'
                                  }}
                                >
                                  {amenity.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span style={{ color: '#6c757d', fontStyle: 'italic' }}> No amenities added</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No rooms message - shown when no rooms exist */}
        {existingRooms.length === 0 && !showAddForm && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>No rooms added yet</h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>Start by adding your first room to this hotel</p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px'
              }}
            >
              <FaPlus /> Add Your First Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRooms;
