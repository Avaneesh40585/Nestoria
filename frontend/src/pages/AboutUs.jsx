import React from 'react';
import { FaHotel, FaUsers, FaGlobe, FaAward } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About Nestoria Inc.</h1>
          <p>Your Trusted Partner in Hospitality</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Nestoria Inc. is India's premier hotel booking platform, connecting travelers with
            exceptional accommodations across the country. Founded in 2020, we've revolutionized
            the way people discover and book hotels, making travel more accessible and enjoyable
            for everyone.
          </p>
          <p>
            Our mission is to provide a seamless booking experience while supporting local
            hoteliers and promoting sustainable tourism practices. We believe that great
            hospitality begins with trust, transparency, and exceptional service.
          </p>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <FaHotel className="stat-icon" />
              <h3>1000+</h3>
              <p>Hotels Listed</p>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <h3>50,000+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <FaGlobe className="stat-icon" />
              <h3>50+</h3>
              <p>Cities Covered</p>
            </div>
            <div className="stat-item">
              <FaAward className="stat-icon" />
              <h3>4.8/5</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Trust</h3>
              <p>We verify every hotel and provide transparent information to ensure your peace of mind.</p>
            </div>
            <div className="value-card">
              <h3>Quality</h3>
              <p>We partner only with hotels that meet our high standards of cleanliness and service.</p>
            </div>
            <div className="value-card">
              <h3>Support</h3>
              <p>Our 24/7 customer support team is always ready to assist you with any questions.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously improve our platform to provide the best booking experience.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Why Choose Us?</h2>
          <ul className="benefits-list">
            <li>Best price guarantee on all bookings</li>
            <li>Secure payment processing with multiple payment options</li>
            <li>Instant booking confirmation</li>
            <li>Free cancellation up to 24 hours before check-in</li>
            <li>Verified reviews from real guests</li>
            <li>24/7 customer support in multiple languages</li>
            <li>Easy-to-use mobile app for booking on the go</li>
            <li>Loyalty rewards program for frequent travelers</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
