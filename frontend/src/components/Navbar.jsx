import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHotel, FaBars, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const Navbar = () => {
  const { logout, isAuthenticated, isHost, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {isHost ? (
          <div className="nav-logo" style={{ cursor: 'default' }}>
            <FaHotel className="logo-icon" />
            <span>Nestoria Inc.</span>
          </div>
        ) : (
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <FaHotel className="logo-icon" />
            <span>Nestoria Inc.</span>
          </Link>
        )}

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {isAuthenticated && !isCustomer && !isHost ? (
            <>
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
            </>
          ) : null}
          
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
                <>
                  <li className="nav-item">
                    <Link to="/host/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <FaHotel className="nav-icon" /> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/host/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <FaUser className="nav-icon" /> Profile
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" /> Logout
                </button>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-icon-container">
              <FaExclamationCircle className="alert-icon" />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn-modal-yes" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn-modal-no" onClick={cancelLogout}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
