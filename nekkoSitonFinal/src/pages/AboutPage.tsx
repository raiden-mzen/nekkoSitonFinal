import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="about-page-container"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className="about-content-wrapper">
        <motion.div className="about-image-container" variants={variants}>
          <img src="imagesGallery/photographer.jpg" alt="Nekko Siton" className="about-image" />
        </motion.div>
        <motion.div className="about-description-container" variants={variants}>
          <h1 className="about-title">About Nekko Siton</h1>
          <p className="about-subtitle">Capturing Life's Fleeting Moments</p>
          <p className="about-text">
            From a young age, I've been fascinated by the power of a single photograph to tell a story. My passion is to capture the authentic, fleeting moments that define our lives—the laughter, the tears, and the quiet joy. With years of experience and a keen eye for detail, I founded Nekko Siton to create timeless, beautiful memories for my clients.
          </p>
          <p className="about-text">
            My approach is personal and collaborative. I take the time to understand your vision and what matters most to you, ensuring that every photo session is a relaxed, enjoyable experience. Let's create something beautiful together.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;