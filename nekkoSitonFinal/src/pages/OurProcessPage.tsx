import React from 'react';
import { motion } from 'framer-motion';
import '../styles/OurProcessPage.css';
import { Calendar, Camera, ImageIcon, Smile } from 'lucide-react';

const OurProcessPage: React.FC = () => {
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
      className="our-process-page-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="our-process-section">
        <motion.h2 variants={itemVariants}>Our Process</motion.h2>
        <motion.div className="process-steps-grid" variants={containerVariants}>
          <motion.div className="process-step" variants={itemVariants}>
            <div className="process-icon-wrapper"><Calendar size={40} /></div>
            <h3>1. Book Your Session</h3>
            <p>Contact us to discuss your vision and schedule a date. We'll find the perfect package for you.</p>
          </motion.div>
          <motion.div className="process-step" variants={itemVariants}>
            <div className="process-icon-wrapper"><Camera size={40} /></div>
            <h3>2. The Photoshoot</h3>
            <p>Enjoy a relaxed and fun photoshoot experience at a location of your choice. We'll guide you every step of the way.</p>
          </motion.div>
          <motion.div className="process-step" variants={itemVariants}>
            <div className="process-icon-wrapper"><ImageIcon size={40} /></div>
            <h3>3. Receive Your Gallery</h3>
            <p>Within a few weeks, you'll receive a stunning online gallery of professionally edited, high-resolution images.</p>
          </motion.div>
          <motion.div className="process-step" variants={itemVariants}>
            <div className="process-icon-wrapper"><Smile size={40} /></div>
            <h3>4. Cherish Forever</h3>
            <p>Download, share, and print your photos to cherish the memories for a lifetime.</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurProcessPage;