import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import HotelsList from './pages/HotelsList';
import HotelDetails from './pages/HotelDetails';
import RoomDetails from './pages/RoomDetails';
import BookingPage from './pages/BookingPage';
import CustomerProfile from './pages/CustomerProfile';
import HostProfile from './pages/HostProfile';
import HostDashboard from './pages/HostDashboard';
import AddRooms from './pages/AddRooms';
import AboutUs from './pages/AboutUs';
import TermsOfService from './pages/TermsOfService';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/hotels" element={<HotelsList />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/room/:id" element={<RoomDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* Protected Customer Routes */}
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <CustomerProfile />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Host Routes */}
              <Route 
                path="/host/profile" 
                element={
                  <ProtectedRoute requireHost={true}>
                    <HostProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/dashboard" 
                element={
                  <ProtectedRoute requireHost={true}>
                    <HostDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/add-rooms" 
                element={
                  <ProtectedRoute requireHost={true}>
                    <AddRooms />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div className="not-found-page">
    <div className="container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="home-btn">Go Home</a>
    </div>
  </div>
);

export default App;
