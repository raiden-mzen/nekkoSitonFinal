import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WhyChooseUs.css';
import { Camera, MapPin, Star } from 'lucide-react';

const WhyChooseUsPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="why-choose-us-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <section className="why-choose-us-section">
        <motion.h2 className="section-title-choose" variants={itemVariants}>
          Why Choose Us?
        </motion.h2>
        <motion.div className="features-grid" variants={containerVariants}>
          <motion.div className="feature-card" variants={itemVariants}>
            <Camera size={48} className="feature-icon" />
            <h3 className="feature-title">Professional Quality</h3>
            <p className="feature-description">High-resolution photos and expert editing to make every shot perfect.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <MapPin size={48} className="feature-icon" />
            <h3 className="feature-title">Unique Locations</h3>
            <p className="feature-description">We find the most stunning backdrops for your once-in-a-lifetime moments.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <Star size={48} className="feature-icon" />
            <h3 className="feature-title">Personalized Experience</h3>
            <p className="feature-description">A photoshoot tailored to your style, personality, and vision.</p>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default WhyChooseUsPage;