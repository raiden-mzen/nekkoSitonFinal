import React, { useState, useEffect } from 'react';
import { Home, Image, BookUser, Camera, Key, Book, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/NavigationBar.css';

const NavigationBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { label: 'Home', id: 'home', icon: <Home size={24} />, path: '/' },
    { label: 'About', id: 'about', icon: <BookUser size={24} />, path: '/#about' },
    { label: 'Gallery', id: 'gallery', icon: <Image size={24} />, path: '/gallery' },
    { label: 'Contact', id: 'contact', icon: <Phone size={24} />, path: '/contact' },
  ];

  if (isLoggedIn) {
    navItems.splice(2, 0, { label: 'Services', id: 'services', icon: <Camera size={24} />, path: '/services' });
    navItems.push({ label: 'Booking', id: 'booking', icon: <Book size={24} />, path: '/booking' });
  }

  const authItem = isLoggedIn
    ? { label: 'Profile', id: 'profile', icon: <User size={24} />, path: '/profile' }
    : { label: 'Login', id: 'login', icon: <Key size={24} />, path: '/login' };

  const allNavItems = [...navItems, authItem];

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    const [base, hash] = path.split('#');

    if (window.location.pathname === (base || '/') && hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(base || '/');
      if (hash) {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <>
      <button
        className={`nav-toggle-button ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span className="nav-toggle-icon"></span>
      </button>

      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-overlay-links">
          {allNavItems.map((item, index) => (
            <li
              key={item.id}
              className="nav-overlay-item"
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <button
                className="nav-overlay-link"
                onClick={() => handleNavClick(item.path)}
              >
                <span className="nav-overlay-icon">{item.icon}</span>
                <span className="nav-overlay-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavigationBar;