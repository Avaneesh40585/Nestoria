import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nestoria-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // Token rejected. Clear and redirect to login on the next render.
      localStorage.removeItem('nestoria-token');
      localStorage.removeItem('nestoria-user');
    }
    return Promise.reject(err);
  }
);

export default api;

// Endpoint helpers — thin wrappers so screens don't sprinkle URLs.
export const authAPI = {
  register: (body)  => api.post('/auth/register', body).then((r) => r.data),
  login:    (body)  => api.post('/auth/login', body).then((r) => r.data),
  google:   (body)  => api.post('/auth/google', body).then((r) => r.data),
  me:       ()      => api.get('/auth/me').then((r) => r.data),
};
export const hotelsAPI = {
  search:        (params) => api.get('/hotels', { params }).then((r) => r.data),
  destinations:  ()       => api.get('/hotels/destinations').then((r) => r.data),
  detail:        (slug)   => api.get(`/hotels/${slug}`).then((r) => r.data),
  create:        (body)   => api.post('/hotels', body).then((r) => r.data),
  update:        (id, body) => api.put(`/hotels/${id}`, body).then((r) => r.data),
  remove:        (id)     => api.delete(`/hotels/${id}`).then((r) => r.data),
};
export const roomsAPI = {
  detail:        (id)     => api.get(`/rooms/${id}`).then((r) => r.data),
  availability:  (id, q)  => api.get(`/rooms/${id}/availability`, { params: q }).then((r) => r.data),
  create:        (body)   => api.post('/rooms', body).then((r) => r.data),
  update:        (id, body) => api.put(`/rooms/${id}`, body).then((r) => r.data),
  remove:        (id)     => api.delete(`/rooms/${id}`).then((r) => r.data),
};
export const bookingsAPI = {
  create:        (body)   => api.post('/bookings', body).then((r) => r.data),
  my:            ()       => api.get('/bookings/my').then((r) => r.data),
  detail:        (id)     => api.get(`/bookings/${id}`).then((r) => r.data),
  cancel:        (id)     => api.put(`/bookings/${id}/cancel`).then((r) => r.data),
};
export const reviewsAPI = {
  create:        (body)   => api.post('/reviews', body).then((r) => r.data),
  byBooking:     (id)     => api.get(`/reviews/booking/${id}`).then((r) => r.data),
};
export const profileAPI = {
  get:           ()       => api.get('/profile').then((r) => r.data),
  update:        (body)   => api.put('/profile', body).then((r) => r.data),
  changePassword:(body)   => api.put('/profile/change-password', body).then((r) => r.data),
};
export const hostAPI = {
  properties:    ()       => api.get('/host/properties').then((r) => r.data),
  stats:         ()       => api.get('/host/stats').then((r) => r.data),
  bookings:      (params) => api.get('/host/bookings', { params }).then((r) => r.data),
  earnings:      ()       => api.get('/host/earnings').then((r) => r.data),
};
export const uploadAPI = {
  hotelImage: (file) => {
    const fd = new FormData(); fd.append('image', file);
    return api.post('/upload/hotel-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
  roomImage: (file) => {
    const fd = new FormData(); fd.append('image', file);
    return api.post('/upload/room-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
};
