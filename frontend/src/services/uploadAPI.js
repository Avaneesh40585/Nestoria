import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Upload hotel image
export const uploadHotelImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_URL}/upload/hotel-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  return response.data;
};

// Upload room image
export const uploadRoomImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_URL}/upload/room-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  return response.data;
};

export default {
  uploadHotelImage,
  uploadRoomImage
};
