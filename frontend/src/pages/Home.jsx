import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { FaHotel, FaShieldAlt, FaHeadset, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const isCustomer = user?.role === 'customer';
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">
            Discover the best hotels across India with Nestoria Inc.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Nestoria?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaHotel className="feature-icon" />
              <h3>Wide Selection</h3>
              <p>Choose from thousands of verified hotels across major cities in India</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Secure Booking</h3>
              <p>Safe and secure payment options with instant confirmation</p>
            </div>
            <div className="feature-card">
              <FaHeadset className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for all your queries</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Best Prices</h3>
              <p>Get the best deals and competitive prices guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore?</h2>
            <p>Browse our collection of premium hotels</p>
            <Link to="/hotels" className="cta-btn">Browse Hotels</Link>
          </div>
        </div>
      </section>

      {!isAuthenticated || !isCustomer ? (
        <section className="host-section">
          <div className="container">
            <div className="host-content">
              <h2>Are You a Hotel Owner?</h2>
              <p>Join Nestoria and reach millions of travelers</p>
              <Link to="/login" className="host-btn">Become a Host</Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Home;
