import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHotel, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated, isHost, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <FaHotel className="logo-icon" />
          <span>Nestoria Inc.</span>
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/hotels" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Hotels
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {isCustomer && (
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaUser className="nav-icon" /> Profile
                  </Link>
                </li>
              )}
              {isHost && (
                <li className="nav-item">
                  <Link to="/host/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaHotel className="nav-icon" /> Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" /> Logout
                </button>
              </li>
              <li className="nav-item user-greeting">
                <span>Welcome, {user?.name}!</span>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Login / Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
