import React from 'react';
import { motion } from 'framer-motion';
import boltImage from '/bolt.png'; // Import the image

const BoltBadge: React.FC = () => {
  return (
    <motion.a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5, type: "spring" }}
    >
      <img
        src={boltImage}
        alt="Built with Bolt.new"
        className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg"
      />
    </motion.a>
  );
};

export default BoltBadge;