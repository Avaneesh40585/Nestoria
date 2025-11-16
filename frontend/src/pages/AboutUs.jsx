import React, { useState, useEffect } from 'react';
import { FaHotel, FaUsers, FaGlobe, FaAward, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { hotelAPI } from '../services/api';

const AboutUs = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalCustomers: 0,
    avgRating: 0,
    citiesCovered: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching platform stats...');
        const response = await hotelAPI.getPlatformStats();
        console.log('Stats response:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        console.error('Error details:', error.response?.data);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
            exceptional accommodations across the country. We've revolutionized
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
              <h3>{loading ? '...' : `${stats.totalHotels}+`}</h3>
              <p>Hotels Listed</p>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <h3>{loading ? '...' : `${stats.totalCustomers.toLocaleString()}+`}</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <FaGlobe className="stat-icon" />
              <h3>{loading ? '...' : `${stats.citiesCovered}+`}</h3>
              <p>Cities Covered</p>
            </div>
            <div className="stat-item">
              <FaAward className="stat-icon" />
              <h3>{loading ? '...' : `${stats.avgRating}/5`}</h3>
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

        <section className="creators-section">
          <h2>Meet Our Creators</h2>
          <p className="creators-intro">The talented team behind Nestoria Inc.</p>
          <div className="creators-grid">
            <div className="creator-card">
              <div className="creator-photo-wrapper">
                <div className="creator-photo">
                  <img 
                    src="/images/team/avaneesh.jpg" 
                    alt="Avaneesh"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <span className="photo-placeholder" style={{ display: 'none' }}>AM</span>
                </div>
              </div>
              <div className="creator-info">
                <h3>Avaneesh</h3>
                <p className="creator-role">FULL STACK DEVELOPER</p>
                <div className="creator-social">
                  <a href="https://www.linkedin.com/in/avaneesh-muskula/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="https://github.com/Avaneesh40585" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                  <a href="mailto:avaneesh40585@gmail.com" aria-label="Email"><FaEnvelope /></a>
                </div>
              </div>
            </div>

            <div className="creator-card">
              <div className="creator-photo-wrapper">
                <div className="creator-photo">
                  <img 
                    src="/images/team/karthik.jpg" 
                    alt="KA Karthik"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <span className="photo-placeholder" style={{ display: 'none' }}>KR</span>
                </div>
              </div>
              <div className="creator-info">
                <h3>KA Karthik</h3>
                <p className="creator-role">FULL STACK DEVELOPER</p>
                <div className="creator-social">
                  <a href="https://www.linkedin.com/in/kadasani-aswartha-karthik-reddy-5b0068368/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="https://github.com/karthikreddy-31" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                  <a href="mailto:kadasanikarthik.ka@gmail.com" aria-label="Email"><FaEnvelope /></a>
                </div>
              </div>
            </div>

            <div className="creator-card">
              <div className="creator-photo-wrapper">
                <div className="creator-photo">
                  <img 
                    src="/images/team/saiadithya.jpg" 
                    alt="Sai Adithya M"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <span className="photo-placeholder" style={{ display: 'none' }}>SA</span>
                </div>
              </div>
              <div className="creator-info">
                <h3>Sai Adithya M</h3>
                <p className="creator-role">FULL STACK DEVELOPER</p>
                <div className="creator-social">
                  <a href="https://www.linkedin.com/in/sai-adithya-m-77b498315/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="https://github.com/Sai-Adithya-M" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                  <a href="mailto:m.saiadithya2006@gmail.com" aria-label="Email"><FaEnvelope /></a>
                </div>
              </div>
            </div>

            <div className="creator-card">
              <div className="creator-photo-wrapper">
                <div className="creator-photo">
                  <img 
                    src="/images/team/sarath.jpg" 
                    alt="Sarathchandra KVL"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <span className="photo-placeholder" style={{ display: 'none' }}>SK</span>
                </div>
              </div>
              <div className="creator-info">
                <h3>Sarathchandra KVL</h3>
                <p className="creator-role">FULL STACK DEVELOPER</p>
                <div className="creator-social">
                  <a href="https://github.com/Sarathchandra-kvl" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                  <a href="mailto:sarathchandrakvl07@gmail.com" aria-label="Email"><FaEnvelope /></a>
                </div>
              </div>
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
