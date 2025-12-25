import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleBookNowClick = () => {
    navigate('/booking');
  };

  return (
    <motion.div
      className="home-page-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/nekkoVideo.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <motion.div className="hero-content" variants={itemVariants}>
          <motion.h1 className="hero-title" variants={itemVariants}>
            NEKKO SITON
          </motion.h1>
          <motion.p className="hero-tagline" variants={itemVariants}>
            Capturing Moments, Creating Memories.
          </motion.p>
          <motion.button
            className="hero-cta-btn"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNowClick}
          >
            Book Now
          </motion.button>
        </motion.div>

        {/* Scroll Progress Indicator */}
        <div className="scroll-indicator" id="scrollIndicator">
          <div className="scroll-progress" id="scrollProgress" />
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;