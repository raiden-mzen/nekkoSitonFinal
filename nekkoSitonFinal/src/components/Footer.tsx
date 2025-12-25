import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="footer-logo">Nekko Siton</h2>
          <p>Capturing moments, creating memories. Your trusted partner for professional photography services.</p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="gallery">Gallery</a></li>
            <li><a href="services">Services</a></li>
            <li><a href="booking">Booking</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://web.facebook.com/NekkoSiton" target="_blank" rel="noopener noreferrer">
              <Facebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nekko Siton Photography. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;