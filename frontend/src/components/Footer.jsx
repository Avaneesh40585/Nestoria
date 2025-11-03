import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaHotel } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isHost } = useAuth();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <FaHotel className="footer-logo-icon" />
            <h3>Nestoria Inc.</h3>
          </div>
          <p className="footer-desc">
            Your trusted partner for comfortable and memorable hotel stays across India.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {!isHost && (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/hotels">Browse Hotels</Link></li>
              </>
            )}
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>Email: info@nestoria.com</li>
            <li>Phone: +91 1800-123-4567</li>
            <li>Support: 24/7 Available</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Nestoria Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
